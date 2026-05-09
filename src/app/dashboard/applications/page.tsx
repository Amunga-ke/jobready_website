"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  FileText,
  Search,
  ExternalLink,
  Eye,
  RotateCcw,
} from "lucide-react";

interface Application {
  id: string;
  status: string;
  appliedAt: string;
  updatedAt: string;
  coverLetter: string | null;
  job: {
    id: string;
    slug: string;
    title: string;
    companyName: string;
    location: string;
    applicationUrl?: string | null;
  };
}

const STATUS_COLORS: Record<string, string> = {
  SUBMITTED: "bg-blue-50 text-blue-700 border-blue-100",
  VIEWED: "bg-cyan-50 text-cyan-700 border-cyan-100",
  SHORTLISTED: "bg-amber-50 text-amber-700 border-amber-100",
  INTERVIEW: "bg-purple-50 text-purple-700 border-purple-100",
  OFFERED: "bg-emerald-50 text-emerald-700 border-emerald-100",
  REJECTED: "bg-red-50 text-red-700 border-red-100",
  WITHDRAWN: "bg-gray-100 text-gray-600 border-gray-200",
  DRAFT: "bg-gray-50 text-gray-600 border-gray-100",
};

const STATUS_LABELS: Record<string, string> = {
  SUBMITTED: "Submitted",
  VIEWED: "Viewed",
  SHORTLISTED: "Shortlisted",
  INTERVIEW: "Interview",
  OFFERED: "Offered",
  REJECTED: "Rejected",
  WITHDRAWN: "Withdrawn",
  DRAFT: "Draft",
};

type FilterTab = "all" | "active" | "closed";

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<FilterTab>("all");

  const loadApplications = useCallback(async () => {
    try {
      const res = await fetch("/api/dashboard/applications");
      if (res.ok) {
        const data = await res.json();
        setApplications(data);
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadApplications();
  }, [loadApplications]);

  const handleWithdraw = async (id: string) => {
    if (!confirm("Are you sure you want to withdraw this application?")) return;
    try {
      const res = await fetch(`/api/dashboard/applications/${id}`, { method: "DELETE" });
      if (res.ok) {
        setApplications((prev) =>
          prev.map((app) => (app.id === id ? { ...app, status: "WITHDRAWN" } : app))
        );
      }
    } catch {
      // silently fail
    }
  };

  const filteredApplications = applications.filter((app) => {
    if (tab === "active") {
      return ["SUBMITTED", "VIEWED", "SHORTLISTED", "INTERVIEW", "OFFERED"].includes(app.status);
    }
    if (tab === "closed") {
      return ["REJECTED", "WITHDRAWN"].includes(app.status);
    }
    return true;
  });

  const activeCount = applications.filter((a) =>
    ["SUBMITTED", "VIEWED", "SHORTLISTED", "INTERVIEW", "OFFERED"].includes(a.status)
  ).length;
  const closedCount = applications.filter((a) =>
    ["REJECTED", "WITHDRAWN"].includes(a.status)
  ).length;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-xl font-heading font-bold text-ink">My Applications</h1>
        <p className="text-[13px] text-muted mt-1">
          Track the status of your job applications.
        </p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 bg-white rounded-xl border border-divider animate-pulse" />
          ))}
        </div>
      ) : applications.length === 0 ? (
        <div className="bg-white rounded-xl border border-divider p-10 text-center">
          <FileText className="w-10 h-10 text-muted/30 mx-auto mb-3" />
          <h2 className="text-[14px] font-heading font-semibold text-ink mb-1">No applications yet</h2>
          <p className="text-[12px] text-muted mb-4">Start applying to jobs and track them here.</p>
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
          {/* Filter tabs */}
          <div className="flex gap-2">
            {([
              { key: "all", label: "All", count: applications.length },
              { key: "active", label: "Active", count: activeCount },
              { key: "closed", label: "Closed", count: closedCount },
            ] as { key: FilterTab; label: string; count: number }[]).map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`px-3 py-1.5 rounded-lg text-[12px] font-medium border transition-colors ${
                  tab === t.key
                    ? "border-accent bg-accent-bg text-accent"
                    : "border-divider text-muted hover:text-ink hover:border-ink/20"
                }`}
              >
                {t.label} <span className="ml-1 text-[10px] opacity-70">({t.count})</span>
              </button>
            ))}
          </div>

          {/* Applications list */}
          <div className="space-y-3">
            {filteredApplications.length === 0 ? (
              <div className="bg-white rounded-xl border border-divider p-8 text-center">
                <p className="text-[12px] text-muted">No applications in this category.</p>
              </div>
            ) : (
              filteredApplications.map((app) => (
                <div
                  key={app.id}
                  className="bg-white rounded-xl border border-divider p-4 hover:border-ink/10 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-[14px] font-medium text-ink truncate">
                          {app.job.title}
                        </h3>
                        <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium border shrink-0 ${STATUS_COLORS[app.status] || STATUS_COLORS.DRAFT}`}>
                          {STATUS_LABELS[app.status] || app.status}
                        </span>
                      </div>
                      <p className="text-[12px] text-muted mt-0.5">{app.job.companyName}</p>
                      <p className="text-[11px] text-muted mt-1">
                        Applied {new Date(app.appliedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 shrink-0">
                      <Link
                        href={`/jobs/${app.job.slug}`}
                        className="p-1.5 rounded-lg hover:bg-ink/[0.04] text-muted hover:text-ink transition-colors"
                        title="View job"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Link>
                      {app.job.applicationUrl && (
                        <a
                          href={app.job.applicationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg hover:bg-accent-bg text-muted hover:text-accent transition-colors"
                          title="View on employer site"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                      {!["WITHDRAWN", "REJECTED"].includes(app.status) && (
                        <button
                          onClick={() => handleWithdraw(app.id)}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-muted hover:text-red-500 transition-colors"
                          title="Withdraw application"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}
