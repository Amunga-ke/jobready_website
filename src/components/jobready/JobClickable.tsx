"use client";

import Link from "next/link";
import { useJobModal } from "./JobModalContext";
import type { Job } from "@/types";

interface JobClickableProps {
  job: Job;
  children: React.ReactNode;
  className?: string;
}

/**
 * Thin client wrapper that makes any children open the job sidesheet on click.
 * Renders a real <Link> so search engine crawlers can discover job pages.
 * The sidesheet opens on click; the href is a fallback for crawlers and SSR.
 */
export default function JobClickable({ job, children, className }: JobClickableProps) {
  const { openJob } = useJobModal();

  return (
    <Link
      href={`/jobs/${job.slug}`}
      onClick={(e) => {
        e.preventDefault();
        openJob(job);
      }}
      className={className}
      aria-label={`${job.title} at ${job.companyName}`}
    >
      {children}
    </Link>
  );
}
