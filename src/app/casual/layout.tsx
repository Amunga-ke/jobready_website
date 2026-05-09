import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Casual & Part-Time Jobs in Kenya | JobReady",
  description:
    "Find daily-wage, weekend and flexible part-time jobs across Kenya. Browse casual positions in Nairobi, Mombasa, Kisumu and all 47 counties.",
  alternates: { canonical: "https://jobreadyke.co.ke/casual" },
  openGraph: {
    title: "Casual & Part-Time Jobs in Kenya | JobReady",
    description:
      "Find daily-wage, weekend and flexible part-time jobs across Kenya.",
    url: "https://jobreadyke.co.ke/casual",
    siteName: "JobReady",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Casual & Part-Time Jobs in Kenya | JobReady",
    description:
      "Find daily-wage, weekend and flexible part-time jobs across Kenya.",
  },
};

export default function CasualLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
