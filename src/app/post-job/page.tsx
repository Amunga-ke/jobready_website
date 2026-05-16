import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/config";

export const metadata: Metadata = {
  title: "Post a Job in Kenya — Reach Thousands of Candidates",
  description:
    "Post your job openings to thousands of qualified candidates across Kenya. Reach top talent with JobReady's verified job board — free and premium plans available.",
  robots: { index: false, follow: true },
  alternates: { canonical: `${SITE_URL}/post-job`, languages: { 'en-KE': `${SITE_URL}/post-job`, 'x-default': `${SITE_URL}/post-job` } },
  openGraph: {
    title: "Post a Job in Kenya — Reach Thousands of Candidates",
    description:
      "Post your job openings to thousands of qualified candidates across Kenya. Free and premium employer plans available.",
    url: `${SITE_URL}/post-job`,
    siteName: "JobReady",
    type: "website",
    images: [
      {
        url: `${SITE_URL}/opengraph-image.png`,
        width: 1200,
        height: 630,
        alt: "Post a Job on JobReady Kenya",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Post a Job in Kenya — Reach Thousands of Candidates",
    description:
      "Post your job openings to thousands of qualified candidates across Kenya.",
    images: [`${SITE_URL}/opengraph-image.png`],
  },
};

export default function PostJob_Page() {
  return (
    <main className="bg-surface">
      <div className="max-w-2xl mx-auto px-5 py-20 text-center">
        <h1 className="text-2xl font-heading font-bold text-ink mb-3">
          Post a Job
        </h1>
        <p className="text-[14px] text-muted mb-6">
          Advertise your job openings to thousands of qualified candidates
          across Kenya.
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
