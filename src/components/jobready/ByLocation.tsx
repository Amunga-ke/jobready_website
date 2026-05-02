import Link from "next/link";
import SectionNumber from './SectionNumber';
import type { County } from '@prisma/client';

export default function ByLocation({ counties }: { counties: (County & { _count: { listings: number } })[] }) {
  // Only show counties with listings, sorted by count desc
  const activeCounties = counties
    .filter(c => c._count.listings > 0)
    .sort((a, b) => b._count.listings - a._count.listings);

  const topCounties = activeCounties.slice(0, 6);
  const restCounties = activeCounties.slice(6, 12);
  const totalCount = activeCounties.length;

  return (
    <section className="py-14 relative overflow-hidden">
      <SectionNumber num="07" />
      <div className="max-w-6xl mx-auto px-5 relative">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading text-xl font-bold">By Location</h2>
          <Link href="/jobs" className="text-[11px] font-mono text-muted hover:text-ink transition-colors uppercase tracking-wider">
            All locations →
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 gap-x-12 gap-y-5">
          {topCounties.slice(0, 2).map((county) => (
            <div key={county.id}>
              <Link href={`/jobs/in-${county.slug}`} className="font-heading text-base font-bold text-ink hover:text-accent transition-colors">
                {county.name} <span className="font-mono text-sm font-normal text-muted">({county._count.listings.toLocaleString()})</span>
              </Link>
            </div>
          ))}
        </div>
        {restCounties.length > 0 && (
          <>
            <div className="h-px bg-divider my-6"></div>
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              {restCounties.map((county) => (
                <Link key={county.id} href={`/jobs/in-${county.slug}`} className="text-[13px] text-muted hover:text-ink transition-colors">
                  {county.name} <span className="font-mono text-[11px] text-muted/40">({county._count.listings.toLocaleString()})</span>
                </Link>
              ))}
            </div>
          </>
        )}
        <p className="font-mono text-[10px] text-muted/40 mt-3 uppercase tracking-wider">+ {totalCount - Math.min(totalCount, 12)} more counties</p>
      </div>
    </section>
  );
}
