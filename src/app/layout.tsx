import type { Metadata } from "next";
import { Playfair_Display, Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { JobModalProvider } from "@/components/jobready/JobModalContext";
import JobDetailSheet from "@/components/jobready/JobDetailSheet";
import { UpdateModalProvider } from "@/components/jobready/UpdateModalContext";
import UpdateDetailSheet from "@/components/jobready/UpdateDetailSheet";
import Navbar from "@/components/jobready/Navbar";
import Footer from "@/components/jobready/Footer";

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

export const metadata: Metadata = {
  metadataBase: new URL("https://jobreadyke.co.ke"),
  title: {
    default: "JobReady — Jobs for Kenyans",
    template: "%s | JobReady",
  },
  description:
    "Kenya's most trusted job board. Real jobs from verified employers.",
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    siteName: "JobReady",
    type: "website",
    locale: "en_KE",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${playfair.variable} ${spaceGrotesk.variable} ${inter.variable} ${jetbrains.variable} font-inter antialiased bg-surface text-ink`}
      >
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
      </body>
    </html>
  );
}
