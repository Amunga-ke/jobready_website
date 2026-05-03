import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About JobReady",
  description: "Learn about JobReady - Kenya's leading job platform.",
};

export default function AboutPage() {
  return (
    <main className="bg-surface">
      <div className="max-w-6xl mx-auto px-5 py-20 text-center">
        <h1 className="text-2xl font-heading font-bold text-ink mb-2">About JobReady</h1>
        <p className="text-muted text-[14px] mb-6">We&apos;re crafting the story of JobReady and how we&apos;re helping Kenyans find meaningful work. Coming soon!</p>
        <Link href="/jobs" className="text-[13px] font-medium text-accent hover:text-accent-dark transition-colors">
          &larr; Back to Jobs
        </Link>
      </div>
    </main>
  );
}
