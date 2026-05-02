"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Menu, X, LayoutDashboard } from "lucide-react";

const NAV_LINKS = [
  { label: "Jobs", href: "/jobs" },
  { label: "Government", href: "/government" },
  { label: "Casual", href: "/casual" },
  { label: "Opportunities", href: "/opportunities" },
  { label: "Companies", href: "/companies" },
  { label: "Resources", href: "/articles" },
  { label: "Salary Guide", href: "/salary-guide" },
];

const MOBILE_BOTTOM = [
  { label: "Post a Job", href: "/post-job" },
  { label: "Sign In", href: "/auth/login" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();

  // Lock body scroll when overlay is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const displayName = session?.user?.name || "Dashboard";

  return (
    <>
      <nav className="pt-4 pb-4">
        <div className="max-w-6xl mx-auto px-5 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="font-heading font-bold text-lg tracking-tight">
            JOB<span className="text-accent">READY</span>
          </Link>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[13px] font-medium text-muted hover:text-ink transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <Link
              href="/post-job"
              className="text-[13px] font-medium text-muted hover:text-ink transition-colors"
            >
              Post a Job
            </Link>
            {session ? (
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1.5 bg-ink text-white text-[13px] font-medium px-4 py-2 rounded-lg hover:bg-ink/90 transition-colors"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                {displayName}
              </Link>
            ) : (
              <Link
                href="/auth/login"
                className="bg-ink text-white text-[13px] font-medium px-4 py-2 rounded-lg hover:bg-ink/90 transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen(true)}
            className="lg:hidden p-1.5 -mr-1.5 text-ink"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </nav>

      {/* ───── Full-screen overlay menu ───── */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setOpen(false)}
          />

          {/* Drawer */}
          <div className="absolute inset-y-0 right-0 w-[280px] max-w-[85vw] bg-surface shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-divider">
              <span className="font-heading font-bold text-lg tracking-tight">
                JOB<span className="text-accent">READY</span>
              </span>
              <button
                onClick={() => setOpen(false)}
                className="p-1 -mr-1 text-ink"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Links */}
            <div className="flex-1 overflow-y-auto px-3 py-3">
              <div className="space-y-0.5">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block px-3 py-2.5 rounded-lg text-[15px] font-medium text-ink/80 hover:text-ink hover:bg-ink/[0.04] transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Bottom CTA */}
            <div className="px-5 py-5 border-t border-divider space-y-3">
              {session ? (
                <Link
                  href="/dashboard"
                  onClick={() => setOpen(false)}
                  className="block w-full text-center bg-ink text-white text-[14px] font-medium px-4 py-2.5 rounded-lg hover:bg-ink/90 transition-colors"
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    onClick={() => setOpen(false)}
                    className="block w-full text-center bg-ink text-white text-[14px] font-medium px-4 py-2.5 rounded-lg hover:bg-ink/90 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/post-job"
                    onClick={() => setOpen(false)}
                    className="block w-full text-center text-[13px] font-medium text-muted hover:text-ink transition-colors"
                  >
                    Post a Job
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
