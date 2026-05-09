import Link from "next/link";
import { Briefcase, ArrowRight, Search } from "lucide-react";

export default function NotFound() {
  return (
    <main className="bg-surface min-h-screen flex items-center justify-center">
      <div className="max-w-lg mx-auto px-5 py-20 text-center">
        <div className="w-20 h-20 bg-surface border border-divider rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Briefcase className="w-9 h-9 text-muted/40" />
        </div>
        <h1 className="text-4xl md:text-5xl font-heading font-black text-ink mb-3">404</h1>
        <h2 className="text-lg font-heading font-bold text-ink/70 mb-3">Page Not Found</h2>
        <p className="text-[14px] text-muted leading-relaxed mb-8 max-w-sm mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Browse thousands of verified job listings across Kenya on JobReady.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-ink text-white text-[14px] font-medium hover:bg-ink/90 transition-colors">
            <Search className="w-4 h-4" />
            Browse Jobs
          </Link>
          <Link href="/companies" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-divider text-ink text-[14px] font-medium hover:bg-ink/[0.04] transition-colors">
            View Companies
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="mt-10 pt-8 border-t border-divider">
          <p className="text-[12px] text-muted mb-4">Popular Searches</p>
          <div className="flex flex-wrap justify-center gap-2">
            {["Jobs in Nairobi", "Government Jobs", "Internships", "Casual Jobs", "Jobs in Mombasa"].map((term) => (
              <Link key={term} href={`/jobs?q=${encodeURIComponent(term)}`} className="text-[11px] font-medium px-3 py-1.5 rounded-lg bg-ink/[0.04] text-ink/60 hover:bg-ink/[0.08] hover:text-ink transition-colors">
                {term}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
