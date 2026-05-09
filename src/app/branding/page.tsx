import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Employer Branding in Kenya — Attract Top Talent",
  description:
    "Enhance your employer brand and attract top talent with JobReady's branding solutions. Showcase your company culture to Kenyan job seekers.",
  robots: { index: false, follow: true },
  alternates: { canonical: "https://jobreadyke.co.ke/branding" },
  openGraph: {
    title: "Employer Branding in Kenya — Attract Top Talent | JobReady",
    description:
      "Enhance your employer brand and attract top talent with JobReady's branding solutions.",
    url: "https://jobreadyke.co.ke/branding",
    siteName: "JobReady",
    type: "website",
    images: [
      {
        url: "https://jobreadyke.co.ke/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Employer Branding on JobReady Kenya",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Employer Branding in Kenya — Attract Top Talent | JobReady",
    description:
      "Enhance your employer brand and attract top talent with JobReady's branding solutions.",
    images: ["https://jobreadyke.co.ke/opengraph-image.png"],
  },
};

export default function Branding_Page() {
  return (
    <main className="bg-surface">
      <div className="max-w-2xl mx-auto px-5 py-20 text-center">
        <h1 className="text-2xl font-heading font-bold text-ink mb-3">
          Employer Branding
        </h1>
        <p className="text-[14px] text-muted mb-6">
          Enhance your employer brand and attract top talent with JobReady's
          branding solutions.
        </p>
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
