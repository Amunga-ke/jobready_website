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

/**
 * Check whether a job listing should get an AI-predicted salary.
 * Returns true when the job has no disclosed salary and is a job-type listing.
 */
function needsSalaryPrediction(job: Job): boolean {
  // Skip if salary is already disclosed
  if (job.salaryCurrency && job.salary !== 'Competitive') return false;
  // Skip non-job types
  const code = job.listingTypeCode;
  if (
    ['SCHOLARSHIP', 'BURSARY', 'FELLOWSHIP', 'GRANT', 'VOLUNTEER', 'BOOTCAMP',
     'TRAINING', 'WORKSHOP', 'MENTORSHIP', 'CONFERENCE', 'APPRENTICESHIP'].includes(code)
  ) return false;
  // Skip casual
  if (job.isCasual) return false;
  return true;
}

/**
 * Fetch an AI-predicted salary range for the given job.
 * Silently fails — predicted salary is a nice-to-have, not critical.
 */
async function fetchPredictedSalary(job: Job): Promise<Job['predictedSalary'] | undefined> {
  try {
    const res = await fetch('/api/salary/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: job.title,
        category: job.category,
        level: job.level,
        location: job.location,
        listingType: job.listingTypeCode,
      }),
    });
    if (!res.ok) return undefined;
    const data = await res.json();
    return data.predicted || undefined;
  } catch {
    return undefined;
  }
}

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
      .then(async (data) => {
        if (data.job) {
          const job = data.job as Job;
          setSelectedJob(job);

          // If no salary is disclosed, predict it in the background
          if (needsSalaryPrediction(job)) {
            const predicted = await fetchPredictedSalary(job);
            if (predicted) {
              setSelectedJob((prev) => (prev ? { ...prev, predictedSalary: predicted } : prev));
            }
          }
        }
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
