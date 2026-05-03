import Link from "next/link";
import type { Metadata } from "next";
import { OPPORTUNITY_TYPES, KE_COUNTIES, slugifyCounty } from "@/lib/constants";
import { SeoPageHeader } from "@/components/jobready/SeoPageLayout";
import JobRowClickable from "@/components/jobready/JobRowClickable";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

/* ── Fetch counts for every opportunity type in one round-trip ── */
async function getTypeCounts() {
  // Single raw query: GROUP BY opportunityType
  const rows = await prisma.$queryRaw<
    Array<{ opportunityType: string; _count: bigint }>
  >`
    SELECT opportunityType, COUNT(*) as _count
    FROM Listing
    WHERE status = 'ACTIVE' AND opportunityType IS NOT NULL AND opportunityType != ''
    GROUP BY opportunityType
    ORDER BY _count DESC
  `.catch(() => []);

  const map = new Map<string, number>();
  for (const r of rows) {
    map.set(r.opportunityType, Number(r._count));
  }
  return map;
}

/* ── Fetch recent listings across all opportunity types ── */
async function getRecentListings(limit = 20) {
  return prisma.listing
    .findMany({
      where: {
        status: "ACTIVE",
        opportunityType: { not: null },
      },
      include: {
        company: true,
        category: true,
        subcategory: true,
        tags: { include: { tag: true } },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    })
    .catch(() => []);
}

export default async function OpportunitiesPage() {
  const [typeCounts, recentListings] = await Promise.all([
    getTypeCounts(),
    getRecentListings(20),
  ]);

  const totalCount = Array.from(typeCounts.values()).reduce((a, b) => a + b, 0);

  /* Build enriched type cards sorted by real count (types with listings first) */
  const typesWithCounts = OPPORTUNITY_TYPES.map((t) => ({
    ...t,
    count: typeCounts.get(t.value) ?? 0,
  })).sort((a, b) => b.count - a.count);

  /* Split into "popular" (has listings) and "other" (no listings yet) */
  const popular = typesWithCounts.filter((t) => t.count > 0);
  const other = typesWithCounts.filter((t) => t.count === 0);

  return (
    <main className="bg-surface">
      <div className="max-w-6xl mx-auto px-5 py-8 md:py-12">
        <SeoPageHeader
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Opportunities", href: "/opportunities" },
          ]}
          title="Opportunities"
          description="Scholarships, internships, fellowships, grants, bursaries and more from top organizations in Kenya."
          count={totalCount || undefined}
        />

        {/* ── Browse by type ── */}
        <div className="mb-10">
          <h2 className="text-[13px] font-semibold text-ink uppercase tracking-wider mb-4">
            Browse by Type
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {typesWithCounts.map((t) => (
              <Link
                key={t.slug}
                href={`/opportunities/${t.slug}`}
                className="group flex items-center justify-between px-4 py-3 rounded-lg border border-divider hover:border-accent/30 hover:bg-accent-bg/50 transition-all"
              >
                <span className="text-[13px] font-medium text-ink/80 group-hover:text-ink transition-colors">
                  {t.label}
                </span>
                <div className="flex items-center gap-2 shrink-0">
                  {t.count > 0 && (
                    <span className="text-[11px] font-mono text-accent">
                      {t.count}
                    </span>
                  )}
                  <svg
                    className="w-4 h-4 text-muted group-hover:text-accent transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* ── Recent listings across all types ── */}
        {recentListings.length > 0 && (
          <div className="mb-10">
            <h2 className="text-[13px] font-semibold text-ink uppercase tracking-wider mb-4">
              Latest Opportunities
            </h2>
            <div className="hidden sm:grid sm:grid-cols-12 gap-4 pb-2 border-b border-divider text-[10px] font-mono text-muted uppercase tracking-widest mb-1">
              <div className="col-span-5">Position</div>
              <div className="col-span-3">Company</div>
              <div className="col-span-2">Type</div>
              <div className="col-span-2 text-right">Deadline</div>
            </div>
            <div className="divide-y divide-subtle">
              {recentListings.map((job) => {
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
            {totalCount > 20 && (
              <Link
                href="/jobs?opportunity=INTERNSHIP"
                className="inline-flex items-center gap-1 text-[13px] font-medium text-accent hover:text-accent-dark transition-colors mt-4"
              >
                View all {totalCount} opportunities &rarr;
              </Link>
            )}
          </div>
        )}

        {/* ── Browse by county ── */}
        <div className="mb-10">
          <h2 className="text-[13px] font-semibold text-ink uppercase tracking-wider mb-4">
            Opportunities by County
          </h2>
          <div className="flex flex-wrap gap-2">
            {KE_COUNTIES.map((county) => {
              const countySlug = slugifyCounty(county);
              return (
                <Link
                  key={countySlug}
                  href={`/opportunities/internship/in-${countySlug}`}
                  className="text-[12px] font-medium px-3 py-1.5 rounded-lg bg-ink/[0.04] text-ink/70 hover:bg-ink/[0.08] hover:text-ink transition-colors"
                >
                  {county}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}
