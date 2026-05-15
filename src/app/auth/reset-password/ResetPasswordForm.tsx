"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2, CheckCircle2, ArrowLeft } from "lucide-react";

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("Invalid or missing reset token. Please request a new reset link.");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }

      setSuccess(true);
      // Redirect to login after a short delay
      setTimeout(() => {
        router.push("/auth/login");
      }, 3000);
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  // Success state
  if (success) {
    return (
      <div className="bg-white rounded-xl border border-divider p-6 shadow-sm text-center">
        <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
        <h2 className="text-lg font-heading font-bold text-ink mb-2">
          Password Reset Successfully
        </h2>
        <p className="text-[13px] text-muted mb-4">
          Your password has been updated. You can now sign in with your new
          password.
        </p>
        <Link
          href="/auth/login"
          className="inline-flex items-center gap-1.5 text-[13px] text-accent hover:text-accent-dark font-medium transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Go to sign in
        </Link>
      </div>
    );
  }

  // No token provided
  if (!token) {
    return (
      <div className="bg-white rounded-xl border border-divider p-6 shadow-sm text-center">
        <h2 className="text-lg font-heading font-bold text-ink mb-2">
          Invalid Reset Link
        </h2>
        <p className="text-[13px] text-muted mb-5">
          This reset link is missing a token. Please request a new password
          reset link.
        </p>
        <Link
          href="/auth/forgot-password"
          className="inline-flex items-center gap-1.5 text-[13px] text-accent hover:text-accent-dark font-medium transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Request a new link
        </Link>
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

        {email && (
          <div className="text-[12px] text-muted text-center bg-surface rounded-lg px-3 py-2">
            Resetting password for{" "}
            <span className="font-medium text-ink">{email}</span>
          </div>
        )}

        {/* New Password */}
        <div>
          <label
            htmlFor="new-password"
            className="block text-[12px] font-medium text-ink mb-1.5"
          >
            New password
          </label>
          <div className="relative">
            <input
              id="new-password"
              type={showPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="At least 8 characters"
              required
              minLength={8}
              maxLength={128}
              autoComplete="new-password"
              className="w-full px-3 py-2 pr-10 rounded-lg border border-divider bg-surface text-[13px] text-ink placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted hover:text-ink transition-colors"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div>
          <label
            htmlFor="confirm-password"
            className="block text-[12px] font-medium text-ink mb-1.5"
          >
            Confirm new password
          </label>
          <div className="relative">
            <input
              id="confirm-password"
              type={showConfirm ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter your password"
              required
              minLength={8}
              maxLength={128}
              autoComplete="new-password"
              className="w-full px-3 py-2 pr-10 rounded-lg border border-divider bg-surface text-[13px] text-ink placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted hover:text-ink transition-colors"
              tabIndex={-1}
            >
              {showConfirm ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Password requirements hint */}
        <div className="text-[11px] text-muted space-y-0.5">
          <p>Password must:</p>
          <ul className="list-disc list-inside space-y-0.5 ml-1">
            <li className={newPassword.length >= 8 ? "text-green-600" : ""}>
              Be at least 8 characters
            </li>
            <li
              className={
                newPassword.length > 0 && newPassword === confirmPassword
                  ? "text-green-600"
                  : ""
              }
            >
              Match confirmation
            </li>
          </ul>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-ink text-white text-[13px] font-medium py-2.5 rounded-lg hover:bg-ink/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {loading ? "Resetting password…" : "Reset Password"}
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
