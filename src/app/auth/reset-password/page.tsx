import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { SITE_URL } from "@/lib/config";
import ResetPasswordForm from "./ResetPasswordForm";

export const metadata: Metadata = {
  title: "Set New Password — JobReady",
  description:
    "Choose a new password for your JobReady account. Enter your new password below.",
  robots: { index: false, follow: false },
  alternates: { canonical: `${SITE_URL}/auth/reset-password` },
};

export default function ResetPasswordPage() {
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
            Set New Password
          </h1>
          <p className="text-[13px] text-muted mt-2">
            Enter your new password below.
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
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
