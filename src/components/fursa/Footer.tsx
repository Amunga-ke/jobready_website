import Link from 'next/link';
import { Linkedin, Facebook, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-divider py-16 bg-surface">
      <div className="max-w-6xl mx-auto px-5">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="font-heading font-bold text-lg tracking-tight">
              JOB<span className="text-accent">NET</span>
            </Link>
            <p className="text-[12px] text-muted mt-3 leading-relaxed">
              Kenya&apos;s most trusted job board. Real jobs from verified employers.
            </p>
          </div>
          <div>
            <h4 className="font-mono text-[10px] text-muted uppercase tracking-widest mb-4">Jobseekers</h4>
            <ul className="space-y-2.5">
              <li><Link href="/jobs" className="text-[13px] text-muted hover:text-ink transition-colors">Browse Jobs</Link></li>
              <li><Link href="/companies" className="text-[13px] text-muted hover:text-ink transition-colors">Companies</Link></li>
              <li><Link href="/opportunities" className="text-[13px] text-muted hover:text-ink transition-colors">Opportunities</Link></li>
              <li><Link href="/articles" className="text-[13px] text-muted hover:text-ink transition-colors">Resources</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-mono text-[10px] text-muted uppercase tracking-widest mb-4">By Type</h4>
            <ul className="space-y-2.5">
              <li><Link href="/government" className="text-[13px] text-muted hover:text-ink transition-colors">Government</Link></li>
              <li><Link href="/casual" className="text-[13px] text-muted hover:text-ink transition-colors">Casual &amp; Part-Time</Link></li>
              <li><Link href="/opportunities?tab=internships" className="text-[13px] text-muted hover:text-ink transition-colors">Internships</Link></li>
              <li><Link href="/opportunities?tab=scholarships" className="text-[13px] text-muted hover:text-ink transition-colors">Scholarships</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-mono text-[10px] text-muted uppercase tracking-widest mb-4">Employers</h4>
            <ul className="space-y-2.5">
              <li><Link href="#" className="text-[13px] text-muted hover:text-ink transition-colors">Post a Job</Link></li>
              <li><Link href="#" className="text-[13px] text-muted hover:text-ink transition-colors">Pricing</Link></li>
              <li><Link href="/companies" className="text-[13px] text-muted hover:text-ink transition-colors">Branding</Link></li>
              <li><Link href="#" className="text-[13px] text-muted hover:text-ink transition-colors">CV Database</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-mono text-[10px] text-muted uppercase tracking-widest mb-4">Company</h4>
            <ul className="space-y-2.5">
              <li><Link href="#" className="text-[13px] text-muted hover:text-ink transition-colors">About</Link></li>
              <li><Link href="#" className="text-[13px] text-muted hover:text-ink transition-colors">Contact</Link></li>
              <li><Link href="#" className="text-[13px] text-muted hover:text-ink transition-colors">Privacy</Link></li>
              <li><Link href="#" className="text-[13px] text-muted hover:text-ink transition-colors">Terms</Link></li>
            </ul>
          </div>
        </div>
        <div className="h-px bg-divider my-10"></div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-mono text-[11px] text-muted/40">&copy; 2025 Jobnet</p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-muted/30 hover:text-ink transition-colors">
              <svg className="text-base" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a href="#" className="text-muted/30 hover:text-ink transition-colors">
              <Linkedin className="text-base" />
            </a>
            <a href="#" className="text-muted/30 hover:text-ink transition-colors">
              <Facebook className="text-base" />
            </a>
            <a href="#" className="text-muted/30 hover:text-ink transition-colors">
              <Instagram className="text-base" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
