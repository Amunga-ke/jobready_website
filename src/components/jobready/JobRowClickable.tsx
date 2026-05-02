"use client";

import { useJobModal } from "./JobModalContext";

interface JobRowClickableProps {
  slug: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Thin client wrapper that opens the job sidesheet by slug.
 * Used by server components that have raw listing data (not the full Job type).
 *
 * Usage:
 *   <JobRowClickable slug={listing.slug} className="...">
 *     <div>Row content here</div>
 *   </JobRowClickable>
 */
export default function JobRowClickable({ slug, children, className }: JobRowClickableProps) {
  const { openJobById } = useJobModal();

  return (
    <div
      onClick={() => openJobById(slug)}
      className={className}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openJobById(slug);
        }
      }}
    >
      {children}
    </div>
  );
}
