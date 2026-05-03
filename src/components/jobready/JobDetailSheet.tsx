"use client";

import { useEffect, useRef, useState } from "react";
import { X, MapPin, Clock, Building2, ExternalLink, Share2, Bookmark, BookmarkCheck, LogIn } from "lucide-react";
import { useSession } from "next-auth/react";
import { useJobModal } from "./JobModalContext";
import { formatDateUTC } from "@/lib/format-date";
import type { Job } from "@/types";

function GovernmentBadge({ level }: { level?: string }) {
  if (!level) return null;
  const labels: Record<string, string> = {
    NATIONAL: "National Government",
    COUNTY: "County Government",
    STATE_CORPORATION: "State Corporation",
  };
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-100">
      {labels[level] || level}
    </span>
  );
}

function OpportunityBadge({ type }: { type?: string }) {
  if (!type) return null;
  const labels: Record<string, string> = {
    INTERNSHIP: "Internship",
    SCHOLARSHIP: "Scholarship",
    FELLOWSHIP: "Fellowship",
    BURSARY: "Bursary",
    SPONSORSHIP: "Sponsorship",
    GRANT: "Grant",
    VOLUNTEER: "Volunteer",
    TRAINING: "Training",
    BOOTCAMP: "Bootcamp",
    MENTORSHIP: "Mentorship",
    CERTIFICATION: "Certification",
    FUNDING: "Funding",
    RESEARCH: "Research",
    APPRENTICESHIP: "Apprenticeship",
    CONFERENCE: "Conference",
    COMPETITION: "Competition",
    AWARD: "Award",
    RESIDENCY: "Residency",
    ACCELERATOR: "Accelerator",
    INCUBATOR: "Incubator",
    EXCHANGE: "Exchange Program",
    UNIVERSITY_ADMISSION: "University Admission",
    WORKSHOP: "Workshop",
  };
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-100">
      {labels[type] || type}
    </span>
  );
}

function formatDate(dateStr: string) {
  return formatDateUTC(dateStr);
}

function daysUntil(dateStr: string | null | undefined): string | null {
  if (!dateStr) return null;
  const now = new Date();
  const deadline = new Date(dateStr);
  const diff = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (diff < 0) return "Closed";
  if (diff === 0) return "Closes today";
  if (diff === 1) return "Closes tomorrow";
  return `${diff} days left`;
}

function SalaryBlock({ job }: { job: Job }) {
  const hasSalary = job.salaryMin != null && job.salaryMax != null;

  return (
    <div className="rounded-lg bg-emerald-50/60 border border-emerald-100/80 px-4 py-3">
      <p className="text-[11px] font-medium text-emerald-600 uppercase tracking-wider mb-1">
        {job.listingType === "OPPORTUNITY" ? "Value" : "Compensation"}
      </p>
      {hasSalary ? (
        <p className="text-sm font-semibold text-ink">
          KES{" "}
          {job.salaryMin?.toLocaleString()} – {job.salaryMax?.toLocaleString()}
          {job.salaryPeriod && (
            <span className="font-normal text-muted"> / {job.salaryPeriod}</span>
          )}
        </p>
      ) : (
        <>
          <p className="text-sm font-medium text-ink/60">
            {job.predictedSalary || "Not disclosed"}
          </p>
          {job.predictedSalary && (
            <p className="text-[11px] text-muted mt-0.5">
              Estimated based on similar roles in {job.county || job.location}
            </p>
          )}
        </>
      )}
    </div>
  );
}

function ShareButton({ slug, title }: { slug: string; title: string }) {
  const handleShare = async () => {
    const url = typeof window !== "undefined"
      ? `${window.location.origin}/jobs/${slug}`
      : `/jobs/${slug}`;

    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {}
    } else {
      // Copy to clipboard
      try {
        await navigator.clipboard.writeText(url);
        alert("Link copied!");
      } catch {
        // Fallback
        const el = document.createElement("textarea");
        el.value = url;
        document.body.appendChild(el);
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);
        alert("Link copied!");
      }
    }
  };

  return (
    <button
      onClick={handleShare}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium text-muted hover:text-ink hover:bg-ink/[0.04] transition-colors"
      title="Share this job"
    >
      <Share2 className="w-3.5 h-3.5" />
      Share
    </button>
  );
}

function SaveJobButton({ slug, jobId }: { slug: string; jobId: string }) {
  const { data: session } = useSession();
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showLoginHint, setShowLoginHint] = useState(false);

  // Initialize saved state based on auth
  useEffect(() => {
    if (!session) {
      // Fallback: check localStorage for non-authenticated users
      try {
        const stored = localStorage.getItem("saved-jobs");
        if (stored) {
          const slugs: string[] = JSON.parse(stored);
          setSaved(slugs.includes(slug));
        }
      } catch {}
    } else {
      // Check DB via API
      async function checkSaved() {
        try {
          const res = await fetch("/api/dashboard/saved-jobs");
          if (res.ok) {
            const data = await res.json();
            setSaved(data.some((sj: { job: { id: string } }) => sj.job.id === jobId));
          }
        } catch {}
      }
      checkSaved();
    }
  }, [session, slug, jobId]);

  const toggleSave = async () => {
    if (!session) {
      setShowLoginHint(true);
      setTimeout(() => setShowLoginHint(false), 3000);
      return;
    }

    setLoading(true);
    try {
      if (saved) {
        const res = await fetch(`/api/dashboard/saved-jobs?listingId=${jobId}`, { method: "DELETE" });
        if (res.ok) setSaved(false);
      } else {
        const res = await fetch("/api/dashboard/saved-jobs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ listingId: jobId }),
        });
        if (res.ok) setSaved(true);
      }
    } catch {
      // Fallback to localStorage
      try {
        const stored = localStorage.getItem("saved-jobs");
        const slugs: string[] = stored ? JSON.parse(stored) : [];
        if (saved) {
          localStorage.setItem("saved-jobs", JSON.stringify(slugs.filter((s) => s !== slug)));
          setSaved(false);
        } else {
          slugs.push(slug);
          localStorage.setItem("saved-jobs", JSON.stringify(slugs));
          setSaved(true);
        }
      } catch {}
    } finally {
      setLoading(false);
    }
  };

  if (saved) {
    return (
      <div className="relative">
        <button
          onClick={toggleSave}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium text-accent hover:bg-accent/[0.08] transition-colors disabled:opacity-50"
          title="Unsave this job"
        >
          <BookmarkCheck className="w-3.5 h-3.5" />
          Saved
        </button>
        {showLoginHint && (
          <div className="absolute top-full right-0 mt-1 px-2.5 py-1.5 bg-ink text-white text-[11px] rounded-lg whitespace-nowrap shadow-lg z-10">
            <a href="/auth/login" className="inline-flex items-center gap-1 hover:underline">
              <LogIn className="w-3 h-3" /> Sign in to save jobs
            </a>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={toggleSave}
        disabled={loading}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium text-muted hover:text-ink hover:bg-ink/[0.04] transition-colors disabled:opacity-50"
        title="Save this job"
      >
        <Bookmark className="w-3.5 h-3.5" />
        Save
      </button>
      {showLoginHint && (
        <div className="absolute top-full right-0 mt-1 px-2.5 py-1.5 bg-ink text-white text-[11px] rounded-lg whitespace-nowrap shadow-lg z-10">
          <a href="/auth/login" className="inline-flex items-center gap-1 hover:underline">
            <LogIn className="w-3 h-3" /> Sign in to save jobs
          </a>
        </div>
      )}
    </div>
  );
}

export default function JobDetailSheet() {
  const { currentJob: job, closeJob, isOpen } = useJobModal();
  const sheetRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) closeJob();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, closeJob]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!job || !isOpen) return null;

  const deadlineText = daysUntil(job.deadline);

  return (
    <div className="fixed inset-0 z-[60]" aria-modal="true" role="dialog">
      {/* Backdrop */}
      <div
        ref={backdropRef}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={closeJob}
      />

      {/* Sheet */}
      <div
        ref={sheetRef}
        className="absolute inset-y-0 right-0 w-full max-w-lg bg-surface shadow-2xl flex flex-col animate-in slide-in-from-right duration-300"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 px-5 pt-5 pb-3 border-b border-divider">
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-heading font-bold text-ink leading-tight truncate">
              {job.title}
            </h2>
            <p className="text-[13px] text-muted mt-0.5 truncate">
              {job.companyName}
              {job.companyVerified && (
                <span className="inline-block ml-1.5 text-[11px] text-accent font-medium">
                  Verified
                </span>
              )}
            </p>
          </div>
          <button
            onClick={closeJob}
            className="p-1.5 -mt-0.5 -mr-1 rounded-lg hover:bg-ink/[0.06] text-muted hover:text-ink transition-colors shrink-0"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
          {/* Meta row — inline compact */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[12px] text-muted">
            <span className="inline-flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {job.location}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatDate(job.createdAt)}
            </span>
            <span className="inline-flex items-center gap-1">
              <Building2 className="w-3 h-3" />
              {job.employmentType}
            </span>
            {job.workMode && <span>{job.workMode}</span>}
            {deadlineText && (
              <span className={deadlineText === "Closed" ? "text-red-500 font-medium" : "text-accent font-medium"}>
                {deadlineText}
              </span>
            )}
          </div>

          {/* Type badges */}
          <div className="flex flex-wrap gap-1.5">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-ink/[0.05] text-ink/70">
              {job.category}
            </span>
            <GovernmentBadge level={job.governmentLevel} />
            <OpportunityBadge type={job.opportunityType} />
          </div>

          {/* Salary / Compensation */}
          <SalaryBlock job={job} />

          {/* Description */}
          {job.description && (
            <div>
              <h3 className="text-[12px] font-medium text-muted uppercase tracking-wider mb-2">
                Description
              </h3>
              <div
                className="text-[13px] text-ink/80 leading-relaxed prose prose-sm max-w-none
                  [&_ul]:list-disc [&_ul]:pl-4 [&_ol]:list-decimal [&_ol]:pl-4
                  [&_li]:mb-1 [&_p]:mb-2 [&_strong]:font-semibold [&_strong]:text-ink"
                dangerouslySetInnerHTML={{ __html: job.description }}
              />
            </div>
          )}

          {/* Requirements */}
          {job.requirements && (
            <div>
              <h3 className="text-[12px] font-medium text-muted uppercase tracking-wider mb-2">
                Requirements
              </h3>
              <div
                className="text-[13px] text-ink/80 leading-relaxed prose prose-sm max-w-none
                  [&_ul]:list-disc [&_ul]:pl-4 [&_ol]:list-decimal [&_ol]:pl-4
                  [&_li]:mb-1 [&_p]:mb-2"
                dangerouslySetInnerHTML={{ __html: job.requirements }}
              />
            </div>
          )}

          {/* Application instructions */}
          {job.instructions && (
            <div>
              <h3 className="text-[12px] font-medium text-muted uppercase tracking-wider mb-2">
                How to Apply
              </h3>
              <div
                className="text-[13px] text-ink/80 leading-relaxed prose prose-sm max-w-none
                  [&_ul]:list-disc [&_ul]:pl-4 [&_ol]:list-decimal [&_ol]:pl-4
                  [&_li]:mb-1 [&_p]:mb-2"
                dangerouslySetInnerHTML={{ __html: job.instructions }}
              />
            </div>
          )}

          {/* Tags */}
          {job.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {job.tags.map((tag) => (
                <span key={tag} className="text-[11px] text-muted">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-divider flex items-center justify-between gap-3">
          <div className="flex items-center gap-1">
            <ShareButton slug={job.slug} title={job.title} />
            <SaveJobButton key={job.slug} slug={job.slug} jobId={job.id} />
          </div>
          {job.applicationUrl ? (
            <a
              href={job.applicationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-ink text-white text-[13px] font-medium hover:bg-ink/90 transition-colors"
            >
              Apply Now
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          ) : (
            <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-ink text-white text-[13px] font-medium hover:bg-ink/90 transition-colors">
              Apply Now
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
