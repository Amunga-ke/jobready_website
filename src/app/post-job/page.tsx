import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Post a Job | JobReady",
  description: "Post a job listing on JobReady - coming soon.",
};

export default function PostJobPage() {
  return (
    <main className="bg-surface">
      <div className="max-w-6xl mx-auto px-5 py-20 text-center">
        <h1 className="text-2xl font-heading font-bold text-ink mb-2">Post a Job</h1>
        <p className="text-muted text-[14px] mb-6">We&apos;re building an easy job posting experience for employers. Stay tuned!</p>
        <Link href="/jobs" className="text-[13px] font-medium text-accent hover:text-accent-dark transition-colors">
          &larr; Back to Jobs
        </Link>
      </div>
    </main>
  );
}
