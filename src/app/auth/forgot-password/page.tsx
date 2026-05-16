import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { SITE_URL } from "@/lib/config";
import ForgotPasswordForm from "./ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Reset Your JobReady Password",
  description:
    "Reset your JobReady password securely via email. Follow the link sent to your registered address.",
  robots: { index: false, follow: false },
  alternates: { canonical: `${SITE_URL}/auth/forgot-password`, languages: { 'en-KE': `${SITE_URL}/auth/forgot-password`, 'x-default': `${SITE_URL}/auth/forgot-password` } },
};

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-5 py-12">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-block font-heading font-bold text-lg tracking-tight"
          >
            JOB<span className="text-accent">READY</span>
          </Link>
          <h1 className="text-xl font-heading font-bold text-ink mb-2">
            Reset Your Password
          </h1>
          <p className="text-[13px] text-muted mt-2">
            Enter your email and we&apos;ll send you a reset link.
          </p>
        </div>

        {/* Form */}
        <Suspense
          fallback={
            <div className="bg-white rounded-xl border border-divider p-6 shadow-sm">
              Loading…
            </div>
          }
        >
          <ForgotPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
