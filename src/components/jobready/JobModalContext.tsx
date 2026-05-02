"use client";

import React, { createContext, useContext, useCallback, useState, useEffect, useRef } from "react";
import type { Job } from "@/types";

interface JobModalContextType {
  /** Open the sidesheet for a specific job (by full job object) */
  openJob: (job: Job) => void;
  /** Open the sidesheet by fetching the job by slug or ID from the API */
  openJobById: (idOrSlug: string) => void;
  /** Close the sidesheet */
  closeJob: () => void;
  /** Currently open job (null if closed) */
  currentJob: Job | null;
  /** Whether the sheet is open */
  isOpen: boolean;
  /** Whether a fetch is in progress */
  isLoading: boolean;
}

const JobModalContext = createContext<JobModalContextType>({
  openJob: () => {},
  openJobById: () => {},
  closeJob: () => {},
  currentJob: null,
  isOpen: false,
  isLoading: false,
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
  const [isLoading, setIsLoading] = useState(false);
  const popstateJobRef = useRef<string | null>(null);

  const pushUrlForJob = useCallback((slug: string) => {
    if (typeof window !== "undefined") {
      const url = `/jobs/${slug}`;
      popstateJobRef.current = slug;
      nativePushState({ jobSlug: slug }, "", url);
    }
  }, []);

  const openJob = useCallback((job: Job) => {
    setCurrentJob(job);
    pushUrlForJob(job.slug);
  }, [pushUrlForJob]);

  const openJobById = useCallback(async (idOrSlug: string) => {
    setIsLoading(true);
    try {
      // First try fetching by slug via our API
      const res = await fetch(`/api/jobs/${idOrSlug}`);
      if (!res.ok) throw new Error("Job not found");
      const data = await res.json();
      if (data.job) {
        setCurrentJob(data.job);
        pushUrlForJob(data.job.slug);
      }
    } catch (error) {
      console.error("[openJobById] Failed to fetch job:", error);
    } finally {
      setIsLoading(false);
    }
  }, [pushUrlForJob]);

  const closeJob = useCallback(() => {
    if (typeof window !== "undefined" && popstateJobRef.current) {
      window.history.back();
      popstateJobRef.current = null;
    } else {
      setCurrentJob(null);
    }
  }, []);

  // When the user presses the browser back button, close the sidesheet.
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
      value={{ openJob, openJobById, closeJob, currentJob, isOpen: currentJob !== null, isLoading }}
    >
      {children}
    </JobModalContext.Provider>
  );
}

export function useJobModal() {
  return useContext(JobModalContext);
}
