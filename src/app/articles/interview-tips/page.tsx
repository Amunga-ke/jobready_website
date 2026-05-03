import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Interview Tips | JobReady",
  description: "Ace your next interview with these expert tips.",
};

export default function InterviewTipsPage() {
  return (
    <main className="bg-surface">
      <div className="max-w-6xl mx-auto px-5 py-20 text-center">
        <h1 className="text-2xl font-heading font-bold text-ink mb-2">Interview Tips</h1>
        <p className="text-muted text-[14px] mb-6">Prepare for your next interview with confidence. This article is coming soon!</p>
        <Link href="/articles" className="text-[13px] font-medium text-accent hover:text-accent-dark transition-colors">
          &larr; Back to Resources
        </Link>
      </div>
    </main>
  );
}
