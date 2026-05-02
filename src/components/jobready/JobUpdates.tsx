"use client";

import { useEffect, useState } from "react";
import SectionNumber from "./SectionNumber";
import { useUpdateModal } from "./UpdateModalContext";
import type { UpdateData } from "./UpdateModalContext";
import {
  Rss,
  ChevronRight,
  Clock,
  FileText,
  Download,
} from "lucide-react";

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
      label: "New",
      className: "bg-violet-50 text-violet-700 border-violet-100",
    },
  };

  const c = config[type] || { label: "Announcement", className: "bg-violet-50 text-violet-700 border-violet-100" };
  return (
    <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${c.className}`}>
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

export default function JobUpdates() {
  const { openUpdateBySlug } = useUpdateModal();
  const [updates, setUpdates] = useState<UpdateData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUpdates() {
      try {
        const res = await fetch("/api/updates?limit=5");
        if (res.ok) {
          const data = await res.json();
          setUpdates(data.updates || []);
        }
      } catch {
        // Silently fail
      } finally {
        setLoading(false);
      }
    }
    fetchUpdates();
  }, []);

  return (
    <section className="py-14 border-t border-divider bg-white relative overflow-hidden">
      <SectionNumber num="01" />
      <div className="max-w-6xl mx-auto px-5 relative">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <h2 className="font-heading text-xl font-bold">Job Updates</h2>
            <span className="text-[11px] font-mono text-muted bg-ink/[0.04] px-2 py-0.5 rounded">
              Official
            </span>
          </div>
          <a
            href="/updates"
            className="text-[11px] font-mono text-muted hover:text-ink transition-colors uppercase tracking-wider"
          >
            View all &rarr;
          </a>
        </div>
        <p className="text-[12px] text-muted mb-6">
          Ministry postings, shortlisting results, recruitment announcements, and deadlines
        </p>

        {loading ? (
          <div className="divide-y divide-subtle">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="py-3.5 animate-pulse">
                <div className="h-3.5 bg-subtle rounded w-3/4 mb-2" />
                <div className="h-3 bg-subtle rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : updates.length === 0 ? (
          <div className="py-12 text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-ink/[0.04] flex items-center justify-center">
              <Rss className="w-5 h-5 text-muted/40" />
            </div>
            <p className="text-[14px] font-medium text-muted">No updates yet</p>
            <p className="text-[12px] text-muted/60 mt-1">
              Ministry postings, shortlisting results, and recruitment updates will appear here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-subtle">
            {updates.map((item) => (
              <button
                key={item.id}
                onClick={() => openUpdateBySlug(item.slug)}
                className="py-3.5 w-full text-left group hover:bg-surface -mx-2 px-2 rounded-lg transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 border border-divider rounded-lg flex items-center justify-center shrink-0 bg-ink/[0.02] mt-0.5">
                    {getTypeIcon(item.updateType)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-ink group-hover:text-accent transition-colors leading-snug">
                      {item.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      {getTypeBadge(item.updateType)}
                      <span className="text-[11px] text-muted">{item.source}</span>
                      <span className="text-[11px] text-subtle">&middot;</span>
                      <span className="text-[11px] text-muted inline-flex items-center gap-1">
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
        )}
      </div>
    </section>
  );
}
