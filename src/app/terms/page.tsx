import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service | JobReady",
  description:
    "Read the terms and conditions governing the use of JobReady's job board services, employer accounts, and job listings.",
  alternates: { canonical: "https://jobreadyke.co.ke/terms" },
  openGraph: {
    title: "Terms of Service | JobReady",
    description: "Terms and conditions for using JobReady's services.",
    url: "https://jobreadyke.co.ke/terms",
    siteName: "JobReady",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Terms of Service | JobReady",
    description: "Terms and conditions for using JobReady's services.",
  },
};

export default function Terms_Page() {
  return (
    <main className="bg-surface">
      <div className="max-w-2xl mx-auto px-5 py-20 text-center">
        <h1 className="text-2xl font-heading font-bold text-ink mb-3">Terms of Service</h1>
        <p className="text-[14px] text-muted mb-6">Read the terms and conditions governing the use of JobReady's services.</p>
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
