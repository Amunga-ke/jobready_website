import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Job Updates & Announcements | JobReady",
  description:
    "Stay updated with the latest job market announcements, recruitment notices, and career news from Kenya's top employers and government agencies.",
  alternates: { canonical: "https://jobreadyke.co.ke/updates" },
  openGraph: {
    title: "Job Updates & Announcements | JobReady",
    description:
      "Stay updated with the latest job market announcements, recruitment notices, and career news from Kenya.",
    url: "https://jobreadyke.co.ke/updates",
    siteName: "JobReady",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Job Updates & Announcements | JobReady",
    description:
      "Stay updated with the latest job market announcements, recruitment notices, and career news from Kenya.",
  },
};

export default function UpdatesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
