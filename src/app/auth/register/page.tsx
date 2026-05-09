import type { Metadata } from "next";
import RegisterForm from "./RegisterForm";

export const metadata: Metadata = {
  title: "Create Your JobReady Account",
  description: "Create a free JobReady account to browse thousands of verified jobs, save listings, and get job alerts across Kenya.",
  robots: { index: false, follow: false },
  alternates: { canonical: "https://jobreadyke.co.ke/auth/register" },
};

export default function RegisterPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-5 py-12">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block font-heading font-bold text-lg tracking-tight">
            JOB<span className="text-accent">READY</span>
          </Link>
          <h1 className="text-xl font-heading font-bold text-ink mb-2">Create Your Account</h1>
          <p className="text-[13px] text-muted mt-2">
            Create your account to get started.
          </p>
        </div>

        {/* Form */}
        <RegisterForm />
      </div>
    </div>
  );
}

import Link from "next/link";
