'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { href: '/jobs', label: 'Jobs' },
  { href: '/companies', label: 'Companies' },
  { href: '/articles', label: 'Resources' },
  { href: '/opportunities', label: 'Opportunities' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="pt-5 pb-5">
      <div className="max-w-6xl mx-auto px-5 flex items-center justify-between">
        <Link href="/" className="font-heading font-bold text-lg tracking-tight">
          JOB<span className="text-accent">NET</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[13px] font-medium text-muted hover:text-ink transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="#"
            className="text-[13px] font-medium text-muted hover:text-ink transition-colors hidden sm:block"
          >
            Sign In
          </Link>
          <Link
            href="#"
            className="bg-ink text-white text-[13px] font-medium px-4 py-2 rounded-lg hover:bg-ink/90 transition-colors"
          >
            Post Job
          </Link>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg hover:bg-surface transition-colors text-muted"
            aria-label="Menu"
          >
            {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-divider mt-3 pt-4 px-5 pb-2 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block py-2.5 text-[14px] font-medium text-muted hover:text-ink transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="#"
            className="block py-2.5 text-[14px] font-medium text-muted hover:text-ink transition-colors sm:hidden"
          >
            Sign In
          </Link>
        </div>
      )}
    </nav>
  );
}
