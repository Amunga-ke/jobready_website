import SectionNumber from './SectionNumber';

const leftUpdates = [
  { text: '42 candidates shortlisted — KRA Graduate Trainee', time: '12 min ago', active: true },
  { text: 'Interview invites sent — Equity Graduate Program', time: '1 hour ago', active: true },
  { text: 'Safaricom Senior PM applications now closed', time: '3 hours ago', active: false },
];

const rightUpdates = [
  { text: 'NCBA extends Marketing Intern deadline to Feb 20', time: '2 hours ago', active: true },
  { text: 'TSC internship postings for Q2 2025 now open', time: '5 hours ago', active: true },
  { text: 'KCB final round interviews scheduled for next week', time: '6 hours ago', active: false },
];

function TimelineColumn({ updates }: { updates: typeof leftUpdates }) {
  return (
    <div className="relative">
      <div className="absolute left-[5px] top-2 bottom-2 w-px bg-divider rounded-full"></div>
      <div className="space-y-5">
        {updates.map((update, i) => (
          <div key={i} className="flex gap-4 group cursor-pointer">
            <div
              className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${
                update.active ? 'bg-accent ring-4 ring-accent/10' : 'bg-subtle'
              }`}
            ></div>
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
          <a href="#" className="text-[11px] font-mono text-muted hover:text-ink transition-colors uppercase tracking-wider">
            All updates →
          </a>
        </div>
        <div className="grid sm:grid-cols-2 gap-x-10">
          <TimelineColumn updates={leftUpdates} />
          <TimelineColumn updates={rightUpdates} />
        </div>
      </div>
    </section>
  );
}
