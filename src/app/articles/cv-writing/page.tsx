import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CV Writing Tips | JobReady",
  description: "Professional CV writing tips for Kenyan job seekers.",
};

export default function CVWritingTipsPage() {
  return (
    <main className="bg-surface">
      <div className="max-w-6xl mx-auto px-5 py-20 text-center">
        <h1 className="text-2xl font-heading font-bold text-ink mb-2">CV Writing Tips</h1>
        <p className="text-muted text-[14px] mb-6">Expert tips to help you craft a standout CV. This article is coming soon!</p>
        <Link href="/articles" className="text-[13px] font-medium text-accent hover:text-accent-dark transition-colors">
          &larr; Back to Resources
        </Link>
      </div>
    </main>
  );
}
