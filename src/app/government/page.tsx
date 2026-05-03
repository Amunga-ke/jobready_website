import type { Metadata } from "next";
import Link from "next/link";
import { KE_COUNTIES, slugifyCounty, PROVINCES } from "@/lib/constants";
import { SeoPageHeader } from "@/components/jobready/SeoPageLayout";
import JobRowClickable from "@/components/jobready/JobRowClickable";
import GovTabs from "./GovTabs";
import prisma from "@/lib/prisma";
import type { Job } from "@/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Government Jobs in Kenya | JobReady",
  description:
    "Browse national, county and state corporation jobs from the Kenya Gazette. TSC, PSC, KRA and all 47 county government positions.",
  alternates: { canonical: "https://jobreadyke.co.ke/government" },
  openGraph: {
    title: "Government Jobs in Kenya | JobReady",
    description:
      "Browse national, county and state corporation jobs from the Kenya Gazette.",
    url: "https://jobreadyke.co.ke/government",
    siteName: "JobReady",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Government Jobs in Kenya | JobReady",
    description:
      "Browse national, county and state corporation jobs from the Kenya Gazette.",
  },
};

/* ── Level config ── */
const GOV_LEVELS = [
  { value: "NATIONAL", slug: "national", label: "National Government", icon: "🏛️" },
  { value: "COUNTY", slug: "county", label: "County Governments", icon: "🏢" },
  { value: "STATE_CORPORATION", slug: "state-corporations", label: "State Corporations", icon: "🏗️" },
] as const;

/* ── Fetch all government jobs grouped by level ── */
async function getGovernmentData() {
  const [listings, totalByLevel] = await Promise.all([
    prisma.listing.findMany({
      where: { status: "ACTIVE", listingType: "GOVERNMENT" },
      include: {
        company: true,
        category: true,
        subcategory: true,
        tags: { include: { tag: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 60,
    }).catch(() => []),
    prisma.listing.groupBy({
      by: ["governmentLevel"],
      where: { status: "ACTIVE", listingType: "GOVERNMENT" },
      _count: true,
    }).catch(() => []),
  ]);

  // Group listings by level
  const national = listings.filter((l) => l.governmentLevel === "NATIONAL");
  const county = listings.filter((l) => l.governmentLevel === "COUNTY");
  const stateCorp = listings.filter((l) => l.governmentLevel === "STATE_CORPORATION");

  // Build count map
  const countMap = new Map<string, number>();
  for (const r of totalByLevel) {
    if (r.governmentLevel) countMap.set(r.governmentLevel, r._count);
  }

  // County-level counts for county pill badges
  const countyCounts = await prisma.$queryRaw<Array<{ county: string; _count: bigint }>>`
    SELECT county, COUNT(*) as _count
    FROM Listing
    WHERE status = 'ACTIVE' AND listingType = 'GOVERNMENT' AND governmentLevel = 'COUNTY'
      AND county IS NOT NULL AND county != ''
    GROUP BY county
    ORDER BY _count DESC
  `.catch(() => []);

  const countyCountMap = new Map<string, number>();
  for (const r of countyCounts) {
    countyCountMap.set(r.county, Number(r._count));
  }

  // Top employers across all government jobs
  const topEmployers = await prisma.$queryRaw<Array<{ companyName: string; _count: bigint }>>`
    SELECT c.name as companyName, COUNT(*) as _count
    FROM Listing l
    JOIN Company c ON l.companyId = c.id
    WHERE l.status = 'ACTIVE' AND l.listingType = 'GOVERNMENT'
    GROUP BY c.name
    ORDER BY _count DESC
    LIMIT 8
  `.catch(() => []);

  return {
    national,
    county,
    stateCorp,
    total: listings.length,
    counts: countMap,
    countyCountMap,
    topEmployers: topEmployers.map((e) => ({
      name: e.companyName,
      count: Number(e._count),
    })),
  };
}

export default async function GovernmentPage() {
  const data = await getGovernmentData();

  return (
    <main className="bg-surface">
      <div className="max-w-6xl mx-auto px-5 py-8 md:py-12">
        <SeoPageHeader
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Government Jobs", href: "/government" },
          ]}
          title="Government Jobs in Kenya"
          description="National, county and state corporation positions from the Kenya Gazette. TSC, PSC, KRA, and all 47 county government openings."
          count={data.total || undefined}
        />

        {/* Level tabs */}
        <GovTabs
          levels={GOV_LEVELS.map((l) => ({
            ...l,
            count: data.counts.get(l.value) || 0,
          }))}
          national={data.national}
          county={data.county}
          stateCorp={data.stateCorp}
          countyCountMap={data.countyCountMap}
          topEmployers={data.topEmployers}
        />

        {/* County government jobs by county */}
        <div className="mt-10 mb-10">
          <h2 className="text-[13px] font-semibold text-ink uppercase tracking-wider mb-4">
            County Government Jobs by County
          </h2>
          <div className="flex flex-wrap gap-2">
            {KE_COUNTIES.map((county) => {
              const countySlug = slugifyCounty(county);
              const cCount = data.countyCountMap.get(county) || 0;
              return (
                <Link
                  key={countySlug}
                  href={`/jobs?type=GOVERNMENT&govt=COUNTY&county=${county}`}
                  className={`text-[12px] font-medium px-3 py-1.5 rounded-lg transition-colors ${
                    cCount > 0
                      ? "bg-blue-50 text-blue-700 border border-blue-100 hover:bg-blue-100"
                      : "bg-ink/[0.02] text-muted/40 border border-transparent"
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

        {/* Top Government Employers */}
        {data.topEmployers.length > 0 && (
          <div className="mb-10">
            <h2 className="text-[13px] font-semibold text-ink uppercase tracking-wider mb-4">
              Top Government Employers
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {data.topEmployers.map((emp) => (
                <Link
                  key={emp.name}
                  href={`/companies`}
                  className="flex items-center justify-between px-4 py-3 rounded-lg border border-divider hover:border-blue-200 hover:bg-blue-50/30 transition-all group"
                >
                  <span className="text-[12px] font-medium text-ink/80 group-hover:text-ink truncate">
                    {emp.name}
                  </span>
                  <span className="font-mono text-[11px] text-muted ml-2 shrink-0">{emp.count}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* How to apply guide */}
        <div className="rounded-xl border border-divider p-6 mb-10">
          <h2 className="text-[15px] font-heading font-bold text-ink mb-2">
            How to Apply for Government Jobs in Kenya
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

        {/* Browse all link */}
        <div className="text-center py-4">
          <Link
            href="/jobs?type=GOVERNMENT"
            className="inline-flex items-center gap-2 text-[13px] font-medium text-accent hover:text-accent-dark transition-colors"
          >
            Browse all government jobs
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </main>
  );
}
