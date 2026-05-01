'use client';

import { useJobModal } from './JobModalContext';
import SectionNumber from './SectionNumber';

const nationalJobs = [
  { id: 'kra-graduate-trainee', title: 'KRA Graduate Trainee Program 2025', deadline: 'Closes 15 Feb', gazette: true },
  { id: 'tsc-teacher-posts', title: 'TSC — 5,000 Teacher Posts', deadline: 'Closes 28 Feb', gazette: false },
  { id: 'kenya-police-recruitment', title: 'Kenya Police Constable Recruitment', deadline: 'Closes 10 Mar', gazette: true },
];

const countyJobs = [
  { id: 'nakuru-county-various', title: 'Nakuru County — Various Positions', deadline: 'Closes 20 Feb' },
  { id: 'nairobi-county-health', title: 'Nairobi County — Health Workers', deadline: 'Closes 25 Feb' },
  { id: 'mombasa-county-engineers', title: 'Mombasa County — Engineers', deadline: 'Closes 5 Mar' },
];

export default function Government() {
  const { openJobById } = useJobModal();

  return (
    <section className="py-14 bg-white border-t border-divider relative overflow-hidden">
      <SectionNumber num="08" />
      <div className="max-w-6xl mx-auto px-5 relative">
        <h2 className="font-heading text-xl font-bold mb-6">Government</h2>
        <div className="grid sm:grid-cols-2">
          <div className="border-r-0 sm:border-r border-b sm:border-b-0 border-divider sm:pr-8 pb-6 sm:pb-0">
            <div className="font-mono text-[10px] text-muted uppercase tracking-widest mb-4">National</div>
            <div className="space-y-0 divide-y divide-subtle">
              {nationalJobs.map((job) => (
                <div
                  key={job.id}
                  onClick={() => openJobById(job.id)}
                  className="py-3 group cursor-pointer"
                >
                  <p className="text-sm font-medium group-hover:text-accent transition-colors">{job.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {job.gazette && (
                      <span className="font-mono text-[9px] bg-surface text-muted px-1.5 py-0.5 rounded-md border border-subtle">
                        GAZETTE
                      </span>
                    )}
                    <span className="font-mono text-[11px] text-muted tabular-nums">{job.deadline}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="sm:pl-8 pt-6 sm:pt-0">
            <div className="font-mono text-[10px] text-muted uppercase tracking-widest mb-4">County</div>
            <div className="space-y-0 divide-y divide-subtle">
              {countyJobs.map((job) => (
                <div
                  key={job.id}
                  onClick={() => openJobById(job.id)}
                  className="py-3 group cursor-pointer"
                >
                  <p className="text-sm font-medium group-hover:text-accent transition-colors">{job.title}</p>
                  <span className="font-mono text-[11px] text-muted tabular-nums mt-1 block">{job.deadline}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="h-px bg-divider mt-6" />
        <a href="#" className="inline-flex items-center gap-1 text-[13px] font-medium text-ink hover:text-accent mt-4 transition-colors">
          Browse all government jobs →
        </a>
      </div>
    </section>
  );
}
