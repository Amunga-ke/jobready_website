import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Career Resources & Articles | JobReady",
  description:
    "Expert career advice for Kenyan job seekers. CV writing tips, interview preparation, salary negotiation guides and career growth strategies.",
  alternates: { canonical: "https://jobreadyke.co.ke/articles" },
  openGraph: {
    title: "Career Resources & Articles | JobReady",
    description:
      "Expert career advice for Kenyan job seekers. CV writing tips, interview preparation and salary guides.",
    url: "https://jobreadyke.co.ke/articles",
    siteName: "JobReady",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Career Resources & Articles | JobReady",
    description:
      "Expert career advice for Kenyan job seekers. CV writing tips, interview preparation and salary guides.",
  },
};

export default function ArticlesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
