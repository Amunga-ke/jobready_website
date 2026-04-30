import SectionNumber from './SectionNumber';

const jobs = [
  { position: 'Marketing Intern', company: 'NCBA Group', deadline: '1d left', urgent: true },
  { position: 'Senior Accountant', company: 'Safaricom', deadline: '2d left', urgent: false },
  { position: 'HR Manager', company: 'Equity Bank', deadline: '3d left', urgent: false },
  { position: 'Junior Developer', company: 'KCB Bank', deadline: '5d left', urgent: false },
  { position: 'Data Analyst', company: 'KRA', deadline: '5d left', urgent: false },
];

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
          {jobs.map((job, i) => (
            <div
              key={i}
              className="grid grid-cols-12 gap-4 py-3.5 group cursor-pointer hover:bg-surface rounded-lg -mx-2 px-2 transition-colors"
            >
              <div className="col-span-7 sm:col-span-5 text-sm font-medium truncate group-hover:text-accent transition-colors">
                {job.position}
              </div>
              <div className="col-span-5 sm:col-span-4 text-[12px] text-muted truncate">{job.company}</div>
              <div className="col-span-12 sm:col-span-3 sm:text-right">
                <span
                  className={`font-mono text-[12px] font-medium tabular-nums ${
                    job.urgent ? 'text-accent' : 'text-muted'
                  }`}
                >
                  {job.deadline}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
