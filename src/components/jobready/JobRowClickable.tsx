"use client";

import Link from "next/link";
import { useJobModal } from "./JobModalContext";

interface JobRowClickableProps {
  slug: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Thin client wrapper that opens the job sidesheet by slug.
 * Renders a real <Link> so search engine crawlers can discover job pages.
 * The sidesheet opens on click; the href is a fallback for crawlers and SSR.
 */
export default function JobRowClickable({ slug, children, className }: JobRowClickableProps) {
  const { openJobById } = useJobModal();

  return (
    <Link
      href={`/jobs/${slug}`}
      onClick={(e) => {
        e.preventDefault();
        openJobById(slug);
      }}
      className={className}
    >
      {children}
    </Link>
  );
}
