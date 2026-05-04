import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Salary Guide — Kenya Salary Benchmarks 2025 | JobReady",
  description:
    "Explore salary benchmarks and compensation insights across industries in Kenya. Compare salaries by role, experience, and location.",
  alternates: { canonical: "https://jobreadyke.co.ke/salary-guide" },
  openGraph: {
    title: "Salary Guide — Kenya Salary Benchmarks | JobReady",
    description: "Salary benchmarks and compensation insights across Kenyan industries.",
    url: "https://jobreadyke.co.ke/salary-guide",
    siteName: "JobReady",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Salary Guide | JobReady",
    description: "Salary benchmarks and compensation insights across Kenyan industries.",
  },
};

export default function SalaryGuide_Page() {
  return (
    <main className="bg-surface">
      <div className="max-w-2xl mx-auto px-5 py-20 text-center">
        <h1 className="text-2xl font-heading font-bold text-ink mb-3">Salary Guide</h1>
        <p className="text-[14px] text-muted mb-6">Explore salary benchmarks and compensation insights across industries in Kenya.</p>
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
