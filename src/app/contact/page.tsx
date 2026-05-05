import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/jobready/JsonLd";

export const metadata: Metadata = {
  title: "Contact Us | JobReady",
  description:
    "Get in touch with the JobReady team for support, employer partnerships, advertising inquiries, or general questions about our job board services.",
  alternates: { canonical: "https://jobreadyke.co.ke/contact" },
  openGraph: {
    title: "Contact Us | JobReady",
    description: "Reach the JobReady team for support and partnerships.",
    url: "https://jobreadyke.co.ke/contact",
    siteName: "JobReady",
    type: "website",
    images: [{ url: "https://jobreadyke.co.ke/opengraph-image.png", width: 1200, height: 630, alt: "JobReady" }],
  },
  twitter: {
    card: "summary",
    title: "Contact Us | JobReady",
    description: "Reach the JobReady team for support and partnerships.",
  },
};

export default function Contact_Page() {
  return (
    <main className="bg-surface">
      <BreadcrumbJsonLd items={[
        { name: "Home", url: "https://jobreadyke.co.ke/" },
        { name: "Contact", url: "https://jobreadyke.co.ke/contact" },
      ]} />
      <div className="max-w-3xl mx-auto px-5 py-16 md:py-20">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1.5 text-[12px] text-muted mb-8">
          <Link href="/" className="hover:text-ink transition-colors">Home</Link>
          <span className="text-divider">/</span>
          <span className="text-ink font-medium">Contact</span>
        </nav>

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-heading font-black text-ink mb-4">
            Contact Us
          </h1>
          <p className="text-[15px] text-muted leading-relaxed">
            Have a question, feedback, or partnership inquiry? We&apos;d love to hear from you.
            Reach out through any of the channels below and our team will get back to you.
          </p>
        </div>

        {/* Contact Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          <div className="rounded-xl border border-divider p-5">
            <h2 className="text-[14px] font-semibold text-ink mb-2">General Inquiries</h2>
            <p className="text-[13px] text-muted leading-relaxed mb-3">
              For questions about JobReady&apos;s services, job listings, or account issues.
            </p>
            <a
              href="mailto:info@jobreadyke.co.ke"
              className="text-[13px] font-medium text-accent hover:text-accent-dark transition-colors"
            >
              info@jobreadyke.co.ke
            </a>
          </div>

          <div className="rounded-xl border border-divider p-5">
            <h2 className="text-[14px] font-semibold text-ink mb-2">Employer Partnerships</h2>
            <p className="text-[13px] text-muted leading-relaxed mb-3">
              Interested in posting jobs, employer branding, or partnership opportunities.
            </p>
            <a
              href="mailto:partnerships@jobreadyke.co.ke"
              className="text-[13px] font-medium text-accent hover:text-accent-dark transition-colors"
            >
              partnerships@jobreadyke.co.ke
            </a>
          </div>

          <div className="rounded-xl border border-divider p-5">
            <h2 className="text-[14px] font-semibold text-ink mb-2">Report an Issue</h2>
            <p className="text-[13px] text-muted leading-relaxed mb-3">
              Found a suspicious listing or experiencing technical problems? Let us know.
            </p>
            <a
              href="mailto:support@jobreadyke.co.ke"
              className="text-[13px] font-medium text-accent hover:text-accent-dark transition-colors"
            >
              support@jobreadyke.co.ke
            </a>
          </div>

          <div className="rounded-xl border border-divider p-5">
            <h2 className="text-[14px] font-semibold text-ink mb-2">Follow Us</h2>
            <p className="text-[13px] text-muted leading-relaxed mb-3">
              Stay updated with the latest job listings, tips, and announcements.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://x.com/jobreadyke"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[13px] font-medium text-accent hover:text-accent-dark transition-colors"
              >
                X (Twitter)
              </a>
              <a
                href="https://linkedin.com/company/jobreadyke"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[13px] font-medium text-accent hover:text-accent-dark transition-colors"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-10">
          <h2 className="text-lg font-heading font-bold text-ink mb-4">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div className="rounded-xl border border-divider p-5">
              <h3 className="text-[14px] font-semibold text-ink mb-2">Is JobReady free for job seekers?</h3>
              <p className="text-[13px] text-muted leading-relaxed">
                Yes, JobReady is completely free for job seekers. You can browse, search, and apply for jobs without any charges. We never ask job seekers to pay for job applications or access to listings.
              </p>
            </div>
            <div className="rounded-xl border border-divider p-5">
              <h3 className="text-[14px] font-semibold text-ink mb-2">How do I report a fake job listing?</h3>
              <p className="text-[13px] text-muted leading-relaxed">
                If you encounter a suspicious listing, please email us at support@jobreadyke.co.ke with the job title and URL. We review all reports and remove fraudulent listings promptly. All employers on JobReady are verified, but we appreciate community vigilance.
              </p>
            </div>
            <div className="rounded-xl border border-divider p-5">
              <h3 className="text-[14px] font-semibold text-ink mb-2">How can my company post jobs on JobReady?</h3>
              <p className="text-[13px] text-muted leading-relaxed">
                Visit our Post a Job page to get started. Employers can create accounts, submit job listings, and manage applications through our employer dashboard. We offer both free and premium listing options.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-4">
          <Link
            href="/jobs"
            className="inline-flex items-center gap-2 text-[13px] font-medium text-accent hover:text-accent-dark transition-colors"
          >
            Browse Jobs
          </Link>
        </div>
      </div>
    </main>
  );
}
