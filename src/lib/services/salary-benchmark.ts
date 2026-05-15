import prisma from "@/lib/prisma";

// ─── Types ───

export type SalaryPeriod = "HOURLY" | "DAILY" | "WEEKLY" | "MONTHLY" | "ANNUALLY";

export interface SalarySubmissionInput {
  userId: string;
  jobTitle: string;
  company?: string;
  industry?: string;
  county?: string;
  employmentType: string;
  experienceLevel: string;
  salaryAmount: number;
  salaryPeriod: string;
  benefits?: string[];
}

export interface SalaryAggregatedData {
  average: number;
  median: number;
  min: number;
  max: number;
  p25: number;
  p75: number;
  count: number;
  period: string;
  distribution: Array<{ range: string; count: number }>;
  byCounty: Array<{ county: string; average: number; count: number }>;
  byExperience: Array<{ level: string; average: number; count: number }>;
}

export interface SalaryTopTitle {
  jobTitle: string;
  count: number;
  averageSalary: number;
}

// ─── Period Normalization ───
// Everything is converted to MONTHLY KES for comparison

const PERIOD_MULTIPLIERS: Record<string, number> = {
  HOURLY: 173.33, // avg 8hrs/day * 21.67 days/month
  DAILY: 21.67, // avg working days per month
  WEEKLY: 4.33, // avg weeks per month
  MONTHLY: 1,
  ANNUALLY: 1 / 12,
};

function toMonthly(amount: number, period: string): number {
  const multiplier = PERIOD_MULTIPLIERS[period.toUpperCase()] || 1;
  return Math.round(amount * multiplier);
}

function getPeriodLabel(period: string): string {
  const upper = period.toUpperCase();
  if (upper === "MONTHLY") return "monthly";
  if (upper === "ANNUALLY") return "annually";
  if (upper === "WEEKLY") return "weekly";
  if (upper === "DAILY") return "daily";
  if (upper === "HOURLY") return "hourly";
  return "monthly";
}

// ─── Statistics Helpers ───

function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : Math.round((sorted[mid - 1] + sorted[mid]) / 2);
}

function percentile(values: number[], p: number): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const idx = Math.ceil((p / 100) * sorted.length) - 1;
  return sorted[Math.max(0, idx)];
}

function buildDistribution(values: number[]): Array<{ range: string; count: number }> {
  if (values.length === 0) return [];

  const min = Math.min(...values);
  const max = Math.max(...values);

  // Define ranges based on data spread
  const ranges: Array<{ min: number; max: number; label: string }> = [];

  if (max - min < 10000) {
    // Very narrow range: use 5 equal buckets
    const step = Math.ceil((max - min) / 5) || 5000;
    for (let i = 0; i < 5; i++) {
      const lo = min + step * i;
      const hi = i === 4 ? max + 1 : min + step * (i + 1);
      ranges.push({ min: lo, max: hi, label: `${formatKes(lo)} - ${formatKes(hi)}` });
    }
  } else {
    // Standard ranges for Kenyan salaries (monthly KES)
    const standardRanges = [
      { min: 0, max: 20000, label: "Under 20K" },
      { min: 20000, max: 35000, label: "20K - 35K" },
      { min: 35000, max: 50000, label: "35K - 50K" },
      { min: 50000, max: 75000, label: "50K - 75K" },
      { min: 75000, max: 100000, label: "75K - 100K" },
      { min: 100000, max: 150000, label: "100K - 150K" },
      { min: 150000, max: 200000, label: "150K - 200K" },
      { min: 200000, max: 300000, label: "200K - 300K" },
      { min: 300000, max: 500000, label: "300K - 500K" },
      { min: 500000, max: Infinity, label: "500K+" },
    ];
    ranges.push(...standardRanges);
  }

  return ranges.map(({ min: lo, max: hi, label }) => ({
    range: label,
    count: values.filter((v) => v >= lo && v < hi).length,
  }));
}

function formatKes(amount: number): string {
  if (amount >= 1000) {
    return `KES ${Math.round(amount / 1000)}K`;
  }
  return `KES ${amount.toLocaleString()}`;
}

// ─── Public API ───

/**
 * Submit a salary data point.
 */
export async function submitSalary({
  userId,
  jobTitle,
  company,
  industry,
  county,
  employmentType,
  experienceLevel,
  salaryAmount,
  salaryPeriod,
  benefits,
}: SalarySubmissionInput): Promise<{
  id: string;
  jobTitle: string;
  salaryAmount: number;
  salaryPeriod: string;
  createdAt: string;
}> {
  // Normalize period to uppercase
  const normalizedPeriod = (salaryPeriod || "MONTHLY").toUpperCase();

  const submission = await prisma.salarySubmission.create({
    data: {
      userId,
      jobTitle: jobTitle.trim(),
      company: company?.trim() || null,
      industry: industry?.trim() || null,
      county: county?.trim() || null,
      employmentType: employmentType.trim() || "Full-time",
      experienceLevel: experienceLevel.trim() || "Mid-level",
      salaryAmount,
      salaryPeriod: normalizedPeriod,
      currency: "KES",
      benefits: benefits && benefits.length > 0 ? JSON.stringify(benefits) : null,
      isVerified: false,
      source: "USER_SUBMISSION",
    },
  });

  return {
    id: submission.id,
    jobTitle: submission.jobTitle,
    salaryAmount: submission.salaryAmount,
    salaryPeriod: submission.salaryPeriod,
    createdAt: submission.createdAt.toISOString(),
  };
}

/**
 * Get aggregated salary data for benchmarking.
 * All amounts are normalized to monthly KES for comparison.
 */
export async function getSalaryData({
  jobTitle,
  industry,
  county,
  employmentType,
  experienceLevel,
}: {
  jobTitle?: string;
  industry?: string;
  county?: string;
  employmentType?: string;
  experienceLevel?: string;
}): Promise<SalaryAggregatedData> {
  // Build filter conditions
  const where: Record<string, unknown> = {};

  if (jobTitle) {
    where.jobTitle = { contains: jobTitle, mode: "insensitive" };
  }
  if (industry) {
    where.industry = industry;
  }
  if (county) {
    where.county = county;
  }
  if (employmentType) {
    where.employmentType = employmentType;
  }
  if (experienceLevel) {
    where.experienceLevel = experienceLevel;
  }

  const submissions = await prisma.salarySubmission.findMany({
    where,
    select: {
      salaryAmount: true,
      salaryPeriod: true,
      county: true,
      experienceLevel: true,
    },
  });

  if (submissions.length === 0) {
    return {
      average: 0,
      median: 0,
      min: 0,
      max: 0,
      p25: 0,
      p75: 0,
      count: 0,
      period: "monthly",
      distribution: [],
      byCounty: [],
      byExperience: [],
    };
  }

  // Convert all amounts to monthly
  const monthlyAmounts = submissions.map((s) =>
    Math.max(0, toMonthly(s.salaryAmount, s.salaryPeriod))
  );

  // Core statistics
  const sum = monthlyAmounts.reduce((a, b) => a + b, 0);
  const average = Math.round(sum / monthlyAmounts.length);
  const med = median(monthlyAmounts);
  const min = Math.min(...monthlyAmounts);
  const max = Math.max(...monthlyAmounts);
  const p25 = percentile(monthlyAmounts, 25);
  const p75 = percentile(monthlyAmounts, 75);

  // Distribution
  const distribution = buildDistribution(monthlyAmounts);

  // By county (using normalized monthly amounts)
  const countyMap = new Map<string, { total: number; count: number }>();
  for (const s of submissions) {
    const c = s.county || "Unknown";
    const monthly = toMonthly(s.salaryAmount, s.salaryPeriod);
    const entry = countyMap.get(c);
    if (entry) {
      entry.total += monthly;
      entry.count += 1;
    } else {
      countyMap.set(c, { total: monthly, count: 1 });
    }
  }
  const byCounty = Array.from(countyMap.entries())
    .map(([county, data]) => ({
      county,
      average: Math.round(data.total / data.count),
      count: data.count,
    }))
    .sort((a, b) => b.count - a.count);

  // By experience level
  const expMap = new Map<string, { total: number; count: number }>();
  for (const s of submissions) {
    const level = s.experienceLevel || "Not specified";
    const monthly = toMonthly(s.salaryAmount, s.salaryPeriod);
    const entry = expMap.get(level);
    if (entry) {
      entry.total += monthly;
      entry.count += 1;
    } else {
      expMap.set(level, { total: monthly, count: 1 });
    }
  }
  const byExperience = Array.from(expMap.entries())
    .map(([level, data]) => ({
      level,
      average: Math.round(data.total / data.count),
      count: data.count,
    }))
    .sort((a, b) => b.count - a.count);

  // Determine the most common period in the data
  const periodCounts = new Map<string, number>();
  for (const s of submissions) {
    const p = s.salaryPeriod.toLowerCase();
    periodCounts.set(p, (periodCounts.get(p) || 0) + 1);
  }
  const dominantPeriod = [...periodCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] || "monthly";

  return {
    average,
    median: med,
    min,
    max,
    p25,
    p75,
    count: submissions.length,
    period: getPeriodLabel(dominantPeriod),
    distribution,
    byCounty,
    byExperience,
  };
}

/**
 * Get top job titles by number of salary submissions.
 */
export async function getTopJobTitles(limit = 20): Promise<SalaryTopTitle[]> {
  const submissions = await prisma.salarySubmission.findMany({
    select: {
      jobTitle: true,
      salaryAmount: true,
      salaryPeriod: true,
    },
  });

  if (submissions.length === 0) return [];

  // Group by job title (case-insensitive)
  const titleMap = new Map<string, { totalMonthly: number; count: number }>();

  for (const s of submissions) {
    const key = s.jobTitle.toLowerCase().trim();
    const monthly = toMonthly(s.salaryAmount, s.salaryPeriod);
    const entry = titleMap.get(key);
    if (entry) {
      entry.totalMonthly += monthly;
      entry.count += 1;
    } else {
      titleMap.set(key, { totalMonthly: monthly, count: 1 });
    }
  }

  return Array.from(titleMap.entries())
    .map(([jobTitle, data]) => ({
      jobTitle: jobTitle.charAt(0).toUpperCase() + jobTitle.slice(1),
      count: data.count,
      averageSalary: Math.round(data.totalMonthly / data.count),
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

/**
 * Extract salary data from listings that have salaryMin/salaryMax.
 * Intended for cron/scheduled use.
 * Creates SalarySubmission records with source='LISTING_EXTRACTED'.
 */
export async function extractSalaryFromListings(): Promise<{
  extracted: number;
  skipped: number;
}> {
  // Find listings with salary data that haven't been extracted yet
  // We look for listings with salaryMin or salaryMax
  const listings = await prisma.listing.findMany({
    where: {
      OR: [
        { salaryMin: { not: null } },
        { salaryMax: { not: null } },
      ],
      salaryPeriod: { not: null },
    },
    select: {
      id: true,
      title: true,
      salaryMin: true,
      salaryMax: true,
      salaryPeriod: true,
      employmentType: true,
      experienceLevel: true,
      county: true,
      company: { select: { name: true, industry: true } },
      category: { select: { name: true } },
    },
  });

  let extracted = 0;
  let skipped = 0;

  for (const listing of listings) {
    try {
      // Use the midpoint of min/max, or just min if only min is available
      let amount: number;
      if (listing.salaryMin && listing.salaryMax) {
        amount = Math.round((listing.salaryMin + listing.salaryMax) / 2);
      } else if (listing.salaryMin) {
        amount = listing.salaryMin;
      } else if (listing.salaryMax) {
        amount = listing.salaryMax;
      } else {
        skipped++;
        continue;
      }

      const period = (listing.salaryPeriod || "MONTHLY").toUpperCase();

      // Check if we already extracted from this listing
      // We use a best-effort check by looking for recent entries with same title + amount
      const existing = await prisma.salarySubmission.findFirst({
        where: {
          jobTitle: listing.title,
          salaryAmount: amount,
          salaryPeriod: period,
          source: "LISTING_EXTRACTED",
          company: listing.company.name,
          createdAt: {
            // Check within last 7 days to avoid re-extracting
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        },
      });

      if (existing) {
        skipped++;
        continue;
      }

      await prisma.salarySubmission.create({
        data: {
          userId: null, // No user associated with extracted data
          jobTitle: listing.title,
          company: listing.company.name,
          industry: listing.company.industry || listing.category?.name || null,
          county: listing.county || null,
          employmentType: listing.employmentType,
          experienceLevel: listing.experienceLevel,
          salaryAmount: amount,
          salaryPeriod: period,
          currency: "KES",
          isVerified: false,
          source: "LISTING_EXTRACTED",
        },
      });

      extracted++;
    } catch {
      skipped++;
    }
  }

  return { extracted, skipped };
}
