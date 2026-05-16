import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/config";

export const metadata: Metadata = {
  title: "Pricing — Advertise Jobs on JobReady Kenya",
  description:
    "Find the right plan to advertise your job openings and reach top talent across Kenya. Affordable employer pricing for businesses of all sizes.",
  robots: { index: false, follow: true },
  alternates: { canonical: `${SITE_URL}/pricing`, languages: { 'en-KE': `${SITE_URL}/pricing`, 'x-default': `${SITE_URL}/pricing` } },
  openGraph: {
    title: "Pricing — Advertise Jobs on JobReady",
    description: "Affordable employer pricing to reach top Kenyan talent.",
    url: `${SITE_URL}/pricing`,
    siteName: "JobReady",
    type: "website",
    images: [
      {
        url: `${SITE_URL}/opengraph-image.png`,
        width: 1200,
        height: 630,
        alt: "Advertise Jobs on JobReady Kenya",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pricing — Advertise Jobs on JobReady",
    description: "Affordable employer pricing to reach top Kenyan talent.",
    images: [`${SITE_URL}/opengraph-image.png`],
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
