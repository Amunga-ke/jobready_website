/**
 * Fallback Content Generator
 *
 * When a programmatic page has few or zero listings,
 * this module generates rich, useful fallback content
 * so the page is still valuable to visitors (even if noindexed).
 */

import { JOB_CATEGORIES, KE_COUNTIES, OPPORTUNITY_TYPES } from "@/lib/constants";
import type { JobCategory } from "@/lib/constants";

/**
 * Generate SEO-friendly intro text for a category page.
 */
export function getCategoryIntro(category: JobCategory): string {
  return `Find ${category.label.toLowerCase()} jobs in Kenya. Browse the latest openings, career advice, and salary guides for ${category.label.toLowerCase()} professionals.`;
}

/**
 * Generate SEO-friendly intro text for a county page.
 */
export function getCountyIntro(county: string): string {
  return `Discover jobs in ${county}, Kenya. Browse verified openings from top employers, salary data, and career resources for ${county} professionals.`;
}

/**
 * Generate SEO-friendly intro for a category × county combo page.
 */
export function getComboIntro(category: JobCategory, county: string): string {
  return `Browse ${category.label.toLowerCase()} jobs in ${county}, Kenya. Verified openings from local and national employers.`;
}

/**
 * Generate SEO-friendly intro for an opportunity type page.
 */
export function getOpportunityIntro(typeLabel: string): string {
  return `Discover the latest ${typeLabel.toLowerCase()} opportunities in Kenya. Application deadlines, eligibility, and how to apply.`;
}

/**
 * Get related categories for a county (categories that commonly have jobs there).
 * In production, this would query the DB. For now, show popular categories.
 */
export function getRelatedCategoriesForCounty(county: string): JobCategory[] {
  // Show top 6 categories as suggestions
  return JOB_CATEGORIES.slice(0, 6);
}

/**
 * Get nearby counties for related job suggestions.
 */
export function getNearbyCounties(county: string): string[] {
  const nearby: Record<string, string[]> = {
    "Nairobi": ["Kiambu", "Machakos", "Kajiado", "Nakuru", "Murang'a"],
    "Mombasa": ["Kilifi", "Kwale", "Taita Taveta", "Lamu"],
    "Kisumu": ["Siaya", "Homa Bay", "Migori", "Nyamira", "Kisii"],
    "Nakuru": ["Nairobi", "Narok", "Nyandarua", "Laikipia", "Nyeri"],
    "Eldoret": ["Uasin Gishu", "Trans Nzoia", "Nandi", "Elgeyo Marakwet"],
  };

  // Default: find geographically close counties
  const idx = KE_COUNTIES.indexOf(county as typeof KE_COUNTIES[number]);
  if (idx === -1) return KE_COUNTIES.slice(0, 5) as unknown as string[];

  const start = Math.max(0, idx - 2);
  const end = Math.min(KE_COUNTIES.length, idx + 5);
  return KE_COUNTIES.slice(start, end) as unknown as string[];
}

/**
 * Get salary context for a category (placeholder for AI-powered data).
 */
export function getSalaryContext(category: string): string | null {
  const salaryHints: Record<string, { range: string; note: string }> = {
    "TECHNOLOGY": { range: "KES 80,000 - 350,000", note: "per month" },
    "FINANCE_ACCOUNTING": { range: "KES 60,000 - 300,000", note: "per month" },
    "HEALTHCARE": { range: "KES 50,000 - 250,000", note: "per month" },
    "ENGINEERING": { range: "KES 70,000 - 280,000", note: "per month" },
    "HUMAN_RESOURCES": { range: "KES 50,000 - 200,000", note: "per month" },
    "MARKETING_COMMUNICATIONS": { range: "KES 40,000 - 180,000", note: "per month" },
    "EDUCATION": { range: "KES 30,000 - 150,000", note: "per month" },
    "SALES_BUSINESS": { range: "KES 35,000 - 200,000", note: "per month" },
    "GOVERNMENT_PUBLIC_SECTOR": { range: "KES 40,000 - 300,000", note: "per month (varies by grade)" },
  };

  const hint = salaryHints[category];
  return hint ? `${hint.range} ${hint.note}` : null;
}

/**
 * Generate breadcrumbs for structured data.
 */
export function generateBreadcrumbs(
  items: { label: string; href: string }[]
): { name: string; item: string }[] {
  return items.map((item) => ({
    name: item.label,
    item: `https://jobreadyke.co.ke${item.href}`,
  }));
}

/**
 * Generate JSON-LD structured data for a programmatic page.
 */
export function generateJobListingLd(
  type: "collection" | "category" | "location",
  name: string,
  description: string,
  url: string,
  count?: number
): object {
  return {
    "@context": "https://schema.org",
    "@type": type === "collection" ? "CollectionPage" : "ItemList",
    name,
    description,
    url,
    ...(count !== undefined && { numberOfItems: count }),
    isPartOf: {
      "@type": "WebSite",
      name: "JobReady",
      url: "https://jobreadyke.co.ke",
    },
  };
}

/**
 * Generate meta title and description for programmatic pages.
 */
export function generateMeta(
  type: "category" | "county" | "combo" | "opportunity" | "opp_county",
  params: {
    category?: string;
    subcategory?: string;
    county?: string;
    opportunity?: string;
    count?: number;
  }
): { title: string; description: string } {
  const { category, subcategory, county, opportunity, count } = params;

  switch (type) {
    case "category":
      return {
        title: `${category} Jobs in Kenya (${count || ""} Openings) | JobReady`,
        description: `Browse the latest ${category} jobs in Kenya. ${count || ""} verified openings from top employers. Apply now on JobReady.`,
      };

    case "county":
      return {
        title: `Jobs in ${county}, Kenya (${count || ""} Openings) | JobReady`,
        description: `Find jobs in ${county}, Kenya. ${count || ""} verified openings from local and national employers. Your next career move starts here.`,
      };

    case "combo":
      return {
        title: `${category} Jobs in ${county} (${count || ""} Openings) | JobReady`,
        description: `Browse ${category} jobs in ${county}, Kenya. ${count || ""} verified openings. Apply now on JobReady — Kenya's trusted job board.`,
      };

    case "opportunity":
      return {
        title: `${opportunity} Opportunities in Kenya | JobReady`,
        description: `Find ${opportunity} opportunities in Kenya. Deadlines, eligibility, and application guides. Updated daily on JobReady.`,
      };

    case "opp_county":
      return {
        title: `${opportunity} in ${county}, Kenya | JobReady`,
        description: `Discover ${opportunity} opportunities in ${county}, Kenya. Application details and deadlines on JobReady.`,
      };
  }
}
