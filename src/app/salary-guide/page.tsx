import type { Metadata } from "next";
import { SITE_URL } from "@/lib/config";
import SalaryGuideClient from "./SalaryGuideClient";

export const metadata: Metadata = {
  title: "Kenya Salary Guide 2025 — Real Salary Benchmarks",
  description:
    "Explore real salary data shared by professionals across Kenya. Compare compensation by role, experience, location, and industry. Anonymous salary benchmarks for 2025.",
  robots: { index: false, follow: true },
  alternates: { canonical: `${SITE_URL}/salary-guide` },
  openGraph: {
    title: "Kenya Salary Guide 2025 — Real Salary Benchmarks",
    description:
      "Explore real salary data shared by professionals across Kenya. Compare compensation by role, experience, location, and industry.",
    url: `${SITE_URL}/salary-guide`,
    siteName: "JobReady",
    type: "website",
    images: [
      {
        url: `${SITE_URL}/opengraph-image.png`,
        width: 1200,
        height: 630,
        alt: "Kenya Salary Guide 2025 — JobReady",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kenya Salary Guide 2025 — Real Salary Benchmarks",
    description:
      "Explore real salary data shared by professionals across Kenya.",
    images: [`${SITE_URL}/opengraph-image.png`],
  },
};

export default function SalaryGuide_Page() {
  return (
    <main className="bg-surface">
      <SalaryGuideClient />
    </main>
  );
}
