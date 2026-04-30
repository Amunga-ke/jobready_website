import SectionNumber from './SectionNumber';

const casualJobs = [
  { title: 'Waitstaff', location: 'Westlands', rate: 'Ksh 500/day', note: 'Immediate' },
  { title: 'Delivery Rider', location: 'CBD', rate: 'Ksh 1,200/day', note: 'Own bike' },
  { title: 'Farm Worker', location: 'Naivasha', rate: 'Ksh 700/day', note: 'Accom. provided' },
  { title: 'Shop Assistant', location: 'Thika Rd', rate: 'Ksh 15k/mo', note: 'Part-time' },
  { title: 'Cleaning Staff', location: 'Kilimani', rate: 'Ksh 600/day', note: 'Weekends' },
  { title: 'Loader', location: 'Industrial Area', rate: 'Ksh 800/day', note: 'Morning shift' },
];

export default function CasualJobs() {
  return (
    <section className="py-14 bg-white border-b border-divider relative overflow-hidden">
      <SectionNumber num="09" />
      <div className="max-w-6xl mx-auto px-5 relative">
        <h2 className="font-heading text-xl font-bold mb-5">Casual & Part-Time</h2>
        <div className="bg-surface border border-divider rounded-xl p-5 sm:p-6">
          <div className="classifieds-text text-[12px] leading-[2.2]">
            {casualJobs.map((job, i) => (
              <div
                key={i}
                className={`group cursor-pointer ${i < casualJobs.length - 1 ? 'border-b border-subtle pb-1' : ''}`}
              >
                <span className="text-ink group-hover:text-accent transition-colors">{job.title}</span>
                <span className="text-muted/40"> — {job.location} — </span>
                <span className="text-muted">{job.rate}</span>
                <span className="text-muted/40"> — {job.note}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
