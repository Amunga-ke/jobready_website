import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact Us | JobReady",
  description:
    "Get in touch with the JobReady team for support, employer partnerships, advertising inquiries, or general questions.",
  alternates: { canonical: "https://jobreadyke.co.ke/contact" },
  openGraph: {
    title: "Contact Us | JobReady",
    description: "Reach the JobReady team for support and partnerships.",
    url: "https://jobreadyke.co.ke/contact",
    siteName: "JobReady",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Contact Us | JobReady",
    description: "Reach the JobReady team for support and partnerships.",
  },
};

export default function Contact_Page() {
  return (
    <main className="bg-surface">
      <div className="max-w-2xl mx-auto px-5 py-20 text-center">
        <h1 className="text-2xl font-heading font-bold text-ink mb-3">Contact Us</h1>
        <p className="text-[14px] text-muted mb-6">Get in touch with the JobReady team for support, partnerships, or inquiries.</p>
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
