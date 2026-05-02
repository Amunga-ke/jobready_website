import SectionNumber from './SectionNumber';
import JobClickable from './JobClickable';
import { nationalGovJobs, countyGovJobs } from '@/lib/mock-jobs';
import { formatDateShortUTC } from '@/lib/format-date';

export default function Government() {
  return (
    <section className="py-14 bg-white border-t border-divider relative overflow-hidden">
      <SectionNumber num="08" />
      <div className="max-w-6xl mx-auto px-5 relative">
        <h2 className="font-heading text-xl font-bold mb-6">Government</h2>
        <div className="grid sm:grid-cols-2">
          <div className="border-r-0 sm:border-r border-b sm:border-b-0 border-divider sm:pr-8 pb-6 sm:pb-0">
            <div className="font-mono text-[10px] text-muted uppercase tracking-widest mb-4">National</div>
            <div className="space-y-0 divide-y divide-subtle">
              {nationalGovJobs.map((job) => (
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
          </div>
          <div className="sm:pl-8 pt-6 sm:pt-0">
            <div className="font-mono text-[10px] text-muted uppercase tracking-widest mb-4">County</div>
            <div className="space-y-0 divide-y divide-subtle">
              {countyGovJobs.map((job) => (
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
          </div>
        </div>
        <div className="h-px bg-divider mt-6"></div>
        <a href="#" className="inline-flex items-center gap-1 text-[13px] font-medium text-ink hover:text-accent mt-4 transition-colors">
          Browse all government jobs →
        </a>
      </div>
    </section>
  );
}
