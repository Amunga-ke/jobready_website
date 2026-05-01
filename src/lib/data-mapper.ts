// =============================================================================
// Jobnet — Data Mapper (Prisma → Frontend Types)
// =============================================================================
// Transforms database query results into the flat, display-level types that
// the UI components expect.  Centralised here so every API route stays thin.
// =============================================================================

import type {
  Job,
  JobCategory,
  JobType,
  JobLevel,
  JobCategoryEntry,
  ClosingSoonEntry,
  FeaturedEntry,
  GovernmentJobEntry,
  CasualJobEntry,
  RecentJobEntry,
  OpportunityTabEntry,
  CityLocation,
  Locality,
  Currency,
} from '@/types';

// ---------------------------------------------------------------------------
// Enum mappers
// ---------------------------------------------------------------------------

/** Maps a DB EmploymentType enum to a display JobType string */
const EMPLOYMENT_TYPE_MAP: Record<string, JobType> = {
  FULL_TIME: 'Full-time',
  PART_TIME: 'Part-time',
  CONTRACT: 'Contract',
  TEMPORARY: 'Temporary',
  INTERNSHIP: 'Internship',
  VOLUNTEER: 'Volunteer',
};

/** Maps a DB ExperienceLevel enum to a display JobLevel string */
const EXPERIENCE_LEVEL_MAP: Record<string, JobLevel> = {
  ENTRY_LEVEL: 'Entry Level',
  INTERNSHIP: 'Intern',
  MID_LEVEL: 'Mid Level',
  SENIOR: 'Senior',
  LEAD: 'Senior',
  MANAGER: 'Senior',
  DIRECTOR: 'Executive',
  EXECUTIVE: 'Executive',
};

/** Maps a DB Currency enum to a display symbol */
const CURRENCY_SYMBOL_MAP: Record<string, string> = {
  KES: 'Ksh',
  USD: '$',
  EUR: '€',
  GBP: '£',
  UGX: 'UGX',
  TZS: 'TZS',
  RWF: 'RWF',
  ZAR: 'ZAR',
  NGN: 'NGN',
  CAD: 'C$',
  AUD: 'A$',
  INR: '₹',
  CNY: '¥',
};

// ---------------------------------------------------------------------------
// Time helpers
// ---------------------------------------------------------------------------

function relativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);
  const diffWk = Math.floor(diffDay / 7);
  const diffMo = Math.floor(diffDay / 30);

  if (diffSec < 60) return 'Just now';
  if (diffMin < 60) return `${diffMin}m`;
  if (diffHr < 24) return `${diffHr}h`;
  if (diffDay < 7) return `${diffDay}d`;
  if (diffWk < 5) return `${diffWk}w`;
  return `${diffMo}mo`;
}

function deadlineText(date: Date): { text: string; urgent: boolean } {
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffDay = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDay < 0) return { text: 'Closed', urgent: false };
  if (diffDay === 0) return { text: 'Closes today', urgent: true };
  if (diffDay === 1) return { text: '1d left', urgent: true };
  if (diffDay <= 3) return { text: `${diffDay}d left`, urgent: true };
  if (diffDay <= 7) return { text: `${diffDay}d left`, urgent: false };

  // Format as "Closes DD Mon"
  const day = date.getDate();
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];
  const month = months[date.getMonth()];
  return { text: `Closes ${day} ${month}`, urgent: false };
}

function formatSalary(min: number | null | undefined, max: number | null | undefined): string {
  if (min == null && max == null) return 'Competitive';
  const fmt = (n: number) => n.toLocaleString('en-KE');
  if (min != null && max != null) return `${fmt(min)} - ${fmt(max)}`;
  if (min != null) return `From ${fmt(min)}`;
  return `Up to ${fmt(max!)}`;
}

// ---------------------------------------------------------------------------
// Prisma include payload type (what the queries return)
// ---------------------------------------------------------------------------

/**
 * Shape of a Prisma Job query result when `include` is used for
 * company, category, location, and tags.
 */
export interface PrismaJobRow {
  id: string;
  slug: string;
  title: string;
  description: string;
  requirements: string; // JSON string
  type: string;
  level: string;
  salaryMin: number | null;
  salaryMax: number | null;
  salaryCurrency: string;
  casualRate: string | null;
  casualNote: string | null;
  isCasual: boolean;
  isGovernment: boolean;
  isGazette: boolean;
  isFeatured: boolean;
  isUrgent: boolean;
  isRemote: boolean;
  postedAt: Date;
  deadlineAt: Date | null;
  companyId: string;
  category: { id: string; name: string; slug: string };
  subcategory: { id: string; name: string; slug: string } | null;
  location: { id: string; name: string; slug: string; type: string };
  company: { id: string; name: string; slug: string; logoUrl: string | null; isGovernment: boolean };
  tags: Array<{ tagId: string; jobId: string; tagIdRef: { id: string; name: string; slug: string } }>;
}

// ---------------------------------------------------------------------------
// Core mapper
// ---------------------------------------------------------------------------

/** Maps a Prisma Job row to the frontend `Job` type. */
export function mapJobToView(job: PrismaJobRow): Job {
  const deadline = job.deadlineAt ? deadlineText(new Date(job.deadlineAt)) : null;
  return {
    id: job.slug,
    title: job.title,
    company: job.company.name,
    companyInitial: job.company.name.charAt(0).toUpperCase(),
    category: (job.category.name as JobCategory) || 'Other',
    type: EMPLOYMENT_TYPE_MAP[job.type] || job.type,
    level: EXPERIENCE_LEVEL_MAP[job.level] || job.level,
    location: job.location.name,
    salary: formatSalary(job.salaryMin, job.salaryMax),
    salaryCurrency: CURRENCY_SYMBOL_MAP[job.salaryCurrency] || job.salaryCurrency,
    posted: relativeTime(new Date(job.postedAt)),
    deadline: deadline?.text,
    urgent: deadline?.urgent ?? (job.deadlineAt
      ? (new Date(job.deadlineAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24) <= 3
      : false),
    description: job.description,
    requirements: safeParseJson(job.requirements, []),
    tags: (job.tags || []).map((t) => t.tagIdRef?.name || ''),
    isRemote: job.isRemote,
    isGovernment: job.isGovernment,
    isGazette: job.isGazette,
    isCasual: job.isCasual,
    casualRate: job.casualRate || undefined,
    casualNote: job.casualNote || undefined,
  };
}

// ---------------------------------------------------------------------------
// Section-specific mappers
// ---------------------------------------------------------------------------

/** Maps Prisma Jobs to ClosingSoonEntry[] for the "Closing Soon" table. */
export function mapToClosingSoon(jobs: PrismaJobRow[]): ClosingSoonEntry[] {
  return jobs.map((job) => {
    const deadline = job.deadlineAt
      ? deadlineText(new Date(job.deadlineAt))
      : { text: 'No deadline', urgent: false };
    return {
      id: job.slug,
      position: job.title,
      company: job.company.name,
      deadline: deadline.text,
      urgent: deadline.urgent,
    };
  });
}

/** Maps Prisma Jobs to RecentJobEntry[] for the Hero sidebar. */
export function mapToRecent(jobs: PrismaJobRow[]): RecentJobEntry[] {
  return jobs.map((job) => ({
    id: job.slug,
    title: job.title,
    company: job.company.name,
    location: job.location.name,
    time: relativeTime(new Date(job.postedAt)),
  }));
}

/** Maps Prisma Jobs to FeaturedEntry[] for the Featured section. */
export function mapToFeatured(jobs: PrismaJobRow[]): FeaturedEntry[] {
  return jobs.map((job) => ({
    id: job.slug,
    letter: job.company.name.charAt(0).toUpperCase(),
    title: job.title,
    company: `${job.company.name} · ${job.location.name}`,
  }));
}

/** Maps Prisma Jobs to GovernmentJobEntry[] for the Government section. */
export function mapToGovernment(jobs: PrismaJobRow[]): GovernmentJobEntry[] {
  return jobs.map((job) => {
    const deadline = job.deadlineAt
      ? deadlineText(new Date(job.deadlineAt))
      : { text: 'Open', urgent: false };
    return {
      id: job.slug,
      title: job.title,
      deadline: deadline.text,
      gazette: job.isGazette || undefined,
    };
  });
}

/** Maps Prisma Jobs to CasualJobEntry[] for the Casual section. */
export function mapToCasual(jobs: PrismaJobRow[]): CasualJobEntry[] {
  return jobs.map((job) => ({
    id: job.slug,
    title: job.title,
    location: job.location.name,
    rate: job.casualRate || 'Negotiable',
    note: job.casualNote || '',
  }));
}

/** Maps Prisma Jobs to OpportunityTabEntry[] for Opportunities tabs. */
export function mapToOpportunities(jobs: PrismaJobRow[]): OpportunityTabEntry[] {
  return jobs.map((job) => {
    const deadline = job.deadlineAt ? deadlineText(new Date(job.deadlineAt)) : null;
    return {
      id: job.slug,
      title: job.title,
      company: `${job.company.name} · ${job.location.name}`,
      type: EMPLOYMENT_TYPE_MAP[job.type] || job.type,
      accent: deadline?.urgent ?? false,
    };
  });
}

// ---------------------------------------------------------------------------
// Category / Location mappers
// ---------------------------------------------------------------------------

interface PrismaCategoryRow {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  jobCount: number;
}

/** Maps Prisma Categories to JobCategoryEntry[] for the Categories section. */
export function mapToCategories(categories: PrismaCategoryRow[]): JobCategoryEntry[] {
  const darkSlugs = ['GOVERNMENT_PUBLIC_SECTOR', 'HEALTHCARE', 'ENGINEERING', 'TECHNOLOGY'];
  return categories.map((cat) => ({
    name: cat.name as JobCategory,
    count: cat.jobCount.toLocaleString('en-KE') + ' jobs',
    dark: darkSlugs.includes(cat.slug),
  }));
}

interface PrismaLocationRow {
  id: string;
  name: string;
  slug: string;
  type: string;
  childLocations: PrismaLocationRow[];
  _count: { jobs: number };
}

/** Maps Prisma Locations to CityLocation[] for the By Location section. */
export function mapToLocations(locations: PrismaLocationRow[]): CityLocation[] {
  return locations
    .filter((loc) => loc._count.jobs > 0)
    .map((loc) => {
      const areas: Locality[] | undefined =
        loc.childLocations && loc.childLocations.length > 0
          ? loc.childLocations
              .filter((child) => child._count?.jobs > 0)
              .map((child) => ({
                name: child.name,
                count: (child._count?.jobs || 0).toLocaleString('en-KE') + ' jobs',
              }))
          : undefined;

      return {
        city: loc.name,
        count: loc._count.jobs.toLocaleString('en-KE') + ' jobs',
        areas,
      };
    });
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function safeParseJson<T>(str: string, fallback: T): T {
  try {
    const parsed = JSON.parse(str);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}
