import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JOB_CATEGORIES, KE_COUNTIES, slugifyCounty, getCategoryBySlug, getCountyBySlug } from "@/lib/constants";
import { getRobotsMeta, getFallbackStrategy, type SeoTier } from "@/lib/seo/page-thresholds";
import { getComboIntro, getSalaryContext, getNearbyCounties } from "@/lib/seo/fallback-content";
import { SeoPageHeader, SubcategoryGrid, RichFallback } from "@/components/fursa/SeoPageLayout";

async function getListingCount(categorySlug: string, countySlug: string) {
  return 0; // DB query in production
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; county: string }>;
}): Promise<Metadata> {
  const { slug, county: countySlug } = await params;
  const category = getCategoryBySlug(slug);
  const county = getCountyBySlug(countySlug);

  if (!category || !county) return { title: "Not Found | JobReady" };

  const count = await getListingCount(slug, countySlug);
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
      url: `/jobs/category/${slug}/in-${countySlug}`,
      type: "website",
      siteName: "JobReady",
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

  const count = await getListingCount(slug, countySlug);
  const salaryContext = getSalaryContext(category.value);
  const nearby = getNearbyCounties(county);
  const relatedCategories = JOB_CATEGORIES.filter((c) => c.slug !== slug).slice(0, 6);

  return (
    <main className="min-h-screen bg-surface">
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
        {count > 0 ? (
          <div className="mb-10">
            <p className="text-[14px] text-muted">
              Showing {count} {category.label.toLowerCase()} jobs in {county}.
            </p>
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
