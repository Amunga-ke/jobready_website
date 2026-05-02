"use client";

import React, { createContext, useContext, useCallback, useState } from "react";
import type { Job } from "@/types";

interface JobModalContextType {
  /** Open the sidesheet for a specific job (by full job object) */
  openJob: (job: Job) => void;
  /** Close the sidesheet */
  closeJob: () => void;
  /** Currently open job (null if closed) */
  currentJob: Job | null;
  /** Whether the sheet is open */
  isOpen: boolean;
}

const JobModalContext = createContext<JobModalContextType>({
  openJob: () => {},
  closeJob: () => {},
  currentJob: null,
  isOpen: false,
});

export function JobModalProvider({ children }: { children: React.ReactNode }) {
  const [currentJob, setCurrentJob] = useState<Job | null>(null);

  const openJob = useCallback((job: Job) => {
    setCurrentJob(job);
    // Push URL for sharing / SEO / back button
    if (typeof window !== "undefined") {
      const url = `/jobs/${job.slug}`;
      window.history.pushState({ jobSlug: job.slug }, "", url);
    }
  }, []);

  const closeJob = useCallback(() => {
    setCurrentJob(null);
    // Pop back to the previous URL
    if (typeof window !== "undefined") {
      window.history.back();
    }
  }, []);

  return (
    <JobModalContext.Provider
      value={{ openJob, closeJob, currentJob, isOpen: currentJob !== null }}
    >
      {children}
    </JobModalContext.Provider>
  );
}

export function useJobModal() {
  return useContext(JobModalContext);
}
