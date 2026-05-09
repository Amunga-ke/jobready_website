// ─── Job (Listing) ───
export interface Job {
  id: string;
  slug: string;
  title: string;
  companyName: string;
  companyLogo?: string | null;
  companyVerified: boolean;
  location: string;
  county: string;
  category: string;
  subcategory?: string;
  listingType: "JOB" | "GOVERNMENT" | "CASUAL" | "OPPORTUNITY";
  governmentLevel?: "NATIONAL" | "COUNTY" | "STATE_CORPORATION";
  opportunityType?: string;
  employmentType: string;
  experienceLevel: string;
  workMode: "ONSITE" | "REMOTE" | "HYBRID";
  salaryMin?: number | null;
  salaryMax?: number | null;
  salaryPeriod?: string;
  predictedSalary?: string;
  description: string;
  tags: string[];
  createdAt: string;
  deadline?: string | null;
  source?: string;
  applicationUrl?: string | null;
  applyCount?: number;
  featured: boolean;
}

// ─── Simplified card view (for listings) ───
export interface JobCard {
  id: string;
  slug: string;
  title: string;
  companyName: string;
  companyLogo?: string | null;
  companyVerified: boolean;
  location: string;
  county: string;
  listingType: Job["listingType"];
  category: string;
  employmentType: string;
  workMode: Job["workMode"];
  salaryMin?: number | null;
  salaryMax?: number | null;
  salaryPeriod?: string;
  createdAt: string;
  deadline?: string | null;
  featured: boolean;
  tags: string[];
}

// ─── Company ───
export interface Company {
  id: string;
  slug: string;
  name: string;
  logo?: string | null;
  verified: boolean;
  orgType: string;
  industry: string;
  location: string;
  county: string;
  description?: string;
  website?: string;
  employeeCount?: string;
  jobCount?: number;
}

// ─── Article ───
export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  coverImage?: string | null;
  author: string;
  publishedAt: string;
  readTime?: number;
}

// ─── Filter types ───
export interface JobFilters {
  q?: string;
  category?: string;
  subcategory?: string;
  location?: string;
  county?: string;
  employmentType?: string;
  experienceLevel?: string;
  workMode?: string;
  listingType?: string;
  governmentLevel?: string;
  opportunityType?: string;
  page?: number;
  limit?: number;
}
