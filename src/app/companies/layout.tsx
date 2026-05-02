import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verified Employers & Companies Hiring in Kenya | JobReady",
  description:
    "Explore verified employers hiring across Kenya. Browse open positions at Safaricom, Equity Bank, KCB, KRA, KenGen and hundreds more trusted companies.",
  alternates: { canonical: "https://jobreadyke.co.ke/companies" },
  openGraph: {
    title: "Verified Employers & Companies Hiring in Kenya | JobReady",
    description:
      "Explore verified employers hiring across Kenya. Browse open positions at Safaricom, Equity Bank and more.",
    url: "https://jobreadyke.co.ke/companies",
    siteName: "JobReady",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Verified Employers & Companies Hiring in Kenya | JobReady",
    description:
      "Explore verified employers hiring across Kenya. Browse open positions at Safaricom, Equity Bank and more.",
  },
};

export default function CompaniesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
