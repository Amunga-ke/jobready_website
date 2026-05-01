'use client';

import { useJobModal } from './JobModalContext';
import { X, MapPin, Clock, Briefcase, Building2, Bookmark, Share2, ExternalLink } from 'lucide-react';
import type { Job } from '@/lib/job-data';

export default function JobDetailSheet() {
  const { isOpen, selectedJob, closeJob } = useJobModal();

  if (!isOpen || !selectedJob) return null;

  const job = selectedJob as Job;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px] transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeJob}
      />

      {/* Sheet Panel */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-full sm:w-[480px] lg:w-[540px] bg-white shadow-2xl transition-transform duration-300 ease-out flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="border-b border-divider px-6 py-4 flex items-start justify-between shrink-0">
          <div className="flex-1 min-w-0 pr-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-mono text-[9px] uppercase tracking-widest text-accent bg-accent-bg px-2 py-0.5 rounded-md">
                {job.category}
              </span>
              {job.urgent && (
                <span className="font-mono text-[9px] uppercase tracking-widest text-red-600 bg-red-50 px-2 py-0.5 rounded-md">
                  Closing soon
                </span>
              )}
            </div>
            <h2 className="font-heading text-xl font-bold leading-tight">{job.title}</h2>
            <p className="text-sm text-muted mt-1">{job.company}</p>
          </div>
          <button
            onClick={closeJob}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface transition-colors text-muted hover:text-ink shrink-0 mt-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          {/* Company & Meta */}
          <div className="px-6 py-5 border-b border-subtle">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 border border-divider rounded-xl flex items-center justify-center shrink-0 font-heading font-bold text-base text-muted">
                {job.companyInitial}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{job.company}</p>
                <div className="flex items-center gap-3 mt-0.5 text-[12px] text-muted">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {job.location}
                  </span>
                  {job.isRemote && (
                    <span className="text-accent font-medium">Remote</span>
                  )}
                </div>
              </div>
            </div>

            {/* Key details grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-surface rounded-lg p-3">
                <div className="flex items-center gap-1.5 text-[10px] text-muted uppercase tracking-wider mb-1">
                  <Briefcase className="w-3 h-3" />
                  Type
                </div>
                <p className="text-sm font-medium">{job.type}</p>
              </div>
              <div className="bg-surface rounded-lg p-3">
                <div className="flex items-center gap-1.5 text-[10px] text-muted uppercase tracking-wider mb-1">
                  <Building2 className="w-3 h-3" />
                  Level
                </div>
                <p className="text-sm font-medium">{job.level}</p>
              </div>
              <div className="bg-surface rounded-lg p-3">
                <div className="flex items-center gap-1.5 text-[10px] text-muted uppercase tracking-wider mb-1">
                  <Clock className="w-3 h-3" />
                  Posted
                </div>
                <p className="text-sm font-medium">{job.posted} ago</p>
              </div>
              <div className="bg-surface rounded-lg p-3">
                <div className="flex items-center gap-1.5 text-[10px] text-muted uppercase tracking-wider mb-1">
                  <Clock className="w-3 h-3" />
                  Deadline
                </div>
                <p className={`text-sm font-medium ${job.urgent ? 'text-accent' : ''}`}>
                  {job.deadline || 'Open'}
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="px-6 py-5 border-b border-subtle">
            <h3 className="font-heading text-sm font-bold uppercase tracking-wider mb-3">About this role</h3>
            <p className="text-[13px] text-muted leading-relaxed">{job.description}</p>
          </div>

          {/* Salary */}
          {job.salaryCurrency && !job.isCasual && (
            <div className="px-6 py-5 border-b border-subtle bg-accent-bg">
              <h3 className="font-heading text-sm font-bold uppercase tracking-wider mb-2">Compensation</h3>
              <p className="text-lg font-heading font-bold text-ink">
                {job.salaryCurrency} {job.salary}
                <span className="text-[12px] text-muted font-normal font-sans"> /month</span>
              </p>
            </div>
          )}

          {/* Casual rate */}
          {job.isCasual && (
            <div className="px-6 py-5 border-b border-subtle bg-accent-bg">
              <h3 className="font-heading text-sm font-bold uppercase tracking-wider mb-2">Pay</h3>
              <p className="text-lg font-heading font-bold text-ink">{job.casualRate}</p>
              {job.casualNote && (
                <p className="text-[12px] text-muted mt-1">{job.casualNote}</p>
              )}
            </div>
          )}

          {/* Requirements */}
          <div className="px-6 py-5 border-b border-subtle">
            <h3 className="font-heading text-sm font-bold uppercase tracking-wider mb-3">Requirements</h3>
            <ul className="space-y-2.5">
              {job.requirements.map((req, i) => (
                <li key={i} className="flex items-start gap-2.5 text-[13px] text-muted">
                  <span className="w-1.5 h-1.5 bg-accent rounded-full mt-1.5 shrink-0" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Tags */}
          <div className="px-6 py-5 border-b border-subtle">
            <h3 className="font-heading text-sm font-bold uppercase tracking-wider mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {job.tags.map((tag, i) => (
                <span
                  key={i}
                  className="text-[11px] text-muted bg-surface border border-subtle rounded-md px-2.5 py-1"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Government notice */}
          {job.isGovernment && (
            <div className="px-6 py-5 border-b border-subtle">
              <div className="bg-surface border border-subtle rounded-lg p-4">
                {job.isGazette && (
                  <span className="inline-block font-mono text-[9px] uppercase tracking-widest bg-white text-muted px-1.5 py-0.5 rounded-md border border-subtle mb-2">
                    Gazette Notice
                  </span>
                )}
                <p className="text-[12px] text-muted leading-relaxed">
                  This is a government position. Applications must follow official government recruitment procedures.
                  {job.isGazette && ' Refer to the official Kenya Gazette for full details.'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Sticky Footer Actions */}
        <div className="border-t border-divider px-6 py-4 bg-white shrink-0">
          <div className="flex gap-3">
            <button
              onClick={closeJob}
              className="flex-1 bg-ink text-white text-sm font-medium py-3 rounded-xl hover:bg-ink/90 transition-colors flex items-center justify-center gap-2"
            >
              Apply Now
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
            <button className="w-11 h-11 border border-divider rounded-xl flex items-center justify-center text-muted hover:text-accent hover:border-accent/30 transition-colors shrink-0">
              <Bookmark className="w-4 h-4" />
            </button>
            <button className="w-11 h-11 border border-divider rounded-xl flex items-center justify-center text-muted hover:text-accent hover:border-accent/30 transition-colors shrink-0">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
