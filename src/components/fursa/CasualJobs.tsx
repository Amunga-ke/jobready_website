import SectionNumber from './SectionNumber';
import JobClickable from './JobClickable';
import { casualJobs } from '@/lib/mock-jobs';

export default function CasualJobs() {
  return (
    <section className="py-14 bg-white border-b border-divider relative overflow-hidden">
      <SectionNumber num="09" />
      <div className="max-w-6xl mx-auto px-5 relative">
        <h2 className="font-heading text-xl font-bold mb-5">Casual & Part-Time</h2>
        <div className="bg-surface border border-divider rounded-xl p-5 sm:p-6">
          <div className="text-[12px] leading-[2.2]">
            {casualJobs.map((job, i) => (
              <JobClickable
                key={job.id}
                job={job}
                className={`group cursor-pointer ${i < casualJobs.length - 1 ? 'border-b border-subtle pb-1' : ''}`}
              >
                <span className="text-ink group-hover:text-accent transition-colors">{job.title}</span>
                <span className="text-muted/40"> — {job.location.split(",")[0]} — </span>
                <span className="text-muted">
                  {job.salaryCurrency}{" "}{job.salaryMin?.toLocaleString()}/{job.salaryPeriod}
                </span>
                {job.tags.length > 0 && (
                  <span className="text-muted/40"> — {job.tags[job.tags.length > 2 ? 2 : job.tags.length - 1]}</span>
                )}
              </JobClickable>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
