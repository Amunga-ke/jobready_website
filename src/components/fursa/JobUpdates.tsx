'use client';

import Link from 'next/link';
import { useJobModal } from './JobModalContext';
import SectionNumber from './SectionNumber';

const leftUpdates = [
  { text: '42 candidates shortlisted — KRA Graduate Trainee', time: '12 min ago', active: true, jobId: 'kra-graduate-trainee' },
  { text: 'Interview invites sent — Equity Graduate Program', time: '1 hour ago', active: true, jobId: 'equity-financial-analyst' },
  { text: 'Safaricom Senior PM applications now closed', time: '3 hours ago', active: false, jobId: 'safaricom-senior-pm' },
];

const rightUpdates = [
  { text: 'NCBA extends Marketing Intern deadline to Feb 20', time: '2 hours ago', active: true, jobId: 'ncba-marketing-intern' },
  { text: 'TSC internship postings for Q2 2025 now open', time: '5 hours ago', active: true, jobId: 'tsc-teacher-posts' },
  { text: 'KCB final round interviews scheduled for next week', time: '6 hours ago', active: false, jobId: 'kcb-backend-developer' },
];

function TimelineColumn({ updates }: { updates: typeof leftUpdates }) {
  const { openJobById } = useJobModal();

  return (
    <div className="relative">
      <div className="absolute left-[5px] top-2 bottom-2 w-px bg-divider rounded-full" />
      <div className="space-y-5">
        {updates.map((update, i) => (
          <div key={i} className="flex gap-4 group cursor-pointer active:scale-[0.98] transition-transform rounded-lg -mx-1 px-1" onClick={() => openJobById(update.jobId)}>
            <div
              className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${
                update.active ? 'bg-accent ring-4 ring-accent/10' : 'bg-subtle'
              }`}
            />
            <div>
              <p className="text-sm font-medium group-hover:text-accent-dark transition-colors">{update.text}</p>
              <span className="font-mono text-[11px] text-muted mt-1 block">{update.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function JobUpdates() {
  return (
    <section className="py-14 relative overflow-hidden">
      <SectionNumber num="01" />
      <div className="max-w-6xl mx-auto px-5 relative">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-heading text-xl font-bold">Job Updates</h2>
          <Link href="/jobs" className="text-[11px] font-mono text-muted hover:text-ink transition-colors uppercase tracking-wider">
            All updates →
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 gap-x-10">
          <TimelineColumn updates={leftUpdates} />
          <TimelineColumn updates={rightUpdates} />
        </div>
      </div>
    </section>
  );
}
