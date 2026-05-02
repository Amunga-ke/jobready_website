"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { Eye, EyeOff, Loader2, Check } from "lucide-react";
import { KE_COUNTIES } from "@/lib/constants";

export default function RegisterForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [county, setCounty] = useState("");
  const [role, setRole] = useState("SEEKER");
  const [terms, setTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (!terms) {
      setError("You must accept the terms and conditions");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role, county: county || undefined }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed");
        setLoading(false);
        return;
      }

      // Auto sign in
      const result = await signIn("credentials", {
        email: email.toLowerCase().trim(),
        password,
        redirect: false,
      });

      if (result?.ok) {
        router.push("/dashboard");
        router.refresh();
      } else {
        router.push("/auth/login?callbackUrl=/dashboard");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-divider p-6 shadow-sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 text-[12px] rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        {/* Role selector */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setRole("SEEKER")}
            className={`flex-1 text-center py-2 rounded-lg border text-[12px] font-medium transition-colors ${
              role === "SEEKER"
                ? "border-accent bg-accent-bg text-accent"
                : "border-divider text-muted hover:text-ink hover:border-ink/20"
            }`}
          >
            Job Seeker
          </button>
          <button
            type="button"
            onClick={() => setRole("EMPLOYER")}
            className={`flex-1 text-center py-2 rounded-lg border text-[12px] font-medium transition-colors ${
              role === "EMPLOYER"
                ? "border-accent bg-accent-bg text-accent"
                : "border-divider text-muted hover:text-ink hover:border-ink/20"
            }`}
          >
            Employer
          </button>
        </div>

        <div>
          <label htmlFor="name" className="block text-[12px] font-medium text-ink mb-1.5">
            Full name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            autoComplete="name"
            className="w-full px-3 py-2 rounded-lg border border-divider bg-surface text-[13px] text-ink placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors"
          />
        </div>

        <div>
          <label htmlFor="reg-email" className="block text-[12px] font-medium text-ink mb-1.5">
            Email address
          </label>
          <input
            id="reg-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            autoComplete="email"
            className="w-full px-3 py-2 rounded-lg border border-divider bg-surface text-[13px] text-ink placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors"
          />
        </div>

        <div>
          <label htmlFor="county" className="block text-[12px] font-medium text-ink mb-1.5">
            County <span className="text-muted font-normal">(optional)</span>
          </label>
          <select
            id="county"
            value={county}
            onChange={(e) => setCounty(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-divider bg-surface text-[13px] text-ink focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors"
          >
            <option value="">Select county</option>
            {KE_COUNTIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="reg-password" className="block text-[12px] font-medium text-ink mb-1.5">
            Password
          </label>
          <div className="relative">
            <input
              id="reg-password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 8 characters"
              required
              autoComplete="new-password"
              className="w-full px-3 py-2 pr-10 rounded-lg border border-divider bg-surface text-[13px] text-ink placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted hover:text-ink transition-colors"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="confirm-password" className="block text-[12px] font-medium text-ink mb-1.5">
            Confirm password
          </label>
          <input
            id="confirm-password"
            type={showPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your password"
            required
            autoComplete="new-password"
            className="w-full px-3 py-2 rounded-lg border border-divider bg-surface text-[13px] text-ink placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors"
          />
          {confirmPassword && password === confirmPassword && (
            <p className="text-[11px] text-emerald-600 mt-1 flex items-center gap-1">
              <Check className="w-3 h-3" /> Passwords match
            </p>
          )}
        </div>

        <label className="flex items-start gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={terms}
            onChange={(e) => setTerms(e.target.checked)}
            className="mt-0.5 rounded border-divider accent-accent"
          />
          <span className="text-[12px] text-muted leading-relaxed">
            I agree to JobReady&apos;s{" "}
            <Link href="/terms" className="text-accent hover:underline">Terms of Service</Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-accent hover:underline">Privacy Policy</Link>
          </span>
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-ink text-white text-[13px] font-medium py-2.5 rounded-lg hover:bg-ink/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {loading ? "Creating account..." : "Create Account"}
        </button>
      </form>

      <p className="text-[12px] text-muted text-center mt-5">
        Already have an account?{" "}
        <Link href="/auth/login" className="text-accent hover:text-accent-dark font-medium transition-colors">
          Sign in
        </Link>
      </p>
    </div>
  );
}
