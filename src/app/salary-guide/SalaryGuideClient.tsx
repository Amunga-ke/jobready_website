"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Search,
  MapPin,
  BarChart3,
  TrendingUp,
  Users,
  Briefcase,
  ChevronDown,
  Plus,
  ArrowRight,
  DollarSign,
} from "lucide-react";
import { KE_COUNTIES, ORG_INDUSTRIES } from "@/lib/constants";

// ─── Types ───

interface SalaryData {
  average: number;
  median: number;
  min: number;
  max: number;
  p25: number;
  p75: number;
  count: number;
  period: string;
  distribution: Array<{ range: string; count: number }>;
  byCounty: Array<{ county: string; average: number; count: number }>;
  byExperience: Array<{ level: string; average: number; count: number }>;
}

interface TopTitle {
  jobTitle: string;
  count: number;
  averageSalary: number;
}

// ─── Helpers ───

function formatKES(amount: number): string {
  if (amount >= 1_000_000) {
    return `KES ${(amount / 1_000_000).toFixed(1)}M`;
  }
  if (amount >= 1_000) {
    return `KES ${Math.round(amount / 1_000).toLocaleString()}K`;
  }
  return `KES ${amount.toLocaleString()}`;
}

function formatKESFull(amount: number): string {
  return `KES ${Math.round(amount).toLocaleString()}`;
}

const EXPERIENCE_LEVELS = [
  { value: "", label: "All Levels" },
  { value: "ENTRY_LEVEL", label: "Entry Level" },
  { value: "MID_LEVEL", label: "Mid Level" },
  { value: "SENIOR", label: "Senior" },
  { value: "MANAGER", label: "Manager" },
  { value: "DIRECTOR", label: "Director" },
  { value: "EXECUTIVE", label: "Executive" },
];

// ─── Component ───

export default function SalaryGuideClient() {
  // Filters
  const [jobTitle, setJobTitle] = useState("");
  const [county, setCounty] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [industry, setIndustry] = useState("");

  // Data
  const [salaryData, setSalaryData] = useState<SalaryData | null>(null);
  const [topTitles, setTopTitles] = useState<TopTitle[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchSalaryData = useCallback(async (signal?: AbortSignal) => {
    try {
      setLoadingMore(true);
      const params = new URLSearchParams();
      if (jobTitle) params.set("jobTitle", jobTitle);
      if (county) params.set("county", county);
      if (experienceLevel) params.set("experienceLevel", experienceLevel);
      if (industry) params.set("industry", industry);

      const res = await fetch(`/api/salary/data?${params.toString()}`, { signal });
      if (!res.ok) throw new Error("Failed to fetch");
      const data: SalaryData = await res.json();
      setSalaryData(data);
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      console.error("Failed to fetch salary data:", err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [jobTitle, county, experienceLevel, industry]);

  useEffect(() => {
    const controller = new AbortController();
    fetchSalaryData(controller.signal);
    return () => controller.abort();
  }, [fetchSalaryData]);

  useEffect(() => {
    fetch("/api/salary/top-titles?limit=15")
      .then((res) => res.json())
      .then((data: TopTitle[]) => setTopTitles(data))
      .catch(() => {});
  }, []);

  // Active filter count
  const activeFilters = [jobTitle, county, experienceLevel, industry].filter(Boolean).length;

  const clearFilters = () => {
    setJobTitle("");
    setCounty("");
    setExperienceLevel("");
    setIndustry("");
  };

  return (
    <div className="max-w-4xl mx-auto px-5 py-16 md:py-20">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-[12px] text-muted mb-8">
        <Link href="/" className="hover:text-ink transition-colors">Home</Link>
        <span className="text-divider">/</span>
        <span className="text-ink font-medium">Salary Guide</span>
      </nav>

      {/* Hero Section */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-3">
          <BarChart3 className="w-6 h-6 text-accent" />
          <span className="text-[12px] font-medium text-accent uppercase tracking-wider">
            Salary Intelligence
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-heading font-black text-ink mb-3">
          Kenya Salary Guide 2025
        </h1>
        <p className="text-[15px] text-muted leading-relaxed max-w-2xl">
          Explore real salary data shared by professionals across Kenya. Compare
          compensation by job title, location, experience, and industry to
          negotiate your next offer with confidence.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="rounded-xl border border-divider p-4 md:p-5 mb-8 bg-surface">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[14px] font-semibold text-ink">Filter Salaries</h2>
          {activeFilters > 0 && (
            <button
              onClick={clearFilters}
              className="text-[12px] text-accent hover:text-accent-dark transition-colors font-medium"
            >
              Clear all ({activeFilters})
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Job Title Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
            <input
              type="text"
              placeholder="Job title..."
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-divider text-[13px] text-ink placeholder:text-muted/60 bg-white focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors"
            />
          </div>

          {/* County Select */}
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
            <select
              value={county}
              onChange={(e) => setCounty(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 rounded-lg border border-divider text-[13px] text-ink bg-white focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent appearance-none transition-colors"
            >
              <option value="">All Counties</option>
              {KE_COUNTIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted pointer-events-none" />
          </div>

          {/* Experience Level Select */}
          <div className="relative">
            <TrendingUp className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
            <select
              value={experienceLevel}
              onChange={(e) => setExperienceLevel(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 rounded-lg border border-divider text-[13px] text-ink bg-white focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent appearance-none transition-colors"
            >
              {EXPERIENCE_LEVELS.map((l) => (
                <option key={l.value} value={l.value}>
                  {l.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted pointer-events-none" />
          </div>

          {/* Industry Select */}
          <div className="relative">
            <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 rounded-lg border border-divider text-[13px] text-ink bg-white focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent appearance-none transition-colors"
            >
              <option value="">All Industries</option>
              {ORG_INDUSTRIES.map((ind) => (
                <option key={ind.value} value={ind.value}>
                  {ind.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Submit CTA */}
      <div className="rounded-xl border border-accent/20 bg-accent-bg/30 p-5 md:p-6 mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-[15px] font-semibold text-ink mb-1">
            Know your worth? Share your salary.
          </h3>
          <p className="text-[13px] text-muted">
            Help other professionals make informed decisions. Your submission is
            anonymous and contributes to our growing dataset.
          </p>
        </div>
        <Link
          href="/dashboard/salary"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-ink text-white text-[13px] font-medium hover:bg-ink/90 transition-colors whitespace-nowrap shrink-0"
        >
          <Plus className="w-4 h-4" />
          Submit Your Salary
        </Link>
      </div>

      {/* Loading State */}
      {loading && !salaryData && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-xl border border-divider p-5 animate-pulse">
                <div className="h-3 bg-muted/20 rounded w-16 mb-3" />
                <div className="h-7 bg-muted/20 rounded w-24" />
              </div>
            ))}
          </div>
          <div className="rounded-xl border border-divider p-6 h-64 animate-pulse bg-muted/5" />
        </div>
      )}

      {/* Salary Data Display */}
      {salaryData && (
        <>
          {/* No Data State */}
          {salaryData.count === 0 && !loading && (
            <div className="text-center py-16 mb-10">
              <div className="w-16 h-16 rounded-full bg-muted/10 flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-muted" />
              </div>
              <h3 className="text-[16px] font-semibold text-ink mb-2">
                No data yet
              </h3>
              <p className="text-[13px] text-muted max-w-sm mx-auto mb-4">
                We&apos;re still collecting salary data for these filters. Be
                among the first to contribute and help others!
              </p>
              <Link
                href="/dashboard/salary"
                className="inline-flex items-center gap-2 text-[13px] font-medium text-accent hover:text-accent-dark transition-colors"
              >
                Submit your salary <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}

          {salaryData.count > 0 && (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="rounded-xl border border-divider p-5">
                  <div className="flex items-center gap-1.5 mb-2">
                    <DollarSign className="w-4 h-4 text-accent" />
                    <span className="text-[11px] text-muted uppercase tracking-wider font-medium">
                      Average
                    </span>
                  </div>
                  <p className="text-xl md:text-2xl font-heading font-black text-ink">
                    {formatKES(salaryData.average)}
                  </p>
                  <p className="text-[11px] text-muted mt-1">
                    per month
                  </p>
                </div>

                <div className="rounded-xl border border-divider p-5">
                  <div className="flex items-center gap-1.5 mb-2">
                    <TrendingUp className="w-4 h-4 text-accent" />
                    <span className="text-[11px] text-muted uppercase tracking-wider font-medium">
                      Median
                    </span>
                  </div>
                  <p className="text-xl md:text-2xl font-heading font-black text-ink">
                    {formatKES(salaryData.median)}
                  </p>
                  <p className="text-[11px] text-muted mt-1">
                    per month
                  </p>
                </div>

                <div className="rounded-xl border border-divider p-5">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Users className="w-4 h-4 text-accent" />
                    <span className="text-[11px] text-muted uppercase tracking-wider font-medium">
                      Data Points
                    </span>
                  </div>
                  <p className="text-xl md:text-2xl font-heading font-black text-ink">
                    {salaryData.count.toLocaleString()}
                  </p>
                  <p className="text-[11px] text-muted mt-1">
                    submissions
                  </p>
                </div>

                <div className="rounded-xl border border-divider p-5">
                  <div className="flex items-center gap-1.5 mb-2">
                    <BarChart3 className="w-4 h-4 text-accent" />
                    <span className="text-[11px] text-muted uppercase tracking-wider font-medium">
                      P75
                    </span>
                  </div>
                  <p className="text-xl md:text-2xl font-heading font-black text-ink">
                    {formatKES(salaryData.p75)}
                  </p>
                  <p className="text-[11px] text-muted mt-1">
                    75th percentile
                  </p>
                </div>
              </div>

              {/* Salary Range Bar */}
              <div className="rounded-xl border border-divider p-5 md:p-6 mb-8">
                <h3 className="text-[14px] font-semibold text-ink mb-4">
                  Salary Range
                </h3>
                <div className="space-y-3">
                  {/* Min */}
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] text-muted">Minimum</span>
                    <span className="text-[13px] font-semibold text-ink">
                      {formatKESFull(salaryData.min)}
                    </span>
                  </div>
                  {/* Visual bar */}
                  <div className="relative h-3 rounded-full bg-muted/15 overflow-hidden">
                    {/* P25 marker */}
                    {salaryData.max > salaryData.min && (
                      <div
                        className="absolute top-0 h-full bg-accent/20 rounded-l-full"
                        style={{
                          width: `${((salaryData.p25 - salaryData.min) / (salaryData.max - salaryData.min)) * 100}%`,
                        }}
                      />
                    )}
                    {/* Average marker */}
                    {salaryData.max > salaryData.min && (
                      <div
                        className="absolute top-0 h-full bg-accent/50 rounded-l-full"
                        style={{
                          width: `${((salaryData.average - salaryData.min) / (salaryData.max - salaryData.min)) * 100}%`,
                        }}
                      />
                    )}
                    {/* P75 marker */}
                    {salaryData.max > salaryData.min && (
                      <div
                        className="absolute top-0 h-full bg-accent/30 rounded-l-full"
                        style={{
                          width: `${((salaryData.p75 - salaryData.min) / (salaryData.max - salaryData.min)) * 100}%`,
                        }}
                      />
                    )}
                    {/* Full gradient bar */}
                    <div
                      className="absolute top-0.5 h-2 rounded-full bg-gradient-to-r from-emerald-200 via-emerald-400 to-emerald-600 opacity-60"
                      style={{
                        left: "0%",
                        width: "100%",
                      }}
                    />
                  </div>
                  {/* Legend */}
                  <div className="flex flex-wrap gap-4 text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-accent/20" />
                      <span className="text-muted">P25: {formatKES(salaryData.p25)}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-accent/50" />
                      <span className="text-muted">Avg: {formatKES(salaryData.average)}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-accent/30" />
                      <span className="text-muted">P75: {formatKES(salaryData.p75)}</span>
                    </div>
                  </div>
                  {/* Max */}
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] text-muted">Maximum</span>
                    <span className="text-[13px] font-semibold text-ink">
                      {formatKESFull(salaryData.max)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Distribution Histogram */}
              {salaryData.distribution.length > 0 && (
                <div className="rounded-xl border border-divider p-5 md:p-6 mb-8">
                  <h3 className="text-[14px] font-semibold text-ink mb-4">
                    Salary Distribution
                  </h3>
                  <div className="space-y-2">
                    {salaryData.distribution
                      .filter((d) => d.count > 0)
                      .map((d) => {
                        const maxCount = Math.max(
                          ...salaryData.distribution.map((x) => x.count)
                        );
                        const pct =
                          maxCount > 0
                            ? (d.count / maxCount) * 100
                            : 0;
                        return (
                          <div
                            key={d.range}
                            className="flex items-center gap-3"
                          >
                            <span className="text-[11px] text-muted w-24 sm:w-28 shrink-0 text-right">
                              {d.range}
                            </span>
                            <div className="flex-1 h-6 bg-muted/10 rounded overflow-hidden relative">
                              <div
                                className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded transition-all duration-500 ease-out"
                                style={{ width: `${Math.max(pct, 2)}%` }}
                              />
                              <span className="absolute inset-0 flex items-center justify-end pr-2 text-[11px] font-medium text-ink">
                                {d.count}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                  <p className="text-[11px] text-muted mt-3">
                    All amounts normalized to monthly KES
                  </p>
                </div>
              )}

              {/* Top Paying Counties Table */}
              {salaryData.byCounty.length > 0 && (
                <div className="rounded-xl border border-divider p-5 md:p-6 mb-8">
                  <h3 className="text-[14px] font-semibold text-ink mb-4">
                    Salary by County
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-[13px]">
                      <thead>
                        <tr className="border-b border-divider">
                          <th className="text-left py-2 pr-4 font-medium text-muted">
                            County
                          </th>
                          <th className="text-left py-2 pr-4 font-medium text-muted">
                            Avg. Salary
                          </th>
                          <th className="text-right py-2 font-medium text-muted">
                            Submissions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {salaryData.byCounty.slice(0, 10).map((item, idx) => (
                          <tr
                            key={item.county}
                            className="border-b border-divider/50 last:border-0"
                          >
                            <td className="py-2.5 pr-4">
                              <div className="flex items-center gap-2">
                                <span className="text-[11px] text-muted w-4">
                                  {idx + 1}
                                </span>
                                <span className="text-ink font-medium">
                                  {item.county}
                                </span>
                              </div>
                            </td>
                            <td className="py-2.5 pr-4 text-ink">
                              {formatKESFull(item.average)}
                            </td>
                            <td className="py-2.5 text-right text-muted">
                              {item.count}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Salary by Experience Level Table */}
              {salaryData.byExperience.length > 0 && (
                <div className="rounded-xl border border-divider p-5 md:p-6 mb-8">
                  <h3 className="text-[14px] font-semibold text-ink mb-4">
                    Salary by Experience Level
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-[13px]">
                      <thead>
                        <tr className="border-b border-divider">
                          <th className="text-left py-2 pr-4 font-medium text-muted">
                            Level
                          </th>
                          <th className="text-left py-2 pr-4 font-medium text-muted">
                            Avg. Salary
                          </th>
                          <th className="text-right py-2 font-medium text-muted">
                            Submissions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {salaryData.byExperience.map((item) => (
                          <tr
                            key={item.level}
                            className="border-b border-divider/50 last:border-0"
                          >
                            <td className="py-2.5 pr-4 text-ink font-medium">
                              {item.level.replace(/_/g, " ")}
                            </td>
                            <td className="py-2.5 pr-4 text-ink">
                              {formatKESFull(item.average)}
                            </td>
                            <td className="py-2.5 text-right text-muted">
                              {item.count}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Loading overlay for filter changes */}
          {loadingMore && salaryData && (
            <div className="flex items-center justify-center py-6">
              <div className="w-5 h-5 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
              <span className="ml-2 text-[13px] text-muted">
                Updating...
              </span>
            </div>
          )}
        </>
      )}

      {/* Top Job Titles */}
      <div className="rounded-xl border border-divider p-5 md:p-6 mb-8">
        <h3 className="text-[14px] font-semibold text-ink mb-4">
          Most Reported Job Titles
        </h3>
        {topTitles.length === 0 && (
          <div className="text-center py-8">
            <p className="text-[13px] text-muted">
              No titles reported yet. Be the first to{" "}
              <Link
                href="/dashboard/salary"
                className="text-accent hover:text-accent-dark underline transition-colors"
              >
                share your salary
              </Link>
              .
            </p>
          </div>
        )}
        {topTitles.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {topTitles.map((title) => (
              <div
                key={title.jobTitle}
                className="rounded-lg border border-divider/60 p-4 hover:border-accent/30 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold text-ink truncate">
                      {title.jobTitle}
                    </p>
                    <p className="text-[12px] text-accent font-medium mt-0.5">
                      {formatKES(title.averageSalary)}
                      <span className="text-muted font-normal"> /month</span>
                    </p>
                  </div>
                  <span className="text-[11px] text-muted bg-muted/50 px-2 py-0.5 rounded-full shrink-0">
                    {title.count} {title.count === 1 ? "report" : "reports"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      <div className="rounded-xl border border-accent/20 bg-accent-bg/30 p-6 text-center">
        <h2 className="text-lg font-heading font-bold text-ink mb-2">
          Contribute to Kenya&apos;s Salary Data
        </h2>
        <p className="text-[14px] text-muted mb-4 max-w-md mx-auto">
          Your anonymous salary submission helps thousands of job seekers
          negotiate fair compensation. It takes less than a minute.
        </p>
        <Link
          href="/dashboard/salary"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-ink text-white text-[14px] font-medium hover:bg-ink/90 transition-colors"
        >
          Submit Your Salary
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
