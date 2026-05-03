import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { getCategoryBySlug, slugifyCounty } from "@/lib/constants";
import { getRobotsMeta, type SeoTier } from "@/lib/seo/page-thresholds";
import { getCategoryIntro, getSalaryContext } from "@/lib/seo/fallback-content";
import { SeoPageHeader } from "@/components/jobready/SeoPageLayout";
import JobRowClickable from "@/components/jobready/JobRowClickable";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  try {
    const { slug } = await params;

  // Look up category from DB first, fall back to hardcoded constants
  const dbCategory = await prisma.category
    .findUnique({ where: { slug } })
    .catch(() => null);
  if (!dbCategory) return { title: "Not Found | JobReady" };

  const fallbackCategory = getCategoryBySlug(slug);
  const label = dbCategory.name;

  const count = await prisma.listing
    .count({
      where: { categoryId: dbCategory.id, status: "ACTIVE" },
    })
    .catch(() => 0);
  const robots = getRobotsMeta(count, "CATEGORY" as SeoTier);

  const description = fallbackCategory
    ? getCategoryIntro(fallbackCategory)
    : `Browse ${count} ${label.toLowerCase()} job openings across Kenya on JobReady.`;

  return {
    title: `${label} Jobs in Kenya${count > 0 ? ` (${count} Openings)` : ""} | JobReady`,
    description,
    robots,
    alternates: { canonical: `https://jobreadyke.co.ke/jobs/category/${slug}` },
    openGraph: {
      title: `${label} Jobs in Kenya | JobReady`,
      description,
      url: `https://jobreadyke.co.ke/jobs/category/${slug}`,
      type: "website",
      siteName: "JobReady",
    },
    twitter: {
      card: "summary_large_image",
      title: `${label} Jobs in Kenya | JobReady`,
      description,
    },
  };
  } catch {
    return { title: "Not Found | JobReady" };
  }
}

// No generateStaticParams — page is force-dynamic, all slugs handled at runtime

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  try {
    const { slug } = await params;

  // Look up category from DB — this is the source of truth
  const dbCategory = await prisma.category
    .findUnique({
      where: { slug },
      include: {
        subcategories: {
          where: { active: true },
          orderBy: { sortOrder: "asc" },
          include: { _count: { select: { listings: { where: { status: "ACTIVE" } } } } },
        },
        _count: { select: { listings: { where: { status: "ACTIVE" } } } },
      },
    })
    .catch(() => null);

  if (!dbCategory) notFound();

  // Check if we have a matching hardcoded category for salary info
  const fallbackCategory = getCategoryBySlug(slug);
  const label = dbCategory.name;
  const description = fallbackCategory
    ? getCategoryIntro(fallbackCategory)
    : `Browse ${dbCategory._count.listings} ${label.toLowerCase()} job openings across Kenya.`;
  const salaryContext = fallbackCategory
    ? getSalaryContext(fallbackCategory.value)
    : null;

  const count = dbCategory._count.listings;

  // Fetch secondary data in parallel with error fallbacks
  // If any query fails (e.g. connection exhaustion), that section renders empty
  const [listings, countiesWithCounts, relatedCategoriesWithCounts] = await Promise.all([
    prisma.listing.findMany({
      where: { categoryId: dbCategory.id, status: "ACTIVE" },
      include: { company: true, category: true, subcategory: true, tags: { include: { tag: true } } },
      orderBy: { createdAt: "desc" },
      take: 20,
    }).catch(() => []),
    prisma.$queryRaw<Array<{ countyName: string; _count: bigint }>>`
      SELECT l.countyName, COUNT(*) as _count
      FROM Listing l
      WHERE l.status = 'ACTIVE' AND l.categoryId = ${dbCategory.id}
        AND l.countyName IS NOT NULL AND l.countyName != ''
      GROUP BY l.countyName
      ORDER BY _count DESC
      LIMIT 15
    `.catch(() => []),
    prisma.category.findMany({
      where: { active: true, id: { not: dbCategory.id } },
      orderBy: { sortOrder: "asc" },
      take: 6,
      include: { _count: { select: { listings: { where: { status: "ACTIVE" } } } } },
    }).catch(() => []),
  ]);

  return (
    <main className="bg-surface">
      <div className="max-w-6xl mx-auto px-5 py-8 md:py-12">
        <SeoPageHeader
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Jobs", href: "/jobs" },
            { label, href: `/jobs/category/${slug}` },
          ]}
          title={`${label} Jobs in Kenya`}
          description={description}
          count={count || undefined}
        />

        {/* Salary overview (only if we have hardcoded data for this category) */}
        {salaryContext && (
          <div className="mb-8 rounded-lg bg-emerald-50/60 border border-emerald-100/80 px-5 py-4 max-w-xl">
            <p className="text-[11px] font-medium text-emerald-600 uppercase tracking-wider mb-1">
              Salary Range in Kenya
            </p>
            <p className="text-base font-semibold text-ink">{salaryContext}</p>
            <p className="text-[12px] text-muted mt-1">
              Average based on market data across all experience levels
            </p>
          </div>
        )}

        {/* Job listings */}
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
                  ? Math.ceil((job.deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
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
                        <span className="text-[11px] text-muted">{job.company.name}</span>
                        <span className="text-[11px] text-subtle">&middot;</span>
                        <span className="text-[11px] text-muted">{job.location}</span>
                      </div>
                    </div>
                    <div className="hidden sm:block sm:col-span-3 text-[12px] text-muted truncate">
                      {job.company.name}
                    </div>
                    <div className="col-span-6 sm:col-span-2 flex items-center">
                      <span className="text-[11px] text-muted">
                        {job.subcategory?.name || job.listingType}
                      </span>
                    </div>
                    <div className="col-span-6 sm:col-span-2 flex sm:justify-end items-center">
                      {dl !== null ? (
                        <span
                          className={`font-mono text-[12px] font-medium tabular-nums ${
                            dl <= 0 ? "text-muted/40" : urgent ? "text-accent" : "text-muted"
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
              <Link
                href={`/jobs?category=${dbCategory.id}`}
                className="inline-flex items-center gap-1 text-[13px] font-medium text-accent hover:text-accent-dark transition-colors mt-4"
              >
                View all {count} {label.toLowerCase()} jobs &rarr;
              </Link>
            )}
          </div>
        ) : (
          <div className="mb-10 text-center py-12">
            <p className="text-[14px] text-muted">
              No {label.toLowerCase()} jobs listed at the moment. Check back soon.
            </p>
          </div>
        )}

        {/* Subcategory grid with real counts */}
        {dbCategory.subcategories && dbCategory.subcategories.length > 0 && (
          <div className="mb-10">
            <h2 className="text-[13px] font-semibold text-ink uppercase tracking-wider mb-4">
              {label} Subcategories
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {dbCategory.subcategories.map((sub) => (
                <Link
                  key={sub.slug}
                  href={`/jobs/category/${slug}/${sub.slug}`}
                  className="group flex items-center justify-between px-4 py-3 rounded-lg border border-divider hover:border-accent/30 hover:bg-accent-bg/50 transition-all"
                >
                  <div className="min-w-0">
                    <span className="text-[13px] font-medium text-ink/80 group-hover:text-ink transition-colors">
                      {sub.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {sub._count.listings > 0 && (
                      <span className="text-[11px] font-mono text-accent">{sub._count.listings}</span>
                    )}
                    <svg
                      className="w-4 h-4 text-muted group-hover:text-accent transition-colors"
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Browse by county — only counties that have jobs in this category */}
        {countiesWithCounts.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[13px] font-semibold text-ink uppercase tracking-wider">
                {label} Jobs by County
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {countiesWithCounts.map((c) => {
                const countySlug = slugifyCounty(c.countyName);
                return (
                  <Link
                    key={countySlug}
                    href={`/jobs/category/${slug}/in-${countySlug}`}
                    className="text-[12px] font-medium px-3 py-1.5 rounded-lg bg-ink/[0.04] text-ink/70 hover:bg-ink/[0.08] hover:text-ink transition-colors inline-flex items-center gap-1.5"
                  >
                    {c.countyName}
                    <span className="text-[10px] font-mono text-accent">
                      {Number(c._count)}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Related categories with real job counts */}
        {relatedCategoriesWithCounts.length > 0 && (
          <div>
            <h2 className="text-[13px] font-semibold text-ink uppercase tracking-wider mb-4">
              Related Categories
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {relatedCategoriesWithCounts.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/jobs/category/${cat.slug}`}
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
                    <svg className="w-4 h-4 text-muted group-hover:text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
    );
  } catch {
    notFound();
  }
}
