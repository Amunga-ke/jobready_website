"use client";

import { useEffect, useState, useCallback, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  Send,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Trophy,
  X,
  ArrowRight,
  RotateCcw,
} from "lucide-react";
import { toast } from "sonner";

interface Question {
  id: string;
  questionText: string;
  options: string[];
  type: string;
}

interface TestInfo {
  id: string;
  title: string;
  category: string;
  durationMinutes: number;
  passingScore: number;
}

interface TestResult {
  id: string;
  percentage: number;
  passed: boolean;
  timeTaken: number;
  questionBreakdown: {
    questionId: string;
    questionText: string;
    selectedAnswer: string | null;
    correctAnswer: string;
    isCorrect: boolean;
    explanation: string | null;
  }[];
}

function formatTimer(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

function formatTimeTaken(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m === 0) return `${s}s`;
  if (s === 0) return `${m}m`;
  return `${m}m ${s}s`;
}

export default function TakeTestPage({
  params,
}: {
  params: Promise<{ testId: string }>;
}) {
  const { testId } = use(params);
  const router = useRouter();

  // States
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [testInfo, setTestInfo] = useState<TestInfo | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentQ, setCurrentQ] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [startedAt, setStartedAt] = useState<number>(0);
  const [result, setResult] = useState<TestResult | null>(null);
  const [autoSubmitted, setAutoSubmitted] = useState(false);

  // Load test
  const loadTest = useCallback(async () => {
    try {
      const res = await fetch(`/api/skills-tests/${testId}/start`, {
        method: "POST",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        if (data.alreadyCompleted) {
          setResult({
            id: data.resultId || "",
            percentage: data.percentage || 0,
            passed: data.passed || false,
            timeTaken: data.timeTaken || 0,
            questionBreakdown: [],
          });
          setLoading(false);
          return;
        }
        setError(data.error || "Failed to start test");
        setLoading(false);
        return;
      }
      const data = await res.json();
      setTestInfo({
        id: data.testId || testId,
        title: data.testTitle || "Assessment",
        category: data.testCategory || "",
        durationMinutes: data.durationMinutes || 15,
        passingScore: data.passingScore || 60,
      });
      setQuestions(data.questions || []);
      setTimeLeft((data.durationMinutes || 15) * 60);
      setStartedAt(Date.now());
    } catch {
      setError("Failed to load test. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [testId]);

  useEffect(() => {
    loadTest();
  }, [loadTest]);

  // Timer
  useEffect(() => {
    if (result || loading || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [result, loading, timeLeft]);

  // Auto-submit on timer expiry
  useEffect(() => {
    if (timeLeft === 0 && !result && !submitting && !loading && questions.length > 0) {
      setAutoSubmitted(true);
      handleSubmitTest();
    }
  }, [timeLeft, result, submitting, loading, questions.length]);

  const handleAnswer = (questionId: string, option: string) => {
    if (result) return;
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const handleSubmitTest = async () => {
    if (submitting) return;
    setSubmitting(true);
    setShowConfirm(false);

    const timeTaken = Math.round((Date.now() - startedAt) / 1000);

    try {
      const res = await fetch(`/api/skills-tests/${testId}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers: Object.entries(answers).map(([questionId, selectedAnswer]) => ({
            questionId,
            selectedAnswer,
          })),
          timeTaken,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setResult({
          id: data.id || "",
          percentage: data.percentage || 0,
          passed: data.passed || false,
          timeTaken: data.timeTaken || timeTaken,
          questionBreakdown: data.questionBreakdown || [],
        });
        if (autoSubmitted) {
          toast.info("Time expired! Test submitted automatically.");
        } else {
          toast.success("Test submitted successfully!");
        }
      } else {
        toast.error("Failed to submit test. Please try again.");
        setSubmitting(false);
      }
    } catch {
      toast.error("Something went wrong.");
      setSubmitting(false);
    }
  };

  const answeredCount = Object.keys(answers).length;
  const totalQuestions = questions.length;
  const progressPercent = totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0;
  const isTimerLow = timeLeft <= 60 && timeLeft > 0;

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-ink/20 border-t-ink rounded-full animate-spin mx-auto mb-3" />
          <p className="text-[13px] text-muted">Loading test...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-20">
        <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto mb-3" />
        <h2 className="text-[14px] font-heading font-semibold text-ink mb-1">
          Error
        </h2>
        <p className="text-[12px] text-muted mb-4">{error}</p>
        <Link
          href="/dashboard/skills-tests"
          className="inline-flex items-center gap-2 bg-ink text-white text-[12px] font-medium px-4 py-2 rounded-lg hover:bg-ink/90 transition-colors"
        >
          <ArrowRight className="w-3.5 h-3.5" />
          Back to Tests
        </Link>
      </div>
    );
  }

  // Results view
  if (result) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-xl font-heading font-bold text-ink">Test Results</h1>
          <p className="text-[13px] text-muted mt-1">{testInfo?.title}</p>
        </div>

        {/* Score Card */}
        <div
          className={`rounded-xl border p-6 text-center ${
            result.passed
              ? "bg-emerald-50 border-emerald-200"
              : "bg-red-50 border-red-200"
          }`}
        >
          {/* Circular Score Indicator */}
          <div className="w-28 h-28 mx-auto mb-4 relative">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className="text-black/5"
              />
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke={result.passed ? "#10b981" : "#ef4444"}
                strokeWidth="8"
                strokeDasharray={`${(result.percentage / 100) * 263.89} 263.89`}
                strokeLinecap="round"
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[24px] font-heading font-bold text-ink">
                {result.percentage}%
              </span>
            </div>
          </div>

          {result.passed ? (
            <div className="flex items-center justify-center gap-2 mb-2">
              <Trophy className="w-5 h-5 text-emerald-600" />
              <span className="text-[16px] font-heading font-semibold text-emerald-700">
                Passed!
              </span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2 mb-2">
              <XCircle className="w-5 h-5 text-red-500" />
              <span className="text-[16px] font-heading font-semibold text-red-700">
                Not Passed
              </span>
            </div>
          )}

          <p className="text-[12px] text-muted">
            Passing score: {testInfo?.passingScore}% &middot; Time taken:{" "}
            {formatTimeTaken(result.timeTaken)}
          </p>
        </div>

        {/* Question Breakdown */}
        {result.questionBreakdown.length > 0 && (
          <div className="bg-white rounded-xl border border-divider overflow-hidden">
            <div className="p-4 border-b border-divider">
              <h2 className="text-[14px] font-heading font-semibold text-ink">
                Question Breakdown
              </h2>
              <p className="text-[11px] text-muted mt-0.5">
                {result.questionBreakdown.filter((q) => q.isCorrect).length} of{" "}
                {result.questionBreakdown.length} correct
              </p>
            </div>
            <div className="divide-y divide-divider">
              {result.questionBreakdown.map((q, idx) => (
                <div key={q.questionId} className="p-4">
                  <div className="flex items-start gap-2 mb-2">
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                        q.isCorrect
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {q.isCorrect ? (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[12px] font-medium text-ink">
                        Q{idx + 1}. {q.questionText}
                      </p>

                      {q.selectedAnswer && !q.isCorrect && (
                        <p className="text-[11px] text-red-600 mt-1">
                          Your answer: {q.selectedAnswer}
                        </p>
                      )}

                      <p className="text-[11px] text-emerald-600 mt-0.5">
                        Correct answer: {q.correctAnswer}
                      </p>

                      {q.explanation && (
                        <p className="text-[11px] text-muted mt-1.5 bg-gray-50 rounded-lg px-3 py-2">
                          {q.explanation}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-center gap-3">
          <Link
            href="/dashboard/skills-tests"
            className="inline-flex items-center gap-2 bg-ink text-white text-[12px] font-medium px-4 py-2 rounded-lg hover:bg-ink/90 transition-colors"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            Back to Tests
          </Link>
        </div>
      </div>
    );
  }

  // Test-taking view
  const currentQuestion = questions[currentQ];

  return (
    <div className="space-y-5">
      {/* Test Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-heading font-bold text-ink">
            {testInfo?.title}
          </h1>
          <p className="text-[11px] text-muted mt-0.5">
            Question {currentQ + 1} of {totalQuestions}
          </p>
        </div>
        <div
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-mono font-semibold ${
            isTimerLow
              ? "bg-red-50 text-red-600 animate-pulse"
              : "bg-gray-100 text-ink"
          }`}
        >
          <Clock className="w-4 h-4" />
          {formatTimer(timeLeft)}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-gray-100 rounded-full h-2 overflow-hidden">
        <div
          className="h-full bg-accent rounded-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
      <p className="text-[10px] text-muted -mt-2">
        {answeredCount} of {totalQuestions} answered
      </p>

      {/* Question */}
      {currentQuestion && (
        <div className="bg-white rounded-xl border border-divider p-5">
          <p className="text-[14px] font-medium text-ink leading-relaxed mb-5">
            <span className="text-accent font-semibold mr-2">Q{currentQ + 1}.</span>
            {currentQuestion.questionText}
          </p>

          <div className="space-y-2.5">
            {currentQuestion.options.map((option, idx) => {
              const isSelected = answers[currentQuestion.id] === option;
              const optionLetter = String.fromCharCode(65 + idx);
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleAnswer(currentQuestion.id, option)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border text-left text-[13px] transition-colors ${
                    isSelected
                      ? "border-accent bg-accent-bg text-ink ring-1 ring-accent/30"
                      : "border-divider text-muted hover:text-ink hover:border-ink/20"
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-[11px] font-semibold shrink-0 ${
                      isSelected
                        ? "border-accent bg-accent text-white"
                        : "border-gray-300 text-muted"
                    }`}
                  >
                    {isSelected ? (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    ) : (
                      optionLetter
                    )}
                  </span>
                  {option}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentQ(Math.max(0, currentQ - 1))}
          disabled={currentQ === 0}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-[12px] font-medium border border-divider text-muted hover:text-ink hover:border-ink/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </button>

        <div className="flex items-center gap-1.5">
          {questions.map((q, idx) => (
            <button
              key={q.id}
              onClick={() => setCurrentQ(idx)}
              className={`w-7 h-7 rounded-lg text-[10px] font-medium transition-colors ${
                idx === currentQ
                  ? "bg-accent text-white"
                  : answers[q.id]
                  ? "bg-accent-bg text-accent border border-accent/30"
                  : "bg-gray-100 text-muted hover:bg-gray-200"
              }`}
              title={`Question ${idx + 1}`}
            >
              {idx + 1}
            </button>
          ))}
        </div>

        {currentQ < totalQuestions - 1 ? (
          <button
            onClick={() => setCurrentQ(currentQ + 1)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-[12px] font-medium bg-ink text-white hover:bg-ink/90 transition-colors"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={() => {
              if (answeredCount < totalQuestions) {
                setShowConfirm(true);
              } else {
                handleSubmitTest();
              }
            }}
            disabled={submitting || answeredCount === 0}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-[12px] font-medium bg-emerald-600 text-white hover:bg-emerald-700 transition-colors disabled:opacity-50"
          >
            {submitting ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                Submit Test
              </>
            )}
          </button>
        )}
      </div>

      {/* Confirm Dialog */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowConfirm(false)}
          />
          <div className="relative bg-white rounded-xl border border-divider p-6 w-full max-w-sm shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <h3 className="text-[14px] font-heading font-semibold text-ink">
                  Submit Test?
                </h3>
                <p className="text-[11px] text-muted mt-0.5">
                  You have answered {answeredCount} of {totalQuestions} questions.
                  {totalQuestions - answeredCount > 0 &&
                    ` ${totalQuestions - answeredCount} question${totalQuestions - answeredCount > 1 ? "s" : ""} unanswered.`}
                </p>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 px-4 py-2 rounded-lg text-[12px] font-medium border border-divider text-muted hover:text-ink transition-colors"
              >
                Continue Test
              </button>
              <button
                onClick={handleSubmitTest}
                className="flex-1 px-4 py-2 rounded-lg text-[12px] font-medium bg-ink text-white hover:bg-ink/90 transition-colors"
              >
                Submit Anyway
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
