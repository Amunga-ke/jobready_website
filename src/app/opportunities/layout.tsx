import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Opportunities — Scholarships, Internships, Fellowships & More | JobReady",
  description:
    "Discover scholarships, internships, fellowships, grants, bursaries and training programs in Kenya. Apply to the latest opportunities from top organizations.",
  alternates: { canonical: "https://jobreadyke.co.ke/opportunities" },
  openGraph: {
    title: "Opportunities — Scholarships, Internships & More | JobReady",
    description:
      "Discover scholarships, internships, fellowships, grants, bursaries and training programs in Kenya.",
    url: "https://jobreadyke.co.ke/opportunities",
    siteName: "JobReady",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Opportunities — Scholarships, Internships & More | JobReady",
    description:
      "Discover scholarships, internships, fellowships, grants, bursaries and training programs in Kenya.",
  },
};

export default function OpportunitiesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
