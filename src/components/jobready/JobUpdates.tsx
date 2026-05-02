"use client";

import { useEffect, useState } from "react";
import SectionNumber from "./SectionNumber";
import { Rss, ChevronRight, Clock, Megaphone, ClipboardCheck, AlertTriangle } from "lucide-react";

interface UpdateItem {
  id: string;
  title: string;
  body?: string;
  source: string;
  type: "posted" | "shortlisted" | "deadline" | "closing";
  date: string;
  slug: string;
  createdAt: string;
}

function getTypeIcon(type: UpdateItem["type"]) {
  switch (type) {
    case "shortlisted":
      return <ClipboardCheck className="w-4 h-4 text-emerald-500" />;
    case "closing":
      return <AlertTriangle className="w-4 h-4 text-amber-500" />;
    case "deadline":
      return <AlertTriangle className="w-4 h-4 text-red-500" />;
    default:
      return <Megaphone className="w-4 h-4 text-blue-500" />;
  }
}

function getTypeBadge(type: UpdateItem["type"]) {
  switch (type) {
    case "shortlisted":
      return (
        <span className="text-[9px] font-mono bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded border border-emerald-100">
          SHORTLISTED
        </span>
      );
    case "closing":
      return (
        <span className="text-[9px] font-mono bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded border border-amber-100">
          CLOSING SOON
        </span>
      );
    case "deadline":
      return (
        <span className="text-[9px] font-mono bg-red-50 text-red-600 px-1.5 py-0.5 rounded border border-red-100">
          DEADLINE PASSED
        </span>
      );
    default:
      return (
        <span className="text-[9px] font-mono bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded border border-blue-100">
          NEW POSTING
        </span>
      );
  }
}

export default function JobUpdates() {
  const [updates, setUpdates] = useState<UpdateItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUpdates() {
      try {
        const res = await fetch("/api/updates?limit=10");
        if (res.ok) {
          const data = await res.json();
          setUpdates(data.updates || []);
        }
      } catch {
        // Silently fail — show empty state
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
          <a href="/jobs?sort=latest" className="text-[11px] font-mono text-muted hover:text-ink transition-colors uppercase tracking-wider">
            View all →
          </a>
        </div>
        <p className="text-[12px] text-muted mb-6">
          Ministry postings, shortlisting results, recruitment announcements, and deadlines
        </p>

        {loading ? (
          <div className="space-y-0 divide-y divide-subtle">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="py-4 animate-pulse">
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
          <div className="space-y-0 divide-y divide-subtle">
            {updates.map((item) => (
              <div
                key={item.id}
                className="py-4 group"
              >
                <button
                  onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                  className="flex items-start gap-4 w-full text-left hover:bg-surface -mx-2 px-2 rounded-lg transition-colors"
                >
                  <div className="w-10 h-10 border border-divider rounded-lg flex items-center justify-center shrink-0 bg-ink/[0.02]">
                    {getTypeIcon(item.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-ink group-hover:text-accent transition-colors">
                      {item.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="text-[11px] text-muted">{item.source}</span>
                      <span className="text-[11px] text-subtle">·</span>
                      <span className="text-[11px] text-muted flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {item.date}
                      </span>
                      {getTypeBadge(item.type)}
                    </div>
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 text-muted/30 group-hover:text-muted shrink-0 mt-1 transition-transform ${
                      expandedId === item.id ? "rotate-90" : ""
                    }`}
                  />
                </button>
                {/* Expanded body */}
                {expandedId === item.id && item.body && (
                  <div className="mt-2 ml-14 text-[13px] text-ink/70 leading-relaxed pb-1">
                    {item.body}
                  </div>
                )}
                {/* Link to listing if available */}
                {expandedId === item.id && item.slug && (
                  <div className="mt-1 ml-14">
                    <a
                      href={`/jobs/${item.slug}`}
                      className="text-[12px] font-medium text-accent hover:text-accent-dark transition-colors inline-flex items-center gap-1"
                    >
                      View listing <ChevronRight className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
