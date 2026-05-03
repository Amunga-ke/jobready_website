import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { OPPORTUNITY_TYPES, KE_COUNTIES, slugifyCounty } from "@/lib/constants";
import { getRobotsMeta, type SeoTier } from "@/lib/seo/page-thresholds";
import { getOpportunityIntro } from "@/lib/seo/fallback-content";
import { SeoPageHeader, RichFallback } from "@/components/jobready/SeoPageLayout";
import JobRowClickable from "@/components/jobready/JobRowClickable";
import { formatDateShortUTC } from "@/lib/format-date";
import { listingToJob } from "@/lib/transforms";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function getOpportunities(typeSlug: string, limit = 20) {
  const dbType = typeSlug.toUpperCase().replace(/-/g, "_");

  const [listings, count] = await Promise.all([
    prisma.listing
      .findMany({
        where: { status: "ACTIVE", opportunityType: dbType },
        include: {
          company: true,
          category: true,
          subcategory: true,
          county: true,
          tags: { include: { tag: true } },
        },
        orderBy: { createdAt: "desc" },
        take: limit,
      })
      .catch(() => []),
    prisma.listing
      .count({
        where: { status: "ACTIVE", opportunityType: dbType },
      })
      .catch(() => 0),
  ]);

  return { jobs: listings.map(listingToJob), count };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ type: string }>;
}): Promise<Metadata> {
  try {
    const { type: typeSlug } = await params;
    const opp = OPPORTUNITY_TYPES.find((t) => t.slug === typeSlug);
    if (!opp) return { title: "Not Found | JobReady" };

    const dbType = (opp.value || "").replace(/-/g, "_");
    const count = await prisma.listing.count({
      where: { status: "ACTIVE", opportunityType: dbType },
    }).catch(() => 0);
    const robots = getRobotsMeta(count, "OPPORTUNITY" as SeoTier);

    return {
      title: `${opp.label} Opportunities in Kenya | JobReady`,
      description: getOpportunityIntro(opp.label),
      robots,
      alternates: {
        canonical: `https://jobreadyke.co.ke/opportunities/${typeSlug}`,
      },
      openGraph: {
        title: `${opp.label} in Kenya | JobReady`,
        description: getOpportunityIntro(opp.label),
        url: `https://jobreadyke.co.ke/opportunities/${typeSlug}`,
        type: "website",
        siteName: "JobReady",
      },
      twitter: {
        card: "summary_large_image",
        title: `${opp.label} in Kenya | JobReady`,
        description: getOpportunityIntro(opp.label),
      },
    };
  } catch {
    return { title: "Not Found | JobReady" };
  }
}

// No generateStaticParams — page is force-dynamic, all types handled at runtime

export default async function OpportunityTypePage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  try {
    const { type: typeSlug } = await params;
    const opp = OPPORTUNITY_TYPES.find((t) => t.slug === typeSlug);

    if (!opp) notFound();

    const oppResult = await getOpportunities(typeSlug, 20);
    const count = oppResult.count;
    const oppJobs = oppResult.jobs;
    const nearbyCounties = KE_COUNTIES.slice(0, 8) as unknown as string[];

    return (
      <main className="bg-surface">
        <div className="max-w-6xl mx-auto px-5 py-8 md:py-12">
          <SeoPageHeader
            breadcrumbs={[
              { label: "Home", href: "/" },
              { label: "Opportunities", href: "/opportunities" },
              { label: opp.label, href: `/opportunities/${typeSlug}` },
            ]}
            title={`${opp.label} in Kenya`}
            description={getOpportunityIntro(opp.label)}
            count={count || undefined}
          />

          {/* Listings or fallback */}
          {oppJobs.length > 0 ? (
            <div className="mb-10">
              <p className="text-[14px] text-muted mb-4">
                Showing {count} {opp.label.toLowerCase()} opportunities.
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
                listingCount={count}
                nearbyCounties={nearbyCounties}
              />
            </div>
          )}

          {/* Browse by county */}
          <div className="mb-10">
            <h2 className="text-[13px] font-semibold text-ink uppercase tracking-wider mb-4">
              {opp.label} by County
            </h2>
            <div className="flex flex-wrap gap-2">
              {KE_COUNTIES.map((county) => {
                const countySlug = slugifyCounty(county);
                return (
                  <Link
                    key={countySlug}
                    href={`/opportunities/${typeSlug}/in-${countySlug}`}
                    className="text-[12px] font-medium px-3 py-1.5 rounded-lg bg-ink/[0.04] text-ink/70 hover:bg-ink/[0.08] hover:text-ink transition-colors"
                  >
                    {county}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Other opportunity types */}
          <div>
            <h2 className="text-[13px] font-semibold text-ink uppercase tracking-wider mb-4">
              Other Opportunities
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {OPPORTUNITY_TYPES.filter((t) => t.slug !== typeSlug).map((t) => (
                <Link
                  key={t.slug}
                  href={`/opportunities/${t.slug}`}
                  className="flex items-center justify-between px-4 py-3 rounded-lg border border-divider hover:border-accent/30 hover:bg-accent-bg/50 transition-all group"
                >
                  <span className="text-[13px] font-medium text-ink/80 group-hover:text-ink">
                    {t.label}
                  </span>
                  <svg
                    className="w-4 h-4 text-muted group-hover:text-accent"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  } catch {
    notFound();
  }
}
