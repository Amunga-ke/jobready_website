const trendingItems = [
  'Data Analyst at KRA',
  'Product Manager at Safaricom',
  'Nurse at Aga Khan Hospital',
  'Civil Engineer at KeNHA',
  'Marketing Lead at EABL',
  'Accountant at Co-op Bank',
  'UX Designer at KCB',
  'HR Business Partner at Equity',
];

export default function TrendingMarquee() {
  const content = trendingItems.map((item, i) => (
    <span key={i}>
      <span className="text-[13px] text-white/40">{item}</span>
      <span className="text-white/10">—</span>
    </span>
  ));

  return (
    <section className="py-4 bg-ink overflow-hidden border-t border-b border-ink">
      <div className="marquee-container">
        <div className="animate-marquee flex items-center gap-8 whitespace-nowrap">
          {content}
          {content}
        </div>
      </div>
    </section>
  );
}
