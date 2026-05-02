import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Government Jobs in Kenya | JobReady",
  description:
    "Browse national, county and state corporation jobs from the Kenya Gazette. TSC, PSC, KRA and all 47 county government positions.",
  alternates: { canonical: "https://jobreadyke.co.ke/government" },
  openGraph: {
    title: "Government Jobs in Kenya | JobReady",
    description:
      "Browse national, county and state corporation jobs from the Kenya Gazette.",
    url: "https://jobreadyke.co.ke/government",
    siteName: "JobReady",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Government Jobs in Kenya | JobReady",
    description:
      "Browse national, county and state corporation jobs from the Kenya Gazette.",
  },
};

export default function GovernmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
