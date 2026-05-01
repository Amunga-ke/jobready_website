import { Linkedin, Facebook, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-divider py-16 bg-surface">
      <div className="max-w-6xl mx-auto px-5">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2 md:col-span-1">
            <a href="#" className="font-heading font-bold text-lg tracking-tight">
              JOB<span className="text-accent">NET</span>
            </a>
            <p className="text-[12px] text-muted mt-3 leading-relaxed">
              Kenya&apos;s most trusted job board. Real jobs from verified employers.
            </p>
          </div>
          <div>
            <h4 className="font-mono text-[10px] text-muted uppercase tracking-widest mb-4">Jobseekers</h4>
            <ul className="space-y-2.5">
              <li><a href="#" className="text-[13px] text-muted hover:text-ink transition-colors">Browse Jobs</a></li>
              <li><a href="#" className="text-[13px] text-muted hover:text-ink transition-colors">Companies</a></li>
              <li><a href="#" className="text-[13px] text-muted hover:text-ink transition-colors">Salary Guide</a></li>
              <li><a href="#" className="text-[13px] text-muted hover:text-ink transition-colors">Resources</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-mono text-[10px] text-muted uppercase tracking-widest mb-4">Employers</h4>
            <ul className="space-y-2.5">
              <li><a href="#" className="text-[13px] text-muted hover:text-ink transition-colors">Post a Job</a></li>
              <li><a href="#" className="text-[13px] text-muted hover:text-ink transition-colors">Pricing</a></li>
              <li><a href="#" className="text-[13px] text-muted hover:text-ink transition-colors">Branding</a></li>
              <li><a href="#" className="text-[13px] text-muted hover:text-ink transition-colors">CV Database</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-mono text-[10px] text-muted uppercase tracking-widest mb-4">Resources</h4>
            <ul className="space-y-2.5">
              <li><a href="#" className="text-[13px] text-muted hover:text-ink transition-colors">Blog</a></li>
              <li><a href="#" className="text-[13px] text-muted hover:text-ink transition-colors">CV Writing</a></li>
              <li><a href="#" className="text-[13px] text-muted hover:text-ink transition-colors">Interview Tips</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-mono text-[10px] text-muted uppercase tracking-widest mb-4">Company</h4>
            <ul className="space-y-2.5">
              <li><a href="#" className="text-[13px] text-muted hover:text-ink transition-colors">About</a></li>
              <li><a href="#" className="text-[13px] text-muted hover:text-ink transition-colors">Contact</a></li>
              <li><a href="#" className="text-[13px] text-muted hover:text-ink transition-colors">Privacy</a></li>
              <li><a href="#" className="text-[13px] text-muted hover:text-ink transition-colors">Terms</a></li>
            </ul>
          </div>
        </div>
        <div className="h-px bg-divider my-10"></div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-mono text-[11px] text-muted/40">© 2025 Jobnet</p>
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
