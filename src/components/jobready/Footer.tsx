import Link from "next/link";
import { Linkedin, Facebook, Instagram } from "lucide-react";

const FOOTER_LINKS = {
  jobseekers: [
    { label: "Browse Jobs", href: "/jobs" },
    { label: "Government Jobs", href: "/government" },
    { label: "Casual Jobs", href: "/casual" },
    { label: "Opportunities", href: "/opportunities" },
    { label: "Companies", href: "/companies" },
    { label: "Salary Guide", href: "/salary-guide" },
  ],
  employers: [
    { label: "Post a Job", href: "/post-job" },
    { label: "Pricing", href: "/pricing" },
    { label: "Branding", href: "/branding" },
    { label: "CV Database", href: "/cv-database" },
  ],
  resources: [
    { label: "Resources", href: "/articles" },
    { label: "CV Writing", href: "/articles/cv-writing" },
    { label: "Interview Tips", href: "/articles/interview-tips" },
  ],
  company: [
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-divider py-16 bg-surface">
      <div className="max-w-6xl mx-auto px-5">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Logo */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="font-heading font-bold text-lg tracking-tight">
              JOB<span className="text-accent">READY</span>
            </Link>
            <p className="text-[12px] text-muted mt-3 leading-relaxed">
              Kenya&apos;s most trusted job board. Real jobs from verified employers.
            </p>
          </div>

          {/* Jobseekers */}
          <div>
            <h4 className="font-mono text-[10px] text-muted uppercase tracking-widest mb-4">
              Jobseekers
            </h4>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.jobseekers.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[13px] text-muted hover:text-ink transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Employers */}
          <div>
            <h4 className="font-mono text-[10px] text-muted uppercase tracking-widest mb-4">
              Employers
            </h4>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.employers.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[13px] text-muted hover:text-ink transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-mono text-[10px] text-muted uppercase tracking-widest mb-4">
              Resources
            </h4>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.resources.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[13px] text-muted hover:text-ink transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-mono text-[10px] text-muted uppercase tracking-widest mb-4">
              Company
            </h4>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[13px] text-muted hover:text-ink transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="h-px bg-divider my-10"></div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-mono text-[11px] text-muted/40">
            &copy; {new Date().getFullYear()} JobReady
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://x.com/jobreadyke"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted/30 hover:text-ink transition-colors"
            >
              <svg
                className="text-base"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a
              href="https://linkedin.com/company/jobreadyke"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted/30 hover:text-ink transition-colors"
            >
              <Linkedin className="text-base" />
            </a>
            <a
              href="https://facebook.com/jobreadyke"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted/30 hover:text-ink transition-colors"
            >
              <Facebook className="text-base" />
            </a>
            <a
              href="https://instagram.com/jobreadyke"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted/30 hover:text-ink transition-colors"
            >
              <Instagram className="text-base" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
