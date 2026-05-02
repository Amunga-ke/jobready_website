export default function TrustedBy() {
  const companies = ['Safaricom', 'Equity Bank', 'KCB Group', 'NCBA', 'Co-op Bank', 'KRA', 'Kenya Airways', 'EABL'];

  return (
    <section className="py-5 border-b border-subtle bg-white">
      <div className="max-w-6xl mx-auto px-5">
        <div className="flex items-center justify-between gap-8 overflow-x-auto scrollbar-hide">
          {companies.map((company) => (
            <span
              key={company}
              className="text-muted/20 font-heading font-bold text-base whitespace-nowrap tracking-tight"
            >
              {company}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
