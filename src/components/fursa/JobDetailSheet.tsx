'use client';

import { useJobModal } from './JobModalContext';
import {
  X,
  MapPin,
  Clock,
  Briefcase,
  Building2,
  Bookmark,
  Share2,
  ExternalLink,
  GraduationCap,
  Users,
  Wifi,
  Mail,
  Shield,
  TrendingUp,
} from 'lucide-react';
import type { Job } from '@/types';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const isNonJob = (code: string) =>
  ['SCHOLARSHIP', 'BURSARY', 'FELLOWSHIP', 'GRANT', 'INTERNSHIP', 'APPRENTICESHIP',
   'BOOTCAMP', 'TRAINING', 'WORKSHOP', 'MENTORSHIP', 'VOLUNTEER', 'CONFERENCE'].includes(code);

const listingTypeAccent: Record<string, string> = {
  SCHOLARSHIP: 'text-purple-700 bg-purple-50',
  INTERNSHIP: 'text-blue-700 bg-blue-50',
  FELLOWSHIP:  'text-indigo-700 bg-indigo-50',
  BURSARY:     'text-emerald-700 bg-emerald-50',
  GRANT:       'text-teal-700 bg-teal-50',
  BOOTCAMP:    'text-orange-700 bg-orange-50',
  VOLUNTEER:   'text-pink-700 bg-pink-50',
  CASUAL:      'text-amber-700 bg-amber-50',
};

function workModeLabel(mode?: string): string | null {
  if (!mode || mode === 'ONSITE') return null;
  return mode === 'REMOTE' ? 'Remote' : 'Hybrid';
}

// ---------------------------------------------------------------------------
// Sub-section components
// ---------------------------------------------------------------------------

/** A single compact meta chip: icon + label · value */
function MetaChip({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <span className={`inline-flex items-center gap-1 text-[12px] whitespace-nowrap ${accent ? 'text-accent font-medium' : 'text-muted'}`}>
      <Icon className="w-3 h-3 shrink-0" />
      <span className="text-subtle">{label}</span>
      <span className="font-sans">{value}</span>
    </span>
  );
}

/** Divider dot between inline meta chips */
function Dot() {
  return <span className="w-1 h-1 rounded-full bg-subtle shrink-0" />;
}

function DescriptionBlock({ description }: { description: string }) {
  // Split on ## headings
  const parts = description.split(/\n(?=##\s)/);
  return (
    <div className="space-y-4">
      {parts.map((part, i) => {
        if (part.startsWith('## ')) {
          const [heading, ...body] = part.split('\n');
          const headingText = heading.replace('## ', '').trim();
          const bodyText = body.join('\n').trim();
          // Parse list items
          const lines = bodyText.split('\n');
          const isList = lines.every((l) => /^[-*]\s/.test(l.trim()) || l.trim() === '');

          return (
            <div key={i}>
              <h4 className="font-heading text-sm font-bold text-ink mb-2">{headingText}</h4>
              {isList ? (
                <ul className="space-y-2">
                  {lines
                    .filter((l) => l.trim().startsWith('-') || l.trim().startsWith('*'))
                    .map((line, j) => {
                      const text = line.replace(/^[-*]\s+/, '');
                      return (
                        <li
                          key={j}
                          className="flex items-start gap-2.5 text-[13px] text-muted leading-relaxed"
                        >
                          <span className="w-1.5 h-1.5 bg-accent rounded-full mt-[7px] shrink-0" />
                          <span>{text}</span>
                        </li>
                      );
                    })}
                </ul>
              ) : (
                <p className="text-[13px] text-muted leading-relaxed">{bodyText}</p>
              )}
            </div>
          );
        }
        // First part — plain paragraph
        if (part.trim()) {
          return (
            <p key={i} className="text-[13px] text-muted leading-relaxed">
              {part.trim()}
            </p>
          );
        }
        return null;
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function JobDetailSheet() {
  const { isOpen, selectedJob, closeJob } = useJobModal();

  if (!isOpen || !selectedJob) return null;

  const job = selectedJob as Job;
  const isScholarshipLike = isNonJob(job.listingTypeCode);
  const wMode = workModeLabel(job.workMode);
  const typeAccentClass = listingTypeAccent[job.listingTypeCode] ?? '';
  const hasSalary = job.salaryCurrency && !job.isCasual && !isScholarshipLike;
  const hasJobDetails = !isScholarshipLike;

  // Build the apply URL
  const applyUrl = job.applicationUrl || job.sourceUrl || undefined;

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
        className={`fixed top-0 right-0 z-50 h-full w-full sm:w-[500px] lg:w-[560px] bg-white shadow-2xl transition-transform duration-300 ease-out flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* ─── Header ─── */}
        <div className="border-b border-divider px-6 py-4 flex items-start justify-between shrink-0">
          <div className="flex-1 min-w-0 pr-4">
            {/* Pills row */}
            <div className="flex items-center flex-wrap gap-2 mb-2">
              {/* Category pill */}
              {job.category && (
                <span className="font-mono text-[9px] uppercase tracking-widest text-accent bg-accent-bg px-2 py-0.5 rounded-md">
                  {job.category}
                </span>
              )}
              {/* Listing type pill (coloured for non-job types) */}
              {typeAccentClass ? (
                <span
                  className={`font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-md ${typeAccentClass}`}
                >
                  {job.listingType}
                </span>
              ) : (
                <span className="font-mono text-[9px] uppercase tracking-widest text-muted bg-surface px-2 py-0.5 rounded-md">
                  {job.type}
                </span>
              )}
              {/* Urgency pill */}
              {job.urgent && (
                <span className="font-mono text-[9px] uppercase tracking-widest text-red-600 bg-red-50 px-2 py-0.5 rounded-md">
                  Closing soon
                </span>
              )}
              {/* Government pill */}
              {job.isGovernment && (
                <span className="font-mono text-[9px] uppercase tracking-widest text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                  <Shield className="w-2.5 h-2.5" />
                  Government
                </span>
              )}
            </div>
            <h2 className="font-heading text-xl font-bold leading-tight">{job.title}</h2>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-sm text-muted">{job.company}</p>
              {job.isVerified && (
                <span className="inline-flex items-center justify-center w-4 h-4 bg-accent rounded-full" title="Verified employer">
                  <Shield className="w-2.5 h-2.5 text-white" />
                </span>
              )}
            </div>
          </div>
          <button
            onClick={closeJob}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface transition-colors text-muted hover:text-ink shrink-0 mt-1"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ─── Scrollable Content ─── */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          {/* ── Organization card ── */}
          <div className="px-6 py-5 border-b border-subtle">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 border border-divider rounded-xl flex items-center justify-center shrink-0 font-heading font-bold text-base text-muted">
                {job.companyInitial}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{job.company}</p>
                <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                  {job.organizationType && (
                    <span className="text-[11px] text-muted">{job.organizationType}</span>
                  )}
                  {job.industry && (
                    <>
                      <span className="text-[11px] text-subtle">·</span>
                      <span className="text-[11px] text-muted">{job.industry}</span>
                    </>
                  )}
                </div>
                {job.companyWebsite && (
                  <a
                    href={job.companyWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-accent hover:underline mt-0.5 inline-block"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {job.companyWebsite.replace(/^https?:\/\//, '')}
                  </a>
                )}
              </div>
            </div>

            {/* ── Quick meta row ── */}
            <div className="flex items-center gap-2 flex-wrap text-[12px]">
              {/* Type */}
              {hasJobDetails && (
                <>
                  <MetaChip icon={Briefcase} label="" value={job.type} />
                  <Dot />
                </>
              )}
              {/* Level */}
              {hasJobDetails && job.level !== 'Any' && (
                <>
                  <MetaChip icon={Building2} label="" value={job.level} />
                  <Dot />
                </>
              )}
              {/* Work mode */}
              {wMode && (
                <>
                  <MetaChip icon={Wifi} label="" value={wMode} accent={wMode === 'Remote'} />
                  <Dot />
                </>
              )}
              {/* Location */}
              <MetaChip icon={MapPin} label="" value={job.location} />
              {/* Education */}
              {job.educationLevel && (
                <>
                  <Dot />
                  <MetaChip icon={GraduationCap} label="" value={job.educationLevel} />
                </>
              )}
              {/* Vacancies */}
              {job.vacancies != null && job.vacancies > 0 && (
                <>
                  <Dot />
                  <MetaChip icon={Users} label="" value={`${job.vacancies} vac`} />
                </>
              )}
              {/* Duration */}
              {job.contractDuration && (
                <>
                  <Dot />
                  <MetaChip icon={Clock} label="" value={job.contractDuration} />
                </>
              )}
              {/* Posted */}
              <>
                <Dot />
                <MetaChip icon={Clock} label="" value={job.posted + ' ago'} />
              </>
              {/* Deadline */}
              {job.deadline && (
                <>
                  <Dot />
                  <MetaChip icon={Clock} label="" value={job.deadline} accent={job.urgent} />
                </>
              )}
              {/* Salary */}
              {hasSalary && (
                <>
                  <Dot />
                  <MetaChip icon={Briefcase} label="" value={`${job.salaryCurrency} ${job.salary}${job.salaryPeriod ?? ''}`} />
                </>
              )}
            </div>
          </div>

          {/* ── Summary ── */}
          {job.summary && (
            <div className="px-6 py-4 border-b border-subtle bg-surface/50">
              <p className="text-[13px] text-ink/80 leading-relaxed">{job.summary}</p>
            </div>
          )}

          {/* ── Description ── */}
          <div className="px-6 py-5 border-b border-subtle">
            <h3 className="font-heading text-sm font-bold uppercase tracking-wider mb-3">
              {isScholarshipLike ? 'About this programme' : 'About this role'}
            </h3>
            <DescriptionBlock description={job.description} />
          </div>

          {/* ── Casual rate ── */}
          {job.isCasual && (
            <div className="px-6 py-5 border-b border-subtle bg-amber-50">
              <h3 className="font-heading text-sm font-bold uppercase tracking-wider mb-2">Pay</h3>
              <p className="text-lg font-heading font-bold text-ink">{job.casualRate}</p>
              {job.casualNote && (
                <p className="text-[12px] text-muted mt-1">{job.casualNote}</p>
              )}
            </div>
          )}

          {/* ── Application instructions ── */}
          {job.applicationInstructions && (
            <div className="px-6 py-5 border-b border-subtle">
              <h3 className="font-heading text-sm font-bold uppercase tracking-wider mb-3">
                How to apply
              </h3>
              <p className="text-[13px] text-muted leading-relaxed">
                {job.applicationInstructions}
              </p>
            </div>
          )}

          {/* ── Tags ── */}
          {job.tags.length > 0 && (
            <div className="px-6 py-5 border-b border-subtle">
              <p className="text-[12px] text-muted leading-relaxed">
                {job.tags.map((tag) => `#${tag}`).join(' ')}
              </p>
            </div>
          )}

          {/* ── Government notice ── */}
          {job.isGovernment && (
            <div className="px-6 py-5 border-b border-subtle">
              <div className="bg-amber-50 border border-amber-100 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-3.5 h-3.5 text-amber-700" />
                  <span className="text-[12px] font-medium text-amber-800">
                    Government Position
                  </span>
                </div>
                <p className="text-[12px] text-amber-700 leading-relaxed">
                  This is a government position. Applications must follow official government
                  recruitment procedures.
                </p>
              </div>
            </div>
          )}

          {/* ── Engagement stats ── */}
          {(job.viewsCount || job.applicationsCount) && (
            <div className="px-6 py-4 border-b border-subtle">
              <div className="flex items-center gap-5 text-[11px] text-muted">
                {job.viewsCount != null && job.viewsCount > 0 && (
                  <span className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {job.viewsCount.toLocaleString('en-KE')} views
                  </span>
                )}
                {job.applicationsCount != null && job.applicationsCount > 0 && (
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {job.applicationsCount.toLocaleString('en-KE')} applications
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ─── Sticky Footer Actions ─── */}
        <div className="border-t border-divider px-6 py-4 bg-white shrink-0">
          <div className="flex gap-3">
            {/* Apply button */}
            {applyUrl ? (
              <a
                href={applyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-ink text-white text-sm font-medium py-3 rounded-xl hover:bg-ink/90 transition-colors flex items-center justify-center gap-2"
              >
                Apply Now
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            ) : job.applicationEmail ? (
              <a
                href={`mailto:${job.applicationEmail}`}
                className="flex-1 bg-ink text-white text-sm font-medium py-3 rounded-xl hover:bg-ink/90 transition-colors flex items-center justify-center gap-2"
              >
                Apply via Email
                <Mail className="w-3.5 h-3.5" />
              </a>
            ) : (
              <button
                className="flex-1 bg-ink text-white text-sm font-medium py-3 rounded-xl hover:bg-ink/90 transition-colors flex items-center justify-center gap-2"
              >
                Apply Now
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            )}
            {/* Save */}
            <button
              className="w-11 h-11 border border-divider rounded-xl flex items-center justify-center text-muted hover:text-accent hover:border-accent/30 transition-colors shrink-0"
              title="Save listing"
            >
              <Bookmark className="w-4 h-4" />
            </button>
            {/* Share */}
            <button
              className="w-11 h-11 border border-divider rounded-xl flex items-center justify-center text-muted hover:text-accent hover:border-accent/30 transition-colors shrink-0"
              title="Share"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
