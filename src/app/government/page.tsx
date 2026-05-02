'use client';

import { useState, useEffect } from 'react';
import { useJobModal } from '@/components/jobready/JobModalContext';
import { Shield, Clock, FileText, Loader2, AlertCircle } from 'lucide-react';
import type { GovernmentJobEntry } from '@/types';

/* ── Skeleton loader ── */
function SkeletonRow() {
  return (
    <div className="py-3 animate-pulse">
      <div className="h-4 bg-subtle rounded w-4/5 mb-2" />
      <div className="h-3 bg-subtle rounded w-24" />
    </div>
  );
}

/* ── Government job row ── */
function GovJobRow({
  job,
  onClick,
}: {
  job: GovernmentJobEntry;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="py-3 group cursor-pointer active:scale-[0.98] transition-transform rounded-lg hover:bg-surface -mx-2 px-2"
    >
      <p className="text-sm font-medium group-hover:text-accent transition-colors leading-snug">
        {job.title}
      </p>
      <div className="flex items-center gap-2 mt-1">
        {job.gazette && (
          <span className="font-mono text-[9px] bg-surface text-muted px-1.5 py-0.5 rounded-md border border-subtle flex items-center gap-1">
            <FileText className="w-2.5 h-2.5" />
            GAZETTE
          </span>
        )}
        <span className="font-mono text-[11px] text-muted tabular-nums flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {job.deadline}
        </span>
      </div>
    </div>
  );
}

/* ── Main component ── */
export default function GovernmentPage() {
  const { openJobById } = useJobModal();
  const [nationalJobs, setNationalJobs] = useState<GovernmentJobEntry[]>([]);
  const [countyJobs, setCountyJobs] = useState<GovernmentJobEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchGovernmentJobs() {
      setLoading(true);
      setError(false);
      try {
        const res = await fetch('/api/jobs?type=government&limit=50');
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        const jobs: GovernmentJobEntry[] = data.jobs || [];

        // Split into national and county based on gazette flag or title patterns
        const national = jobs.filter((j) => j.gazette || /national|tsc|kra|kenya police|public service/i.test(j.title));
        const county = jobs.filter((j) => !j.gazette && !/national|tsc|kra|kenya police|public service/i.test(j.title));

        setNationalJobs(national);
        setCountyJobs(county);
      } catch (err) {
        console.error('[GovernmentPage] Fetch error:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchGovernmentJobs();
  }, []);

  return (
    <div className="bg-white">
      {/* Header */}
      <div className="border-b border-divider">
        <div className="max-w-6xl mx-auto px-5 pt-10 pb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-accent-bg rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h1 className="font-hero text-3xl sm:text-4xl font-black tracking-tight">
                Government Jobs
              </h1>
            </div>
          </div>
          <p className="text-[13px] text-muted ml-[52px]">
            National & County positions from the Kenya Gazette
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-5 py-8">
        {loading ? (
          <div className="grid sm:grid-cols-2 gap-8">
            <div>
              <div className="font-mono text-[10px] text-muted uppercase tracking-widest mb-4">National</div>
              <div className="divide-y divide-subtle">
                {Array.from({ length: 5 }).map((_, i) => (
                  <SkeletonRow key={i} />
                ))}
              </div>
            </div>
            <div>
              <div className="font-mono text-[10px] text-muted uppercase tracking-widest mb-4">County</div>
              <div className="divide-y divide-subtle">
                {Array.from({ length: 5 }).map((_, i) => (
                  <SkeletonRow key={i} />
                ))}
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-7 h-7 text-muted/40" />
            </div>
            <h3 className="font-heading text-lg font-bold mb-2">Failed to load listings</h3>
            <p className="text-[13px] text-muted max-w-sm mx-auto leading-relaxed">
              Something went wrong. Please try refreshing the page.
            </p>
          </div>
        ) : (
          <>
            <div className="grid sm:grid-cols-2">
              {/* National column */}
              <div className="border-r-0 sm:border-r border-b sm:border-b-0 border-divider sm:pr-8 pb-6 sm:pb-0">
                <div className="font-mono text-[10px] text-muted uppercase tracking-widest mb-4">
                  National{' '}
                  <span className="text-muted/50">({nationalJobs.length})</span>
                </div>
                {nationalJobs.length === 0 ? (
                  <p className="text-[13px] text-muted py-8 text-center">No national listings right now</p>
                ) : (
                  <div className="divide-y divide-subtle">
                    {nationalJobs.map((job) => (
                      <GovJobRow key={job.id} job={job} onClick={() => openJobById(job.id)} />
                    ))}
                  </div>
                )}
              </div>

              {/* County column */}
              <div className="sm:pl-8 pt-6 sm:pt-0">
                <div className="font-mono text-[10px] text-muted uppercase tracking-widest mb-4">
                  County{' '}
                  <span className="text-muted/50">({countyJobs.length})</span>
                </div>
                {countyJobs.length === 0 ? (
                  <p className="text-[13px] text-muted py-8 text-center">No county listings right now</p>
                ) : (
                  <div className="divide-y divide-subtle">
                    {countyJobs.map((job) => (
                      <GovJobRow key={job.id} job={job} onClick={() => openJobById(job.id)} />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Bottom CTA */}
            <div className="h-px bg-divider mt-8" />
            <div className="mt-6 flex items-center justify-between">
              <p className="text-[12px] text-muted">
                Showing {nationalJobs.length + countyJobs.length} government positions
              </p>
              <a
                href="/jobs?type=GOVERNMENT"
                className="inline-flex items-center gap-1 text-[13px] font-medium text-ink hover:text-accent transition-colors"
              >
                Browse all government jobs →
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
