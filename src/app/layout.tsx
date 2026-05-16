import type { Metadata, Viewport } from "next";
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
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

import { SITE_URL, SITE_TITLE, SITE_DESCRIPTION } from "@/lib/config";

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
    site: "@jobreadyke",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 },
  },
  verification: { google: "GSC_VERIFICATION_CODE" }, // Replace with your actual Google Search Console verification code
  alternates: {
    canonical: `${SITE_URL}/`,
    languages: {
      'en-KE': `${SITE_URL}/`,
      'x-default': `${SITE_URL}/`,
    },
  },
  category: "employment",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0f172a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-KE" className="scroll-smooth" suppressHydrationWarning>
      <head>
        {/* Google AdSense auto-ads verification */}
        <meta name="google-adsense-account" content="ca-pub-8031704055036556" />
        {/* Preconnect to third-party origins */}
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" />
        <link rel="preconnect" href="https://googleads.g.doubleclick.net" />
        <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
        <link rel="manifest" href="/manifest.json" />
        <OrganizationJsonLd />
      </head>
      <body
        className={`${playfair.variable} ${spaceGrotesk.variable} ${inter.variable} ${jetbrains.variable} font-inter antialiased bg-surface text-ink`}
      >
        <Providers>
        <Navbar />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-accent focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm"
        >
          Skip to main content
        </a>
        <JobModalProvider>
          <UpdateModalProvider>
            <div className="min-h-screen" id="main-content">
              {children}
            </div>
            <Footer />
            <JobDetailSheet />
            <UpdateDetailSheet />
          </UpdateModalProvider>
        </JobModalProvider>
        <noscript>
          <div style={{ padding: '2rem', textAlign: 'center', fontFamily: 'sans-serif', background: '#f8fafc', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>JobReady — Jobs for Kenyans</h1>
              <p style={{ color: '#64748b' }}>Please enable JavaScript to use JobReady. Browse our <a href="/jobs" style={{ color: '#2563eb' }}>job listings</a> or <a href="/about" style={{ color: '#2563eb' }}>learn more about us</a>.</p>
              <nav style={{ marginTop: '1rem' }}>
                <a href="/" style={{ marginRight: '1rem' }}>Home</a>
                <a href="/jobs" style={{ marginRight: '1rem' }}>Jobs</a>
                <a href="/companies" style={{ marginRight: '1rem' }}>Companies</a>
                <a href="/government" style={{ marginRight: '1rem' }}>Government</a>
                <a href="/about" style={{ marginRight: '1rem' }}>About</a>
                <a href="/contact">Contact</a>
              </nav>
            </div>
          </div>
        </noscript>
        </Providers>
        <AdSenseScript />
      </body>
    </html>
  );
}
