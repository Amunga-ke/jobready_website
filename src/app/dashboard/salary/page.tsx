"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  DollarSign,
  TrendingUp,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  Loader2,
  BarChart3,
} from "lucide-react";
import { toast } from "sonner";
import { KE_COUNTIES, ORG_INDUSTRIES } from "@/lib/constants";

const BENEFITS_OPTIONS = [
  "Health Insurance",
  "Pension",
  "Housing Allowance",
  "Transport",
  "Meals",
  "Training",
  "Bonus",
] as const;

const EMPLOYMENT_TYPES = [
  "Full-time",
  "Part-time",
  "Contract",
  "Freelance",
] as const;

const EXPERIENCE_LEVELS = [
  "Entry-level",
  "Mid-level",
  "Senior",
  "Executive",
] as const;

const SALARY_PERIODS = [
  "Monthly",
  "Annually",
  "Weekly",
  "Daily",
] as const;

interface FormData {
  jobTitle: string;
  company: string;
  industry: string;
  county: string;
  employmentType: string;
  experienceLevel: string;
  salaryAmount: string;
  salaryPeriod: string;
  benefits: string[];
}

interface BenchmarkData {
  average: number;
  median: number;
  min: number;
  max: number;
  p25: number;
  p75: number;
  count: number;
  distribution: { range: string; count: number }[];
  byCounty: { name: string; average: number; count: number }[];
  byExperience: { level: string; average: number; count: number }[];
}

function formatKES(amount: number): string {
  if (amount >= 1_000_000) return `KES ${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `KES ${(amount / 1_000).toFixed(1)}K`;
  return `KES ${amount.toLocaleString()}`;
}

export default function SalaryPage() {
  const [form, setForm] = useState<FormData>({
    jobTitle: "",
    company: "",
    industry: "",
    county: "",
    employmentType: "",
    experienceLevel: "",
    salaryAmount: "",
    salaryPeriod: "Monthly",
    benefits: [],
  });

  const [submitting, setSubmitting] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [benchmark, setBenchmark] = useState<BenchmarkData | null>(null);
  const [benchmarkLoading, setBenchmarkLoading] = useState(false);

  const toggleBenefit = (benefit: string) => {
    setForm((prev) => ({
      ...prev,
      benefits: prev.benefits.includes(benefit)
        ? prev.benefits.filter((b) => b !== benefit)
        : [...prev.benefits, benefit],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.jobTitle.trim() || !form.salaryAmount) {
      toast.error("Please fill in job title and salary amount");
      return;
    }

    setSubmitting(true);
    try {
      // Submit salary
      const submitRes = await fetch("/api/salary/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobTitle: form.jobTitle.trim(),
          company: form.company.trim() || undefined,
          industry: form.industry || undefined,
          county: form.county || undefined,
          employmentType: form.employmentType || undefined,
          experienceLevel: form.experienceLevel || undefined,
          salaryAmount: parseFloat(form.salaryAmount),
          salaryPeriod: form.salaryPeriod.toUpperCase(),
          benefits: form.benefits,
        }),
      });

      if (!submitRes.ok) {
        const err = await submitRes.json().catch(() => ({}));
        toast.error(err.error || "Failed to submit salary data");
        setSubmitting(false);
        return;
      }

      toast.success("Salary data submitted successfully!");

      // Fetch benchmark data for similar roles
      setShowResults(true);
      setBenchmarkLoading(true);

      const params = new URLSearchParams();
      params.set("jobTitle", form.jobTitle.trim());
      if (form.county) params.set("county", form.county);
      if (form.industry) params.set("industry", form.industry);
      if (form.experienceLevel) params.set("experienceLevel", form.experienceLevel);

      const benchRes = await fetch(`/api/salary/data?${params}`);
      if (benchRes.ok) {
        setBenchmark(await benchRes.json());
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
      setBenchmarkLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-heading font-bold text-ink">Salary Benchmark</h1>
        <p className="text-[13px] text-muted mt-1">
          See what professionals like you earn in Kenya.
        </p>
      </div>

      {/* Intro Card */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100 p-5">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
            <DollarSign className="w-5 h-5 text-blue-600" />
          </div>
          <div className="min-w-0">
            <h2 className="text-[14px] font-heading font-semibold text-ink">
              Know Your Worth
            </h2>
            <p className="text-[12px] text-muted mt-1">
              Contribute your salary data anonymously and get access to aggregate benchmarking
              data for your role, industry, and location in Kenya. Your personal information is
              never shared.
            </p>
            <Link
              href="/salary-guide"
              className="inline-flex items-center gap-1.5 text-[12px] font-medium text-blue-600 hover:text-blue-700 mt-3 transition-colors"
            >
              <BarChart3 className="w-3.5 h-3.5" />
              View Salary Guide
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Salary Submission Form */}
      <div className="bg-white rounded-xl border border-divider p-5">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-4 h-4 text-muted" />
          <h2 className="text-[14px] font-heading font-semibold text-ink">
            Submit Your Salary
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Job Title */}
            <div>
              <label className="block text-[12px] font-medium text-ink mb-1.5">
                Job Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.jobTitle}
                onChange={(e) => setForm({ ...form, jobTitle: e.target.value })}
                placeholder="e.g., Software Engineer"
                required
                className="w-full px-3 py-2 rounded-lg border border-divider bg-surface text-[13px] text-ink placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            {/* Company */}
            <div>
              <label className="block text-[12px] font-medium text-ink mb-1.5">
                Company <span className="text-muted font-normal">(optional)</span>
              </label>
              <input
                type="text"
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                placeholder="e.g., Safaricom"
                className="w-full px-3 py-2 rounded-lg border border-divider bg-surface text-[13px] text-ink placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            {/* Industry */}
            <div>
              <label className="block text-[12px] font-medium text-ink mb-1.5">Industry</label>
              <select
                value={form.industry}
                onChange={(e) => setForm({ ...form, industry: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-divider bg-surface text-[13px] text-ink focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="">Select industry</option>
                {ORG_INDUSTRIES.map((ind) => (
                  <option key={ind.value} value={ind.value}>
                    {ind.label}
                  </option>
                ))}
              </select>
            </div>

            {/* County */}
            <div>
              <label className="block text-[12px] font-medium text-ink mb-1.5">County</label>
              <select
                value={form.county}
                onChange={(e) => setForm({ ...form, county: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-divider bg-surface text-[13px] text-ink focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="">Select county</option>
                {KE_COUNTIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Employment Type */}
            <div>
              <label className="block text-[12px] font-medium text-ink mb-1.5">
                Employment Type
              </label>
              <select
                value={form.employmentType}
                onChange={(e) => setForm({ ...form, employmentType: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-divider bg-surface text-[13px] text-ink focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="">Select type</option>
                {EMPLOYMENT_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            {/* Experience Level */}
            <div>
              <label className="block text-[12px] font-medium text-ink mb-1.5">
                Experience Level
              </label>
              <select
                value={form.experienceLevel}
                onChange={(e) => setForm({ ...form, experienceLevel: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-divider bg-surface text-[13px] text-ink focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="">Select level</option>
                {EXPERIENCE_LEVELS.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Salary Amount */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-medium text-ink mb-1.5">
                Salary Amount <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[12px] text-muted pointer-events-none">
                  KES
                </span>
                <input
                  type="number"
                  value={form.salaryAmount}
                  onChange={(e) => setForm({ ...form, salaryAmount: e.target.value })}
                  placeholder="e.g., 150000"
                  required
                  min="1"
                  max="10000000"
                  className="w-full pl-12 pr-3 py-2 rounded-lg border border-divider bg-surface text-[13px] text-ink placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Salary Period */}
            <div>
              <label className="block text-[12px] font-medium text-ink mb-1.5">
                Salary Period
              </label>
              <div className="flex gap-2">
                {SALARY_PERIODS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setForm({ ...form, salaryPeriod: p })}
                    className={`flex-1 py-2 rounded-lg border text-[11px] font-medium transition-colors ${
                      form.salaryPeriod === p
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-divider text-muted hover:text-ink"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div>
            <label className="block text-[12px] font-medium text-ink mb-2">Benefits</label>
            <div className="flex flex-wrap gap-2">
              {BENEFITS_OPTIONS.map((benefit) => (
                <button
                  key={benefit}
                  type="button"
                  onClick={() => toggleBenefit(benefit)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[11px] font-medium transition-colors ${
                    form.benefits.includes(benefit)
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-divider text-muted hover:text-ink hover:border-ink/20"
                  }`}
                >
                  {form.benefits.includes(benefit) && (
                    <CheckCircle2 className="w-3 h-3" />
                  )}
                  {benefit}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 bg-ink text-white text-[13px] font-medium px-5 py-2.5 rounded-lg hover:bg-ink/90 transition-colors disabled:opacity-50"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <DollarSign className="w-4 h-4" />
                Submit Salary
              </>
            )}
          </button>
        </form>
      </div>

      {/* Benchmark Results */}
      {showResults && (
        <div className="bg-white rounded-xl border border-divider p-5">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-4 h-4 text-muted" />
            <h2 className="text-[14px] font-heading font-semibold text-ink">
              Salary Benchmark for &ldquo;{form.jobTitle}&rdquo;
            </h2>
          </div>

          {benchmarkLoading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="w-5 h-5 text-muted animate-spin" />
              <span className="text-[12px] text-muted ml-2">Loading benchmark data...</span>
            </div>
          ) : benchmark && benchmark.count > 0 ? (
            <div className="space-y-5">
              {/* Key Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <p className="text-[10px] text-muted uppercase tracking-wide">Average</p>
                  <p className="text-[16px] font-heading font-bold text-ink mt-0.5">
                    {formatKES(benchmark.average)}
                  </p>
                  <p className="text-[10px] text-muted">/month</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <p className="text-[10px] text-muted uppercase tracking-wide">Median</p>
                  <p className="text-[16px] font-heading font-bold text-ink mt-0.5">
                    {formatKES(benchmark.median)}
                  </p>
                  <p className="text-[10px] text-muted">/month</p>
                </div>
                <div className="bg-emerald-50 rounded-lg p-3 text-center">
                  <p className="text-[10px] text-muted uppercase tracking-wide">75th %ile</p>
                  <p className="text-[16px] font-heading font-bold text-emerald-700 mt-0.5">
                    {formatKES(benchmark.p75)}
                  </p>
                  <p className="text-[10px] text-muted">/month</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-3 text-center">
                  <p className="text-[10px] text-muted uppercase tracking-wide">Data Points</p>
                  <p className="text-[16px] font-heading font-bold text-blue-700 mt-0.5">
                    {benchmark.count}
                  </p>
                  <p className="text-[10px] text-muted">submissions</p>
                </div>
              </div>

              {/* Salary Range Bar */}
              <div>
                <p className="text-[11px] text-muted mb-2">Salary Range (Monthly KES)</p>
                <div className="relative h-6 bg-gray-100 rounded-full overflow-hidden">
                  <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-red-200 via-amber-200 to-emerald-200 rounded-full" />
                  <div className="absolute inset-y-0 left-1/2 w-0.5 bg-ink/30" />
                </div>
                <div className="flex justify-between mt-1 text-[10px] text-muted">
                  <span>{formatKES(benchmark.min)}</span>
                  <span>{formatKES(benchmark.max)}</span>
                </div>
              </div>

              {/* By Experience */}
              {benchmark.byExperience && benchmark.byExperience.length > 0 && (
                <div>
                  <p className="text-[12px] font-medium text-ink mb-2">
                    By Experience Level
                  </p>
                  <div className="space-y-2">
                    {benchmark.byExperience.map((exp) => (
                      <div key={exp.level} className="flex items-center gap-3">
                        <span className="text-[11px] text-muted w-24 shrink-0">
                          {exp.level}
                        </span>
                        <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden relative">
                          <div
                            className="h-full bg-blue-500 rounded-full transition-all"
                            style={{
                              width: `${Math.min(
                                (exp.average / Math.max(...benchmark.byExperience.map((e) => e.average))) * 100,
                                100
                              )}%`,
                            }}
                          />
                        </div>
                        <span className="text-[11px] font-medium text-ink w-20 text-right shrink-0">
                          {formatKES(exp.average)}
                        </span>
                        <span className="text-[10px] text-muted w-8 text-right shrink-0">
                          ({exp.count})
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* By County */}
              {benchmark.byCounty && benchmark.byCounty.length > 0 && (
                <div>
                  <p className="text-[12px] font-medium text-ink mb-2">By County</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {benchmark.byCounty.slice(0, 6).map((county) => (
                      <div
                        key={county.name}
                        className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2"
                      >
                        <span className="text-[11px] text-ink">{county.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-medium text-ink">
                            {formatKES(county.average)}
                          </span>
                          <span className="text-[10px] text-muted">
                            ({county.count})
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-[12px] text-muted">
                Not enough data for this role yet. Be among the first to contribute!
              </p>
            </div>
          )}
        </div>
      )}

      {/* Link to Public Guide */}
      <div className="flex items-center justify-center">
        <Link
          href="/salary-guide"
          className="inline-flex items-center gap-1.5 text-[12px] font-medium text-accent hover:text-accent-dark transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          View Full Kenya Salary Guide
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}
