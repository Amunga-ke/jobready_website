import SectionNumber from './SectionNumber';
import JobClickable from './JobClickable';
import Link from 'next/link';
import type { Job } from '@/types';

interface OpportunitiesData {
  internships: Job[];
  scholarships: Job[];
  entryLevel: Job[];
  internshipCount: number;
  scholarshipCount: number;
  entryLevelCount: number;
}

export default function OpportunitiesHub({ opportunities }: { opportunities: OpportunitiesData }) {
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
              {opportunities.internships.slice(0, 3).map((job) => (
                <JobClickable key={job.id} job={job} className="cursor-pointer">
                  <p className="text-[13px] text-ink hover:text-accent-dark transition-colors">{job.title}</p>
                </JobClickable>
              ))}
            </div>
            <div className="border-t border-divider mt-3 pt-3">
              <Link href="/opportunities/internship" className="font-mono text-[11px] text-accent hover:text-accent-dark transition-colors">
                +{opportunities.internshipCount} more →
              </Link>
            </div>
          </div>

          {/* Scholarships Card */}
          <Link href="/opportunities/scholarship" className="snap-start shrink-0 w-64 border border-divider rounded-xl p-4 hover:border-ink/20 transition-colors cursor-pointer">
            <div className="font-mono text-[10px] text-accent uppercase tracking-widest mb-4">02 — Scholarships</div>
            <div className="border-t border-divider pt-3 text-center py-3">
              <div className="font-mono text-3xl font-bold text-accent tabular-nums">{opportunities.scholarshipCount}</div>
              <div className="font-mono text-[10px] text-muted uppercase tracking-widest mt-1">Available</div>
            </div>
            <p className="text-[13px] font-medium text-ink mt-2">Scholarships & Grants</p>
            <p className="text-[11px] text-muted">Full funding, tuition support, stipends</p>
          </Link>

          {/* Entry Level Card */}
          <Link href="/jobs?experience=Entry-level" className="snap-start shrink-0 w-64 bg-ink text-white border border-ink rounded-xl p-4 hover:bg-ink/90 transition-colors cursor-pointer">
            <div className="font-mono text-[10px] text-accent-light uppercase tracking-widest mb-4">03 — Entry Level</div>
            <div className="border-t border-white/10 pt-4 text-center py-6">
              <div className="font-heading text-6xl font-bold">{opportunities.entryLevelCount}</div>
              <div className="text-[12px] text-white/40 mt-1">open positions</div>
            </div>
            <div className="border-t border-white/10 pt-3 text-center">
              <span className="font-mono text-[10px] text-white/50 uppercase tracking-wider">No experience needed</span>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
