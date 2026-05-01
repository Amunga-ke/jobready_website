'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import type { Job } from '@/types';

interface JobModalContextType {
  openJob: (job: Job) => void;
  openJobById: (id: string) => void;
  closeJob: () => void;
  isOpen: boolean;
  isLoading: boolean;
  selectedJob: Job | null;
}

const JobModalContext = createContext<JobModalContextType>({
  openJob: () => {},
  openJobById: () => {},
  closeJob: () => {},
  isOpen: false,
  isLoading: false,
  selectedJob: null,
});

export function JobModalProvider({ children }: { children: React.ReactNode }) {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const openJob = useCallback((job: Job) => {
    setSelectedJob(job);
    setIsOpen(true);
    document.body.style.overflow = 'hidden';
  }, []);

  const openJobById = useCallback((id: string) => {
    // Open immediately with loading state — no waiting for the fetch
    setIsOpen(true);
    setIsLoading(true);
    document.body.style.overflow = 'hidden';

    fetch(`/api/jobs/${encodeURIComponent(id)}`)
      .then((res) => {
        if (!res.ok) throw new Error('Job not found');
        return res.json();
      })
      .then((data) => {
        if (data.job) setSelectedJob(data.job);
      })
      .catch((err) => {
        console.error('[openJobById] Failed to fetch job:', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const closeJob = useCallback(() => {
    setIsOpen(false);
    setIsLoading(false);
    document.body.style.overflow = '';
    setTimeout(() => setSelectedJob(null), 300);
  }, []);

  return (
    <JobModalContext.Provider value={{ openJob, openJobById, closeJob, isOpen, isLoading, selectedJob }}>
      {children}
    </JobModalContext.Provider>
  );
}

export function useJobModal() {
  return useContext(JobModalContext);
}
