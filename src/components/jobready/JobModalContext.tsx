"use client";

import React, { createContext, useContext, useCallback, useState, useEffect, useRef } from "react";
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

/**
 * Next.js App Router patches `window.history.pushState` to intercept
 * URL changes that match app routes and trigger soft navigation.
 * We bypass that by calling the *native* History.prototype method
 * directly — this updates the browser URL bar without Next.js
 * unmounting the current page.
 */
function nativePushState(state: any, title: string, url: string | URL | null) {
  History.prototype.pushState.call(window.history, state, title, url);
}

export function JobModalProvider({ children }: { children: React.ReactNode }) {
  const [currentJob, setCurrentJob] = useState<Job | null>(null);
  const popstateJobRef = useRef<string | null>(null);

  const openJob = useCallback((job: Job) => {
    setCurrentJob(job);
    if (typeof window !== "undefined") {
      const url = `/jobs/${job.slug}`;
      popstateJobRef.current = job.slug;
      // Use native pushState to avoid Next.js soft-navigation
      nativePushState({ jobSlug: job.slug }, "", url);
    }
  }, []);

  const closeJob = useCallback(() => {
    if (typeof window !== "undefined" && popstateJobRef.current) {
      // We pushed state, so going back cleans the URL bar.
      // The popstate listener below will see no matching slug and clear state.
      window.history.back();
      popstateJobRef.current = null;
    } else {
      // Fallback: direct navigation or no pushed state
      setCurrentJob(null);
    }
  }, []);

  // When the user presses the browser back button, close the sidesheet.
  // This fires *after* history.back() has already popped the URL,
  // so we just clear the job state here.
  useEffect(() => {
    const onPopState = () => {
      setCurrentJob(null);
      popstateJobRef.current = null;
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
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
