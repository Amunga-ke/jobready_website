import type { Job } from "@/types";
import type { Listing } from "@prisma/client";

/**
 * Transform a Prisma Listing (with included relations) into the
 * frontend `Job` type that `JobClickable` / `JobDetailSheet` consume.
 */
export function listingToJob(
  listing: Listing & {
    company?: { id: string; name: string; logo?: string | null; verified: boolean } | null;
    tags?: { tag: { id: string; name: string } }[];
  }
): Job {
  return {
    id: listing.id,
    slug: listing.slug,
    title: listing.title,
    companyName: listing.company?.name ?? "Unknown",
    companyLogo: listing.company?.logo ?? null,
    companyVerified: listing.company?.verified ?? false,
    location: listing.location,
    county: listing.countyName,
    country: listing.country,
    category: listing.listingType === "JOB"
      ? "Job"
      : listing.listingType === "GOVERNMENT"
      ? "Government"
      : listing.listingType === "CASUAL"
      ? "Casual"
      : "Opportunity",
    subcategory: undefined, // populated from Category relation if needed
    listingType: listing.listingType as Job["listingType"],
    governmentLevel: (listing.governmentLevel as Job["governmentLevel"]) ?? undefined,
    opportunityType: listing.opportunityType ?? undefined,
    employmentType: listing.employmentType,
    experienceLevel: listing.experienceLevel,
    workMode: listing.workMode as Job["workMode"],
    salaryMin: listing.salaryMin,
    salaryMax: listing.salaryMax,
    salaryCurrency: listing.salaryCurrency,
    salaryPeriod: listing.salaryPeriod ?? undefined,
    predictedSalary: listing.predictedSalary ?? undefined,
    isPredictedSalary: listing.isPredictedSalary ?? undefined,
    description: listing.description,
    requirements: listing.requirements ?? undefined,
    instructions: listing.instructions ?? undefined,
    tags: listing.tags?.map((t) => t.tag.name) ?? [],
    createdAt: listing.createdAt.toISOString(),
    deadline: listing.deadline?.toISOString() ?? null,
    source: listing.source ?? undefined,
    applicationUrl: listing.applicationUrl ?? undefined,
    applyCount: listing.applyCount,
    featured: listing.featured,
  };
}
