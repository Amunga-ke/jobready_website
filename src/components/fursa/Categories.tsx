'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

const categorySlugs: Record<string, string> = {
  'Technology & IT': 'technology',
  'Finance & Accounting': 'finance-accounting',
  'Sales & Business Dev': 'sales-business',
  'Marketing & Comms': 'marketing-communications',
  'Human Resources': 'human-resources',
  'Engineering': 'engineering',
  'Healthcare & Medical': 'healthcare',
  'Education & Training': 'education',
  'Operations & Admin': 'operations-admin',
  'Logistics & Supply Chain': 'supply-chain',
  'Hospitality & Tourism': 'hospitality',
  'Legal & Compliance': 'legal',
  'Creative Arts & Design': 'creative-design',
  'Government & Public': 'government-public-sector',
};

const categories = [
  { name: 'Technology & IT', count: '2,300 jobs', dark: true },
  { name: 'Finance & Accounting', count: '1,800 jobs' },
  { name: 'Sales & Business Dev', count: '1,200 jobs' },
  { name: 'Marketing & Comms', count: '980 jobs' },
  { name: 'Human Resources', count: '760 jobs' },
  { name: 'Engineering', count: '690 jobs' },
  { name: 'Healthcare & Medical', count: '540 jobs' },
  { name: 'Education & Training', count: '480 jobs' },
  { name: 'Operations & Admin', count: '420 jobs' },
  { name: 'Logistics & Supply Chain', count: '310 jobs' },
  { name: 'Hospitality & Tourism', count: '240 jobs' },
  { name: 'Legal & Compliance', count: '210 jobs' },
  { name: 'Creative Arts & Design', count: '190 jobs' },
  { name: 'Government & Public', count: '180 jobs' },
];

export default function Categories() {
  const router = useRouter();

  return (
    <section className="py-14 bg-white border-b border-divider relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-5 relative">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading text-xl font-bold">Categories</h2>
          <Link href="/jobs" className="text-[11px] font-mono text-muted hover:text-ink transition-colors uppercase tracking-wider">
            40+ →
          </Link>
        </div>
        <div className="flex gap-2.5 overflow-x-auto pb-3 px-1 scrollbar-hide snap-x snap-mandatory">
          {categories.map((cat, i) => {
            const slug = categorySlugs[cat.name] || '';
            return (
              <button
                key={i}
                onClick={() => router.push(`/jobs?category=${slug}`)}
                className={`snap-start shrink-0 px-5 py-4 text-[13px] font-medium rounded-xl transition-colors text-left active:scale-[0.98] transition-transform ${
                  cat.dark
                    ? 'bg-ink text-white hover:bg-ink/90'
                    : 'bg-surface text-ink border border-divider hover:border-ink/30'
                }`}
              >
                <div
                  className={`font-mono text-[10px] mb-1 ${
                    cat.dark ? 'text-white/40' : 'text-muted'
                  }`}
                >
                  {cat.count}
                </div>
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
