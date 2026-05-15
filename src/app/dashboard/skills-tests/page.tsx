"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FileCheck,
  Clock,
  HelpCircle,
  Target,
  Play,
  Trophy,
  Award,
  Loader2,
} from "lucide-react";

interface AvailableTest {
  id: string;
  title: string;
  description: string;
  category: string;
  durationMinutes: number;
  questionCount: number;
  passingScore: number;
}

interface TestResult {
  id: string;
  testId: string;
  testTitle: string;
  testCategory: string;
  listingTitle: string | null;
  percentage: number;
  passed: boolean;
  timeTaken: number;
  completedAt: string;
}

function getCategoryColor(category: string): string {
  switch (category?.toLowerCase()) {
    case "aptitude":
      return "bg-purple-50 text-purple-700 border-purple-100";
    case "english":
    case "language":
      return "bg-blue-50 text-blue-700 border-blue-100";
    case "it":
    case "technology":
      return "bg-emerald-50 text-emerald-700 border-emerald-100";
    default:
      return "bg-gray-50 text-gray-700 border-gray-100";
  }
}

function getScoreColor(score: number, passed: boolean): string {
  if (passed) return "text-emerald-700";
  return score >= 40 ? "text-amber-700" : "text-red-700";
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function SkillsTestsPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"available" | "results">("available");
  const [availableTests, setAvailableTests] = useState<AvailableTest[]>([]);
  const [results, setResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [completedTestIds, setCompletedTestIds] = useState<Set<string>>(new Set());
  const [startingTest, setStartingTest] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      const [testsRes, resultsRes] = await Promise.all([
        fetch("/api/skills-tests/available"),
        fetch("/api/skills-tests/results"),
      ]);

      if (testsRes.ok) {
        const data = await testsRes.json();
        setAvailableTests(Array.isArray(data) ? data : data.tests || []);
      }

      if (resultsRes.ok) {
        const data = await resultsRes.json();
        const resultsArr = Array.isArray(data) ? data : data.results || [];
        setResults(resultsArr);
        const ids = new Set<string>(resultsArr.map((r: TestResult) => r.testId));
        setCompletedTestIds(ids);
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleStartTest = async (testId: string) => {
    setStartingTest(testId);
    try {
      const res = await fetch(`/api/skills-tests/${testId}/start`, {
        method: "POST",
      });
      if (res.ok) {
        const data = await res.json();
        if (data.alreadyCompleted) {
          router.push("/dashboard/skills-tests");
          return;
        }
        router.push(`/dashboard/skills-tests/${testId}/take`);
      }
    } catch {
      // silently fail
    } finally {
      setStartingTest(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-heading font-bold text-ink">Skills Assessments</h1>
        <p className="text-[13px] text-muted mt-1">
          Take assessments to stand out to employers and showcase your abilities.
        </p>
      </div>

      {/* Intro Card */}
      <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border border-purple-100 p-5">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center shrink-0">
            <FileCheck className="w-5 h-5 text-purple-600" />
          </div>
          <div className="min-w-0">
            <h2 className="text-[14px] font-heading font-semibold text-ink">
              Why Take Assessments?
            </h2>
            <p className="text-[12px] text-muted mt-1">
              Skills assessments help you demonstrate your knowledge to employers. Completing
              tests with high scores adds verified badges to your profile, increasing your
              chances of getting shortlisted. Take tests in areas that match your career goals.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setTab("available")}
          className={`px-3 py-1.5 rounded-lg text-[12px] font-medium border transition-colors ${
            tab === "available"
              ? "border-accent bg-accent-bg text-accent"
              : "border-divider text-muted hover:text-ink hover:border-ink/20"
          }`}
        >
          Available Tests
          <span className="ml-1.5 text-[10px] opacity-70">({availableTests.length})</span>
        </button>
        <button
          onClick={() => setTab("results")}
          className={`px-3 py-1.5 rounded-lg text-[12px] font-medium border transition-colors ${
            tab === "results"
              ? "border-accent bg-accent-bg text-accent"
              : "border-divider text-muted hover:text-ink hover:border-ink/20"
          }`}
        >
          My Results
          <span className="ml-1.5 text-[10px] opacity-70">({results.length})</span>
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-28 bg-white rounded-xl border border-divider animate-pulse" />
          ))}
        </div>
      ) : tab === "available" ? (
        /* Available Tests */
        availableTests.length === 0 ? (
          <div className="bg-white rounded-xl border border-divider p-10 text-center">
            <FileCheck className="w-10 h-10 text-muted/30 mx-auto mb-3" />
            <h2 className="text-[14px] font-heading font-semibold text-ink mb-1">
              No tests available
            </h2>
            <p className="text-[12px] text-muted">
              New assessments are added regularly. Check back soon!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {availableTests.map((test) => {
              const isCompleted = completedTestIds.has(test.id);
              return (
                <div
                  key={test.id}
                  className={`bg-white rounded-xl border border-divider p-5 transition-colors hover:border-ink/10 ${
                    isCompleted ? "opacity-75" : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="min-w-0">
                      <h3 className="text-[13px] font-medium text-ink truncate">
                        {test.title}
                      </h3>
                      <span
                        className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium border mt-1 ${getCategoryColor(test.category)}`}
                      >
                        {test.category}
                      </span>
                    </div>
                    {isCompleted && (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-700 shrink-0">
                        <Trophy className="w-3 h-3" />
                        Done
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-muted line-clamp-2 mb-3">
                    {test.description}
                  </p>

                  <div className="flex items-center gap-3 text-[11px] text-muted mb-3">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {test.durationMinutes} min
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <HelpCircle className="w-3 h-3" />
                      {test.questionCount} questions
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Target className="w-3 h-3" />
                      {test.passingScore}% pass
                    </span>
                  </div>

                  {!isCompleted && (
                    <button
                      onClick={() => handleStartTest(test.id)}
                      disabled={startingTest === test.id}
                      className="inline-flex items-center gap-1.5 bg-ink text-white text-[12px] font-medium px-4 py-2 rounded-lg hover:bg-ink/90 transition-colors disabled:opacity-50"
                    >
                      {startingTest === test.id ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          Starting...
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5" />
                          Start Test
                        </>
                      )}
                    </button>
                  )}

                  {isCompleted && (
                    <p className="text-[11px] text-muted">
                      You&apos;ve already completed this test.
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )
      ) : /* My Results */
      results.length === 0 ? (
        <div className="bg-white rounded-xl border border-divider p-10 text-center">
          <Award className="w-10 h-10 text-muted/30 mx-auto mb-3" />
          <h2 className="text-[14px] font-heading font-semibold text-ink mb-1">
            No test results yet
          </h2>
          <p className="text-[12px] text-muted mb-4">
            Take your first assessment to see results here.
          </p>
          <button
            onClick={() => setTab("available")}
            className="inline-flex items-center gap-2 bg-ink text-white text-[12px] font-medium px-4 py-2 rounded-lg hover:bg-ink/90 transition-colors"
          >
            <FileCheck className="w-3.5 h-3.5" />
            Browse Tests
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-divider overflow-hidden">
          {/* Desktop table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-[12px]">
              <thead>
                <tr className="border-b border-divider bg-gray-50/50">
                  <th className="text-left px-4 py-3 font-medium text-muted">Test</th>
                  <th className="text-left px-4 py-3 font-medium text-muted">Listing</th>
                  <th className="text-left px-4 py-3 font-medium text-muted">Score</th>
                  <th className="text-left px-4 py-3 font-medium text-muted">Passed</th>
                  <th className="text-left px-4 py-3 font-medium text-muted">Time</th>
                  <th className="text-left px-4 py-3 font-medium text-muted">Date</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result) => (
                  <tr
                    key={result.id}
                    className="border-b border-divider last:border-0 hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-[13px] font-medium text-ink">{result.testTitle}</p>
                        <span
                          className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium border mt-0.5 ${getCategoryColor(result.testCategory)}`}
                        >
                          {result.testCategory}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted">
                      {result.listingTitle || (
                        <span className="text-muted/60">General</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-[13px] font-semibold ${getScoreColor(
                          result.percentage,
                          result.passed
                        )}`}
                      >
                        {result.percentage}%
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {result.passed ? (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                          <Trophy className="w-3 h-3" />
                          Passed
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-red-50 text-red-700 border border-red-100">
                          Failed
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-muted">
                      {formatTime(result.timeTaken)}
                    </td>
                    <td className="px-4 py-3 text-muted whitespace-nowrap">
                      {new Date(result.completedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="sm:hidden divide-y divide-divider">
            {results.map((result) => (
              <div key={result.id} className="px-4 py-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="text-[13px] font-medium text-ink truncate">
                      {result.testTitle}
                    </h3>
                    <span
                      className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium border mt-0.5 ${getCategoryColor(result.testCategory)}`}
                    >
                      {result.testCategory}
                    </span>
                  </div>
                  <span
                    className={`text-[14px] font-bold shrink-0 ${getScoreColor(
                      result.percentage,
                      result.passed
                    )}`}
                  >
                    {result.percentage}%
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-2 text-[11px] text-muted">
                  {result.passed ? (
                    <span className="text-emerald-600 font-medium flex items-center gap-1">
                      <Trophy className="w-3 h-3" /> Passed
                    </span>
                  ) : (
                    <span className="text-red-600 font-medium">Failed</span>
                  )}
                  <span>{formatTime(result.timeTaken)}</span>
                  <span>
                    {new Date(result.completedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
