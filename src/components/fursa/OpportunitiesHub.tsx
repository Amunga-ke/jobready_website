'use client';

import { useJobModal } from './JobModalContext';
import SectionNumber from './SectionNumber';

const internships = [
  { id: 'equity-finance-intern', title: 'Finance Intern — Equity Bank' },
  { id: 'safaricom-software-intern', title: 'Software Intern — Safaricom' },
  { id: 'eabl-marketing-intern', title: 'Marketing Intern — EABL' },
];

export default function OpportunitiesHub() {
  const { openJobById } = useJobModal();

  return (
    <section className="py-14 relative overflow-hidden">
      <SectionNumber num="05" />
      <div className="max-w-6xl mx-auto px-5 relative">
        <h2 className="font-heading text-xl font-bold mb-6">Opportunities Hub</h2>
        <div className="flex gap-3 overflow-x-auto pb-3 -mx-5 px-5 scrollbar-hide snap-x snap-mandatory">
          {/* Internships Card */}
          <div className="snap-start shrink-0 w-64 border border-divider rounded-xl p-4 hover:border-ink/20 transition-colors">
            <div className="font-mono text-[10px] text-accent uppercase tracking-widest mb-4">01 — Internships</div>
            <div className="space-y-2.5 border-t border-divider pt-3">
              {internships.map((job) => (
                <p
                  key={job.id}
                  className="text-[13px] text-ink hover:text-accent-dark transition-colors cursor-pointer"
                  onClick={() => openJobById(job.id)}
                >
                  {job.title}
                </p>
              ))}
            </div>
            <div className="border-t border-divider mt-3 pt-3">
              <span className="font-mono text-[11px] text-muted">+156 more</span>
            </div>
          </div>

          {/* Scholarships Card */}
          <div
            className="snap-start shrink-0 w-64 border border-divider rounded-xl p-4 hover:border-ink/20 transition-colors cursor-pointer"
            onClick={() => openJobById('mastercard-scholars')}
          >
            <div className="font-mono text-[10px] text-accent uppercase tracking-widest mb-4">02 — Scholarships</div>
            <div className="border-t border-divider pt-3 text-center py-3">
              <div className="font-mono text-3xl font-bold text-accent tabular-nums">28</div>
              <div className="font-mono text-[10px] text-muted uppercase tracking-widest mt-1">February</div>
            </div>
            <p className="text-[13px] font-medium text-ink mt-2">Mastercard Foundation Scholars</p>
            <p className="text-[11px] text-muted">University of Nairobi</p>
          </div>

          {/* University Card */}
          <div className="snap-start shrink-0 w-64 border border-divider rounded-xl p-4 hover:border-ink/20 transition-colors cursor-pointer">
            <div className="font-mono text-[10px] text-accent uppercase tracking-widest mb-4">03 — University</div>
            <div className="space-y-3 border-t border-divider pt-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] font-medium text-ink">UoN</span>
                  <span className="text-[11px] text-muted">Nairobi</span>
                </div>
                <span className="w-1.5 h-1.5 bg-accent rounded-full" />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] font-medium text-ink">KU</span>
                  <span className="text-[11px] text-muted">Kenyatta</span>
                </div>
                <span className="w-1.5 h-1.5 bg-accent rounded-full" />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] font-medium text-ink">MKU</span>
                  <span className="text-[11px] text-muted">Mount Kenya</span>
                </div>
                <span className="w-1.5 h-1.5 bg-accent rounded-full" />
              </div>
            </div>
          </div>

          {/* Entry Level Card */}
          <div className="snap-start shrink-0 w-64 bg-ink text-white border border-ink rounded-xl p-4 hover:bg-ink/90 transition-colors cursor-pointer">
            <div className="font-mono text-[10px] text-accent-light uppercase tracking-widest mb-4">04 — Entry Level</div>
            <div className="border-t border-white/10 pt-4 text-center py-6">
              <div className="font-heading text-6xl font-bold">340</div>
              <div className="text-[12px] text-white/40 mt-1">open positions</div>
            </div>
            <div className="border-t border-white/10 pt-3 text-center">
              <span className="font-mono text-[10px] text-white/50 uppercase tracking-wider">No experience needed</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
