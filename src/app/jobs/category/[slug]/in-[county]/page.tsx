import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { KE_COUNTIES, slugifyCounty, getCategoryBySlug, getCountyBySlug } from "@/lib/constants";
import { getRobotsMeta, type SeoTier } from "@/lib/seo/page-thresholds";
import { getComboIntro, getSalaryContext, getNearbyCounties } from "@/lib/seo/fallback-content";
import { SeoPageHeader } from "@/components/jobready/SeoPageLayout";
import JobRowClickable from "@/components/jobready/JobRowClickable";
import { getJobCountByCategoryAndCounty, getJobsByCategoryAndCounty } from "@/lib/data";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; county: string }>;
}): Promise<Metadata> {
  const { slug, county: countySlug } = await params;
  const county = getCountyBySlug(countySlug);
  if (!county) return { title: "Not Found | JobReady" };

  const catRecord = await prisma.category.findUnique({ where: { slug } });
  if (!catRecord) return { title: "Not Found | JobReady" };

  const label = catRecord.name;
  const category = getCategoryBySlug(slug);
  const count = await getJobCountByCategoryAndCounty(slug, countySlug);
  const robots = getRobotsMeta(count, "CAT_COUNTY" as SeoTier);
  const description = category ? getComboIntro(category, county) : `Browse ${count} ${label.toLowerCase()} job openings in ${county}, Kenya on JobReady.`;

  return {
    title: `${label} Jobs in ${county} (${count || ""} Openings) | JobReady`,
    description,
    robots,
    alternates: {
      canonical: `https://jobreadyke.co.ke/jobs/category/${slug}/in-${countySlug}`,
    },
    openGraph: {
      title: `${label} Jobs in ${county} | JobReady`,
      description,
      url: `https://jobreadyke.co.ke/jobs/category/${slug}/in-${countySlug}`,
      type: "website",
      siteName: "JobReady",
    },
    twitter: {
      card: "summary_large_image",
      title: `${label} Jobs in ${county} | JobReady`,
      description,
    },
  };
}

export default async function CategoryCountyPage({
  params,
}: {
  params: Promise<{ slug: string; county: string }>;
}) {
  const { slug, county: countySlug } = await params;
  const county = getCountyBySlug(countySlug);
  if (!county) notFound();

  // Look up category from DB (source of truth)
  const catRecord = await prisma.category.findUnique({ where: { slug } });
  if (!catRecord) notFound();

  const label = catRecord.name;
  const category = getCategoryBySlug(slug); // may be null for DB-only categories
  const salaryContext = category ? getSalaryContext(category.value) : null;
  const description = category ? getComboIntro(category, county) : `Browse ${label.toLowerCase()} job openings in ${county}, Kenya.`;

  // Fetch subcategories from DB
  const subcategories = await prisma.subcategory.findMany({
    where: { categoryId: catRecord.id, active: true },
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { listings: { where: { status: "ACTIVE" } } } } },
  });

  const [comboResult, nearby, otherCategories] = await Promise.all([
    getJobsByCategoryAndCounty(slug, countySlug, 20),
    Promise.resolve(getNearbyCounties(county)),
    prisma.category.findMany({
      where: { active: true, id: { not: catRecord.id } },
      orderBy: { name: "asc" },
      select: { slug: true, name: true, _count: { select: { listings: { where: { status: "ACTIVE" } } } } },
      take: 6,
    }),
  ]);

  const count = comboResult.count;
  const comboJobs = comboResult.jobs;

  return (
    <main className="bg-surface">
      <div className="max-w-6xl mx-auto px-5 py-8 md:py-12">
        <SeoPageHeader
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Jobs", href: "/jobs" },
            { label, href: `/jobs/category/${slug}` },
            { label: county, href: `/jobs/in-${countySlug}` },
            { label: `${label} in ${county}`, href: `/jobs/category/${slug}/in-${countySlug}` },
          ]}
          title={`${label} Jobs in ${county}`}
          description={description}
          count={count || undefined}
        />

        {/* Salary overview */}
        {salaryContext && (
          <div className="mb-8 rounded-lg bg-emerald-50/60 border border-emerald-100/80 px-5 py-4 max-w-xl">
            <p className="text-[11px] font-medium text-emerald-600 uppercase tracking-wider mb-1">
              Salary Range in {county}
            </p>
            <p className="text-base font-semibold text-ink">{salaryContext}</p>
            <p className="text-[12px] text-muted mt-1">
              Average {label.toLowerCase()} salary in {county}
            </p>
          </div>
        )}

        {/* Listings */}
        {comboJobs.length > 0 ? (
          <div className="mb-10">
            <div className="hidden sm:grid sm:grid-cols-12 gap-4 pb-2 border-b border-divider text-[10px] font-mono text-muted uppercase tracking-widest mb-1">
              <div className="col-span-5">Position</div>
              <div className="col-span-3">Company</div>
              <div className="col-span-2">Type</div>
              <div className="col-span-2 text-right">Deadline</div>
            </div>
            <div className="divide-y divide-subtle">
              {comboJobs.map((job) => {
                const dl = job.deadline
                  ? Math.ceil((new Date(job.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
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
                        <span className="text-[11px] text-muted">{job.companyName}</span>
                        <span className="text-[11px] text-subtle">·</span>
                        <span className="text-[11px] text-muted">{job.location}</span>
                      </div>
                    </div>
                    <div className="hidden sm:block sm:col-span-3 text-[12px] text-muted truncate">
                      {job.companyName}
                    </div>
                    <div className="col-span-6 sm:col-span-2 flex items-center">
                      <span className="text-[11px] text-muted">
                        {job.subcategory || job.listingType === "GOVERNMENT" ? "Gov" : job.employmentType || "Job"}
                      </span>
                    </div>
                    <div className="col-span-6 sm:col-span-2 flex sm:justify-end items-center">
                      {dl !== null ? (
                        <span className={`font-mono text-[12px] font-medium tabular-nums ${dl <= 0 ? "text-muted/40" : urgent ? "text-accent" : "text-muted"}`}>
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
                href={`/jobs?category=${slug}&county=${countySlug}`}
                className="inline-flex items-center gap-1 text-[13px] font-medium text-accent hover:text-accent-dark transition-colors mt-4"
              >
                View all {count} {label.toLowerCase()} jobs in {county} →
              </Link>
            )}
          </div>
        ) : (
          <div className="mb-10 rounded-xl bg-accent-bg border border-accent/10 px-5 py-6 text-center">
            <p className="text-[14px] text-ink/80">
              No {label.toLowerCase()} jobs listed in {county} at the moment.
            </p>
            <div className="flex items-center justify-center gap-3 mt-4">
              <Link
                href={`/jobs/category/${slug}`}
                className="text-[13px] font-medium text-accent hover:text-accent-dark transition-colors"
              >
                View all {label.toLowerCase()} jobs →
              </Link>
              <Link
                href={`/jobs/in-${countySlug}`}
                className="text-[13px] font-medium text-muted hover:text-ink transition-colors"
              >
                All jobs in {county} →
              </Link>
            </div>
          </div>
        )}

        {/* Subcategories with real DB counts */}
        {subcategories.length > 0 && (
          <div className="mb-10">
            <h2 className="text-[13px] font-semibold text-ink uppercase tracking-wider mb-4">
              {label} Subcategories in {county}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {subcategories.map((sub) => (
                <Link
                  key={sub.slug}
                  href={`/jobs/category/${slug}/${sub.slug}`}
                  className="group flex items-center justify-between px-4 py-3 rounded-lg border border-divider hover:border-accent/30 hover:bg-accent-bg/50 transition-all"
                >
                  <span className="text-[13px] font-medium text-ink/80 group-hover:text-ink transition-colors truncate mr-2">
                    {sub.name}
                  </span>
                  <div className="flex items-center gap-2 shrink-0">
                    {sub._count.listings > 0 && (
                      <span className="text-[11px] font-mono text-accent">{sub._count.listings}</span>
                    )}
                    <svg className="w-4 h-4 text-muted group-hover:text-accent transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Nearby counties */}
        <div className="mb-10">
          <h2 className="text-[13px] font-semibold text-ink uppercase tracking-wider mb-4">
            {label} Jobs Nearby
          </h2>
          <div className="flex flex-wrap gap-2">
            {nearby.map((c) => (
              <Link
                key={c}
                href={`/jobs/category/${slug}/in-${slugifyCounty(c)}`}
                className="text-[12px] font-medium px-3 py-1.5 rounded-lg bg-ink/[0.04] text-ink/70 hover:bg-ink/[0.08] hover:text-ink transition-colors"
              >
                {c}
              </Link>
            ))}
          </div>
        </div>

        {/* Other categories in this county */}
        <div>
          <h2 className="text-[13px] font-semibold text-ink uppercase tracking-wider mb-4">
            Other Jobs in {county}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {otherCategories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/jobs/category/${cat.slug}/in-${countySlug}`}
                className="group flex items-center justify-between px-4 py-3 rounded-lg border border-divider hover:border-accent/30 hover:bg-accent-bg/50 transition-all"
              >
                <span className="text-[13px] font-medium text-ink/80 group-hover:text-ink">
                  {cat.name}
                </span>
                <div className="flex items-center gap-2 shrink-0">
                  {cat._count.listings > 0 && (
                    <span className="text-[11px] font-mono text-accent">{cat._count.listings}</span>
                  )}
                  <svg className="w-4 h-4 text-muted group-hover:text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
