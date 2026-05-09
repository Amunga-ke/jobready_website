import type { Metadata } from "next";
import { Suspense } from "react";
import UpdatesFeed from "./UpdatesFeed";

export const metadata: Metadata = {
  title: "Job Updates — Shortlists, Interviews & Announcements | JobReady",
  description:
    "Official job updates from Kenyan employers. Shortlisting results, interview schedules, deadline announcements and recruitment news.",
  alternates: { canonical: "https://jobreadyke.co.ke/updates" },
  openGraph: {
    title: "Job Updates — Shortlists, Interviews & Announcements | JobReady",
    description:
      "Official job updates, shortlists, interviews and recruitment announcements from Kenya.",
    url: "https://jobreadyke.co.ke/updates",
    siteName: "JobReady",
    type: "website",
    images: [{ url: "https://jobreadyke.co.ke/opengraph-image.png", width: 1200, height: 630, alt: "JobReady Updates" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Job Updates | JobReady",
    description:
      "Official job updates, shortlists, interviews and recruitment announcements from Kenya.",
    images: ["https://jobreadyke.co.ke/opengraph-image.png"],
  },
};

export default function UpdatesPage() {
  return (
    <Suspense>
      <UpdatesFeed />
    </Suspense>
  );
}
