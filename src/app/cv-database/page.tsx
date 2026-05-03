import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CV Database | JobReady",
  description: "Search our CV database to find the right candidates - coming soon.",
};

export default function CVDatabasePage() {
  return (
    <main className="bg-surface">
      <div className="max-w-6xl mx-auto px-5 py-20 text-center">
        <h1 className="text-2xl font-heading font-bold text-ink mb-2">CV Database</h1>
        <p className="text-muted text-[14px] mb-6">Browse our growing database of job seeker profiles. This feature is coming soon!</p>
        <Link href="/jobs" className="text-[13px] font-medium text-accent hover:text-accent-dark transition-colors">
          &larr; Back to Jobs
        </Link>
      </div>
    </main>
  );
}
