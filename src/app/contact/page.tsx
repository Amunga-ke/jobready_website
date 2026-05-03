import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | JobReady",
  description: "Get in touch with the JobReady team.",
};

export default function ContactPage() {
  return (
    <main className="bg-surface">
      <div className="max-w-6xl mx-auto px-5 py-20 text-center">
        <h1 className="text-2xl font-heading font-bold text-ink mb-2">Contact Us</h1>
        <p className="text-muted text-[14px] mb-6">Our contact page is coming soon. In the meantime, email us at hello@jobready.co.ke!</p>
        <Link href="/jobs" className="text-[13px] font-medium text-accent hover:text-accent-dark transition-colors">
          &larr; Back to Jobs
        </Link>
      </div>
    </main>
  );
}
