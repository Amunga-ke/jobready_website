import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { KE_COUNTIES, slugifyCounty, getCountyBySlug } from "@/lib/constants";
import { getRobotsMeta, type SeoTier } from "@/lib/seo/page-thresholds";
import { getCountyIntro, getNearbyCounties } from "@/lib/seo/fallback-content";
import { SeoPageHeader, RichFallback } from "@/components/jobready/SeoPageLayout";
import JobRowClickable from "@/components/jobready/JobRowClickable";
import { getJobCountByCounty, getJobsByCounty } from "@/lib/data";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ county: string }>;
}): Promise<Metadata> {
  const { county: countySlug } = await params;
  const countyName = getCountyBySlug(countySlug);

  if (!countyName) return { title: "Not Found | JobReady" };

  const count = await getJobCountByCounty(countySlug);
  const robots = getRobotsMeta(count, "COUNTY" as SeoTier);

  return {
    title: `Jobs in ${countyName}, Kenya (${count || ""} Openings) | JobReady`,
    description: getCountyIntro(countyName),
    robots,
    alternates: {
      canonical: `https://jobreadyke.co.ke/jobs/in-${countySlug}`,
    },
    openGraph: {
      title: `Jobs in ${countyName} | JobReady`,
      description: getCountyIntro(countyName),
      url: `https://jobreadyke.co.ke/jobs/in-${countySlug}`,
      type: "website",
      siteName: "JobReady",
    },
    twitter: {
      card: "summary_large_image",
      title: `Jobs in ${countyName} | JobReady`,
      description: getCountyIntro(countyName),
    },
  };
}

export default async function CountyPage({
  params,
}: {
  params: Promise<{ county: string }>;
}) {
  const { county: countySlug } = await params;
  const countyName = getCountyBySlug(countySlug);

  if (!countyName) notFound();

  // Look up county record for ID-based queries
  const countyRecord = await prisma.county.findUnique({
    where: { slug: countySlug },
    select: { id: true },
  });

  // Fetch jobs, nearby counties, and DB categories with per-county job counts
  const [countResult, nearby, dbCategories] = await Promise.all([
    getJobsByCounty(countySlug, 20),
    Promise.resolve(getNearbyCounties(countyName)),
    countyRecord
      ? prisma.category.findMany({
          where: { active: true },
          orderBy: { sortOrder: "asc" },
          include: {
            _count: {
              select: {
                listings: {
                  where: { status: "ACTIVE", countyId: countyRecord.id },
                },
              },
            },
          },
        })
      : Promise.resolve([]),
  ]);
  const count = countResult.count;
  const countyJobs = countResult.jobs;
  const relatedCategories = dbCategories
    .filter((c) => c._count.listings > 0)
    .slice(0, 8);

  return (
    <main className="bg-surface">
      <div className="max-w-6xl mx-auto px-5 py-8 md:py-12">
        <SeoPageHeader
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Jobs", href: "/jobs" },
            { label: countyName, href: `/jobs/in-${countySlug}` },
          ]}
          title={`Jobs in ${countyName}, Kenya`}
          description={getCountyIntro(countyName)}
          count={count || undefined}
        />

        {/* Listings or fallback */}
        {countyJobs.length > 0 ? (
          <div className="mb-10">
            <div className="hidden sm:grid sm:grid-cols-12 gap-4 pb-2 border-b border-divider text-[10px] font-mono text-muted uppercase tracking-widest mb-1">
              <div className="col-span-5">Position</div>
              <div className="col-span-3">Company</div>
              <div className="col-span-2">Type</div>
              <div className="col-span-2 text-right">Deadline</div>
            </div>
            <div className="divide-y divide-subtle">
              {countyJobs.map((job) => {
                const dl = job.deadline
                  ? Math.ceil(
                      (new Date(job.deadline).getTime() - Date.now()) /
                        (1000 * 60 * 60 * 24)
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
                        <span className="text-[11px] text-muted">
                          {job.companyName}
                        </span>
                        <span className="text-[11px] text-subtle">·</span>
                        <span className="text-[11px] text-muted">
                          {job.location}
                        </span>
                      </div>
                    </div>
                    <div className="hidden sm:block sm:col-span-3 text-[12px] text-muted truncate">
                      {job.companyName}
                    </div>
                    <div className="col-span-6 sm:col-span-2 flex items-center">
                      <span className="text-[11px] text-muted">
                        {job.listingType === "GOVERNMENT"
                          ? "Gov"
                          : job.listingType === "CASUAL"
                          ? "Casual"
                          : job.employmentType || "Job"}
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
                        <span className="text-[11px] text-muted/50">—</span>
                      )}
                    </div>
                  </JobRowClickable>
                );
              })}
            </div>
            {count > 20 && (
              <Link
                href={`/jobs?county=${countyRecord?.id || countySlug}`}
                className="inline-flex items-center gap-1 text-[13px] font-medium text-accent hover:text-accent-dark transition-colors mt-4"
              >
                View all {count} jobs in {countyName} →
              </Link>
            )}
          </div>
        ) : (
          <div className="mb-10">
            <RichFallback
              county={countyName}
              listingCount={count}
              nearbyCounties={nearby}
              relatedCategories={relatedCategories.map((c) => ({
                label: c.name,
                slug: c.slug,
                value: c.name,
              }))}
            />
          </div>
        )}

        {/* Jobs by category (from DB with counts) */}
        <div className="mb-10">
          <h2 className="text-[13px] font-semibold text-ink uppercase tracking-wider mb-4">
            Jobs in {countyName} by Category
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {dbCategories.map((cat) => (
              <Link
                key={cat.id}
                href={`/jobs/category/${cat.slug}/in-${countySlug}`}
                className="flex items-center justify-between px-4 py-3 rounded-lg border border-divider hover:border-accent/30 hover:bg-accent-bg/50 transition-all group"
              >
                <span className="text-[13px] font-medium text-ink/80 group-hover:text-ink">
                  {cat.name}
                </span>
                <div className="flex items-center gap-2 shrink-0">
                  {cat._count.listings > 0 && (
                    <span className="text-[11px] font-mono text-accent">
                      {cat._count.listings}
                    </span>
                  )}
                  <svg
                    className="w-4 h-4 text-muted group-hover:text-accent"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Opportunities in this county */}
        <div className="mb-10">
          <h2 className="text-[13px] font-semibold text-ink uppercase tracking-wider mb-4">
            Opportunities in {countyName}
          </h2>
          <div className="flex flex-wrap gap-2">
            {[
              { label: "Scholarships", href: "/opportunities/scholarship" },
              { label: "Internships", href: "/opportunities/internship" },
              { label: "Fellowships", href: "/opportunities/fellowship" },
              { label: "Grants", href: "/opportunities/grant" },
              { label: "Training", href: "/opportunities/training" },
              { label: "Bursaries", href: "/opportunities/bursary" },
            ].map((opp) => (
              <Link
                key={opp.href}
                href={opp.href}
                className="text-[12px] font-medium px-3 py-1.5 rounded-lg bg-amber-50 text-amber-700 border border-amber-100 hover:bg-amber-100 transition-colors"
              >
                {opp.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Nearby counties */}
        <div>
          <h2 className="text-[13px] font-semibold text-ink uppercase tracking-wider mb-4">
            Nearby Counties
          </h2>
          <div className="flex flex-wrap gap-2">
            {nearby.map((c) => (
              <Link
                key={c}
                href={`/jobs/in-${slugifyCounty(c)}`}
                className="text-[12px] font-medium px-3 py-1.5 rounded-lg bg-ink/[0.04] text-ink/70 hover:bg-ink/[0.08] hover:text-ink transition-colors"
              >
                {c}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
