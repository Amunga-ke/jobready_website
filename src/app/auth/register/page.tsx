import type { Metadata } from "next";
import RegisterForm from "./RegisterForm";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Create your JobReady account to find your next job",
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
