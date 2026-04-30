export default function CVBanner({ variant = 'light' }: { variant?: 'light' | 'dark' }) {
  if (variant === 'dark') {
    return (
      <section className="bg-ink py-6">
        <div className="max-w-6xl mx-auto px-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <p className="text-sm font-heading font-bold text-white">93% of our CV clients get called for interviews.</p>
            <p className="text-[12px] text-white/40 mt-0.5">Let experts rewrite your CV for the Kenyan market.</p>
          </div>
          <a href="#" className="shrink-0 bg-accent text-white text-[13px] font-bold px-5 py-2.5 rounded-lg hover:bg-accent-dark transition-colors">
            View Packages →
          </a>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-accent-bg border-y border-accent/15 py-6">
      <div className="max-w-6xl mx-auto px-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <p className="text-sm font-heading font-bold text-ink">Your CV is your first interview. Make it count.</p>
          <p className="text-[12px] text-muted mt-0.5">CV Writing · Cover Letters · LinkedIn — from Ksh 1,500</p>
        </div>
        <a href="#" className="shrink-0 bg-ink text-white text-[13px] font-medium px-5 py-2.5 rounded-lg hover:bg-ink/90 transition-colors">
          Get Started →
        </a>
      </div>
    </section>
  );
}
