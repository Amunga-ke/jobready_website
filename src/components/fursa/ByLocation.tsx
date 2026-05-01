import Link from 'next/link';
import SectionNumber from './SectionNumber';

export default function ByLocation() {
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
          <div>
            <Link href="/jobs?location=nairobi" className="font-heading text-base font-bold text-ink hover:text-accent transition-colors">
              Nairobi <span className="font-mono text-sm font-normal text-muted">(4,200)</span>
            </Link>
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5 ml-4">
              <Link href="/jobs?location=nairobi-cbd" className="text-[13px] text-muted hover:text-ink transition-colors">CBD <span className="font-mono text-[11px] text-muted/40">(1,100)</span></Link>
              <Link href="/jobs?location=nairobi-westlands" className="text-[13px] text-muted hover:text-ink transition-colors">Westlands <span className="font-mono text-[11px] text-muted/40">(890)</span></Link>
              <Link href="/jobs?location=nairobi-kilimani" className="text-[13px] text-muted hover:text-ink transition-colors">Kilimani <span className="font-mono text-[11px] text-muted/40">(670)</span></Link>
              <Link href="/jobs?location=nairobi-industrial-area" className="text-[13px] text-muted hover:text-ink transition-colors">Industrial Area <span className="font-mono text-[11px] text-muted/40">(540)</span></Link>
            </div>
          </div>
          <div>
            <Link href="/jobs?location=mombasa" className="font-heading text-base font-bold text-ink hover:text-accent transition-colors">
              Mombasa <span className="font-mono text-sm font-normal text-muted">(890)</span>
            </Link>
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5 ml-4">
              <Link href="/jobs?location=mombasa-cbd" className="text-[13px] text-muted hover:text-ink transition-colors">CBD <span className="font-mono text-[11px] text-muted/40">(340)</span></Link>
              <Link href="/jobs?location=mombasa-nyali" className="text-[13px] text-muted hover:text-ink transition-colors">Nyali <span className="font-mono text-[11px] text-muted/40">(210)</span></Link>
              <Link href="/jobs?location=mombasa-changamwe" className="text-[13px] text-muted hover:text-ink transition-colors">Changamwe <span className="font-mono text-[11px] text-muted/40">(180)</span></Link>
            </div>
          </div>
        </div>
        <div className="h-px bg-divider my-6"></div>
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          <Link href="/jobs?location=nakuru" className="text-[13px] text-muted hover:text-ink transition-colors">Nakuru <span className="font-mono text-[11px] text-muted/40">(420)</span></Link>
          <Link href="/jobs?location=kisumu" className="text-[13px] text-muted hover:text-ink transition-colors">Kisumu <span className="font-mono text-[11px] text-muted/40">(380)</span></Link>
          <Link href="/jobs?location=eldoret" className="text-[13px] text-muted hover:text-ink transition-colors">Eldoret <span className="font-mono text-[11px] text-muted/40">(210)</span></Link>
          <Link href="/jobs?location=thika" className="text-[13px] text-muted hover:text-ink transition-colors">Thika <span className="font-mono text-[11px] text-muted/40">(190)</span></Link>
          <Link href="/jobs?workMode=REMOTE" className="text-[13px] text-accent font-medium hover:text-accent-dark transition-colors">Remote <span className="font-mono text-[11px] text-accent/60">(340)</span></Link>
        </div>
        <p className="font-mono text-[10px] text-muted/40 mt-3 uppercase tracking-wider">+ 37 more counties</p>
      </div>
    </section>
  );
}
