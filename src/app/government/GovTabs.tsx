"use client";

import { useState } from "react";
import Link from "next/link";
import JobRowClickable from "@/components/jobready/JobRowClickable";

interface GovLevelTab {
  value: string;
  slug: string;
  label: string;
  icon: string;
  count: number;
}

interface GovTabProps {
  levels: GovLevelTab[];
  national: any[];
  county: any[];
  stateCorp: any[];
  countyCountMap: Map<string, number>;
  topEmployers: { name: string; count: number }[];
}

function deadlineInfo(job: { deadline?: Date | null }) {
  if (!job.deadline) return null;
  const dl = Math.ceil((job.deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  if (dl <= 0) return { text: "Closed", urgent: false };
  const urgent = dl <= 3;
  return { text: `${dl}d left`, urgent };
}

function JobListings({ jobs, emptyMessage }: { jobs: any[]; emptyMessage: string }) {
  if (jobs.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-14 h-14 mx-auto mb-3 rounded-xl bg-ink/[0.04] flex items-center justify-center">
          <svg className="w-6 h-6 text-muted/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <p className="text-[14px] font-heading font-semibold text-ink mb-1">{emptyMessage}</p>
        <p className="text-[12px] text-muted">Check back soon — new positions are posted regularly.</p>
      </div>
    );
  }

  return (
    <>
      {/* Column headers — desktop */}
      <div className="hidden sm:grid sm:grid-cols-12 gap-4 pb-2 border-b border-divider text-[10px] font-mono text-muted uppercase tracking-widest mb-1">
        <div className="col-span-5">Position</div>
        <div className="col-span-3">Employer</div>
        <div className="col-span-2">Location</div>
        <div className="col-span-2 text-right">Deadline</div>
      </div>
      <div className="divide-y divide-subtle">
        {jobs.map((job) => {
          const dl = deadlineInfo(job);
          return (
            <JobRowClickable
              key={job.id}
              slug={job.slug}
              className="grid grid-cols-12 gap-4 py-3.5 group cursor-pointer hover:bg-ink/[0.02] rounded-lg -mx-2 px-2 transition-colors"
            >
              <div className="col-span-12 sm:col-span-5 min-w-0">
                <p className="text-[13px] font-medium truncate group-hover:text-accent transition-colors">
                  {job.title}
                </p>
                <div className="sm:hidden flex items-center gap-2 mt-0.5">
                  <span className="text-[11px] text-muted">{job.company?.name || ""}</span>
                  <span className="text-[11px] text-subtle">&middot;</span>
                  <span className="text-[11px] text-muted">{job.town || job.county || ""}</span>
                </div>
              </div>
              <div className="hidden sm:block sm:col-span-3 text-[12px] text-muted truncate">
                {job.company?.name || ""}
              </div>
              <div className="hidden sm:block sm:col-span-2 text-[12px] text-muted truncate">
                {job.town || job.county || ""}
              </div>
              <div className="col-span-12 sm:col-span-2 flex sm:justify-end items-center">
                {dl ? (
                  <span
                    className={`font-mono text-[12px] font-medium tabular-nums ${
                      dl.text === "Closed"
                        ? "text-muted/40"
                        : dl.urgent
                        ? "text-accent"
                        : "text-muted"
                    }`}
                  >
                    {dl.text}
                  </span>
                ) : (
                  <span className="text-[11px] text-muted/50">&mdash;</span>
                )}
              </div>
            </JobRowClickable>
          );
        })}
      </div>
    </>
  );
}

function RichFallbackSection({
  countyCountMap,
  topEmployers,
  levels,
  activeLevel,
}: {
  countyCountMap: Map<string, number>;
  topEmployers: { name: string; count: number }[];
  levels: GovLevelTab[];
  activeLevel: string;
}) {
  return (
    <div className="space-y-6">
      {/* Info banner */}
      <div className="rounded-xl bg-blue-50/70 border border-blue-100 px-5 py-4">
        <p className="text-[14px] text-blue-800/90">
          No listings found for this section right now. Government positions are posted regularly through official gazette notices. Here are some alternatives:
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Other government levels */}
        <div className="rounded-xl border border-divider p-5">
          <h3 className="text-[13px] font-semibold text-ink mb-3">Other Government Sections</h3>
          <div className="flex flex-wrap gap-2">
            {levels
              .filter((l) => l.value !== activeLevel && l.count > 0)
              .map((l) => (
                <Link
                  key={l.slug}
                  href={`/government/${l.slug}`}
                  className="text-[12px] font-medium px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-100 hover:bg-blue-100 transition-colors"
                >
                  {l.label} ({l.count})
                </Link>
              ))}
            {levels.filter((l) => l.value !== activeLevel && l.count > 0).length === 0 && (
              <p className="text-[12px] text-muted">No other sections have listings yet.</p>
            )}
          </div>
        </div>

        {/* Top employers */}
        {topEmployers.length > 0 && (
          <div className="rounded-xl border border-divider p-5">
            <h3 className="text-[13px] font-semibold text-ink mb-3">Top Government Employers</h3>
            <div className="space-y-2">
              {topEmployers.slice(0, 5).map((emp) => (
                <div key={emp.name} className="flex items-center justify-between">
                  <span className="text-[12px] text-ink/70">{emp.name}</span>
                  <span className="font-mono text-[11px] text-muted">{emp.count} positions</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Application tips */}
      <div className="rounded-lg bg-emerald-50/60 border border-emerald-100/80 px-5 py-4">
        <p className="text-[11px] font-medium text-emerald-600 uppercase tracking-wider mb-1">
          Application Tips
        </p>
        <ul className="text-[12px] text-ink/70 space-y-1 list-disc pl-4">
          <li>Monitor the Kenya Gazette for official job announcements</li>
          <li>Government applications are always free — never pay a fee</li>
          <li>Prepare certified copies of all academic and professional certificates</li>
          <li>Chapter Six of the Constitution requires integrity declarations for all public officers</li>
        </ul>
      </div>

      {/* CTA */}
      <div className="text-center pt-2">
        <Link
          href="/jobs?type=GOVERNMENT"
          className="inline-flex items-center gap-2 text-[13px] font-medium text-accent hover:text-accent-dark transition-colors"
        >
          Browse all government jobs
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>
    </div>
  );
}

export default function GovTabs({
  levels,
  national,
  county,
  stateCorp,
  countyCountMap,
  topEmployers,
}: GovTabProps) {
  const [activeTab, setActiveTab] = useState("NATIONAL");

  const activeData: { jobs: any[]; emptyMessage: string } = {
    NATIONAL: {
      jobs: national,
      emptyMessage: "No national government positions available",
    },
    COUNTY: {
      jobs: county,
      emptyMessage: "No county government positions available",
    },
    STATE_CORPORATION: {
      jobs: stateCorp,
      emptyMessage: "No state corporation positions available",
    },
  }[activeTab] || { jobs: [], emptyMessage: "No listings" };

  return (
    <div className="mb-8">
      {/* Tab bar */}
      <div className="flex items-center gap-1 p-1 bg-ink/[0.03] rounded-xl mb-6 overflow-x-auto">
        {levels.map((level) => (
          <button
            key={level.value}
            onClick={() => setActiveTab(level.value)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-[13px] font-medium transition-all whitespace-nowrap ${
              activeTab === level.value
                ? "bg-white text-ink shadow-sm"
                : "text-muted hover:text-ink/70"
            }`}
          >
            <span>{level.icon}</span>
            <span>{level.label}</span>
            <span
              className={`font-mono text-[11px] px-1.5 py-0.5 rounded-md ${
                activeTab === level.value
                  ? "bg-accent/10 text-accent"
                  : "bg-ink/[0.04] text-muted/50"
              }`}
            >
              {level.count}
            </span>
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="min-h-[200px]">
        {activeData.jobs.length > 0 ? (
          <div>
            <p className="text-[12px] text-muted mb-3 font-mono">
              Showing {activeData.jobs.length} of {levels.find((l) => l.value === activeTab)?.count || 0} positions
            </p>
            <JobListings jobs={activeData.jobs} emptyMessage={activeData.emptyMessage} />
            {activeData.jobs.length >= 20 && (
              <p className="text-[12px] text-muted mt-3 text-center">
                Showing latest 20 positions.{" "}
                <Link
                  href={`/government/${levels.find((l) => l.value === activeTab)?.slug}`}
                  className="text-accent hover:text-accent-dark"
                >
                  View all &rarr;
                </Link>
              </p>
            )}
          </div>
        ) : (
          <RichFallbackSection
            countyCountMap={countyCountMap}
            topEmployers={topEmployers}
            levels={levels}
            activeLevel={activeTab}
          />
        )}
      </div>
    </div>
  );
}
