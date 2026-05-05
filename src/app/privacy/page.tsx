import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | JobReady",
  description:
    "Learn how JobReady collects, uses, and protects your personal information. Our privacy policy covers data handling, cookies, and your rights.",
  alternates: { canonical: "https://jobreadyke.co.ke/privacy" },
  openGraph: {
    title: "Privacy Policy | JobReady",
    description: "How JobReady handles and protects your personal data.",
    url: "https://jobreadyke.co.ke/privacy",
    siteName: "JobReady",
    type: "website",
    images: [{ url: "https://jobreadyke.co.ke/opengraph-image.png", width: 1200, height: 630, alt: "JobReady" }],
  },
  twitter: {
    card: "summary",
    title: "Privacy Policy | JobReady",
    description: "How JobReady handles and protects your personal data.",
  },
};

export default function Privacy_Page() {
  return (
    <main className="bg-surface">
      <div className="max-w-2xl mx-auto px-5 py-20 text-center">
        <h1 className="text-2xl font-heading font-bold text-ink mb-3">Privacy Policy</h1>
        <p className="text-[14px] text-muted mb-6">Learn how JobReady collects, uses, and protects your personal information.</p>
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
