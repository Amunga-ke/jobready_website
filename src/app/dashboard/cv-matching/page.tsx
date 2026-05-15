"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  Brain,
  Search,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  BarChart3,
  ArrowRight,
} from "lucide-react";

interface CvMatchResult {
  id: string;
  score: number;
  analysis: string;
  createdAt: string;
  listing: {
    title: string;
    companyName: string;
    slug: string;
  } | null;
}

interface ScoreBucket {
  range: string;
  count: number;
  percentage: number;
}

function getScoreColor(score: number): string {
  if (score >= 70) return "bg-emerald-100 text-emerald-700 border-emerald-200";
  if (score >= 50) return "bg-amber-100 text-amber-700 border-amber-200";
  return "bg-red-100 text-red-700 border-red-200";
}

function getScoreBarColor(score: number): string {
  if (score >= 70) return "bg-emerald-500";
  if (score >= 50) return "bg-amber-500";
  return "bg-red-500";
}

export default function CvMatchingPage() {
  const [results, setResults] = useState<CvMatchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const loadHistory = useCallback(async () => {
    try {
      const res = await fetch("/api/cv-match/history?limit=20");
      if (res.ok) {
        const data = await res.json();
        setResults(data.items || data || []);
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  // Calculate score distribution
  const getScoreDistribution = (): ScoreBucket[] => {
    if (results.length === 0) return [];
    const buckets = [
      { range: "90-100", min: 90, max: 100, count: 0 },
      { range: "70-89", min: 70, max: 89, count: 0 },
      { range: "50-69", min: 50, max: 69, count: 0 },
      { range: "30-49", min: 30, max: 49, count: 0 },
      { range: "0-29", min: 0, max: 29, count: 0 },
    ];
    results.forEach((r) => {
      for (const bucket of buckets) {
        if (r.score >= bucket.min && r.score <= bucket.max) {
          bucket.count++;
          break;
        }
      }
    });
    const maxCount = Math.max(...buckets.map((b) => b.count), 1);
    return buckets.map((b) => ({
      range: b.range,
      count: b.count,
      percentage: Math.round((b.count / maxCount) * 100),
    }));
  };

  const distribution = getScoreDistribution();
  const avgScore =
    results.length > 0
      ? Math.round(results.reduce((sum, r) => sum + r.score, 0) / results.length)
      : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-heading font-bold text-ink">CV Match Scores</h1>
        <p className="text-[13px] text-muted mt-1">
          AI-powered matching helps you understand how well your profile aligns with job requirements.
        </p>
      </div>

      {/* Intro Card */}
      <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl border border-emerald-100 p-5">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
            <Brain className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="min-w-0">
            <h2 className="text-[14px] font-heading font-semibold text-ink">
              AI CV Matching
            </h2>
            <p className="text-[12px] text-muted mt-1">
              Our AI analyzes your profile, skills, and experience against job requirements to
              give you a match score. Use these insights to improve your CV and apply for jobs
              where you have the best chance of success.
            </p>
            <Link
              href="/jobs"
              className="inline-flex items-center gap-1.5 text-[12px] font-medium text-emerald-600 hover:text-emerald-700 mt-3 transition-colors"
            >
              <Search className="w-3.5 h-3.5" />
              Find jobs to match
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 bg-white rounded-xl border border-divider animate-pulse" />
          ))}
        </div>
      ) : results.length === 0 ? (
        <div className="bg-white rounded-xl border border-divider p-10 text-center">
          <Brain className="w-10 h-10 text-muted/30 mx-auto mb-3" />
          <h2 className="text-[14px] font-heading font-semibold text-ink mb-1">
            No match scores yet
          </h2>
          <p className="text-[12px] text-muted mb-4">
            Start browsing jobs and get your CV scored to see match results here.
          </p>
          <Link
            href="/jobs"
            className="inline-flex items-center gap-2 bg-ink text-white text-[12px] font-medium px-4 py-2 rounded-lg hover:bg-ink/90 transition-colors"
          >
            <Search className="w-3.5 h-3.5" />
            Browse Jobs
          </Link>
        </div>
      ) : (
        <>
          {/* Stats Overview */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-white rounded-xl border border-divider p-4">
              <p className="text-[11px] text-muted">Total Matches</p>
              <p className="text-[20px] font-heading font-bold text-ink mt-0.5">
                {results.length}
              </p>
            </div>
            <div className="bg-white rounded-xl border border-divider p-4">
              <p className="text-[11px] text-muted">Average Score</p>
              <p className="text-[20px] font-heading font-bold text-ink mt-0.5">
                {avgScore}%
              </p>
            </div>
            <div className="bg-white rounded-xl border border-divider p-4 col-span-2 sm:col-span-1">
              <p className="text-[11px] text-muted">Top Match</p>
              <p className="text-[20px] font-heading font-bold text-emerald-600 mt-0.5">
                {Math.max(...results.map((r) => r.score))}%
              </p>
            </div>
          </div>

          {/* Score Distribution Chart */}
          <div className="bg-white rounded-xl border border-divider p-5">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-4 h-4 text-muted" />
              <h2 className="text-[14px] font-heading font-semibold text-ink">
                Score Distribution
              </h2>
            </div>
            <div className="space-y-2.5">
              {distribution.map((bucket) => (
                <div key={bucket.range} className="flex items-center gap-3">
                  <span className="text-[11px] text-muted w-12 text-right shrink-0">
                    {bucket.range}%
                  </span>
                  <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden relative">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        parseInt(bucket.range) >= 70
                          ? "bg-emerald-500"
                          : parseInt(bucket.range) >= 50
                          ? "bg-amber-500"
                          : "bg-red-500"
                      }`}
                      style={{ width: `${bucket.percentage}%` }}
                    />
                    {bucket.count > 0 && (
                      <span className="absolute inset-0 flex items-center justify-center text-[10px] font-medium text-ink">
                        {bucket.count}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-4 mt-3 pt-3 border-t border-divider">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-[10px] text-muted">70%+ Strong</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="text-[10px] text-muted">50-69% Fair</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <span className="text-[10px] text-muted">&lt;50% Weak</span>
              </div>
            </div>
          </div>

          {/* Match History Table */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-muted" />
                <h2 className="text-[14px] font-heading font-semibold text-ink">
                  Match History
                </h2>
              </div>
              <Link
                href="/jobs"
                className="inline-flex items-center gap-1 text-[11px] font-medium text-accent hover:text-accent-dark transition-colors"
              >
                Get New Score
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Desktop table */}
            <div className="hidden sm:block bg-white rounded-xl border border-divider overflow-hidden">
              <table className="w-full text-[12px]">
                <thead>
                  <tr className="border-b border-divider bg-gray-50/50">
                    <th className="text-left px-4 py-3 font-medium text-muted">Job Title</th>
                    <th className="text-left px-4 py-3 font-medium text-muted">Company</th>
                    <th className="text-left px-4 py-3 font-medium text-muted">Score</th>
                    <th className="text-left px-4 py-3 font-medium text-muted">Date</th>
                    <th className="text-left px-4 py-3 font-medium text-muted">AI Analysis</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result) => (
                    <tr key={result.id} className="border-b border-divider last:border-0 hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3">
                        {result.listing ? (
                          <Link
                            href={`/jobs/${result.listing.slug}`}
                            className="text-ink font-medium hover:text-accent transition-colors"
                          >
                            {result.listing.title}
                          </Link>
                        ) : (
                          <span className="text-muted">N/A</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-muted">
                        {result.listing?.companyName || "N/A"}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold border ${getScoreColor(result.score)}`}
                        >
                          {result.score}%
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted whitespace-nowrap">
                        {new Date(result.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() =>
                            setExpandedId(expandedId === result.id ? null : result.id)
                          }
                          className="inline-flex items-center gap-1 text-[11px] font-medium text-accent hover:text-accent-dark transition-colors"
                        >
                          {expandedId === result.id ? "Hide" : "View"}
                          {expandedId === result.id ? (
                            <ChevronUp className="w-3 h-3" />
                          ) : (
                            <ChevronDown className="w-3 h-3" />
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="sm:hidden space-y-2">
              {results.map((result) => (
                <div
                  key={result.id}
                  className="bg-white rounded-xl border border-divider p-4"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="text-[13px] font-medium text-ink truncate">
                        {result.listing?.title || "Unknown Job"}
                      </h3>
                      <p className="text-[11px] text-muted mt-0.5">
                        {result.listing?.companyName || "N/A"}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold border ${getScoreColor(result.score)}`}
                    >
                      {result.score}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[10px] text-muted">
                      {new Date(result.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                    <button
                      onClick={() =>
                        setExpandedId(expandedId === result.id ? null : result.id)
                      }
                      className="inline-flex items-center gap-1 text-[11px] font-medium text-accent"
                    >
                      {expandedId === result.id ? "Hide" : "View Analysis"}
                      {expandedId === result.id ? (
                        <ChevronUp className="w-3 h-3" />
                      ) : (
                        <ChevronDown className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                  {expandedId === result.id && (
                    <div className="mt-3 pt-3 border-t border-divider">
                      <p className="text-[12px] text-muted leading-relaxed">
                        {result.analysis}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Expanded Analysis (desktop) */}
            {expandedId && (
              <div className="hidden sm:block bg-white rounded-xl border border-divider p-4">
                {(() => {
                  const expanded = results.find((r) => r.id === expandedId);
                  if (!expanded) return null;
                  return (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-[13px] font-medium text-ink">
                          AI Analysis — {expanded.listing?.title}
                        </h3>
                        <button
                          onClick={() => setExpandedId(null)}
                          className="text-[11px] text-muted hover:text-ink"
                        >
                          Close
                        </button>
                      </div>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 rounded-full border-4 border-gray-100 flex items-center justify-center relative">
                          <svg className="absolute inset-0 -rotate-90" viewBox="0 0 48 48">
                            <circle
                              cx="24"
                              cy="24"
                              r="20"
                              fill="none"
                              stroke="#e5e7eb"
                              strokeWidth="4"
                            />
                            <circle
                              cx="24"
                              cy="24"
                              r="20"
                              fill="none"
                              stroke={expanded.score >= 70 ? "#10b981" : expanded.score >= 50 ? "#f59e0b" : "#ef4444"}
                              strokeWidth="4"
                              strokeDasharray={`${(expanded.score / 100) * 125.6} 125.6`}
                              strokeLinecap="round"
                            />
                          </svg>
                          <span className="text-[11px] font-bold text-ink relative z-10">
                            {expanded.score}%
                          </span>
                        </div>
                      </div>
                      <p className="text-[12px] text-muted leading-relaxed">
                        {expanded.analysis}
                      </p>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
