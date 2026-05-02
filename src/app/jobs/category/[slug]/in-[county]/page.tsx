import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JOB_CATEGORIES, KE_COUNTIES, slugifyCounty, getCategoryBySlug, getCountyBySlug } from "@/lib/constants";
import { getRobotsMeta, getFallbackStrategy, type SeoTier } from "@/lib/seo/page-thresholds";
import { getComboIntro, getSalaryContext, getNearbyCounties } from "@/lib/seo/fallback-content";
import { SeoPageHeader, SubcategoryGrid, RichFallback } from "@/components/jobready/SeoPageLayout";
import { getJobCountByCategoryAndCounty, getJobsByCategoryAndCounty } from "@/lib/data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; county: string }>;
}): Promise<Metadata> {
  const { slug, county: countySlug } = await params;
  const category = getCategoryBySlug(slug);
  const county = getCountyBySlug(countySlug);

  if (!category || !county) return { title: "Not Found | JobReady" };

  const count = await getJobCountByCategoryAndCounty(slug, countySlug);
  const robots = getRobotsMeta(count, "CAT_COUNTY" as SeoTier);

  return {
    title: `${category.label} Jobs in ${county} (${count || ""} Openings) | JobReady`,
    description: getComboIntro(category, county),
    robots,
    alternates: {
      canonical: `https://jobreadyke.co.ke/jobs/category/${slug}/in-${countySlug}`,
    },
    openGraph: {
      title: `${category.label} Jobs in ${county} | JobReady`,
      description: getComboIntro(category, county),
      url: `https://jobreadyke.co.ke/jobs/category/${slug}/in-${countySlug}`,
      type: "website",
      siteName: "JobReady",
    },
    twitter: {
      card: "summary_large_image",
      title: `${category.label} Jobs in ${county} | JobReady`,
      description: getComboIntro(category, county),
    },
  };
}

/**
 * CRITICAL: Only pre-generate combo pages that meet the threshold.
 * This is where the thin-page prevention happens.
 */
export async function generateStaticParams() {
  // In production, this would query:
  // SELECT category, county, COUNT(*) as count
  // FROM listings WHERE status = 'PUBLISHED'
  // GROUP BY category, county
  // HAVING count >= 3
  //
  // For now, return empty — combos are generated dynamically on first visit
  // but only indexed if they meet the threshold (controlled via robots meta)
  return [];
}

export default async function CategoryCountyPage({
  params,
}: {
  params: Promise<{ slug: string; county: string }>;
}) {
  const { slug, county: countySlug } = await params;
  const category = getCategoryBySlug(slug);
  const county = getCountyBySlug(countySlug);

  if (!category || !county) notFound();

  const [comboResult, salaryContext, nearby, relatedCategories] = await Promise.all([
    getJobsByCategoryAndCounty(slug, countySlug, 20),
    Promise.resolve(getSalaryContext(category.value)),
    Promise.resolve(getNearbyCounties(county)),
    Promise.resolve(JOB_CATEGORIES.filter((c) => c.slug !== slug).slice(0, 6)),
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
            { label: category.label, href: `/jobs/category/${slug}` },
            { label: county, href: `/jobs/in-${countySlug}` },
            { label: `${category.label} in ${county}`, href: `/jobs/category/${slug}/in-${countySlug}` },
          ]}
          title={`${category.label} Jobs in ${county}`}
          description={getComboIntro(category, county)}
          count={count || undefined}
        />

        {/* SEO threshold indicator (dev only — remove in production) */}
        {process.env.NODE_ENV === "development" && (
          <div className="mb-4 px-3 py-2 rounded-lg bg-yellow-50 border border-yellow-200 text-[12px] text-yellow-700">
            SEO Tier: CAT_COUNTY | Threshold: 3 | Count: {count} |{" "}
            {count >= 3 ? (
              <span className="text-green-700 font-medium">INDEXED</span>
            ) : (
              <span className="text-red-700 font-medium">NOINDEX</span>
            )}
          </div>
        )}

        {/* Salary overview */}
        {salaryContext && (
          <div className="mb-8 rounded-lg bg-emerald-50/60 border border-emerald-100/80 px-5 py-4 max-w-xl">
            <p className="text-[11px] font-medium text-emerald-600 uppercase tracking-wider mb-1">
              Salary Range in {county}
            </p>
            <p className="text-base font-semibold text-ink">{salaryContext}</p>
            <p className="text-[12px] text-muted mt-1">
              Average {category.label.toLowerCase()} salary in {county}
            </p>
          </div>
        )}

        {/* Listings or rich fallback */}
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
                  <Link key={job.id} href={`/jobs/${job.slug}`} className="block">
                    <div className="grid grid-cols-12 gap-4 py-3.5 group cursor-pointer hover:bg-ink/[0.02] rounded-lg -mx-2 px-2 transition-colors">
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
                    </div>
                  </Link>
                );
              })}
            </div>
            {count > 20 && (
              <Link
                href={`/jobs?category=${slug}&county=${countySlug}`}
                className="inline-flex items-center gap-1 text-[13px] font-medium text-accent hover:text-accent-dark transition-colors mt-4"
              >
                View all {count} {category.label.toLowerCase()} jobs in {county} →
              </Link>
            )}
          </div>
        ) : (
          <div className="mb-10">
            <RichFallback
              category={category}
              county={county}
              listingCount={count}
              nearbyCounties={nearby}
              relatedCategories={relatedCategories}
            />
          </div>
        )}

        {/* Subcategory drill-down */}
        <div className="mb-10">
          <SubcategoryGrid category={category} countySlug={countySlug} />
        </div>

        {/* Nearby counties with same category */}
        <div className="mb-10">
          <h2 className="text-[13px] font-semibold text-ink uppercase tracking-wider mb-4">
            {category.label} Jobs Nearby
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
            {relatedCategories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/jobs/category/${cat.slug}/in-${countySlug}`}
                className="flex items-center justify-between px-4 py-3 rounded-lg border border-divider hover:border-accent/30 hover:bg-accent-bg/50 transition-all group"
              >
                <span className="text-[13px] font-medium text-ink/80 group-hover:text-ink">
                  {cat.label}
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
}
