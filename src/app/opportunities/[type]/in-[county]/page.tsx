import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { OPPORTUNITY_TYPES, KE_COUNTIES, slugifyCounty, getCountyBySlug } from "@/lib/constants";
import { getRobotsMeta, type SeoTier } from "@/lib/seo/page-thresholds";
import { SeoPageHeader, RichFallback } from "@/components/jobready/SeoPageLayout";
import JobRowClickable from "@/components/jobready/JobRowClickable";
import { formatDateShortUTC } from "@/lib/format-date";
import { listingToJob } from "@/lib/transforms";
import type { Job } from "@/types";

async function getOpportunityCountByCounty(typeSlug: string, countySlug: string): Promise<number> {
  const countyRecord = await prisma.county.findUnique({
    where: { slug: countySlug },
    select: { id: true },
  });
  if (!countyRecord) return 0;

  return prisma.listing.count({
    where: {
      status: "ACTIVE",
      opportunityType: typeSlug.toUpperCase().replace(/-/g, "_"),
      countyId: countyRecord.id,
    },
  });
}

async function getOpportunitiesByCounty(typeSlug: string, countySlug: string, limit = 20) {
  const countyRecord = await prisma.county.findUnique({
    where: { slug: countySlug },
    select: { id: true },
  });
  if (!countyRecord) return { jobs: [] as Job[], count: 0 };

  const oppType = typeSlug.toUpperCase().replace(/-/g, "_");
  const [listings, count] = await Promise.all([
    prisma.listing.findMany({
      where: { status: "ACTIVE", opportunityType: oppType, countyId: countyRecord.id },
      include: { company: true, category: true, subcategory: true, county: true, tags: { include: { tag: true } } },
      orderBy: { createdAt: "desc" },
      take: limit,
    }),
    prisma.listing.count({
      where: { status: "ACTIVE", opportunityType: oppType, countyId: countyRecord.id },
    }),
  ]);

  return { jobs: listings.map(listingToJob), count };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ type: string; county: string }>;
}): Promise<Metadata> {
  const { type: typeSlug, county: countySlug } = await params;
  const opp = OPPORTUNITY_TYPES.find((t) => t.slug === typeSlug);
  const county = getCountyBySlug(countySlug);
  if (!opp || !county) return { title: "Not Found | JobReady" };

  const count = await getOpportunityCountByCounty(typeSlug, countySlug);
  const robots = getRobotsMeta(count, "OPP_COUNTY" as SeoTier);

  return {
    title: `${opp.label} in ${county}, Kenya${count > 0 ? ` (${count} Openings)` : ""} | JobReady`,
    description: `Find ${opp.label.toLowerCase()} opportunities in ${county}, Kenya. Application details and deadlines on JobReady.`,
    robots,
    alternates: {
      canonical: `https://jobreadyke.co.ke/opportunities/${typeSlug}/in-${countySlug}`,
    },
    openGraph: {
      title: `${opp.label} in ${county} | JobReady`,
      description: `Find ${opp.label.toLowerCase()} opportunities in ${county}, Kenya.`,
      url: `https://jobreadyke.co.ke/opportunities/${typeSlug}/in-${countySlug}`,
      type: "website",
      siteName: "JobReady",
    },
    twitter: {
      card: "summary_large_image",
      title: `${opp.label} in ${county} | JobReady`,
      description: `Find ${opp.label.toLowerCase()} opportunities in ${county}, Kenya.`,
    },
  };
}

export const dynamic = "force-dynamic";

export default async function OpportunityCountyPage({
  params,
}: {
  params: Promise<{ type: string; county: string }>;
}) {
  const { type: typeSlug, county: countySlug } = await params;
  const opp = OPPORTUNITY_TYPES.find((t) => t.slug === typeSlug);
  const county = getCountyBySlug(countySlug);

  if (!opp || !county) notFound();

  const oppResult = await getOpportunitiesByCounty(typeSlug, countySlug, 20);
  const count = oppResult.count;
  const oppJobs = oppResult.jobs;
  const nearby = KE_COUNTIES.slice(0, 8) as unknown as string[];
  const otherTypes = OPPORTUNITY_TYPES.filter((t) => t.slug !== typeSlug).slice(0, 8);

  return (
    <main className="bg-surface">
      <div className="max-w-6xl mx-auto px-5 py-8 md:py-12">
        <SeoPageHeader
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Opportunities", href: "/opportunities" },
            { label: opp.label, href: `/opportunities/${typeSlug}` },
            { label: county, href: `/jobs/in-${countySlug}` },
          ]}
          title={`${opp.label} in ${county}`}
          description={`Browse ${opp.label.toLowerCase()} opportunities available in ${county}, Kenya.`}
          count={count || undefined}
        />

        {oppJobs.length > 0 ? (
          <div className="mb-10">
            <p className="text-[14px] text-muted mb-4">
              Showing {count} {opp.label.toLowerCase()} opportunities in {county}.
            </p>
            <div className="space-y-0 divide-y divide-subtle">
              {oppJobs.map((job) => (
                <JobRowClickable
                  key={job.id}
                  slug={job.slug}
                  className="flex items-center justify-between py-3 group cursor-pointer rounded-lg hover:bg-white/60 -mx-2 px-2 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium group-hover:text-accent transition-colors leading-snug truncate">
                      {job.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[12px] text-muted">{job.companyName}</span>
                      {job.location && (
                        <>
                          <span className="text-divider">·</span>
                          <span className="text-[12px] text-muted">{job.location}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 ml-4 shrink-0">
                    {job.deadline && (
                      <span className="font-mono text-[11px] text-muted tabular-nums">
                        {formatDateShortUTC(job.deadline)}
                      </span>
                    )}
                    <svg
                      className="w-4 h-4 text-muted/40 group-hover:text-accent transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </JobRowClickable>
              ))}
            </div>
          </div>
        ) : (
          <div className="mb-10">
            <RichFallback
              county={county}
              listingCount={count}
              nearbyCounties={nearby}
            />
          </div>
        )}

        {/* Other opportunity types in this county */}
        <div>
          <h2 className="text-[13px] font-semibold text-ink uppercase tracking-wider mb-4">
            Other Opportunities in {county}
          </h2>
          <div className="flex flex-wrap gap-2">
            {otherTypes.map((t) => (
              <Link
                key={t.slug}
                href={`/opportunities/${t.slug}/in-${countySlug}`}
                className="text-[12px] font-medium px-3 py-1.5 rounded-lg bg-amber-50 text-amber-700 border border-amber-100 hover:bg-amber-100 transition-colors"
              >
                {t.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
