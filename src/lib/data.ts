import prisma from "@/lib/prisma";
import { listingToJob } from "@/lib/transforms";
import type { Job } from "@/types";

// ─── Featured Jobs ───
export async function getFeaturedJobs(): Promise<Job[]> {
  const listings = await prisma.listing.findMany({
    where: { featured: true, status: "ACTIVE" },
    include: { company: true, category: true, subcategory: true, tags: { include: { tag: true } } },
    orderBy: { createdAt: "desc" },
    take: 6,
  }).catch(() => []);
  return listings.map(listingToJob);
}

// ─── Just Posted (latest jobs) ───
export async function getJustPosted(): Promise<Job[]> {
  const listings = await prisma.listing.findMany({
    where: { status: "ACTIVE", listingType: { in: ["JOB", "GOVERNMENT"] } },
    include: { company: true, category: true, subcategory: true, tags: { include: { tag: true } } },
    orderBy: { createdAt: "desc" },
    take: 4,
  }).catch(() => []);
  return listings.map(listingToJob);
}

// ─── Closing Soon ───
export async function getClosingSoon(): Promise<Job[]> {
  const now = new Date();
  const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

  // Try 3-day window first, fall back to 14-day window if nothing found
  let listings = await prisma.listing.findMany({
    where: {
      status: "ACTIVE",
      deadline: { gt: now, lte: threeDaysFromNow },
    },
    include: { company: true, category: true, subcategory: true, tags: { include: { tag: true } } },
    orderBy: { deadline: "asc" },
    take: 10,
  }).catch(() => []);

  if (listings.length === 0) {
    const fourteenDays = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
    listings = await prisma.listing.findMany({
      where: {
        status: "ACTIVE",
        deadline: { gt: now, lte: fourteenDays },
      },
      include: { company: true, category: true, subcategory: true, tags: { include: { tag: true } } },
      orderBy: { deadline: "asc" },
      take: 10,
    }).catch(() => []);
  }

  return listings.map(listingToJob);
}

// ─── Government Jobs by Level (for /government/[level] pages) ───
export async function getGovernmentJobsByLevel(level: "NATIONAL" | "COUNTY" | "STATE_CORPORATION") {
  const listings = await prisma.listing.findMany({
    where: { status: "ACTIVE", listingType: "GOVERNMENT", governmentLevel: level },
    include: { company: true, category: true, subcategory: true, tags: { include: { tag: true } } },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  return listings.map(listingToJob);
}

// ─── Government Jobs (homepage) ───
export async function getGovernmentJobs() {
  const [national, county] = await Promise.all([
    prisma.listing.findMany({
      where: { status: "ACTIVE", listingType: "GOVERNMENT", governmentLevel: "NATIONAL" },
      include: { company: true, category: true, subcategory: true, tags: { include: { tag: true } } },
      orderBy: { createdAt: "desc" },
      take: 5,
    }).catch(() => []),
    prisma.listing.findMany({
      where: { status: "ACTIVE", listingType: "GOVERNMENT", governmentLevel: "COUNTY" },
      include: { company: true, category: true, subcategory: true, tags: { include: { tag: true } } },
      orderBy: { createdAt: "desc" },
      take: 5,
    }).catch(() => []),
  ]);

  return {
    national: national.map(listingToJob),
    county: county.map(listingToJob),
  };
}

// ─── Casual & Part-Time ───
export async function getCasualJobs(): Promise<Job[]> {
  const listings = await prisma.listing.findMany({
    where: { status: "ACTIVE", listingType: "CASUAL" },
    include: { company: true, tags: { include: { tag: true } } },
    orderBy: { createdAt: "desc" },
    take: 8,
  }).catch(() => []);
  return listings.map(listingToJob);
}

// ─── Opportunities Hub ───
export async function getOpportunities() {
  // Each query has its own .catch() so a single connection failure
  // doesn't kill the entire function
  const [internships, scholarships, entryLevel] = await Promise.all([
    prisma.listing.findMany({
      where: { status: "ACTIVE", opportunityType: "INTERNSHIP" },
      include: { company: true, category: true, subcategory: true, tags: { include: { tag: true } } },
      orderBy: { createdAt: "desc" },
      take: 5,
    }).catch(() => []),
    prisma.listing.findMany({
      where: { status: "ACTIVE", opportunityType: "SCHOLARSHIP" },
      include: { company: true, category: true, subcategory: true, tags: { include: { tag: true } } },
      orderBy: { createdAt: "desc" },
      take: 5,
    }).catch(() => []),
    prisma.listing.findMany({
      where: { status: "ACTIVE", experienceLevel: "Entry-level", listingType: { in: ["JOB", "OPPORTUNITY"] } },
      include: { company: true, category: true, subcategory: true, tags: { include: { tag: true } } },
      orderBy: { createdAt: "desc" },
      take: 5,
    }).catch(() => []),
  ]);

  const [internshipCount, scholarshipCount, entryLevelCount] = await Promise.all([
    prisma.listing.count({
      where: { status: "ACTIVE", opportunityType: "INTERNSHIP" },
    }).catch(() => 0),
    prisma.listing.count({
      where: { status: "ACTIVE", opportunityType: "SCHOLARSHIP" },
    }).catch(() => 0),
    prisma.listing.count({
      where: { status: "ACTIVE", experienceLevel: "Entry-level", listingType: { in: ["JOB", "OPPORTUNITY"] } },
    }).catch(() => 0),
  ]);

  return {
    internships: internships.map(listingToJob),
    scholarships: scholarships.map(listingToJob),
    entryLevel: entryLevel.map(listingToJob),
    internshipCount,
    scholarshipCount,
    entryLevelCount,
  };
}

// ─── Categories with listing counts ───
export async function getCategories() {
  return prisma.category.findMany({
    where: { active: true },
    orderBy: { sortOrder: "asc" },
    include: {
      _count: {
        select: { listings: { where: { status: "ACTIVE" } } },
      },
    },
  }).catch(() => []);
}

// ─── Counties with listing counts ───
export async function getCounties() {
  const counties = await prisma.county
    .findMany({
      where: { active: true },
      orderBy: { name: "asc" },
    })
    .catch(() => []);

  // Count active listings grouped by county name
  const counts = await prisma.listing
    .groupBy({
      by: ["county"],
      where: { status: "ACTIVE", county: { not: "" } },
      _count: true,
    })
    .catch(() => []);

  const countMap = new Map(counts.map((c) => [c.county, c._count]));

  return counties.map((c) => ({
    ...c,
    _count: { listings: countMap.get(c.name) || 0 },
  }));
}

// ─── Job by slug (for detail pages) ───
export async function getJobBySlug(slug: string) {
  const listing = await prisma.listing.findUnique({
    where: { slug },
    include: {
      company: true,
      category: true,
      subcategory: true,
      tags: { include: { tag: true } },
    },
  });
  return listing ? listingToJob(listing) : null;
}

// ─── Job count by county slug (for /jobs/in-[county] pages) ───
export async function getJobCountByCounty(countySlug: string): Promise<number> {
  const county = await prisma.county.findUnique({
    where: { slug: countySlug },
    select: { name: true },
  });
  if (!county) return 0;
  return prisma.listing.count({
    where: {
      status: "ACTIVE",
      county: county.name,
    },
  });
}

// ─── Job count by category + county slug (for /jobs/category/[slug]/in-[county] pages) ───
export async function getJobCountByCategoryAndCounty(categorySlug: string, countySlug: string): Promise<number> {
  const [catRecord, countyRecord] = await Promise.all([
    prisma.category.findUnique({ where: { slug: categorySlug }, select: { id: true } }),
    prisma.county.findUnique({ where: { slug: countySlug }, select: { name: true } }),
  ]);

  if (!catRecord || !countyRecord) return 0;

  return prisma.listing.count({
    where: {
      status: "ACTIVE",
      categoryId: catRecord.id,
      county: countyRecord.name,
    },
  });
}

// ─── Jobs by county (for /jobs/in-[county] pages) ───
export async function getJobsByCounty(countySlug: string, limit = 20) {
  const countyRecord = await prisma.county.findUnique({
    where: { slug: countySlug },
    select: { name: true },
  });
  if (!countyRecord) return { jobs: [] as Job[], count: 0 };

  const [listings, count] = await Promise.all([
    prisma.listing.findMany({
      where: { status: "ACTIVE", county: countyRecord.name },
      include: { company: true, category: true, subcategory: true, tags: { include: { tag: true } } },
      orderBy: { createdAt: "desc" },
      take: limit,
    }),
    prisma.listing.count({
      where: { status: "ACTIVE", county: countyRecord.name },
    }),
  ]);

  return { jobs: listings.map(listingToJob), count };
}

// ─── Jobs by category + county (for /jobs/category/[slug]/in-[county] pages) ───
export async function getJobsByCategoryAndCounty(categorySlug: string, countySlug: string, limit = 20) {
  const [catRecord, countyRecord] = await Promise.all([
    prisma.category.findUnique({ where: { slug: categorySlug }, select: { id: true } }),
    prisma.county.findUnique({ where: { slug: countySlug }, select: { name: true } }),
  ]);

  if (!catRecord || !countyRecord) return { jobs: [] as Job[], count: 0 };

  const [listings, count] = await Promise.all([
    prisma.listing.findMany({
      where: { status: "ACTIVE", categoryId: catRecord.id, county: countyRecord.name },
      include: { company: true, category: true, subcategory: true, tags: { include: { tag: true } } },
      orderBy: { createdAt: "desc" },
      take: limit,
    }),
    prisma.listing.count({
      where: { status: "ACTIVE", categoryId: catRecord.id, county: countyRecord.name },
    }),
  ]);

  return { jobs: listings.map(listingToJob), count };
}

// ─── Paginated job listings (for /jobs page) ───
export async function getJobs(params: {
  q?: string;
  category?: string;
  county?: string;
  listingType?: string;
  employmentType?: string;
  experienceLevel?: string;
  workMode?: string;
  governmentLevel?: string;
  opportunityType?: string;
  sort?: string;
  page?: number;
  limit?: number;
}) {
  const {
    q,
    category,
    county,
    listingType,
    employmentType,
    experienceLevel,
    workMode,
    governmentLevel,
    opportunityType,
    sort = "latest",
    page = 1,
    limit = 20,
  } = params;

  const where: Record<string, unknown> = { status: "ACTIVE" };

  if (q) {
    where.OR = [
      { title: { contains: q } },
      { description: { contains: q } },
      { company: { name: { contains: q } } },
    ];
  }
  if (category) where.categoryId = category;
  if (county) where.county = county;
  if (listingType) where.listingType = listingType;
  if (employmentType) where.employmentType = employmentType;
  if (experienceLevel) where.experienceLevel = experienceLevel;
  if (workMode) where.workMode = workMode;
  if (governmentLevel) where.governmentLevel = governmentLevel;
  if (opportunityType) where.opportunityType = opportunityType;

  const orderBy: Record<string, string> =
    sort === "closing"
      ? { deadline: "asc" }
      : sort === "salary"
      ? { salaryMax: "desc" }
      : { createdAt: "desc" };

  const [listings, total] = await Promise.all([
    prisma.listing.findMany({
      where,
      include: { company: true, category: true, subcategory: true, tags: { include: { tag: true } } },
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.listing.count({ where }),
  ]);

  return {
    jobs: listings.map(listingToJob),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

// ─── Companies with listing counts (for /companies page) ───
export async function getCompanies(params?: {
  q?: string;
  industry?: string;
  county?: string;
}) {
  const where: Record<string, unknown> = {};

  if (params?.q) {
    where.OR = [
      { name: { contains: params.q } },
      { industry: { contains: params.q } },
      { description: { contains: params.q } },
    ];
  }
  if (params?.industry) where.industry = params.industry;
  if (params?.county) where.county = params.county;

  const companies = await prisma.company.findMany({
    where,
    include: {
      _count: {
        select: { listings: { where: { status: "ACTIVE" } } },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 200,
  }).catch(() => []);

  // Sort by active listing count (descending), then alphabetically
  return companies.sort((a, b) => {
    const countDiff = b._count.listings - a._count.listings;
    if (countDiff !== 0) return countDiff;
    return a.name.localeCompare(b.name);
  });
}

// ─── Get available industries for filtering ───
export async function getCompanyIndustries() {
  const rows = await prisma.$queryRaw<Array<{ industry: string; _count: bigint }>>`
    SELECT industry, COUNT(*) as _count
    FROM Company
    WHERE industry IS NOT NULL AND industry != ''
    GROUP BY industry
    ORDER BY _count DESC
  `.catch(() => []);

  return rows.map((r) => ({ industry: r.industry, count: Number(r._count) }));
}

// ─── Company by slug (for /companies/[slug] detail page) ───
export async function getCompanyBySlug(slug: string) {
  const company = await prisma.company.findUnique({
    where: { slug },
    include: {
      _count: {
        select: { listings: { where: { status: "ACTIVE" } } },
      },
    },
  }).catch(() => null);

  return company;
}

// ─── Active listings for a company (for /companies/[slug] detail page) ───
export async function getCompanyJobs(companyId: string, limit = 20) {
  const listings = await prisma.listing.findMany({
    where: { status: "ACTIVE", companyId },
    include: { company: true, category: true, subcategory: true, tags: { include: { tag: true } } },
    orderBy: { createdAt: "desc" },
    take: limit,
  }).catch(() => []);

  return listings.map(listingToJob);
}
