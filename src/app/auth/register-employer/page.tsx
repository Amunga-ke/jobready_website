"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Building2, Eye, EyeOff, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";

export default function RegisterEmployerPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    companyName: "",
    companyIndustry: "",
    companyLocation: "",
    companyCounty: "",
    companyWebsite: "",
    companyOrgType: "PRIVATE",
  });

  const update = (field: string, value: string) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register-employer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed");
        return;
      }

      setSuccess(true);
      setTimeout(() => router.push("/auth/login"), 2000);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <main className="min-h-screen bg-surface flex items-center justify-center px-5">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-emerald-600" />
          </div>
          <h1 className="text-xl font-heading font-bold text-ink mb-2">Account Created!</h1>
          <p className="text-[13px] text-muted mb-4">
            Your employer account has been created successfully. Redirecting to login...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-surface">
      <div className="max-w-lg mx-auto px-5 py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-accent-bg flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-6 h-6 text-accent" />
          </div>
          <h1 className="text-xl font-heading font-bold text-ink">Create Employer Account</h1>
          <p className="text-[13px] text-muted mt-1">
            Post jobs and manage applications on JobReady
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-divider p-6 space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-700 text-[12px] rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          {/* Personal Info */}
          <div>
            <h3 className="text-[12px] font-semibold text-ink uppercase tracking-wide mb-3">Personal Information</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-[12px] font-medium text-ink mb-1">Full Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="John Doe"
                  className="w-full px-3 py-2.5 rounded-lg border border-divider text-[13px] text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-ink mb-1">Email *</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  placeholder="you@company.com"
                  className="w-full px-3 py-2.5 rounded-lg border border-divider text-[13px] text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-ink mb-1">Password *</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => update("password", e.target.value)}
                    placeholder="Min 8 chars, 1 uppercase, 1 number"
                    className="w-full px-3 py-2.5 rounded-lg border border-divider text-[13px] text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Company Info */}
          <div>
            <h3 className="text-[12px] font-semibold text-ink uppercase tracking-wide mb-3">Company Information</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-[12px] font-medium text-ink mb-1">Company Name *</label>
                <input
                  type="text"
                  value={form.companyName}
                  onChange={(e) => update("companyName", e.target.value)}
                  placeholder="Acme Ltd"
                  className="w-full px-3 py-2.5 rounded-lg border border-divider text-[13px] text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-medium text-ink mb-1">Industry</label>
                  <input
                    type="text"
                    value={form.companyIndustry}
                    onChange={(e) => update("companyIndustry", e.target.value)}
                    placeholder="Technology"
                    className="w-full px-3 py-2.5 rounded-lg border border-divider text-[13px] text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-ink mb-1">Organization Type</label>
                  <select
                    value={form.companyOrgType}
                    onChange={(e) => update("companyOrgType", e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg border border-divider text-[13px] text-ink focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors bg-white"
                  >
                    <option value="PRIVATE">Private</option>
                    <option value="PUBLIC">Public</option>
                    <option value="NGO">NGO</option>
                    <option value="GOVERNMENT">Government</option>
                    <option value="STARTUP">Startup</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-medium text-ink mb-1">Location</label>
                  <input
                    type="text"
                    value={form.companyLocation}
                    onChange={(e) => update("companyLocation", e.target.value)}
                    placeholder="Nairobi"
                    className="w-full px-3 py-2.5 rounded-lg border border-divider text-[13px] text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-ink mb-1">County</label>
                  <input
                    type="text"
                    value={form.companyCounty}
                    onChange={(e) => update("companyCounty", e.target.value)}
                    placeholder="Nairobi"
                    className="w-full px-3 py-2.5 rounded-lg border border-divider text-[13px] text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[12px] font-medium text-ink mb-1">Website</label>
                <input
                  type="url"
                  value={form.companyWebsite}
                  onChange={(e) => update("companyWebsite", e.target.value)}
                  placeholder="https://www.company.com"
                  className="w-full px-3 py-2.5 rounded-lg border border-divider text-[13px] text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-accent hover:bg-accent-dark text-white text-[13px] font-medium py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Creating account...
              </>
            ) : (
              <>
                Create Employer Account
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-[12px] text-muted mt-6">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-accent hover:text-accent-dark font-medium transition-colors">
            Sign in
          </Link>
        </p>
        <p className="text-center text-[12px] text-muted mt-1">
          Looking for jobs?{" "}
          <Link href="/auth/register" className="text-accent hover:text-accent-dark font-medium transition-colors">
            Register as Job Seeker
          </Link>
        </p>
      </div>
    </main>
  );
}
