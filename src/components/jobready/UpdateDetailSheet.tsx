"use client";

import { useEffect, useRef } from "react";
import { X, Clock, Building2, Download, FileText, ExternalLink, ArrowRight } from "lucide-react";
import { useUpdateModal } from "./UpdateModalContext";
import { formatDateUTC } from "@/lib/format-date";

function getTypeBadge(type: string) {
  const config: Record<string, { label: string; className: string }> = {
    SHORTLISTED: {
      label: "Shortlist",
      className: "bg-emerald-50 text-emerald-700 border-emerald-100",
    },
    INTERVIEW_SCHEDULE: {
      label: "Interview Schedule",
      className: "bg-blue-50 text-blue-700 border-blue-100",
    },
    CLOSING_SOON: {
      label: "Closing Soon",
      className: "bg-amber-50 text-amber-700 border-amber-100",
    },
    DEADLINE_PASSED: {
      label: "Closed",
      className: "bg-red-50 text-red-700 border-red-100",
    },
    ANNOUNCEMENT: {
      label: "Announcement",
      className: "bg-violet-50 text-violet-700 border-violet-100",
    },
  };

  const c = config[type] || { label: type, className: "bg-ink/[0.04] text-ink/70 border-divider" };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border ${c.className}`}
    >
      {c.label}
    </span>
  );
}

function getTypeIcon(type: string) {
  switch (type) {
    case "SHORTLISTED":
      return <FileText className="w-5 h-5 text-emerald-500" />;
    case "INTERVIEW_SCHEDULE":
      return <Clock className="w-5 h-5 text-blue-500" />;
    case "CLOSING_SOON":
      return <Clock className="w-5 h-5 text-amber-500" />;
    case "DEADLINE_PASSED":
      return <FileText className="w-5 h-5 text-red-400" />;
    default:
      return <FileText className="w-5 h-5 text-violet-500" />;
  }
}

export default function UpdateDetailSheet() {
  const { currentUpdate: update, closeUpdate, isOpen } = useUpdateModal();
  const sheetRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) closeUpdate();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, closeUpdate]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!update || !isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60]" aria-modal="true" role="dialog">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={closeUpdate}
      />

      {/* Sheet */}
      <div
        ref={sheetRef}
        className="absolute inset-y-0 right-0 w-full max-w-lg bg-surface shadow-2xl flex flex-col animate-in slide-in-from-right duration-300"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 px-5 pt-5 pb-3 border-b border-divider">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1.5">
              {getTypeBadge(update.updateType)}
              <span className="text-[10px] font-mono text-muted uppercase tracking-wider">
                {update.postedBy === "admin" ? "Official" : "Employer"}
              </span>
            </div>
            <h2 className="text-lg font-heading font-bold text-ink leading-tight">
              {update.title}
            </h2>
          </div>
          <button
            onClick={closeUpdate}
            className="p-1.5 -mt-0.5 -mr-1 rounded-lg hover:bg-ink/[0.06] text-muted hover:text-ink transition-colors shrink-0"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[12px] text-muted">
            <span className="inline-flex items-center gap-1">
              <Building2 className="w-3 h-3" />
              {update.source}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatDateUTC(update.createdAt)}
            </span>
          </div>

          {/* Image preview if available */}
          {update.imageUrl && (
            <div className="rounded-lg overflow-hidden border border-divider">
              <img
                src={update.imageUrl}
                alt={update.title}
                className="w-full h-auto object-cover"
              />
            </div>
          )}

          {/* Body text */}
          {update.body && (
            <div>
              <h3 className="text-[12px] font-medium text-muted uppercase tracking-wider mb-2">
                Details
              </h3>
              <p className="text-[13px] text-ink/80 leading-relaxed">
                {update.body}
              </p>
            </div>
          )}

          {/* PDF Download */}
          {update.pdfUrl && (
            <div className="rounded-lg bg-emerald-50/60 border border-emerald-100/80 px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-ink">Attachment Available</p>
                  <p className="text-[11px] text-muted truncate">{update.pdfUrl}</p>
                </div>
                <a
                  href={update.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-[12px] font-medium hover:bg-emerald-700 transition-colors shrink-0"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download
                </a>
              </div>
            </div>
          )}

          {/* Link to related job listing */}
          {update.listingSlug && (
            <div className="rounded-lg bg-blue-50/60 border border-blue-100/80 px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                  {getTypeIcon(update.updateType)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-ink">Related Job Listing</p>
                  <p className="text-[11px] text-muted">View the original job posting</p>
                </div>
                <a
                  href={`/jobs/${update.listingSlug}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-[12px] font-medium hover:bg-blue-700 transition-colors shrink-0"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  View
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-divider flex items-center justify-between gap-3">
          <a
            href="/updates"
            className="text-[12px] font-medium text-muted hover:text-ink transition-colors inline-flex items-center gap-1"
          >
            All Updates
            <ArrowRight className="w-3 h-3" />
          </a>
          {update.pdfUrl && (
            <a
              href={update.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-ink text-white text-[13px] font-medium hover:bg-ink/90 transition-colors"
            >
              Download PDF
              <Download className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
