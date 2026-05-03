import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "CV Writing Tips | JobReady",
  description: "Professional CV writing tips to help you stand out to Kenyan employers.",
};

export default function CVWriting_Page() {
  return (
    <main className="bg-surface">
      <div className="max-w-2xl mx-auto px-5 py-20 text-center">
        <h1 className="text-2xl font-heading font-bold text-ink mb-3">CV Writing Tips</h1>
        <p className="text-[14px] text-muted mb-6">Professional CV writing tips to help you stand out to Kenyan employers.</p>
        <Link
          href="/jobs"
          className="inline-flex items-center text-[13px] font-medium text-accent hover:text-accent-dark transition-colors"
        >
          ← Browse Jobs
        </Link>
      </div>
    </main>
  );
}
