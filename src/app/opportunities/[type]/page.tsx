import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { OPPORTUNITY_TYPES, KE_COUNTIES, slugifyCounty } from "@/lib/constants";
import { getRobotsMeta, type SeoTier } from "@/lib/seo/page-thresholds";
import { getOpportunityIntro } from "@/lib/seo/fallback-content";
import { SeoPageHeader, RichFallback } from "@/components/jobready/SeoPageLayout";
import JobRowClickable from "@/components/jobready/JobRowClickable";
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

  return { listings, count };
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
    const listings = oppResult.listings;
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
          {listings.length > 0 ? (
            <div className="mb-10">
              <div className="hidden sm:grid sm:grid-cols-12 gap-4 pb-2 border-b border-divider text-[10px] font-mono text-muted uppercase tracking-widest mb-1">
                <div className="col-span-5">Position</div>
                <div className="col-span-3">Company</div>
                <div className="col-span-2">Type</div>
                <div className="col-span-2 text-right">Deadline</div>
              </div>
              <div className="divide-y divide-subtle">
                {listings.map((job) => {
                  const dl = job.deadline
                    ? Math.ceil(
                        (job.deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
                      )
                    : null;
                  const urgent = dl !== null && dl <= 3 && dl > 0;
                  return (
                    <JobRowClickable
                      key={job.id}
                      slug={job.slug}
                      className="grid grid-cols-12 gap-4 py-3.5 group cursor-pointer hover:bg-ink/[0.02] rounded-lg -mx-2 px-2 transition-colors"
                    >
                      <div className="col-span-12 sm:col-span-5 min-w-0">
                        <p className="text-[13px] font-medium truncate group-hover:text-accent transition-colors">
                          {job.title}
                        </p>
                        <div className="sm:hidden flex items-center gap-2 mt-0.5">
                          <span className="text-[11px] text-muted">{job.company?.name || ""}</span>
                          <span className="text-[11px] text-subtle">&middot;</span>
                          <span className="text-[11px] text-muted">{job.town || ""}</span>
                        </div>
                      </div>
                      <div className="hidden sm:block sm:col-span-3 text-[12px] text-muted truncate">
                        {job.company?.name || ""}
                      </div>
                      <div className="col-span-6 sm:col-span-2 flex items-center">
                        <span className="text-[11px] text-muted">
                          {job.employmentType || job.listingType}
                        </span>
                      </div>
                      <div className="col-span-6 sm:col-span-2 flex sm:justify-end items-center">
                        {dl !== null ? (
                          <span
                            className={`font-mono text-[12px] font-medium tabular-nums ${
                              dl <= 0
                                ? "text-muted/40"
                                : urgent
                                ? "text-accent"
                                : "text-muted"
                            }`}
                          >
                            {dl <= 0 ? "Closed" : `${dl}d left`}
                          </span>
                        ) : (
                          <span className="text-[11px] text-muted/50">&mdash;</span>
                        )}
                      </div>
                    </JobRowClickable>
                  );
                })}
              </div>
              {count > 20 && (
                <p className="text-[13px] text-muted mt-4">
                  Showing 20 of {count} {opp.label.toLowerCase()} opportunities
                </p>
              )}
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
