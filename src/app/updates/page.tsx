import type { Metadata } from "next";
import { Suspense } from "react";
import UpdatesFeed from "./UpdatesFeed";
import { SITE_URL } from "@/lib/config";

export const metadata: Metadata = {
  title: "Job Updates — Shortlists, Interviews & Announcements",
  description:
    "Official job updates from Kenyan employers. Shortlisting results, interview schedules, deadline announcements and recruitment news.",
  alternates: { canonical: `${SITE_URL}/updates`, languages: { 'en-KE': `${SITE_URL}/updates`, 'x-default': `${SITE_URL}/updates` } },
  openGraph: {
    title: "Job Updates — Shortlists, Interviews & Announcements",
    description:
      "Official job updates, shortlists, interviews and recruitment announcements from Kenya.",
    url: `${SITE_URL}/updates`,
    siteName: "JobReady",
    type: "website",
    images: [{ url: `${SITE_URL}/opengraph-image.png`, width: 1200, height: 630, alt: "JobReady Updates" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Job Updates",
    description:
      "Official job updates, shortlists, interviews and recruitment announcements from Kenya.",
    images: [`${SITE_URL}/opengraph-image.png`],
  },
};

export default function UpdatesPage() {
  return (
    <Suspense>
      <UpdatesFeed />
    </Suspense>
  );
}
