import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Reset your JobReady password",
};

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-5 py-12">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block font-heading font-bold text-lg tracking-tight">
            JOB<span className="text-accent">READY</span>
          </Link>
          <p className="text-[13px] text-muted mt-2">
            Enter your email and we&apos;ll send you a reset link.
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl border border-divider p-6 shadow-sm">
          <form className="space-y-4">
            <div>
              <label htmlFor="reset-email" className="block text-[12px] font-medium text-ink mb-1.5">
                Email address
              </label>
              <input
                id="reset-email"
                type="email"
                placeholder="you@example.com"
                required
                autoComplete="email"
                className="w-full px-3 py-2 rounded-lg border border-divider bg-surface text-[13px] text-ink placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-ink text-white text-[13px] font-medium py-2.5 rounded-lg hover:bg-ink/90 transition-colors"
            >
              Send Reset Link
            </button>

            <p className="text-[11px] text-muted text-center">
              Password reset functionality coming soon.
            </p>
          </form>

          <p className="text-[12px] text-muted text-center mt-5">
            Remember your password?{" "}
            <Link href="/auth/login" className="text-accent hover:text-accent-dark font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
