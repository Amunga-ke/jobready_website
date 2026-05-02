"use client";

import { useJobModal } from "./JobModalContext";
import type { Job } from "@/types";

interface JobClickableProps {
  job: Job;
  children: React.ReactNode;
  className?: string;
}

/**
 * Thin client wrapper that makes any children open the job sidesheet on click.
 * Server components can render this and pass children without becoming clients themselves.
 *
 * Usage:
 *   <JobClickable job={myJob}>
 *     <div className="...">Card content here</div>
 *   </JobClickable>
 */
export default function JobClickable({ job, children, className }: JobClickableProps) {
  const { openJob } = useJobModal();

  return (
    <div
      onClick={() => openJob(job)}
      className={className}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openJob(job);
        }
      }}
    >
      {children}
    </div>
  );
}
