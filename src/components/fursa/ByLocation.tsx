import SectionNumber from './SectionNumber';

export default function ByLocation() {
  return (
    <section className="py-14 relative overflow-hidden">
      <SectionNumber num="07" />
      <div className="max-w-6xl mx-auto px-5 relative">
        <h2 className="font-heading text-xl font-bold mb-6">By Location</h2>
        <div className="grid sm:grid-cols-2 gap-x-12 gap-y-5">
          <div>
            <a href="#" className="font-heading text-base font-bold text-ink hover:text-accent transition-colors">
              Nairobi <span className="font-mono text-sm font-normal text-muted">(4,200)</span>
            </a>
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5 ml-4">
              <a href="#" className="text-[13px] text-muted hover:text-ink transition-colors">CBD <span className="font-mono text-[11px] text-muted/40">(1,100)</span></a>
              <a href="#" className="text-[13px] text-muted hover:text-ink transition-colors">Westlands <span className="font-mono text-[11px] text-muted/40">(890)</span></a>
              <a href="#" className="text-[13px] text-muted hover:text-ink transition-colors">Kilimani <span className="font-mono text-[11px] text-muted/40">(670)</span></a>
              <a href="#" className="text-[13px] text-muted hover:text-ink transition-colors">Industrial Area <span className="font-mono text-[11px] text-muted/40">(540)</span></a>
            </div>
          </div>
          <div>
            <a href="#" className="font-heading text-base font-bold text-ink hover:text-accent transition-colors">
              Mombasa <span className="font-mono text-sm font-normal text-muted">(890)</span>
            </a>
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5 ml-4">
              <a href="#" className="text-[13px] text-muted hover:text-ink transition-colors">CBD <span className="font-mono text-[11px] text-muted/40">(340)</span></a>
              <a href="#" className="text-[13px] text-muted hover:text-ink transition-colors">Nyali <span className="font-mono text-[11px] text-muted/40">(210)</span></a>
              <a href="#" className="text-[13px] text-muted hover:text-ink transition-colors">Changamwe <span className="font-mono text-[11px] text-muted/40">(180)</span></a>
            </div>
          </div>
        </div>
        <div className="h-px bg-divider my-6"></div>
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          <a href="#" className="text-[13px] text-muted hover:text-ink transition-colors">Nakuru <span className="font-mono text-[11px] text-muted/40">(420)</span></a>
          <a href="#" className="text-[13px] text-muted hover:text-ink transition-colors">Kisumu <span className="font-mono text-[11px] text-muted/40">(380)</span></a>
          <a href="#" className="text-[13px] text-muted hover:text-ink transition-colors">Eldoret <span className="font-mono text-[11px] text-muted/40">(210)</span></a>
          <a href="#" className="text-[13px] text-muted hover:text-ink transition-colors">Thika <span className="font-mono text-[11px] text-muted/40">(190)</span></a>
          <a href="#" className="text-[13px] text-accent font-medium hover:text-accent-dark transition-colors">Remote <span className="font-mono text-[11px] text-accent/60">(340)</span></a>
        </div>
        <p className="font-mono text-[10px] text-muted/40 mt-3 uppercase tracking-wider">+ 37 more counties</p>
      </div>
    </section>
  );
}
