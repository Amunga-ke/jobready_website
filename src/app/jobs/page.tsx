import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Browse Jobs in Kenya | JobReady",
  description:
    "Find the latest jobs in Kenya. Browse by category, location, company, and employment type. Real jobs from verified employers.",
};

export default function JobsPage() {
  return (
    <main className="min-h-screen bg-surface">
      <div className="max-w-6xl mx-auto px-5 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-heading font-bold text-ink">
            Browse Jobs
          </h1>
          <p className="text-[14px] text-muted mt-1">
            Find the latest jobs across Kenya from verified employers
          </p>
        </div>

        {/* Search bar placeholder */}
        <div className="max-w-2xl mb-8">
          <div className="flex items-center gap-3 bg-white border border-divider rounded-xl px-4 py-3">
            <svg
              className="w-5 h-5 text-muted"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search jobs by title, company, or keyword..."
              className="flex-1 bg-transparent text-[14px] text-ink placeholder:text-muted/50 outline-none"
            />
          </div>
        </div>

        {/* Placeholder grid */}
        <div className="text-center py-20">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-ink/[0.04] flex items-center justify-center">
            <svg
              className="w-7 h-7 text-muted"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M21 13.255A23.193 23.193 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h2 className="text-lg font-heading font-bold text-ink mb-1">
            Jobs coming soon
          </h2>
          <p className="text-[14px] text-muted mb-4">
            We&apos;re connecting the database. Check out our sample job pages:
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <Link
              href="/jobs/senior-software-engineer-safaricom-nairobi"
              className="text-[13px] font-medium px-4 py-2 rounded-lg bg-ink text-white hover:bg-ink/90 transition-colors"
            >
              Software Engineer @ Safaricom
            </Link>
            <Link
              href="/jobs/county-director-of-health-kisumu"
              className="text-[13px] font-medium px-4 py-2 rounded-lg bg-ink text-white hover:bg-ink/90 transition-colors"
            >
              County Director @ Kisumu
            </Link>
            <Link
              href="/jobs/google-developer-scholarship-2025"
              className="text-[13px] font-medium px-4 py-2 rounded-lg bg-ink text-white hover:bg-ink/90 transition-colors"
            >
              Google Scholarship
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
