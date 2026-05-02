import type { MetadataRoute } from "next";
import prisma from "@/lib/prisma";
import { OPPORTUNITY_TYPES, KE_COUNTIES, slugifyCounty, JOB_CATEGORIES } from "@/lib/constants";
import { SEO_THRESHOLDS } from "@/lib/seo/page-thresholds";

const SITE_URL = "https://jobreadyke.co.ke";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [
    categoriesWithSubs,
    counties,
    listings,
    updates,
    categoryCountyCounts,
    opportunityCountyCounts,
  ] = await Promise.all([
    prisma.category.findMany({
      where: { active: true },
      select: {
        id: true,
        slug: true,
        subcategories: {
          where: { active: true },
          select: { slug: true },
        },
      },
    }),
    prisma.county.findMany({
      where: { active: true },
      select: { slug: true, name: true },
    }),
    prisma.listing.findMany({
      where: { status: "ACTIVE" },
      select: { slug: true, updatedAt: true },
      orderBy: { createdAt: "desc" },
      take: 1000,
    }),
    prisma.jobUpdate.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true, updatedAt: true },
      orderBy: { createdAt: "desc" },
      take: 200,
    }),
    // Get counts for all category × county combos to filter thin pages
    prisma.listing.groupBy({
      by: ["categoryId", "countyId"],
      where: { status: "ACTIVE" },
      _count: true,
    }),
    // Get counts for all opportunity × county combos to filter thin pages
    prisma.listing.groupBy({
      by: ["opportunityType", "countyId"],
      where: { status: "ACTIVE", opportunityType: { not: null } },
      _count: true,
    }),
  ]);

  // Build lookup maps for combo counts
  const catCountyCountMap = new Map<string, number>();
  for (const row of categoryCountyCounts) {
    catCountyCountMap.set(`${row.categoryId}-${row.countyId}`, row._count);
  }

  const oppCountyCountMap = new Map<string, number>();
  for (const row of opportunityCountyCounts) {
    oppCountyCountMap.set(`${row.opportunityType}-${row.countyId}`, row._count);
  }

  // Fetch county IDs for slug lookup
  const allCounties = await prisma.county.findMany({
    select: { id: true, slug: true },
  });
  const countyIdMap = new Map(allCounties.map((c) => [c.id, c.slug]));

  // Fetch category IDs for slug lookup
  const allCategories = await prisma.category.findMany({
    select: { id: true, slug: true },
  });
  const catIdMap = new Map(allCategories.map((c) => [c.id, c.slug]));

  const now = new Date();
  const catCountyThreshold = SEO_THRESHOLDS.CAT_COUNTY.minListings; // 3
  const oppCountyThreshold = SEO_THRESHOLDS.OPP_COUNTY.minListings; // 3

  // 1. Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${SITE_URL}/jobs`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/government`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/opportunities`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE_URL}/casual`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE_URL}/companies`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/articles`, lastModified: now, changeFrequency: "weekly", priority: 0.5 },
    { url: `${SITE_URL}/updates`, lastModified: now, changeFrequency: "daily", priority: 0.5 },
  ];

  // 2. Government level pages
  const governmentLevels: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/government/national`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/government/county`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/government/state-corporations`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
  ];

  // 3. Category pages (always index)
  const categoryPages: MetadataRoute.Sitemap = categoriesWithSubs.flatMap((cat) => {
    const pages: MetadataRoute.Sitemap = [
      {
        url: `${SITE_URL}/jobs/category/${cat.slug}`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      },
    ];
    // Subcategory pages
    for (const sub of cat.subcategories) {
      pages.push({
        url: `${SITE_URL}/jobs/category/${cat.slug}/${sub.slug}`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.6,
      });
    }
    return pages;
  });

  // 4. County pages (always index)
  const countyPages: MetadataRoute.Sitemap = counties.map((county) => ({
    url: `${SITE_URL}/jobs/in-${county.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // 5. Opportunity type pages (always index)
  const opportunityPages: MetadataRoute.Sitemap = OPPORTUNITY_TYPES.map((opp) => ({
    url: `${SITE_URL}/opportunities/${opp.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // 6. Category × County combo pages — ONLY include if above threshold (≥3 listings)
  // Use groupBy results directly (they already have categoryId + countyId)
  const catCountyPages: MetadataRoute.Sitemap = [];
  for (const row of categoryCountyCounts) {
    if (row._count >= catCountyThreshold && row.categoryId && row.countyId) {
      const catSlug = catIdMap.get(row.categoryId);
      const countySlug = countyIdMap.get(row.countyId);
      if (catSlug && countySlug) {
        catCountyPages.push({
          url: `${SITE_URL}/jobs/category/${catSlug}/in-${countySlug}`,
          lastModified: now,
          changeFrequency: "weekly" as const,
          priority: 0.6,
        });
      }
    }
  }

  // 7. Opportunity × County combo pages — ONLY include if above threshold (≥3 listings)
  const oppCountyPages: MetadataRoute.Sitemap = [];
  for (const row of opportunityCountyCounts) {
    if (row._count >= oppCountyThreshold && row.countyId) {
      const countySlug = countyIdMap.get(row.countyId);
      const oppType = row.opportunityType;
      if (countySlug && oppType) {
        const oppSlug = oppType.toLowerCase().replace(/_/g, "-");
        oppCountyPages.push({
          url: `${SITE_URL}/opportunities/${oppSlug}/in-${countySlug}`,
          lastModified: now,
          changeFrequency: "weekly" as const,
          priority: 0.6,
        });
      }
    }
  }

  // 8. Individual job listings
  const jobPages: MetadataRoute.Sitemap = listings.map((listing) => ({
    url: `${SITE_URL}/jobs/${listing.slug}`,
    lastModified: listing.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  // 9. Individual updates
  const updatePages: MetadataRoute.Sitemap = updates.map((update) => ({
    url: `${SITE_URL}/updates/${update.slug}`,
    lastModified: update.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  return [
    ...staticPages,
    ...governmentLevels,
    ...categoryPages,
    ...countyPages,
    ...opportunityPages,
    ...catCountyPages,
    ...oppCountyPages,
    ...jobPages,
    ...updatePages,
  ];
}
