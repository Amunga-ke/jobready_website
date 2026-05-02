"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  Bookmark,
  BookmarkX,
  ExternalLink,
  MapPin,
  Clock,
  Building2,
  Search,
  ArrowDownUp,
  StickyNote,
  X,
} from "lucide-react";

interface SavedJob {
  id: string;
  note: string | null;
  savedAt: string;
  job: {
    id: string;
    slug: string;
    title: string;
    companyName: string;
    location: string;
    county: string;
    employmentType: string;
    salaryMin: number | null;
    salaryMax: number | null;
    salaryCurrency: string;
    salaryPeriod?: string;
    deadline: string | null;
    applicationUrl?: string | null;
  };
}

type SortBy = "saved" | "deadline" | "salary";

export default function SavedJobsPage() {
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SortBy>("saved");
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [noteText, setNoteText] = useState("");

  const loadSavedJobs = useCallback(async () => {
    try {
      const res = await fetch("/api/dashboard/saved-jobs");
      if (res.ok) {
        const data = await res.json();
        setSavedJobs(data);
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSavedJobs();
  }, [loadSavedJobs]);

  const handleUnsave = async (listingId: string) => {
    try {
      const res = await fetch(`/api/dashboard/saved-jobs?listingId=${listingId}`, { method: "DELETE" });
      if (res.ok) {
        setSavedJobs((prev) => prev.filter((sj) => sj.job.id !== listingId));
      }
    } catch {
      // silently fail
    }
  };

  const handleSaveNote = async (listingId: string) => {
    try {
      const res = await fetch("/api/dashboard/saved-jobs", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId, note: noteText }),
      });
      if (res.ok) {
        setSavedJobs((prev) =>
          prev.map((sj) => (sj.job.id === listingId ? { ...sj, note: noteText || null } : sj))
        );
        setEditingNote(null);
      }
    } catch {
      // silently fail
    }
  };

  const sortedJobs = [...savedJobs].sort((a, b) => {
    switch (sortBy) {
      case "deadline":
        return (a.job.deadline ? new Date(a.job.deadline).getTime() : Infinity) -
               (b.job.deadline ? new Date(b.job.deadline).getTime() : Infinity);
      case "salary":
        return (b.job.salaryMax || 0) - (a.job.salaryMax || 0);
      default:
        return new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime();
    }
  });

  function formatSalary(job: SavedJob["job"]) {
    if (job.salaryMin == null || job.salaryMax == null) return "Not disclosed";
    return `${job.salaryCurrency} ${job.salaryMin.toLocaleString()} – ${job.salaryMax.toLocaleString()}${job.salaryPeriod ? `/${job.salaryPeriod}` : ""}`;
  }

  function daysUntil(dateStr: string | null): string | null {
    if (!dateStr) return null;
    const diff = Math.ceil((new Date(dateStr).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    if (diff < 0) return "Closed";
    if (diff === 0) return "Today";
    if (diff === 1) return "Tomorrow";
    return `${diff}d left`;
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-xl font-heading font-bold text-ink">Saved Jobs</h1>
        <p className="text-[13px] text-muted mt-1">
          Jobs you&apos;ve bookmarked for later. {savedJobs.length} saved.
        </p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-white rounded-xl border border-divider animate-pulse" />
          ))}
        </div>
      ) : savedJobs.length === 0 ? (
        <div className="bg-white rounded-xl border border-divider p-10 text-center">
          <Bookmark className="w-10 h-10 text-muted/30 mx-auto mb-3" />
          <h2 className="text-[14px] font-heading font-semibold text-ink mb-1">No saved jobs</h2>
          <p className="text-[12px] text-muted mb-4">Save jobs while browsing to keep track of them here.</p>
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
          {/* Sort */}
          <div className="flex items-center gap-2">
            <ArrowDownUp className="w-3.5 h-3.5 text-muted" />
            <span className="text-[11px] text-muted font-medium">Sort:</span>
            {(["saved", "deadline", "salary"] as SortBy[]).map((s) => (
              <button
                key={s}
                onClick={() => setSortBy(s)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium border transition-colors ${
                  sortBy === s
                    ? "border-accent bg-accent-bg text-accent"
                    : "border-divider text-muted hover:text-ink hover:border-ink/20"
                }`}
              >
                {s === "saved" ? "Date Saved" : s === "deadline" ? "Deadline" : "Salary"}
              </button>
            ))}
          </div>

          {/* Job list */}
          <div className="space-y-3">
            {sortedJobs.map((item) => {
              const deadline = daysUntil(item.job.deadline);
              return (
                <div key={item.id} className="bg-white rounded-xl border border-divider p-4 hover:border-ink/10 transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-[14px] font-medium text-ink truncate">
                        {item.job.title}
                      </h3>
                      <p className="text-[12px] text-muted mt-0.5">{item.job.companyName}</p>

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-[11px] text-muted">
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {item.job.location}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Building2 className="w-3 h-3" />
                          {item.job.employmentType}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatSalary(item.job)}
                        </span>
                        {deadline && (
                          <span className={deadline === "Closed" ? "text-red-500 font-medium" : "text-accent font-medium"}>
                            {deadline}
                          </span>
                        )}
                      </div>

                      {/* Note */}
                      {editingNote === item.job.id ? (
                        <div className="mt-3 flex gap-2">
                          <input
                            value={noteText}
                            onChange={(e) => setNoteText(e.target.value)}
                            placeholder="Add a note..."
                            className="flex-1 px-2.5 py-1.5 rounded-lg border border-divider bg-surface text-[12px] text-ink placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                            autoFocus
                          />
                          <button
                            onClick={() => handleSaveNote(item.job.id)}
                            className="px-3 py-1.5 rounded-lg bg-accent text-white text-[11px] font-medium hover:bg-accent-dark transition-colors"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingNote(null)}
                            className="p-1.5 rounded-lg hover:bg-ink/[0.04] text-muted transition-colors"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : item.note ? (
                        <p className="mt-2 text-[11px] text-muted bg-ink/[0.02] rounded-lg px-2.5 py-1.5">
                          {item.note}
                        </p>
                      ) : null}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => {
                          setEditingNote(item.job.id);
                          setNoteText(item.note || "");
                        }}
                        className="p-1.5 rounded-lg hover:bg-ink/[0.04] text-muted hover:text-ink transition-colors"
                        title="Add note"
                      >
                        <StickyNote className="w-3.5 h-3.5" />
                      </button>
                      <a
                        href={item.job.applicationUrl || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg hover:bg-accent-bg text-muted hover:text-accent transition-colors"
                        title="Apply"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                      <button
                        onClick={() => handleUnsave(item.job.id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-muted hover:text-red-500 transition-colors"
                        title="Remove"
                      >
                        <BookmarkX className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
