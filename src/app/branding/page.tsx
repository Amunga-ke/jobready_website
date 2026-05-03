import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Employer Branding | JobReady",
  description: "Employer branding solutions on JobReady - coming soon.",
};

export default function BrandingPage() {
  return (
    <main className="bg-surface">
      <div className="max-w-6xl mx-auto px-5 py-20 text-center">
        <h1 className="text-2xl font-heading font-bold text-ink mb-2">Employer Branding</h1>
        <p className="text-muted text-[14px] mb-6">Showcase your company culture and attract top talent. This feature is coming soon!</p>
        <Link href="/jobs" className="text-[13px] font-medium text-accent hover:text-accent-dark transition-colors">
          &larr; Back to Jobs
        </Link>
      </div>
    </main>
  );
}
