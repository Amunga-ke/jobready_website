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
  });
  return listings.map(listingToJob);
}

// ─── Just Posted (latest jobs) ───
export async function getJustPosted(): Promise<Job[]> {
  const listings = await prisma.listing.findMany({
    where: { status: "ACTIVE", listingType: { in: ["JOB", "GOVERNMENT"] } },
    include: { company: true, category: true, subcategory: true, tags: { include: { tag: true } } },
    orderBy: { createdAt: "desc" },
    take: 4,
  });
  return listings.map(listingToJob);
}

// ─── Closing Soon ───
export async function getClosingSoon(): Promise<Job[]> {
  const now = new Date();
  const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

  const listings = await prisma.listing.findMany({
    where: {
      status: "ACTIVE",
      deadline: { gt: now, lte: threeDaysFromNow },
    },
    include: { company: true, category: true, subcategory: true, tags: { include: { tag: true } } },
    orderBy: { deadline: "asc" },
    take: 10,
  });
  return listings.map(listingToJob);
}

// ─── Government Jobs ───
export async function getGovernmentJobs() {
  const [national, county] = await Promise.all([
    prisma.listing.findMany({
      where: { status: "ACTIVE", listingType: "GOVERNMENT", governmentLevel: "NATIONAL" },
      include: { company: true, category: true, subcategory: true, tags: { include: { tag: true } } },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.listing.findMany({
      where: { status: "ACTIVE", listingType: "GOVERNMENT", governmentLevel: "COUNTY" },
      include: { company: true, category: true, subcategory: true, tags: { include: { tag: true } } },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
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
  });
  return listings.map(listingToJob);
}

// ─── Opportunities Hub ───
export async function getOpportunities() {
  const [internships, scholarships, entryLevel] = await Promise.all([
    prisma.listing.findMany({
      where: { status: "ACTIVE", opportunityType: "INTERNSHIP" },
      include: { company: true, category: true, subcategory: true, tags: { include: { tag: true } } },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.listing.findMany({
      where: { status: "ACTIVE", opportunityType: "SCHOLARSHIP" },
      include: { company: true, category: true, subcategory: true, tags: { include: { tag: true } } },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.listing.findMany({
      where: { status: "ACTIVE", experienceLevel: "Entry-level", listingType: { in: ["JOB", "OPPORTUNITY"] } },
      include: { company: true, category: true, subcategory: true, tags: { include: { tag: true } } },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  return {
    internships: internships.map(listingToJob),
    scholarships: scholarships.map(listingToJob),
    entryLevel: entryLevel.map(listingToJob),
    internshipCount: await prisma.listing.count({
      where: { status: "ACTIVE", opportunityType: "INTERNSHIP" },
    }),
    scholarshipCount: await prisma.listing.count({
      where: { status: "ACTIVE", opportunityType: "SCHOLARSHIP" },
    }),
    entryLevelCount: await prisma.listing.count({
      where: { status: "ACTIVE", experienceLevel: "Entry-level" },
    }),
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
  });
}

// ─── Counties with listing counts ───
export async function getCounties() {
  return prisma.county.findMany({
    where: { active: true },
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: { listings: { where: { status: "ACTIVE" } } },
      },
    },
  });
}

// ─── Job by slug (for detail pages) ───
export async function getJobBySlug(slug: string) {
  const listing = await prisma.listing.findUnique({
    where: { slug },
    include: {
      company: true,
      category: true,
      subcategory: true,
      county: true,
      tags: { include: { tag: true } },
    },
  });
  return listing ? listingToJob(listing) : null;
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
      { companyName: { contains: q } },
    ];
  }
  if (category) where.categoryId = category;
  if (county) where.countyId = county;
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
