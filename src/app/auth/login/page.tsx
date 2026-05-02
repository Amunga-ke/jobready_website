import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your JobReady account",
};

export default function LoginPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-5 py-12">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block font-heading font-bold text-lg tracking-tight">
            JOB<span className="text-accent">READY</span>
          </Link>
          <p className="text-[13px] text-muted mt-2">
            Welcome back. Sign in to your account.
          </p>
        </div>

        {/* Form */}
        <Suspense fallback={<div className="bg-white rounded-xl border border-divider p-6">Loading...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
