"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, ArrowLeft, CheckCircle2, Mail } from "lucide-react";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }

      // Always show success regardless of whether the email exists
      setSubmitted(true);
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  // Success state
  if (submitted) {
    return (
      <div className="bg-white rounded-xl border border-divider p-6 shadow-sm">
        <div className="text-center">
          <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h2 className="text-lg font-heading font-bold text-ink mb-2">
            Check Your Email
          </h2>
          <p className="text-[13px] text-muted mb-1">
            If an account exists with{" "}
            <span className="font-medium text-ink">{email}</span>, you will
            receive a password reset link shortly.
          </p>
          <div className="flex items-center justify-center gap-1.5 text-[12px] text-muted mt-2 mb-5">
            <Mail className="w-3.5 h-3.5" />
            <span>Check your spam folder if you don&apos;t see it</span>
          </div>
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-1.5 text-[13px] text-accent hover:text-accent-dark font-medium transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-divider p-6 shadow-sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 text-[12px] rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        <div>
          <label
            htmlFor="reset-email"
            className="block text-[12px] font-medium text-ink mb-1.5"
          >
            Email address
          </label>
          <input
            id="reset-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            autoComplete="email"
            disabled={loading}
            className="w-full px-3 py-2 rounded-lg border border-divider bg-surface text-[13px] text-ink placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors disabled:opacity-50"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-ink text-white text-[13px] font-medium py-2.5 rounded-lg hover:bg-ink/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {loading ? "Sending…" : "Send Reset Link"}
        </button>
      </form>

      <p className="text-[12px] text-muted text-center mt-5">
        Remember your password?{" "}
        <Link
          href="/auth/login"
          className="text-accent hover:text-accent-dark font-medium transition-colors"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
