import type { Metadata } from "next";
import { Playfair_Display, Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import { JobModalProvider } from "@/components/jobready/JobModalContext";
import JobDetailSheet from "@/components/jobready/JobDetailSheet";
import { UpdateModalProvider } from "@/components/jobready/UpdateModalContext";
import UpdateDetailSheet from "@/components/jobready/UpdateDetailSheet";
import Navbar from "@/components/jobready/Navbar";
import Footer from "@/components/jobready/Footer";
import AdSenseScript from "@/components/jobready/AdSenseScript";
import { OrganizationJsonLd } from "@/components/jobready/JsonLd";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  style: ["normal", "italic"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const SITE_URL = "https://jobreadyke.co.ke";
const SITE_TITLE = "JobReady — Jobs for Kenyans";
const SITE_DESCRIPTION =
  "Kenya's most trusted job board. Browse thousands of jobs from verified employers across Nairobi, Mombasa, Kisumu and all 47 counties. Government, private sector, internships and more.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s | JobReady",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "jobs in Kenya", "Kenya jobs", "job vacancies Kenya", "Nairobi jobs",
    "government jobs Kenya", "county government jobs", "internships Kenya",
    "scholarships Kenya", "careers Kenya", "employment Kenya", "job board Kenya",
    "JobReady", "entry level jobs Kenya", "casual jobs Kenya", "graduate jobs Kenya",
  ],
  authors: [{ name: "JobReady", url: SITE_URL }],
  creator: "JobReady",
  publisher: "JobReady",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico", sizes: "48x48" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
    other: [
      { rel: "icon", type: "image/svg+xml", url: "/logo.svg" },
    ],
  },
  openGraph: {
    siteName: "JobReady",
    type: "website",
    locale: "en_KE",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    images: [{ url: `${SITE_URL}/opengraph-image.png`, width: 1200, height: 630, alt: "JobReady — Jobs for Kenyans" }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [`${SITE_URL}/opengraph-image.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 },
  },
  // verification: { google: "YOUR_GOOGLE_SEARCH_CONSOLE_CODE" }, // TODO: Add real GSC verification code
  alternates: { canonical: SITE_URL },
  category: "employment",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        {/* Google AdSense auto-ads verification */}
        <meta name="google-adsense-account" content="ca-pub-8031704055036556" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0f172a" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/svg+xml" href="/logo.svg" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <OrganizationJsonLd />
      </head>
      <body
        className={`${playfair.variable} ${spaceGrotesk.variable} ${inter.variable} ${jetbrains.variable} font-inter antialiased bg-surface text-ink`}
      >
        <Providers>
        <Navbar />
        <JobModalProvider>
          <UpdateModalProvider>
            <div className="min-h-screen">
              {children}
            </div>
            <Footer />
            <JobDetailSheet />
            <UpdateDetailSheet />
          </UpdateModalProvider>
        </JobModalProvider>
        </Providers>
        <AdSenseScript />
      </body>
    </html>
  );
}
