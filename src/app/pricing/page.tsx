import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pricing — Advertise Jobs on JobReady Kenya",
  description:
    "Find the right plan to advertise your job openings and reach top talent across Kenya. Affordable employer pricing for businesses of all sizes.",
  alternates: { canonical: "https://jobreadyke.co.ke/pricing" },
  openGraph: {
    title: "Pricing — Advertise Jobs on JobReady",
    description: "Affordable employer pricing to reach top Kenyan talent.",
    url: "https://jobreadyke.co.ke/pricing",
    siteName: "JobReady",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pricing | JobReady",
    description: "Affordable employer pricing to reach top Kenyan talent.",
  },
};

export default function Pricing_Page() {
  return (
    <main className="bg-surface">
      <div className="max-w-2xl mx-auto px-5 py-20 text-center">
        <h1 className="text-2xl font-heading font-bold text-ink mb-3">Pricing</h1>
        <p className="text-[14px] text-muted mb-6">Find the right plan to advertise your job openings and reach top talent.</p>
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
