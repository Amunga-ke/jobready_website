"use client";

import { useEffect, useState } from "react";
import SectionNumber from "./SectionNumber";
import { Rss, ChevronRight, Clock } from "lucide-react";
import type { Job } from "@/types";

interface UpdateItem {
  id: string;
  title: string;
  source: string;
  type: "posted" | "shortlisted" | "deadline" | "closing";
  date: string;
  slug: string;
}

export default function JobUpdates() {
  const [updates, setUpdates] = useState<UpdateItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUpdates() {
      try {
        const res = await fetch("/api/updates?limit=8");
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
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading text-xl font-bold">Job Updates</h2>
          <a href="/jobs?sort=latest" className="text-[11px] font-mono text-muted hover:text-ink transition-colors uppercase tracking-wider">
            All updates →
          </a>
        </div>

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
              <a
                key={item.id}
                href={`/jobs/${item.slug}`}
                className="flex items-start gap-4 py-4 group hover:bg-surface -mx-2 px-2 rounded-lg transition-colors"
              >
                <div className="w-10 h-10 border border-divider rounded-lg flex items-center justify-center shrink-0 bg-ink/[0.02]">
                  <Rss className="w-4 h-4 text-muted/40" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-ink group-hover:text-accent transition-colors truncate">
                    {item.title}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[11px] text-muted">{item.source}</span>
                    <span className="text-[11px] text-subtle">·</span>
                    <span className="text-[11px] text-muted flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {item.date}
                    </span>
                    {item.type === "shortlisted" && (
                      <span className="text-[9px] font-mono bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded border border-emerald-100">
                        SHORTLISTED
                      </span>
                    )}
                    {item.type === "closing" && (
                      <span className="text-[9px] font-mono bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded border border-amber-100">
                        CLOSING SOON
                      </span>
                    )}
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted/30 group-hover:text-muted shrink-0 mt-1" />
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
