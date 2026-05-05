import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/jobready/JsonLd";

export const metadata: Metadata = {
  title: "Privacy Policy | JobReady",
  description:
    "Learn how JobReady collects, uses, and protects your personal information. Our privacy policy covers data handling, cookies, and your rights.",
  alternates: { canonical: "https://jobreadyke.co.ke/privacy" },
  openGraph: {
    title: "Privacy Policy | JobReady",
    description: "How JobReady handles and protects your personal data.",
    url: "https://jobreadyke.co.ke/privacy",
    siteName: "JobReady",
    type: "website",
    images: [{ url: "https://jobreadyke.co.ke/opengraph-image.png", width: 1200, height: 630, alt: "JobReady" }],
  },
  twitter: {
    card: "summary",
    title: "Privacy Policy | JobReady",
    description: "How JobReady handles and protects your personal data.",
  },
};

export default function Privacy_Page() {
  return (
    <main className="bg-surface">
      <BreadcrumbJsonLd items={[
        { name: "Home", url: "https://jobreadyke.co.ke/" },
        { name: "Privacy Policy", url: "https://jobreadyke.co.ke/privacy" },
      ]} />
      <div className="max-w-3xl mx-auto px-5 py-16 md:py-20">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1.5 text-[12px] text-muted mb-8">
          <Link href="/" className="hover:text-ink transition-colors">Home</Link>
          <span className="text-divider">/</span>
          <span className="text-ink font-medium">Privacy Policy</span>
        </nav>

        <article className="prose-custom">
          <h1 className="text-3xl md:text-4xl font-heading font-black text-ink mb-2">
            Privacy Policy
          </h1>
          <p className="text-[13px] text-muted mb-8">Last updated: May 2025</p>

          <div className="space-y-8 text-[14px] text-ink/80 leading-relaxed">
            <section>
              <h2 className="text-[16px] font-heading font-bold text-ink mb-3">1. Introduction</h2>
              <p>
                JobReady (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy.
                This Privacy Policy explains how we collect, use, disclose, and safeguard your
                information when you visit our website jobreadyke.co.ke (the &quot;Service&quot;). Please
                read this policy carefully. By using JobReady, you agree to the practices
                described in this Privacy Policy.
              </p>
            </section>

            <section>
              <h2 className="text-[16px] font-heading font-bold text-ink mb-3">2. Information We Collect</h2>
              <p className="mb-3">We collect information that you provide directly to us, including:</p>
              <ul className="list-disc pl-5 space-y-1.5 mb-3">
                <li><strong className="text-ink">Account Information:</strong> Name, email address, and password when you create a JobReady account.</li>
                <li><strong className="text-ink">Profile Information:</strong> CV/resume data, work experience, education history, skills, and location that you add to your profile.</li>
                <li><strong className="text-ink">Application Data:</strong> Job applications you submit through our platform, including cover letters and responses to application questions.</li>
                <li><strong className="text-ink">Communications:</strong> Messages you send to employers and support inquiries you submit to us.</li>
              </ul>
              <p className="mb-3">We also collect certain information automatically, including:</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li><strong className="text-ink">Device Information:</strong> IP address, browser type, operating system, and device identifiers.</li>
                <li><strong className="text-ink">Usage Data:</strong> Pages visited, search queries, click patterns, and time spent on the Service.</li>
                <li><strong className="text-ink">Cookies:</strong> We use cookies and similar tracking technologies to improve your experience. See our Cookie section below.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-[16px] font-heading font-bold text-ink mb-3">3. How We Use Your Information</h2>
              <p className="mb-3">We use the information we collect to:</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Provide, maintain, and improve the JobReady Service</li>
                <li>Match you with relevant job listings and opportunities</li>
                <li>Send you job alerts, application updates, and newsletters (with your consent)</li>
                <li>Enable communication between job seekers and employers</li>
                <li>Analyze usage patterns to improve our platform and user experience</li>
                <li>Detect, prevent, and address fraud, abuse, and security issues</li>
                <li>Comply with legal obligations and enforce our terms of service</li>
              </ul>
            </section>

            <section>
              <h2 className="text-[16px] font-heading font-bold text-ink mb-3">4. Information Sharing</h2>
              <p className="mb-3">We do not sell your personal information. We may share your information with:</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li><strong className="text-ink">Employers:</strong> When you apply for a job, your application details (name, CV, cover letter) are shared with the hiring employer.</li>
                <li><strong className="text-ink">Service Providers:</strong> Third-party services that help us operate the platform (hosting, analytics, email delivery).</li>
                <li><strong className="text-ink">Legal Requirements:</strong> When required by law, regulation, or legal process.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-[16px] font-heading font-bold text-ink mb-3">5. Data Security</h2>
              <p>
                We implement appropriate technical and organizational security measures to
                protect your personal information. This includes encryption in transit (HTTPS),
                secure data storage, access controls, and regular security assessments.
                However, no method of transmission over the Internet is 100% secure, and
                we cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-[16px] font-heading font-bold text-ink mb-3">6. Cookies</h2>
              <p className="mb-3">
                We use cookies and similar technologies for authentication, analytics, and
                advertising. You can control cookies through your browser settings. Note
                that disabling cookies may affect the functionality of the Service. We use
                the following types of cookies:
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li><strong className="text-ink">Essential Cookies:</strong> Required for the Service to function (session management, authentication).</li>
                <li><strong className="text-ink">Analytics Cookies:</strong> Help us understand how users interact with the Service (Google Analytics).</li>
                <li><strong className="text-ink">Advertising Cookies:</strong> Used by Google AdSense to display relevant advertisements.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-[16px] font-heading font-bold text-ink mb-3">7. Your Rights</h2>
              <p className="mb-3">
                Under the Kenya Data Protection Act 2019, you have the right to:
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Access your personal data held by JobReady</li>
                <li>Request correction of inaccurate personal data</li>
                <li>Request deletion of your personal data</li>
                <li>Withdraw consent for data processing at any time</li>
                <li>Lodge a complaint with the Office of the Data Protection Commissioner</li>
              </ul>
              <p className="mt-3">
                To exercise any of these rights, contact us at privacy@jobreadyke.co.ke.
              </p>
            </section>

            <section>
              <h2 className="text-[16px] font-heading font-bold text-ink mb-3">8. Data Retention</h2>
              <p>
                We retain your personal information for as long as your account is active
                or as needed to provide you services. If you delete your account, we will
                delete your personal data within 30 days, except where retention is required
                by law (e.g., for tax or regulatory compliance).
              </p>
            </section>

            <section>
              <h2 className="text-[16px] font-heading font-bold text-ink mb-3">9. Children&apos;s Privacy</h2>
              <p>
                JobReady is not intended for use by persons under 18 years of age. We do not
                knowingly collect personal information from children. If we become aware that
                we have collected data from a person under 18, we will take steps to delete
                that information promptly.
              </p>
            </section>

            <section>
              <h2 className="text-[16px] font-heading font-bold text-ink mb-3">10. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of
                any material changes by posting the new Privacy Policy on this page and
                updating the &quot;Last updated&quot; date. Your continued use of the Service after
                changes are posted constitutes your acceptance of the updated policy.
              </p>
            </section>

            <section>
              <h2 className="text-[16px] font-heading font-bold text-ink mb-3">11. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us at
                privacy@jobreadyke.co.ke or visit our contact page.
              </p>
            </section>
          </div>
        </article>

        <div className="text-center pt-8">
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
