/**
 * SEO Page Threshold System
 *
 * Controls which programmatic pages get indexed by Google.
 * A page is only indexable when it meets the minimum listing count
 * for its tier. This prevents thin-page penalties.
 *
 * Strategy:
 *  - Tier 1 (Hub pages): Always index — editorial content makes them useful regardless
 *  - Tier 2 (Category × County): Index when ≥3 listings
 *  - Tier 3 (Subcategory × County): Index when ≥5 listings
 *  - Tier 4 (Multi-dimension combos): Index when ≥3 listings
 */

export type SeoTier = "HUB" | "CATEGORY" | "COUNTY" | "CAT_COUNTY" | "SUBCAT_COUNTY" | "OPPORTUNITY" | "OPP_COUNTY";

export type IndexDirective = "index" | "noindex";

export interface SeoThreshold {
  /** Minimum published listings to index the page */
  minListings: number;
  /** Whether the page is always useful (editorial content) */
  alwaysUseful: boolean;
  /** Fallback behavior when below threshold */
  fallback: "noindex" | "redirect_parent" | "show_related";
}

export const SEO_THRESHOLDS: Record<SeoTier, SeoThreshold> = {
  /** /jobs/category/technology — always index, editorial content */
  HUB: { minListings: 0, alwaysUseful: true, fallback: "show_related" },

  /** /jobs/category/[slug] — always index with category content */
  CATEGORY: { minListings: 0, alwaysUseful: true, fallback: "show_related" },

  /** /jobs/in-[county] — always index with county content */
  COUNTY: { minListings: 0, alwaysUseful: true, fallback: "show_related" },

  /** /jobs/category/technology/in-nairobi — index when ≥3 */
  CAT_COUNTY: { minListings: 3, alwaysUseful: false, fallback: "show_related" },

  /** /jobs/category/technology/software-engineering/in-nairobi — index when ≥5 */
  SUBCAT_COUNTY: { minListings: 5, alwaysUseful: false, fallback: "noindex" },

  /** /opportunities/scholarship — always index */
  OPPORTUNITY: { minListings: 0, alwaysUseful: true, fallback: "show_related" },

  /** /opportunities/scholarship/in-nairobi — index when ≥3 */
  OPP_COUNTY: { minListings: 3, alwaysUseful: false, fallback: "show_related" },
};

/**
 * Determine whether a page should be indexed based on listing count and tier.
 * Returns the robots meta directive.
 */
export function shouldIndex(listingCount: number, tier: SeoTier): IndexDirective {
  const threshold = SEO_THRESHOLDS[tier];

  // Hub/always-useful pages always get indexed
  if (threshold.alwaysUseful) return "index";

  // Check against minimum
  return listingCount >= threshold.minListings ? "index" : "noindex";
}

/**
 * Get the full robots meta configuration for a page.
 */
export function getRobotsMeta(
  listingCount: number,
  tier: SeoTier
): { index: boolean; follow: boolean } {
  const directive = shouldIndex(listingCount, tier);

  // Even noindex pages should be followed (link equity flows through)
  return {
    index: directive === "index",
    follow: true,
  };
}

/**
 * Determine what to show when a page has fewer listings than the threshold.
 */
export function getFallbackStrategy(
  listingCount: number,
  tier: SeoTier
): SeoThreshold["fallback"] {
  const threshold = SEO_THRESHOLDS[tier];

  if (listingCount >= threshold.minListings) return "show_related";
  return threshold.fallback;
}

/**
 * Generate a canonical URL for a programmatic page.
 * Ensures consistent URL format for SEO.
 */
export function buildCanonicalUrl(
  basePath: string,
  params: Record<string, string>
): string {
  const url = new URL(basePath, "https://fursake.co.ke");
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });
  return url.toString();
}
