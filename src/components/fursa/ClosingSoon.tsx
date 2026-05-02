import SectionNumber from './SectionNumber';
import JobClickable from './JobClickable';
import { closingSoonJobs } from '@/lib/mock-jobs';

function deadlineText(job: { deadline?: string | null }): { text: string; urgent: boolean } {
  if (!job.deadline) return { text: "", urgent: false };
  const now = new Date();
  const end = new Date(job.deadline);
  const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (diff <= 0) return { text: "Closed", urgent: false };
  if (diff === 1) return { text: "1d left", urgent: true };
  if (diff <= 3) return { text: `${diff}d left`, urgent: true };
  return { text: `${diff}d left`, urgent: false };
}

export default function ClosingSoon() {
  return (
    <section className="py-14 border-t border-divider bg-white relative overflow-hidden">
      <SectionNumber num="02" />
      <div className="max-w-6xl mx-auto px-5 relative">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading text-xl font-bold">Closing Soon</h2>
          <a href="#" className="text-[11px] font-mono text-muted hover:text-ink transition-colors uppercase tracking-wider">
            23 this week →
          </a>
        </div>
        <div className="hidden sm:grid sm:grid-cols-12 gap-4 pb-2 border-b border-divider text-[10px] font-mono text-muted uppercase tracking-widest">
          <div className="col-span-5">Position</div>
          <div className="col-span-4">Company</div>
          <div className="col-span-3 text-right">Deadline</div>
        </div>
        <div className="divide-y divide-subtle">
          {closingSoonJobs.map((job) => {
            const dl = deadlineText(job);
            return (
              <JobClickable
                key={job.id}
                job={job}
                className="grid grid-cols-12 gap-4 py-3.5 group cursor-pointer hover:bg-surface rounded-lg -mx-2 px-2 transition-colors"
              >
                <div className="col-span-7 sm:col-span-5 text-sm font-medium truncate group-hover:text-accent transition-colors">
                  {job.title}
                </div>
                <div className="col-span-5 sm:col-span-4 text-[12px] text-muted truncate">{job.companyName}</div>
                <div className="col-span-12 sm:col-span-3 sm:text-right">
                  <span
                    className={`font-mono text-[12px] font-medium tabular-nums ${
                      dl.urgent ? 'text-accent' : 'text-muted'
                    }`}
                  >
                    {dl.text}
                  </span>
                </div>
              </JobClickable>
            );
          })}
        </div>
      </div>
    </section>
  );
}
