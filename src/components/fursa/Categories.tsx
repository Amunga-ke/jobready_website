'use client';

import { useRef } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import SectionNumber from './SectionNumber';

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
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir * 260, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-14 bg-white border-b border-divider relative overflow-hidden">
      <SectionNumber num="04" />
      <div className="max-w-6xl mx-auto px-5 relative">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading text-xl font-bold">Categories</h2>
          <a href="#" className="text-[11px] font-mono text-muted hover:text-ink transition-colors uppercase tracking-wider">
            40+ →
          </a>
        </div>
        <div className="relative">
          <button
            onClick={() => scroll(-1)}
            className="scroll-arrow absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10 w-9 h-9 rounded-full border border-divider bg-white flex items-center justify-center text-muted shadow-sm opacity-0 lg:opacity-100 transition-opacity"
          >
            <ArrowLeft className="text-sm" />
          </button>
          <button
            onClick={() => scroll(1)}
            className="scroll-arrow absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10 w-9 h-9 rounded-full border border-divider bg-white flex items-center justify-center text-muted shadow-sm opacity-0 lg:opacity-100 transition-opacity"
          >
            <ArrowRight className="text-sm" />
          </button>
          <div
            ref={scrollRef}
            className="flex gap-2.5 overflow-x-auto pb-3 px-1 scrollbar-hide snap-x snap-mandatory"
          >
            {categories.map((cat, i) => (
              <button
                key={i}
                className={`snap-start shrink-0 px-5 py-4 text-[13px] font-medium rounded-xl transition-colors text-left ${
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
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
