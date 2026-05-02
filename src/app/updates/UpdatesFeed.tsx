"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useUpdateModal } from "@/components/jobready/UpdateModalContext";
import type { UpdateData } from "@/components/jobready/UpdateModalContext";
import {
  FileText,
  Clock,
  Download,
  Rss,
  Filter,
  ChevronRight,
} from "lucide-react";

const TYPE_OPTIONS = [
  { value: "ALL", label: "All Updates" },
  { value: "SHORTLISTED", label: "Shortlists" },
  { value: "INTERVIEW_SCHEDULE", label: "Interviews" },
  { value: "CLOSING_SOON", label: "Closing Soon" },
  { value: "ANNOUNCEMENT", label: "Announcements" },
  { value: "DEADLINE_PASSED", label: "Closed" },
];

function getTypeBadge(type: string) {
  const config: Record<string, { label: string; className: string }> = {
    SHORTLISTED: {
      label: "Shortlist",
      className: "bg-emerald-50 text-emerald-700 border-emerald-100",
    },
    INTERVIEW_SCHEDULE: {
      label: "Interview",
      className: "bg-blue-50 text-blue-700 border-blue-100",
    },
    CLOSING_SOON: {
      label: "Closing Soon",
      className: "bg-amber-50 text-amber-700 border-amber-100",
    },
    DEADLINE_PASSED: {
      label: "Closed",
      className: "bg-red-50 text-red-400 border-red-100",
    },
    ANNOUNCEMENT: {
      label: "Announcement",
      className: "bg-violet-50 text-violet-700 border-violet-100",
    },
  };

  const c = config[type] || { label: type, className: "bg-ink/[0.04] text-ink/70 border-divider" };

  return (
    <span
      className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium border ${c.className}`}
    >
      {c.label}
    </span>
  );
}

function getTypeIcon(type: string) {
  switch (type) {
    case "SHORTLISTED":
      return <FileText className="w-4 h-4 text-emerald-500" />;
    case "INTERVIEW_SCHEDULE":
      return <Clock className="w-4 h-4 text-blue-500" />;
    case "CLOSING_SOON":
      return <Clock className="w-4 h-4 text-amber-500" />;
    case "DEADLINE_PASSED":
      return <FileText className="w-4 h-4 text-red-400" />;
    default:
      return <FileText className="w-4 h-4 text-violet-500" />;
  }
}

export default function UpdatesFeed() {
  const searchParams = useSearchParams();
  const initialType = searchParams.get("type") || "ALL";

  const { openUpdateBySlug } = useUpdateModal();
  const [updates, setUpdates] = useState<UpdateData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeType, setActiveType] = useState(initialType);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 12;

  useEffect(() => {
    fetchUpdates();
  }, [activeType, page]);

  async function fetchUpdates() {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        limit: String(limit),
        page: String(page),
      });
      if (activeType !== "ALL") params.set("type", activeType);

      const res = await fetch(`/api/updates?${params}`);
      if (res.ok) {
        const data = await res.json();
        setUpdates(data.updates || []);
        setTotalPages(data.pagination?.totalPages || 1);
      }
    } catch {
      // Silently fail
    } finally {
      setLoading(false);
    }
  }

  function handleTypeChange(type: string) {
    setActiveType(type);
    setPage(1);
  }

  return (
    <div className="min-h-screen bg-surface">
      {/* Page Header */}
      <div className="border-b border-divider bg-white">
        <div className="max-w-4xl mx-auto px-5 py-8">
          <div className="flex items-center gap-2 mb-1">
            <Rss className="w-5 h-5 text-accent" />
            <h1 className="text-2xl font-heading font-bold text-ink">Job Updates</h1>
          </div>
          <p className="text-[13px] text-muted max-w-lg">
            Official announcements, shortlisting results, interview schedules, and recruitment
            updates from government bodies and employers across Kenya.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="border-b border-divider bg-white sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-5">
          <div className="flex items-center gap-1 overflow-x-auto py-2 -mb-px scrollbar-hide">
            <Filter className="w-3.5 h-3.5 text-muted shrink-0 mr-1" />
            {TYPE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleTypeChange(opt.value)}
                className={`px-3 py-1.5 rounded text-[12px] font-medium whitespace-nowrap transition-colors ${
                  activeType === opt.value
                    ? "bg-ink text-white"
                    : "text-muted hover:text-ink hover:bg-ink/[0.06]"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Update Feed */}
      <div className="max-w-4xl mx-auto px-5 py-6">
        {loading ? (
          <div className="space-y-0 divide-y divide-subtle">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="py-5 animate-pulse">
                <div className="h-4 bg-subtle rounded w-3/4 mb-2" />
                <div className="h-3 bg-subtle rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : updates.length === 0 ? (
          <div className="py-16 text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-ink/[0.04] flex items-center justify-center">
              <Rss className="w-5 h-5 text-muted/40" />
            </div>
            <p className="text-[14px] font-medium text-muted">No updates found</p>
            <p className="text-[12px] text-muted/60 mt-1">
              Check back later for new announcements and shortlists.
            </p>
          </div>
        ) : (
          <>
            <div className="divide-y divide-subtle">
              {updates.map((item) => (
                <button
                  key={item.id}
                  onClick={() => openUpdateBySlug(item.slug)}
                  className="py-5 w-full text-left group hover:bg-ink/[0.02] -mx-2 px-2 rounded-lg transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 border border-divider rounded-lg flex items-center justify-center shrink-0 bg-ink/[0.02] mt-0.5">
                      {getTypeIcon(item.updateType)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-medium text-ink group-hover:text-accent transition-colors leading-snug">
                        {item.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        {getTypeBadge(item.updateType)}
                        <span className="text-[11px] text-muted">{item.source}</span>
                        <span className="text-[11px] text-subtle">&middot;</span>
                        <span className="text-[11px] text-muted flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {item.date}
                        </span>
                        {item.pdfUrl && (
                          <>
                            <span className="text-[11px] text-subtle">&middot;</span>
                            <span className="text-[11px] text-muted inline-flex items-center gap-0.5">
                              <Download className="w-3 h-3" />
                              PDF
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted/20 group-hover:text-muted/50 shrink-0 mt-2 transition-colors" />
                  </div>
                </button>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-8 pb-4">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1.5 rounded text-[12px] font-medium text-muted hover:text-ink hover:bg-ink/[0.06] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="text-[12px] text-muted px-2">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1.5 rounded text-[12px] font-medium text-muted hover:text-ink hover:bg-ink/[0.06] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
