'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import type { Job } from '@/types';

interface JobModalContextType {
  openJob: (job: Job) => void;
  openJobById: (id: string) => void;
  closeJob: () => void;
  isOpen: boolean;
  selectedJob: Job | null;
}

const JobModalContext = createContext<JobModalContextType>({
  openJob: () => {},
  openJobById: () => {},
  closeJob: () => {},
  isOpen: false,
  selectedJob: null,
});

export function JobModalProvider({ children }: { children: React.ReactNode }) {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const openJob = useCallback((job: Job) => {
    setSelectedJob(job);
    setIsOpen(true);
    document.body.style.overflow = 'hidden';
  }, []);

  const openJobById = useCallback((id: string) => {
    // Dynamic import to avoid circular dependency
    import('@/lib/job-data').then(({ getJobById }) => {
      const job = getJobById(id);
      if (job) {
        setSelectedJob(job);
        setIsOpen(true);
        document.body.style.overflow = 'hidden';
      }
    });
  }, []);

  const closeJob = useCallback(() => {
    setIsOpen(false);
    document.body.style.overflow = '';
    // Delay clearing the job for animation
    setTimeout(() => setSelectedJob(null), 300);
  }, []);

  return (
    <JobModalContext.Provider value={{ openJob, openJobById, closeJob, isOpen, selectedJob }}>
      {children}
    </JobModalContext.Provider>
  );
}

export function useJobModal() {
  return useContext(JobModalContext);
}
