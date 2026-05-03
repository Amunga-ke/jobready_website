import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { OPPORTUNITY_TYPES, KE_COUNTIES, slugifyCounty, getCountyBySlug } from "@/lib/constants";
import { getRobotsMeta, type SeoTier } from "@/lib/seo/page-thresholds";
import { SeoPageHeader, RichFallback } from "@/components/jobready/SeoPageLayout";
import JobRowClickable from "@/components/jobready/JobRowClickable";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

function parseLocation(raw: string) {
  if (!raw.startsWith("in-")) return null;
  const countySlug = raw.replace(/^in-/, "");
  const county = getCountyBySlug(countySlug);
  if (!county) return null;
  return { countySlug, county };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ type: string; location: string }>;
}): Promise<Metadata> {
  try {
    const { type: typeSlug, location: rawLocation } = await params;
    const loc = parseLocation(rawLocation);
    if (!loc) return { title: "Not Found | JobReady" };

    const { countySlug, county } = loc;
    const opp = OPPORTUNITY_TYPES.find((t) => t.slug === typeSlug);
    if (!opp) return { title: "Not Found | JobReady" };

    const dbType = typeSlug.toUpperCase().replace(/-/g, "_");
    const count = await prisma.listing
      .count({
        where: {
          status: "ACTIVE",
          opportunityType: dbType,
          countyName: county,
        },
      })
      .catch(() => 0);
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
  } catch {
    return { title: "Not Found | JobReady" };
  }
}

export default async function OpportunityCountyPage({
  params,
}: {
  params: Promise<{ type: string; location: string }>;
}) {
  try {
    const { type: typeSlug, location: rawLocation } = await params;
    const loc = parseLocation(rawLocation);
    if (!loc) notFound();

    const { countySlug, county } = loc;
    const opp = OPPORTUNITY_TYPES.find((t) => t.slug === typeSlug);
    if (!opp) notFound();

    const dbType = typeSlug.toUpperCase().replace(/-/g, "_");

    const [listings, count] = await Promise.all([
      prisma.listing
        .findMany({
          where: {
            status: "ACTIVE",
            opportunityType: dbType,
            countyName: county,
          },
          include: {
            company: true,
            category: true,
            subcategory: true,
            county: true,
            tags: { include: { tag: true } },
          },
          orderBy: { createdAt: "desc" },
          take: 20,
        })
        .catch(() => []),
      prisma.listing
        .count({
          where: {
            status: "ACTIVE",
            opportunityType: dbType,
            countyName: county,
          },
        })
        .catch(() => 0),
    ]);

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
              { label: county, href: `/opportunities/${typeSlug}/in-${countySlug}` },
            ]}
            title={`${opp.label} in ${county}`}
            description={`Browse ${opp.label.toLowerCase()} opportunities available in ${county}, Kenya.`}
            count={count || undefined}
          />

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
                          <span className="text-[11px] text-muted">{job.location || ""}</span>
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
                  Showing 20 of {count} {opp.label.toLowerCase()} opportunities in {county}
                </p>
              )}
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
  } catch {
    notFound();
  }
}
