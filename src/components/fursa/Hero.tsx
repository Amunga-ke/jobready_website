'use client';

import { useJobModal } from './JobModalContext';

const recentJobs = [
  { id: 'safaricom-senior-accountant', title: 'Senior Accountant', company: 'Safaricom', location: 'Nairobi', time: '2m' },
  { id: 'kcb-backend-developer', title: 'Backend Developer', company: 'KCB Bank', location: 'Remote', time: '5m' },
  { id: 'ncba-marketing-intern', title: 'Marketing Intern', company: 'NCBA Group', location: 'Nairobi', time: '8m' },
  { id: 'kenha-civil-engineer', title: 'Civil Engineer', company: 'KeNHA', location: 'Nakuru', time: '12m' },
];

export default function Hero() {
  const { openJobById } = useJobModal();

  return (
    <section className="pt-8 pb-16 lg:pt-12 lg:pb-24 border-b border-divider">
      <div className="max-w-6xl mx-auto px-5">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16">
          <div className="lg:col-span-8">
            <p className="font-mono text-[11px] text-muted uppercase tracking-[0.2em] mb-6">
              12,400 active positions from 800+ employers
            </p>
            <h1 className="font-hero text-5xl sm:text-6xl lg:text-[76px] font-black leading-[0.95] tracking-tight mb-6">
              Your next job<br />
              <span className="text-muted">is here.</span>
            </h1>
            <p className="text-muted text-base max-w-md leading-relaxed mb-10">
              Verified jobs across Kenya. No scams, no recruiter spam, no noise.
            </p>

            <div className="max-w-xl">
              <div className="border border-divider rounded-xl p-1.5 mb-3">
                <div className="flex">
                  <input
                    type="text"
                    placeholder="Job title, company, keyword..."
                    className="flex-1 text-sm bg-transparent focus:outline-none placeholder-muted/60 pl-4 py-3"
                  />
                  <button className="text-sm font-semibold text-ink hover:text-accent transition-colors shrink-0 pr-4">
                    Search →
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <button className="text-[11px] text-muted hover:text-ink transition-colors">Remote</button>
                <button className="text-[11px] text-muted hover:text-ink transition-colors">Entry Level</button>
                <button className="text-[11px] text-muted hover:text-ink transition-colors">Government</button>
                <button className="text-[11px] text-muted hover:text-ink transition-colors">This Week</button>
                <button className="text-[11px] text-muted hover:text-ink transition-colors">Internships</button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 border-t lg:border-t-0 lg:border-l border-divider pt-6 lg:pt-0 lg:pl-8">
            <div className="font-mono text-[10px] text-muted uppercase tracking-widest mb-4">Just posted</div>
            <div className="space-y-4">
              {recentJobs.map((job, i) => (
                <div key={job.id}>
                  <div
                    className="group cursor-pointer"
                    onClick={() => openJobById(job.id)}
                  >
                    <p className="text-sm font-medium group-hover:text-accent transition-colors">{job.title}</p>
                    <p className="text-[12px] text-muted mt-0.5">
                      {job.company} · {job.location} · <span className="font-mono text-[11px]">{job.time}</span>
                    </p>
                  </div>
                  {i < recentJobs.length - 1 && <div className="border-t border-subtle mt-4" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
