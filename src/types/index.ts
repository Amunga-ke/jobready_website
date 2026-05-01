// =============================================================================
// Jobnet — Centralized Schema Definitions
// =============================================================================
// Single source of truth for all data structures used across the platform.
// Every component should import types from here.
// =============================================================================

// -----------------------------------------------------------------------------
// Enums & Literal Unions
// -----------------------------------------------------------------------------

/** Employment type of a job listing */
export type JobType =
  | 'Full-time'
  | 'Part-time'
  | 'Contract'
  | 'Internship'
  | 'Temporary'
  | 'Casual';

/** Seniority / experience level */
export type JobLevel =
  | 'Entry Level'
  | 'Mid Level'
  | 'Senior'
  | 'Executive'
  | 'Intern'
  | 'Any';

/** Government tier */
export type GovernmentTier = 'National' | 'County';

/** CV Banner visual variant */
export type CVBannerVariant = 'light' | 'dark';

/** Opportunities tab identifier */
export type OpportunityTabKey = 'e' | 'i' | 's';

// -----------------------------------------------------------------------------
// Core Entities
// -----------------------------------------------------------------------------

/**
 * Job — The canonical job listing entity.
 *
 * This is the richest schema and the foundation for every section that
 * displays job data. Components that only need a subset of fields should
 * still reference this type (via Pick/Omit) so that a single `Job` object
 * can be passed through without duplication.
 */
export interface Job {
  // ---- Identity ----
  /** Slug-style unique identifier, e.g. "safaricom-senior-accountant" */
  id: string;
  /** Job title, e.g. "Senior Accountant" */
  title: string;
  /** Employer / company name */
  company: string;
  /** Single uppercase letter derived from company name (used as avatar placeholder) */
  companyInitial: string;

  // ---- Classification ----
  /** Primary job category */
  category: JobCategory;
  /** Employment arrangement */
  type: JobType;
  /** Seniority level */
  level: JobLevel;

  // ---- Geography ----
  /** City / area / "Nationwide" / "Remote" */
  location: string;
  /** Whether the role offers remote work */
  isRemote: boolean;

  // ---- Compensation ----
  /** Human-readable salary range, e.g. "180,000 - 250,000" */
  salary: string;
  /** Currency symbol/code, e.g. "Ksh". Empty string for scholarships. */
  salaryCurrency: string;

  // ---- Timing ----
  /** Relative post time, e.g. "2m", "5d", "1w" */
  posted: string;
  /** Human-readable deadline text, e.g. "2d left", "Closes 15 Feb". Undefined = no stated deadline. */
  deadline?: string;
  /** Whether the deadline is imminent — used to highlight urgency in the UI */
  urgent?: boolean;

  // ---- Content ----
  /** Full job description (2-4 sentences) */
  description: string;
  /** Ordered list of requirements */
  requirements: string[];
  /** Keyword tags for search / filtering */
  tags: string[];

  // ---- Flags ----
  /** Government / public-sector position */
  isGovernment?: boolean;
  /** Published via Kenya Gazette notice (government only) */
  isGazette?: boolean;
  /** Casual / daily-wage listing */
  isCasual?: boolean;

  // ---- Casual-specific fields ----
  /** Pay rate for casual roles, e.g. "Ksh 500/day" */
  casualRate?: string;
  /** Extra context for casual roles, e.g. "Immediate start", "Own bike required" */
  casualNote?: string;
}

// -----------------------------------------------------------------------------
// Category
// -----------------------------------------------------------------------------

/**
 * A browsable job category with an aggregate count.
 * Used in the horizontal-scrolling Categories section.
 */
export interface JobCategoryEntry {
  /** Display name, e.g. "Technology & IT" */
  name: JobCategory;
  /** Aggregate count label, e.g. "2,300 jobs" */
  count: string;
  /** Whether this card gets the dark (ink) treatment in the UI */
  dark?: boolean;
}

/** All valid job category names */
export type JobCategory =
  | 'Technology & IT'
  | 'Finance & Accounting'
  | 'Sales & Business Dev'
  | 'Marketing & Comms'
  | 'Human Resources'
  | 'Engineering'
  | 'Healthcare & Medical'
  | 'Education & Training'
  | 'Operations & Admin'
  | 'Logistics & Supply Chain'
  | 'Hospitality & Tourism'
  | 'Legal & Compliance'
  | 'Creative Arts & Design'
  | 'Government & Public';

// -----------------------------------------------------------------------------
// Location / Geography
// -----------------------------------------------------------------------------

/**
 * A sub-area within a city (e.g. "CBD" inside "Nairobi").
 */
export interface Locality {
  /** Area name */
  name: string;
  /** Job count label */
  count: string;
}

/**
 * A city-level location with optional sub-areas.
 * Used in the "By Location" section.
 */
export interface CityLocation {
  /** City name */
  city: string;
  /** Total job count for the city */
  count: string;
  /** Optional breakdown by neighbourhood */
  areas?: Locality[];
}

// -----------------------------------------------------------------------------
// Job Updates / Timeline
// -----------------------------------------------------------------------------

/**
 * A single update event shown in the Job Updates timeline.
 * Each update references a Job by ID so clicking it opens the side-sheet modal.
 */
export interface JobUpdate {
  /** The update / event text */
  text: string;
  /** Relative timestamp, e.g. "12 min ago" */
  time: string;
  /** Whether this is an "active" event (green dot) vs historical (grey dot) */
  active: boolean;
  /** References the Job to open in the side-sheet modal */
  jobId: string;
}

// -----------------------------------------------------------------------------
// Section-specific lightweight views
// -----------------------------------------------------------------------------

/**
 * Row in the "Closing Soon" table.
 * A thin projection of Job used in the table layout.
 */
export interface ClosingSoonEntry {
  id: string;
  position: string;
  company: string;
  deadline: string;
  urgent: boolean;
}

/**
 * Item in the Hero sidebar "Just posted" list.
 */
export interface RecentJobEntry {
  id: string;
  title: string;
  company: string;
  location: string;
  /** Relative post time, e.g. "2m" */
  time: string;
}

/**
 * Item in the Featured section list.
 */
export interface FeaturedEntry {
  id: string;
  /** Company initial for avatar placeholder */
  letter: string;
  title: string;
  /** "Company · Location" combined string */
  company: string;
}

/**
 * A government job as displayed in the Government section.
 * National listings may carry a gazette flag.
 */
export interface GovernmentJobEntry {
  id: string;
  title: string;
  deadline: string;
  /** Only applicable to National-tier listings */
  gazette?: boolean;
}

/**
 * A casual / classified listing in the Casual & Part-Time section.
 */
export interface CasualJobEntry {
  id: string;
  title: string;
  location: string;
  rate: string;
  note: string;
}

/**
 * A tabbed entry in the Opportunities Tabs section.
 * The optional `accent` flag highlights scholarship deadlines.
 */
export interface OpportunityTabEntry {
  id: string;
  title: string;
  /** "Company · Location" or "Company · Scholarship Type" */
  company: string;
  /** Displayed in the right column — job type, duration, or deadline */
  type: string;
  /** Highlight text in accent colour (used for scholarships with deadlines) */
  accent?: boolean;
}

/**
 * Configuration for a single tab in the Opportunities Tabs section.
 */
export interface OpportunityTab {
  key: OpportunityTabKey;
  label: string;
  count: string;
}

// -----------------------------------------------------------------------------
// Career Resources
// -----------------------------------------------------------------------------

/**
 * An article in the Career Resources section.
 */
export interface Article {
  title: string;
  /** Estimated reading time, e.g. "3 min read" */
  time: string;
  /** Optional image URL (for the featured article) */
  imageUrl?: string;
  /** Optional image alt text */
  imageAlt?: string;
  /** Optional article category tag */
  category?: string;
  /** Optional article excerpt / summary */
  excerpt?: string;
}

// -----------------------------------------------------------------------------
// Employer / Company
// -----------------------------------------------------------------------------

/**
 * A trusted employer shown in the logo bar.
 */
export interface TrustedEmployer {
  /** Company display name */
  name: string;
  /** Optional logo URL (if using images instead of text) */
  logoUrl?: string;
}

// -----------------------------------------------------------------------------
// Navigation & Footer
// -----------------------------------------------------------------------------

/**
 * A link in the main navigation bar.
 */
export interface NavLink {
  label: string;
  href: string;
}

/**
 * A group of links in the footer (column).
 */
export interface FooterLinkGroup {
  /** Column heading */
  title: string;
  links: NavLink[];
}

/**
 * A social media link in the footer.
 */
export interface SocialLink {
  /** Platform name: 'x' | 'linkedin' | 'facebook' | 'instagram' | 'tiktok' */
  platform: string;
  href: string;
}

// -----------------------------------------------------------------------------
// Newsletter
// -----------------------------------------------------------------------------

/**
 * Newsletter subscription form payload.
 */
export interface NewsletterSubscription {
  email: string;
  /** Optional: where the user subscribed from */
  source?: 'section' | 'sticky_bar';
}

// -----------------------------------------------------------------------------
// Application / User Actions (for future use)
// -----------------------------------------------------------------------------

/**
 * Represents a user's saved/bookmarked job.
 */
export interface SavedJob {
  jobId: string;
  savedAt: string; // ISO 8601
}

/**
 * Represents a submitted job application.
 */
export interface JobApplication {
  jobId: string;
  applicantName: string;
  applicantEmail: string;
  /** Optional: URL to uploaded CV/resume */
  cvUrl?: string;
  /** Optional: cover letter text */
  coverLetter?: string;
  appliedAt: string; // ISO 8601
}

// -----------------------------------------------------------------------------
// Search & Filtering (for future use)
// -----------------------------------------------------------------------------

/**
 * Job search query parameters.
 */
export interface JobSearchQuery {
  /** Free-text search across title, company, tags */
  q?: string;
  /** Filter by category */
  category?: JobCategory;
  /** Filter by job type */
  type?: JobType;
  /** Filter by level */
  level?: JobLevel;
  /** Filter by location */
  location?: string;
  /** Remote-only flag */
  remote?: boolean;
  /** Government-only flag */
  government?: boolean;
  /** Cursor / pagination token */
  cursor?: string;
  /** Max items per page */
  limit?: number;
}

/**
 * Paginated job search response.
 */
export interface JobSearchResponse {
  jobs: Job[];
  total: number;
  nextCursor?: string;
  hasMore: boolean;
}
