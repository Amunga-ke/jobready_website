// =============================================================================
// Jobnet — Data Mapper (Prisma → Frontend Types)
// =============================================================================
// Transforms database query results into the flat, display-level types that
// the UI components expect.  Centralised here so every API route stays thin.
// =============================================================================
// v2 — adapted for the unified Listing + lookup-table schema.
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
} from '@/types';

// ---------------------------------------------------------------------------
// Prisma query result shape
// ---------------------------------------------------------------------------

/**
 * Shape of a Prisma `Listing` query result when the full include is used
 * (organization → organizationType, listingType, category, location,
 *  jobDetail → employmentType / experienceLevel / educationLevel / currency).
 */
export interface PrismaListingRow {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  description: string;
  tags: string; // JSON array of strings
  status: string;
  isVerified: boolean;
  isFeatured: boolean;
  postedAt: Date;
  deadlineDate: Date | null;
  sourceUrl: string | null;
  applicationUrl: string | null;

  // FK relations
  organization: {
    id: string;
    name: string;
    slug: string;
    organizationType: {
      id: string;
      code: string;
      name: string;
    };
    industry: {
      id: string;
      code: string;
      name: string;
    } | null;
    location: {
      id: string;
      name: string;
    } | null;
  } | null;

  listingType: {
    id: string;
    code: string;
    name: string;
  };

  category: {
    id: string;
    name: string;
    slug: string;
    type: string;
  } | null;

  location: {
    id: string;
    name: string;
    slug: string;
    type: string;
  } | null;

  jobDetail: {
    id: string;
    workMode: string;
    salaryMin: number | null;
    salaryMax: number | null;
    salaryDisplay: string;
    salaryPeriod: string;
    employmentType: {
      id: string;
      code: string;
      name: string;
    } | null;
    experienceLevel: {
      id: string;
      code: string;
      name: string;
    } | null;
    educationLevel: {
      id: string;
      code: string;
      name: string;
    } | null;
    currency: {
      id: string;
      code: string;
      name: string;
      symbol: string;
    } | null;
    vacanciesCount: number | null;
    startDate: Date | null;
    contractDuration: string | null;
  } | null;
}

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

/** Derive the employment type string for the frontend `Job.type` field */
function resolveListingType(listing: PrismaListingRow): JobType {
  // If the listing type itself maps to a known JobType, use it directly
  const code = listing.listingType?.code;
  if (code === 'CASUAL') return 'Casual';
  if (code === 'INTERNSHIP') return 'Internship';

  // For job-type listings, prefer the employmentType from jobDetail
  const empName = listing.jobDetail?.employmentType?.name;
  if (empName) return empName as JobType;

  // Fall back to the listing type name
  const ltName = listing.listingType?.name;
  if (ltName) return ltName as JobType;

  return 'Full-time';
}

/** Derive the experience level string for the frontend `Job.level` field */
function resolveExperienceLevel(listing: PrismaListingRow): JobLevel {
  const name = listing.jobDetail?.experienceLevel?.name;
  if (name) return name as JobLevel;
  return 'Any';
}

/** Detect whether this listing is a government position */
function isGovernmentListing(listing: PrismaListingRow): boolean {
  const orgCode = listing.organization?.organizationType?.code;
  return orgCode === 'NATIONAL_GOV' || orgCode === 'COUNTY_GOV';
}

/** Detect whether this listing is remote */
function isRemoteListing(listing: PrismaListingRow): boolean {
  if (listing.jobDetail?.workMode === 'REMOTE') return true;
  if (listing.location === null) return true;
  return false;
}

/** Extract casual rate from tags or summary */
function extractCasualRate(listing: PrismaListingRow): string | undefined {
  const parsedTags = safeParseJson<string[]>(listing.tags, []);
  // Look for a tag like "Ksh 500/day" or "500/day"
  const rateTag = parsedTags.find(
    (t) => /(?:Ksh\s*)?[\d,]+\/(?:day|hr|hour)/i.test(t),
  );
  if (rateTag) return rateTag;
  return undefined;
}

/** Extract casual note from tags or summary */
function extractCasualNote(listing: PrismaListingRow): string | undefined {
  const parsedTags = safeParseJson<string[]>(listing.tags, []);
  // Look for contextual tags like "Immediate start", "Own tools", etc.
  const noteTag = parsedTags.find(
    (t) =>
      /immediate|urgent|own\s+(tools|bike|car)|flexible|weekend/i.test(t),
  );
  if (noteTag) return noteTag;
  // Fall back to summary if present
  return listing.summary || undefined;
}

// ---------------------------------------------------------------------------
// Core mapper
// ---------------------------------------------------------------------------

/** Maps a Prisma Listing row (with full include) to the frontend `Job` type. */
export function mapJobToView(listing: PrismaListingRow): Job {
  const companyName = listing.organization?.name ?? 'Various';
  const deadline = listing.deadlineDate
    ? deadlineText(new Date(listing.deadlineDate))
    : null;
  const isGov = isGovernmentListing(listing);
  const isCasual = listing.listingType?.code === 'CASUAL';

  return {
    id: listing.slug,
    title: listing.title,
    company: companyName,
    companyInitial: companyName.charAt(0).toUpperCase(),
    category: (listing.category?.name as JobCategory) || 'Other',
    type: resolveListingType(listing),
    level: resolveExperienceLevel(listing),
    location: listing.location?.name ?? 'Remote',
    salary: formatSalary(
      listing.jobDetail?.salaryMin,
      listing.jobDetail?.salaryMax,
    ),
    salaryCurrency: listing.jobDetail?.currency?.symbol ?? '',
    posted: relativeTime(new Date(listing.postedAt)),
    deadline: deadline?.text,
    urgent: deadline?.urgent ?? false,
    description: listing.description,
    requirements: [], // requirements are embedded in description now
    tags: safeParseJson<string[]>(listing.tags, []),
    isRemote: isRemoteListing(listing),
    isGovernment: isGov || undefined,
    isCasual: isCasual || undefined,
    casualRate: isCasual ? (extractCasualRate(listing) || 'Negotiable') : undefined,
    casualNote: isCasual ? (extractCasualNote(listing) || '') : undefined,
  };
}

// ---------------------------------------------------------------------------
// Section-specific mappers
// ---------------------------------------------------------------------------

/** Maps Prisma Listings to ClosingSoonEntry[] for the "Closing Soon" table. */
export function mapToClosingSoon(listings: PrismaListingRow[]): ClosingSoonEntry[] {
  return listings.map((listing) => {
    const deadline = listing.deadlineDate
      ? deadlineText(new Date(listing.deadlineDate))
      : { text: 'No deadline', urgent: false };
    return {
      id: listing.slug,
      position: listing.title,
      company: listing.organization?.name ?? 'Various',
      deadline: deadline.text,
      urgent: deadline.urgent,
    };
  });
}

/** Maps Prisma Listings to RecentJobEntry[] for the Hero sidebar. */
export function mapToRecent(listings: PrismaListingRow[]): RecentJobEntry[] {
  return listings.map((listing) => ({
    id: listing.slug,
    title: listing.title,
    company: listing.organization?.name ?? 'Various',
    location: listing.location?.name ?? 'Remote',
    time: relativeTime(new Date(listing.postedAt)),
  }));
}

/** Maps Prisma Listings to FeaturedEntry[] for the Featured section. */
export function mapToFeatured(listings: PrismaListingRow[]): FeaturedEntry[] {
  return listings.map((listing) => {
    const companyName = listing.organization?.name ?? 'Various';
    return {
      id: listing.slug,
      letter: companyName.charAt(0).toUpperCase(),
      title: listing.title,
      company: `${companyName} · ${listing.location?.name ?? 'Remote'}`,
    };
  });
}

/** Maps Prisma Listings to GovernmentJobEntry[] for the Government section. */
export function mapToGovernment(listings: PrismaListingRow[]): GovernmentJobEntry[] {
  return listings.map((listing) => {
    const deadline = listing.deadlineDate
      ? deadlineText(new Date(listing.deadlineDate))
      : { text: 'Open', urgent: false };
    return {
      id: listing.slug,
      title: listing.title,
      deadline: deadline.text,
    };
  });
}

/** Maps Prisma Listings to CasualJobEntry[] for the Casual section. */
export function mapToCasual(listings: PrismaListingRow[]): CasualJobEntry[] {
  return listings.map((listing) => ({
    id: listing.slug,
    title: listing.title,
    location: listing.location?.name ?? 'Remote',
    rate: extractCasualRate(listing) || 'Negotiable',
    note: extractCasualNote(listing) || '',
  }));
}

/** Maps Prisma Listings to OpportunityTabEntry[] for Opportunities tabs. */
export function mapToOpportunities(listings: PrismaListingRow[]): OpportunityTabEntry[] {
  return listings.map((listing) => {
    const deadline = listing.deadlineDate
      ? deadlineText(new Date(listing.deadlineDate))
      : null;
    const companyName = listing.organization?.name ?? 'Various';
    return {
      id: listing.slug,
      title: listing.title,
      company: `${companyName} · ${listing.location?.name ?? 'Remote'}`,
      type: resolveListingType(listing),
      accent: deadline?.urgent ?? false,
    };
  });
}

// ---------------------------------------------------------------------------
// Category mapper
// ---------------------------------------------------------------------------

interface PrismaCategoryRow {
  id: string;
  name: string;
  slug: string;
  listingCount: number;
  children?: Array<{
    id: string;
    name: string;
    slug: string;
    listingCount: number;
  }>;
}

/** Maps Prisma Categories to JobCategoryEntry[] for the Categories section. */
export function mapToCategories(categories: PrismaCategoryRow[]): JobCategoryEntry[] {
  const darkSlugs = [
    'government-public-sector',
    'healthcare',
    'engineering',
    'technology',
  ];
  return categories
    .filter((cat) => cat.listingCount > 0)
    .map((cat) => ({
      name: cat.name as JobCategory,
      count: cat.listingCount.toLocaleString('en-KE') + ' jobs',
      dark: darkSlugs.includes(cat.slug.toLowerCase()),
    }));
}

// ---------------------------------------------------------------------------
// Location mapper
// ---------------------------------------------------------------------------

interface PrismaLocationRow {
  id: string;
  name: string;
  slug: string;
  type: string;
  children: PrismaLocationRow[];
  _count: { listings: number };
}

/** Maps Prisma Locations to CityLocation[] for the By Location section. */
export function mapToLocations(locations: PrismaLocationRow[]): CityLocation[] {
  return locations
    .filter((loc) => loc._count.listings > 0)
    .map((loc) => {
      const areas: Locality[] | undefined =
        loc.children && loc.children.length > 0
          ? loc.children
              .filter((child) => child._count?.listings > 0)
              .map((child) => ({
                name: child.name,
                count: (child._count?.listings || 0).toLocaleString('en-KE') + ' jobs',
              }))
          : undefined;

      return {
        city: loc.name,
        count: loc._count.listings.toLocaleString('en-KE') + ' jobs',
        areas,
      };
    });
}
