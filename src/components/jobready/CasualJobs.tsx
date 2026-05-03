import Link from "next/link";
import SectionNumber from './SectionNumber';
import JobClickable from './JobClickable';
import type { Job } from '@/types';

export default function CasualJobs({ jobs }: { jobs: Job[] }) {
  return (
    <section className="py-14 bg-white border-b border-divider relative overflow-hidden">
      <SectionNumber num="09" />
      <div className="max-w-6xl mx-auto px-5 relative">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-heading text-xl font-bold">Casual & Part-Time</h2>
        </div>
        <div className="bg-surface border border-divider rounded-xl p-5 sm:p-6">
          <div className="text-[12px] leading-[2.2]">
            {jobs.map((job, i) => (
              <JobClickable
                key={job.id}
                job={job}
                className={`group cursor-pointer ${i < jobs.length - 1 ? 'border-b border-subtle pb-1' : ''}`}
              >
                <span className="text-ink group-hover:text-accent transition-colors">{job.title}</span>
                <span className="text-muted/40"> — {job.location.split(",")[0]} — </span>
                <span className="text-muted">
                  KES{" "}{job.salaryMin?.toLocaleString()}/{job.salaryPeriod}
                </span>
                {job.tags.length > 0 && (
                  <span className="text-muted/40"> — {job.tags[job.tags.length > 2 ? 2 : job.tags.length - 1]}</span>
                )}
              </JobClickable>
            ))}
          </div>
        </div>
        <div className="mt-4">
          <Link
            href="/casual"
            className="inline-flex items-center gap-1 text-[13px] font-medium text-ink hover:text-accent transition-colors"
          >
            Browse all casual & part-time jobs →
          </Link>
        </div>
      </div>
    </section>
  );
}
