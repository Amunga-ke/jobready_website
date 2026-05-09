import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/config";

export const metadata: Metadata = {
  title: "CV Database — Search Kenyan Professionals",
  description:
    "Search our database of qualified Kenyan professionals. Connect with skilled candidates across Nairobi, Mombasa, Kisumu and all 47 counties.",
  robots: { index: false, follow: true },
  alternates: { canonical: `${SITE_URL}/cv-database` },
  openGraph: {
    title: "CV Database — Search Kenyan Professionals",
    description:
      "Search our database of qualified Kenyan professionals. Connect with skilled candidates across all 47 counties.",
    url: `${SITE_URL}/cv-database`,
    siteName: "JobReady",
    type: "website",
    images: [
      {
        url: `${SITE_URL}/opengraph-image.png`,
        width: 1200,
        height: 630,
        alt: "CV Database on JobReady Kenya",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CV Database — Search Kenyan Professionals",
    description:
      "Search our database of qualified Kenyan professionals and connect with potential candidates.",
    images: [`${SITE_URL}/opengraph-image.png`],
  },
};

export default function CVDatabase_Page() {
  return (
    <main className="bg-surface">
      <div className="max-w-2xl mx-auto px-5 py-20 text-center">
        <h1 className="text-2xl font-heading font-bold text-ink mb-3">
          CV Database
        </h1>
        <p className="text-[14px] text-muted mb-6">
          Search our database of qualified professionals and connect with
          potential candidates.
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
