import type { Metadata } from "next";
import { Playfair_Display, Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { JobModalProvider } from '@/components/fursa/JobModalContext';
import JobDetailSheet from '@/components/fursa/JobDetailSheet';
import Navbar from '@/components/fursa/Navbar';
import Footer from '@/components/fursa/Footer';

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
  title: "Jobnet — Jobs for Kenyans",
  description: "Kenya's most trusted job board. Real jobs from verified employers.",
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className={`${playfair.variable} ${spaceGrotesk.variable} ${inter.variable} ${jetbrains.variable} font-inter antialiased bg-surface text-ink`}>
        <JobModalProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
          <JobDetailSheet />
        </JobModalProvider>
      </body>
    </html>
  );
}
