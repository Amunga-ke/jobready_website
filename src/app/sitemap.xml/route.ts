import type { MetadataRoute } from "next";
import prisma from "@/lib/prisma";
import { OPPORTUNITY_TYPES, KE_COUNTIES, slugifyCounty } from "@/lib/constants";

const SITE_URL = "https://jobreadyke.co.ke";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [
    categories,
    counties,
    listings,
    updates,
  ] = await Promise.all([
    prisma.category.findMany({
      where: { active: true },
      select: { slug: true, updatedAt: true },
    }),
    prisma.county.findMany({
      where: { active: true },
      select: { slug: true, name: true, updatedAt: true },
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
  ]);

  const now = new Date();

  // 1. Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/jobs`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/government`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/opportunities`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/casual`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/companies`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/articles`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/updates`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.5,
    },
  ];

  // 2. Government level pages
  const governmentLevels: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/government/national`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/government/county`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/government/state-corporations`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ];

  // 3. Category pages
  const categoryPages: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${SITE_URL}/jobs/category/${cat.slug}`,
    lastModified: cat.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // 4. County pages (from DB)
  const countyPages: MetadataRoute.Sitemap = counties.map((county) => ({
    url: `${SITE_URL}/jobs/in-${county.slug}`,
    lastModified: county.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // 5. Opportunity type pages
  const opportunityPages: MetadataRoute.Sitemap = OPPORTUNITY_TYPES.map((opp) => ({
    url: `${SITE_URL}/opportunities/${opp.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // 6. Individual job listings
  const jobPages: MetadataRoute.Sitemap = listings.map((listing) => ({
    url: `${SITE_URL}/jobs/${listing.slug}`,
    lastModified: listing.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  // 7. Individual updates
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
    ...jobPages,
    ...updatePages,
  ];
}
