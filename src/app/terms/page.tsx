import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/jobready/JsonLd";

export const metadata: Metadata = {
  title: "Terms of Service | JobReady",
  description:
    "Read the terms and conditions governing the use of JobReady's job board services, employer accounts, and job listings.",
  alternates: { canonical: "https://jobreadyke.co.ke/terms" },
  openGraph: {
    title: "Terms of Service | JobReady",
    description: "Terms and conditions for using JobReady's services.",
    url: "https://jobreadyke.co.ke/terms",
    siteName: "JobReady",
    type: "website",
    images: [{ url: "https://jobreadyke.co.ke/opengraph-image.png", width: 1200, height: 630, alt: "JobReady" }],
  },
  twitter: {
    card: "summary",
    title: "Terms of Service | JobReady",
    description: "Terms and conditions for using JobReady's services.",
  },
};

export default function Terms_Page() {
  return (
    <main className="bg-surface">
      <BreadcrumbJsonLd items={[
        { name: "Home", url: "https://jobreadyke.co.ke/" },
        { name: "Terms of Service", url: "https://jobreadyke.co.ke/terms" },
      ]} />
      <div className="max-w-3xl mx-auto px-5 py-16 md:py-20">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1.5 text-[12px] text-muted mb-8">
          <Link href="/" className="hover:text-ink transition-colors">Home</Link>
          <span className="text-divider">/</span>
          <span className="text-ink font-medium">Terms of Service</span>
        </nav>

        <article className="prose-custom">
          <h1 className="text-3xl md:text-4xl font-heading font-black text-ink mb-2">
            Terms of Service
          </h1>
          <p className="text-[13px] text-muted mb-8">Last updated: May 2025</p>

          <div className="space-y-8 text-[14px] text-ink/80 leading-relaxed">
            <section>
              <h2 className="text-[16px] font-heading font-bold text-ink mb-3">1. Acceptance of Terms</h2>
              <p>
                By accessing or using JobReady (jobreadyke.co.ke), you agree to be bound by
                these Terms of Service. If you do not agree with any part of these terms,
                you must not use the Service. These terms apply to all users, including
                job seekers, employers, and visitors.
              </p>
            </section>

            <section>
              <h2 className="text-[16px] font-heading font-bold text-ink mb-3">2. Description of Service</h2>
              <p>
                JobReady is an online job board that connects job seekers with employers in
                Kenya. The Service allows job seekers to browse and apply for job listings,
                and employers to post job openings and manage applications. JobReady does
                not guarantee employment or the accuracy of all job listings, though we make
                reasonable efforts to verify employers and listing content.
              </p>
            </section>

            <section>
              <h2 className="text-[16px] font-heading font-bold text-ink mb-3">3. User Accounts</h2>
              <p className="mb-3">
                To access certain features, you may need to create an account. You agree to:
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Provide accurate, current, and complete information during registration</li>
                <li>Maintain and promptly update your account information</li>
                <li>Keep your password confidential and not share it with third parties</li>
                <li>Notify us immediately of any unauthorized use of your account</li>
                <li>Be responsible for all activities that occur under your account</li>
              </ul>
            </section>

            <section>
              <h2 className="text-[16px] font-heading font-bold text-ink mb-3">4. Job Seeker Terms</h2>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>JobReady is free for job seekers. You will never be charged for browsing or applying for jobs.</li>
                <li>You are responsible for the accuracy of information in your profile, CV, and applications.</li>
                <li>You may not use automated tools to mass-apply for jobs or scrape the platform.</li>
                <li>You may not misrepresent your identity, qualifications, or experience in applications.</li>
                <li>You acknowledge that employers, not JobReady, make all hiring decisions.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-[16px] font-heading font-bold text-ink mb-3">5. Employer Terms</h2>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Employers must accurately represent their organization and job listings.</li>
                <li>Job listings must be for genuine, available positions with accurate descriptions.</li>
                <li>Employers may not post discriminatory job requirements that violate Kenyan law.</li>
                <li>Employers may not charge job seekers any fees for applying or employment.</li>
                <li>JobReady reserves the right to remove any listing that violates these terms.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-[16px] font-heading font-bold text-ink mb-3">6. Prohibited Conduct</h2>
              <p className="mb-3">Users may not:</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Post false, misleading, or fraudulent job listings or applications</li>
                <li>Use the Service for any unlawful purpose or in violation of Kenyan law</li>
                <li>Attempt to gain unauthorized access to the Service or its systems</li>
                <li>Scrape, crawl, or copy content from the Service without permission</li>
                <li>Interfere with or disrupt the Service or servers</li>
                <li>Impersonate any person or entity or misrepresent affiliation</li>
                <li>Transmit any viruses, malware, or harmful code</li>
              </ul>
            </section>

            <section>
              <h2 className="text-[16px] font-heading font-bold text-ink mb-3">7. Intellectual Property</h2>
              <p>
                All content on JobReady, including text, graphics, logos, icons, images,
                and software, is the property of JobReady or its content suppliers and is
                protected by intellectual property laws. You may not reproduce, distribute,
                or create derivative works from our content without prior written permission.
              </p>
            </section>

            <section>
              <h2 className="text-[16px] font-heading font-bold text-ink mb-3">8. Disclaimer of Warranties</h2>
              <p>
                The Service is provided on an &quot;as is&quot; and &quot;as available&quot; basis. JobReady makes
                no warranties, expressed or implied, regarding the Service, including but not
                limited to the accuracy, reliability, or availability of job listings. We do
                not endorse, guarantee, or assume responsibility for any employer, job listing,
                or third-party content.
              </p>
            </section>

            <section>
              <h2 className="text-[16px] font-heading font-bold text-ink mb-3">9. Limitation of Liability</h2>
              <p>
                To the fullest extent permitted by law, JobReady shall not be liable for any
                indirect, incidental, special, consequential, or punitive damages arising from
                your use of the Service. Our total liability shall not exceed the amount you
                paid to us in the twelve months preceding the claim, or KES 10,000, whichever
                is greater.
              </p>
            </section>

            <section>
              <h2 className="text-[16px] font-heading font-bold text-ink mb-3">10. Termination</h2>
              <p>
                We may terminate or suspend your access to the Service at any time, with or
                without cause, including for violation of these Terms. Upon termination, your
                right to use the Service will immediately cease. Sections that by their nature
                should survive termination shall remain in effect.
              </p>
            </section>

            <section>
              <h2 className="text-[16px] font-heading font-bold text-ink mb-3">11. Governing Law</h2>
              <p>
                These Terms are governed by the laws of Kenya. Any disputes arising from
                these Terms or the Service shall be resolved in the courts of Nairobi, Kenya.
              </p>
            </section>

            <section>
              <h2 className="text-[16px] font-heading font-bold text-ink mb-3">12. Changes to Terms</h2>
              <p>
                We reserve the right to modify these Terms at any time. We will notify users
                of material changes by posting updated terms on this page. Continued use of
                the Service after changes are posted constitutes acceptance of the revised terms.
              </p>
            </section>

            <section>
              <h2 className="text-[16px] font-heading font-bold text-ink mb-3">13. Contact</h2>
              <p>
                For questions about these Terms, contact us at legal@jobreadyke.co.ke or visit
                our contact page.
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
