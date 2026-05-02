'use client';

import { useRef } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import SectionNumber from './SectionNumber';
import type { Category } from '@prisma/client';

export default function Categories({ categories }: { categories: (Category & { _count: { listings: number } })[] }) {
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
          <Link href="/jobs" className="text-[11px] font-mono text-muted hover:text-ink transition-colors uppercase tracking-wider">
            All categories →
          </Link>
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
            {categories.slice(0, 14).map((cat, i) => {
              const count = cat._count.listings;
              return (
                <Link
                  key={cat.id}
                  href={`/jobs/category/${cat.slug}`}
                  className={`snap-start shrink-0 px-5 py-4 text-[13px] font-medium rounded-xl transition-colors text-left ${
                    i === 0
                      ? 'bg-ink text-white hover:bg-ink/90'
                      : 'bg-surface text-ink border border-divider hover:border-ink/30'
                  }`}
                >
                  <div className={`font-mono text-[10px] mb-1 ${i === 0 ? 'text-white/40' : 'text-muted'}`}>
                    {count.toLocaleString()} jobs
                  </div>
                  {cat.name}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
