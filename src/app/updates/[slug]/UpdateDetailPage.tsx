"use client";

import Link from "next/link";
import { ArrowLeft, Clock, Building2, Download, FileText, ExternalLink } from "lucide-react";
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
      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border ${c.className}`}
    >
      {c.label}
    </span>
  );
}

interface UpdateRecord {
  id: string;
  slug: string;
  title: string;
  body?: string | null;
  source: string;
  updateType: string;
  pdfUrl?: string | null;
  imageUrl?: string | null;
  listingSlug?: string | null;
  postedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export default function UpdateDetailPage({ update }: { update: UpdateRecord }) {
  return (
    <div className="min-h-screen bg-surface">
      {/* Breadcrumb */}
      <div className="border-b border-divider bg-white">
        <div className="max-w-3xl mx-auto px-5 py-4">
          <Link
            href="/updates"
            className="inline-flex items-center gap-1.5 text-[12px] font-medium text-muted hover:text-ink transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            All Updates
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-5 py-8">
        <article>
          {/* Type badge + posted by */}
          <div className="flex items-center gap-2 mb-3">
            {getTypeBadge(update.updateType)}
            <span className="text-[10px] font-mono text-muted uppercase tracking-wider">
              {update.postedBy === "admin" ? "Official" : "Employer"}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-heading font-bold text-ink leading-tight mb-3">
            {update.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[12px] text-muted mb-6">
            <span className="inline-flex items-center gap-1">
              <Building2 className="w-3 h-3" />
              {update.source}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatDateUTC(update.createdAt.toISOString())}
            </span>
          </div>

          {/* Image if available */}
          {update.imageUrl && (
            <div className="rounded-lg overflow-hidden border border-divider mb-6">
              <img
                src={update.imageUrl}
                alt={update.title}
                className="w-full h-auto object-cover"
              />
            </div>
          )}

          {/* Body */}
          {update.body && (
            <div className="mb-8">
              <p className="text-[15px] text-ink/80 leading-relaxed">{update.body}</p>
            </div>
          )}

          {/* PDF Download */}
          {update.pdfUrl && (
            <div className="rounded-lg bg-emerald-50/60 border border-emerald-100/80 px-5 py-4 mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                  <FileText className="w-6 h-6 text-emerald-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-medium text-ink">Download Attachment</p>
                  <p className="text-[12px] text-muted truncate">{update.pdfUrl}</p>
                </div>
                <a
                  href={update.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 text-white text-[13px] font-medium hover:bg-emerald-700 transition-colors shrink-0"
                >
                  <Download className="w-4 h-4" />
                  Download
                </a>
              </div>
            </div>
          )}

          {/* Related listing */}
          {update.listingSlug && (
            <div className="rounded-lg bg-blue-50/60 border border-blue-100/80 px-5 py-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                  <ExternalLink className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-medium text-ink">Related Job Listing</p>
                  <p className="text-[12px] text-muted">View the original job posting for more details</p>
                </div>
                <Link
                  href={`/jobs/${update.listingSlug}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-blue-600 text-white text-[13px] font-medium hover:bg-blue-700 transition-colors shrink-0"
                >
                  View Job
                </Link>
              </div>
            </div>
          )}
        </article>
      </div>
    </div>
  );
}
