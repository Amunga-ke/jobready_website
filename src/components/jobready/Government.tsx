import Link from "next/link";
import SectionNumber from './SectionNumber';
import JobClickable from './JobClickable';
import { formatDateShortUTC } from '@/lib/format-date';
import type { Job } from '@/types';

export default function Government({ nationalJobs, countyJobs }: { nationalJobs: Job[]; countyJobs: Job[] }) {
  return (
    <section className="py-14 bg-white border-t border-divider relative overflow-hidden">
      <SectionNumber num="08" />
      <div className="max-w-6xl mx-auto px-5 relative">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading text-xl font-bold">Government</h2>
          <Link href="/government" className="text-[11px] font-mono text-muted hover:text-ink transition-colors uppercase tracking-wider">
            All government jobs →
          </Link>
        </div>
        <div className="grid sm:grid-cols-2">
          <div className="border-r-0 sm:border-r border-b sm:border-b-0 border-divider sm:pr-8 pb-6 sm:pb-0">
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-[10px] text-muted uppercase tracking-widest">National</span>
              <Link href="/government/national" className="text-[10px] font-mono text-accent hover:text-accent-dark transition-colors uppercase tracking-wider">
                All national →
              </Link>
            </div>
            {nationalJobs.length === 0 ? (
              <p className="text-sm text-muted py-4">No national government jobs right now.</p>
            ) : (
              <div className="space-y-0 divide-y divide-subtle">
                {nationalJobs.map((job) => (
                  <JobClickable key={job.id} job={job} className="py-3 group cursor-pointer">
                    <p className="text-sm font-medium group-hover:text-accent transition-colors">{job.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {job.tags.includes("National") && (
                        <span className="font-mono text-[9px] bg-surface text-muted px-1.5 py-0.5 rounded-md border border-subtle">
                          GAZETTE
                        </span>
                      )}
                      {job.deadline && (
                        <span className="font-mono text-[11px] text-muted tabular-nums">
                          Closes {formatDateShortUTC(job.deadline)}
                        </span>
                      )}
                    </div>
                  </JobClickable>
                ))}
              </div>
            )}
          </div>
          <div className="sm:pl-8 pt-6 sm:pt-0">
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-[10px] text-muted uppercase tracking-widest">County</span>
              <Link href="/government/county" className="text-[10px] font-mono text-accent hover:text-accent-dark transition-colors uppercase tracking-wider">
                All county →
              </Link>
            </div>
            {countyJobs.length === 0 ? (
              <p className="text-sm text-muted py-4">No county government jobs right now.</p>
            ) : (
              <div className="space-y-0 divide-y divide-subtle">
                {countyJobs.map((job) => (
                  <JobClickable key={job.id} job={job} className="py-3 group cursor-pointer">
                    <p className="text-sm font-medium group-hover:text-accent transition-colors">{job.title}</p>
                    {job.deadline && (
                      <span className="font-mono text-[11px] text-muted tabular-nums mt-1 block">
                        Closes {formatDateShortUTC(job.deadline)}
                      </span>
                    )}
                  </JobClickable>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
