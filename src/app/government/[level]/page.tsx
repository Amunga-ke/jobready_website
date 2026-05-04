import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { KE_COUNTIES, slugifyCounty } from "@/lib/constants";
import { getGovernmentJobsByLevel } from "@/lib/data";
import { SeoPageHeader } from "@/components/jobready/SeoPageLayout";
import JobRowClickable from "@/components/jobready/JobRowClickable";
import { formatDateShortUTC } from "@/lib/format-date";
import { BreadcrumbJsonLd, CollectionPageJsonLd } from "@/components/jobready/JsonLd";
import type { Job } from "@/types";
import prisma from "@/lib/prisma";

const GOV_LEVELS = [
  {
    slug: "national",
    label: "National Government",
    description:
      "Browse job openings from Kenya's national government ministries, departments, and agencies. Civil service positions, parastatal roles, and public sector careers.",
    dbLevel: "NATIONAL" as const,
  },
  {
    slug: "county",
    label: "County Governments",
    description:
      "Find jobs across all 47 county governments in Kenya. County public service board announcements, county executive positions, and county assembly roles.",
    dbLevel: "COUNTY" as const,
  },
  {
    slug: "state-corporations",
    label: "State Corporations & Parastatals",
    description:
      "Explore career opportunities at Kenyan state corporations, parastatals, and semi-autonomous government agencies.",
    dbLevel: "STATE_CORPORATION" as const,
  },
] as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ level: string }>;
}): Promise<Metadata> {
  try {
    const { level } = await params;
    const gov = GOV_LEVELS.find((g) => g.slug === level);
    if (!gov) return { title: "Not Found | JobReady" };

    return {
      title: `${gov.label} Jobs in Kenya | JobReady`,
      description: gov.description,
      alternates: {
        canonical: `https://jobreadyke.co.ke/government/${level}`,
      },
      openGraph: {
        title: `${gov.label} Jobs | JobReady`,
        description: gov.description,
        url: `https://jobreadyke.co.ke/government/${level}`,
        type: "website",
        siteName: "JobReady",
      },
      twitter: {
        card: "summary_large_image",
        title: `${gov.label} Jobs | JobReady`,
        description: gov.description,
      },
    };
  } catch {
    return { title: "Not Found | JobReady" };
  }
}

export const dynamic = "force-dynamic";

export default async function GovernmentLevelPage({
  params,
}: {
  params: Promise<{ level: string }>;
}) {
  try {
    const { level } = await params;
    const gov = GOV_LEVELS.find((g) => g.slug === level);

    if (!gov) notFound();

    const [jobs, otherLevelCounts, countyCountMap] = await Promise.all([
      getGovernmentJobsByLevel(gov.dbLevel).catch(() => [] as Job[]),
      // Get counts for all levels
      prisma.listing
        .groupBy({
          by: ["governmentLevel"],
          where: { status: "ACTIVE", listingType: "GOVERNMENT" },
          _count: true,
        })
        .catch(() => []),
      // Get county counts for county level
      level === "county"
        ? prisma.$queryRaw<Array<{ county: string; _count: bigint }>>`
            SELECT county, COUNT(*) as _count
            FROM Listing
            WHERE status = 'ACTIVE' AND listingType = 'GOVERNMENT' AND governmentLevel = 'COUNTY'
              AND county IS NOT NULL AND county != ''
            GROUP BY county
            ORDER BY _count DESC
          `.catch(() => [])
        : Promise.resolve([]),
    ]);

    const count = jobs.length;
    const otherLevels = GOV_LEVELS.filter((g) => g.slug !== level);

    // Build level count map
    const levelCountMap = new Map<string, number>();
    for (const r of otherLevelCounts) {
      if (r.governmentLevel) levelCountMap.set(r.governmentLevel, r._count);
    }

    // Build county count map
    const countyCounts = new Map<string, number>();
    for (const r of countyCountMap as Array<{ county: string; _count: bigint }>) {
      countyCounts.set(r.county, Number(r._count));
    }

    return (
      <main className="bg-surface">
        <BreadcrumbJsonLd items={[
          { name: "Home", url: "https://jobreadyke.co.ke/" },
          { name: "Government Jobs", url: "https://jobreadyke.co.ke/government" },
          { name: gov.label, url: `https://jobreadyke.co.ke/government/${level}` },
        ]} />
        <CollectionPageJsonLd name={`${gov.label} Jobs`} description={gov.description} url={`https://jobreadyke.co.ke/government/${level}`} numberOfItems={count || undefined} />
        <div className="max-w-6xl mx-auto px-5 py-8 md:py-12">
          <SeoPageHeader
            breadcrumbs={[
              { label: "Home", href: "/" },
              { label: "Government Jobs", href: "/government" },
              { label: gov.label, href: `/government/${level}` },
            ]}
            title={`${gov.label} Jobs`}
            description={gov.description}
            count={count || undefined}
          />

          {/* Blue gov badge */}
          <div className="mb-8 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-100">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            <span className="text-[12px] font-medium">{gov.label}</span>
          </div>

          {/* Listings */}
          {count > 0 ? (
            <div className="mb-10">
              {/* Column headers — desktop */}
              <div className="hidden sm:grid sm:grid-cols-12 gap-4 pb-2 border-b border-divider text-[10px] font-mono text-muted uppercase tracking-widest mb-1">
                <div className="col-span-5">Position</div>
                <div className="col-span-3">Employer</div>
                <div className="col-span-2">Location</div>
                <div className="col-span-2 text-right">Deadline</div>
              </div>
              <div className="divide-y divide-subtle">
                {jobs.map((job) => (
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
                        <span className="text-[11px] text-muted">{job.companyName}</span>
                        <span className="text-[11px] text-subtle">&middot;</span>
                        <span className="text-[11px] text-muted">{job.location}</span>
                      </div>
                    </div>
                    <div className="hidden sm:block sm:col-span-3 text-[12px] text-muted truncate">
                      {job.companyName}
                    </div>
                    <div className="hidden sm:block sm:col-span-2 text-[12px] text-muted truncate">
                      {job.location}
                    </div>
                    <div className="col-span-12 sm:col-span-2 flex sm:justify-end items-center">
                      {job.deadline ? (
                        <span className="font-mono text-[12px] text-muted tabular-nums">
                          {formatDateShortUTC(job.deadline)}
                        </span>
                      ) : (
                        <span className="text-[11px] text-muted/50">&mdash;</span>
                      )}
                    </div>
                  </JobRowClickable>
                ))}
              </div>
              {count >= 50 && (
                <Link
                  href={`/jobs?type=GOVERNMENT&govt=${gov.dbLevel}`}
                  className="inline-flex items-center gap-1 text-[13px] font-medium text-accent hover:text-accent-dark transition-colors mt-4"
                >
                  View all {gov.label.toLowerCase()} positions &rarr;
                </Link>
              )}
            </div>
          ) : (
            /* Rich fallback for empty state */
            <div className="mb-10 space-y-6">
              <div className="rounded-xl bg-blue-50/70 border border-blue-100 px-5 py-4">
                <p className="text-[14px] text-blue-800/90">
                  No {gov.label.toLowerCase()} listings are available right now. Government positions are posted regularly through official gazette notices. Here are some alternatives:
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Other government levels */}
                <div className="rounded-xl border border-divider p-5">
                  <h3 className="text-[13px] font-semibold text-ink mb-3">Other Government Sections</h3>
                  <div className="flex flex-wrap gap-2">
                    {otherLevels
                      .filter((g) => (levelCountMap.get(g.dbLevel) || 0) > 0)
                      .map((g) => (
                        <Link
                          key={g.slug}
                          href={`/government/${g.slug}`}
                          className="text-[12px] font-medium px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-100 hover:bg-blue-100 transition-colors"
                        >
                          {g.label} ({levelCountMap.get(g.dbLevel) || 0})
                        </Link>
                      ))}
                    {otherLevels.filter((g) => (levelCountMap.get(g.dbLevel) || 0) > 0).length === 0 && (
                      <p className="text-[12px] text-muted">No other sections have listings yet.</p>
                    )}
                  </div>
                </div>

                {/* Browse by county */}
                <div className="rounded-xl border border-divider p-5">
                  <h3 className="text-[13px] font-semibold text-ink mb-3">Browse by County</h3>
                  <div className="flex flex-wrap gap-2">
                    {KE_COUNTIES.slice(0, 12).map((county) => (
                      <Link
                        key={slugifyCounty(county)}
                        href={`/jobs/in-${slugifyCounty(county)}`}
                        className="text-[12px] font-medium px-3 py-1.5 rounded-lg bg-ink/[0.04] text-ink/70 hover:bg-ink/[0.08] hover:text-ink transition-colors"
                      >
                        {county}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Application tips */}
              <div className="rounded-lg bg-emerald-50/60 border border-emerald-100/80 px-5 py-4">
                <p className="text-[11px] font-medium text-emerald-600 uppercase tracking-wider mb-1">
                  Government Application Tips
                </p>
                <ul className="text-[12px] text-ink/70 space-y-1 list-disc pl-4">
                  <li>Monitor the Kenya Gazette and Public Service Commission website for announcements</li>
                  <li>Government applications are always free — never pay any fees</li>
                  <li>Prepare certified copies of all academic and professional certificates</li>
                  <li>Chapter Six of the Constitution requires integrity declarations</li>
                </ul>
              </div>
            </div>
          )}

          {/* County-specific government pages */}
          {level === "county" && (
            <div className="mb-10">
              <h2 className="text-[13px] font-semibold text-ink uppercase tracking-wider mb-4">
                County Government Jobs by County
              </h2>
              <div className="flex flex-wrap gap-2">
                {KE_COUNTIES.map((county) => {
                  const countySlug = slugifyCounty(county);
                  const cCount = countyCounts.get(county) || 0;
                  return (
                    <Link
                      key={countySlug}
                      href={`/jobs?type=GOVERNMENT&govt=COUNTY&county=${county}`}
                      className={`text-[12px] font-medium px-3 py-1.5 rounded-lg border transition-colors ${
                        cCount > 0
                          ? "bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-100"
                          : "bg-ink/[0.02] text-muted/40 border-transparent"
                      }`}
                    >
                      {county}
                      {cCount > 0 && (
                        <span className="ml-1.5 font-mono text-[11px] text-blue-500">{cCount}</span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Other government levels */}
          <div className="mb-10">
            <h2 className="text-[13px] font-semibold text-ink uppercase tracking-wider mb-4">
              Other Government Sections
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {otherLevels.map((g) => {
                const gCount = levelCountMap.get(g.dbLevel) || 0;
                return (
                  <Link
                    key={g.slug}
                    href={`/government/${g.slug}`}
                    className="flex items-center justify-between px-4 py-3 rounded-lg border border-divider hover:border-blue-200 hover:bg-blue-50/50 transition-all group"
                  >
                    <span className="text-[13px] font-medium text-ink/80 group-hover:text-ink">
                      {g.label}
                    </span>
                    <div className="flex items-center gap-2">
                      {gCount > 0 && (
                        <span className="font-mono text-[11px] text-blue-500">{gCount}</span>
                      )}
                      <svg
                        className="w-4 h-4 text-muted group-hover:text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* How to apply guide */}
          <div className="rounded-xl border border-divider p-6">
            <h2 className="text-[15px] font-heading font-bold text-ink mb-2">
              How to Apply for {gov.label} Jobs
            </h2>
            <div className="text-[13px] text-ink/70 space-y-2">
              <p>
                Government job applications in Kenya follow a structured process. Here is what you need to know:
              </p>
              <ol className="list-decimal pl-5 space-y-1">
                <li>Check official announcements from the Public Service Commission (PSC) or County Public Service Boards</li>
                <li>Prepare your application: updated CV, cover letter, certified copies of certificates</li>
                <li>Submit before the stated deadline — late applications are never considered</li>
                <li>Shortlisted candidates are contacted for interviews and assessments</li>
                <li>Successful candidates undergo security clearance and verification</li>
              </ol>
              <p>
                All government jobs must comply with Chapter Six of the Constitution on Leadership and Integrity.
                Applications are free of charge — never pay for a government job application.
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  } catch {
    notFound();
  }
}
