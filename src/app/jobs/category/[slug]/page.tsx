import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JOB_CATEGORIES, getCategoryBySlug, KE_COUNTIES, slugifyCounty } from "@/lib/constants";
import { getRobotsMeta, type SeoTier } from "@/lib/seo/page-thresholds";
import { getCategoryIntro, getSalaryContext, getRelatedCategoriesForCounty } from "@/lib/seo/fallback-content";
import { SeoPageHeader, SubcategoryGrid, CountyGrid, RichFallback } from "@/components/fursa/SeoPageLayout";

// Mock: in production this queries DB
async function getListingCount(categorySlug: string, countySlug?: string) {
  return 0;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) return { title: "Not Found | JobReady" };

  const count = await getListingCount(slug);
  const robots = getRobotsMeta(count, "CATEGORY" as SeoTier);

  return {
    title: `${category.label} Jobs in Kenya (${count || ""} Openings) | JobReady`,
    description: getCategoryIntro(category),
    robots,
    alternates: {
      canonical: `https://jobreadyke.co.ke/jobs/category/${slug}`,
    },
    openGraph: {
      title: `${category.label} Jobs in Kenya | JobReady`,
      description: getCategoryIntro(category),
      url: `/jobs/category/${slug}`,
      type: "website",
      siteName: "JobReady",
    },
  };
}

export async function generateStaticParams() {
  return JOB_CATEGORIES.map((cat) => ({ slug: cat.slug }));
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) notFound();

  const count = await getListingCount(slug);
  const salaryContext = getSalaryContext(category.value);
  const nearbyCounties = KE_COUNTIES.slice(0, 8) as unknown as string[];
  const relatedCategories = JOB_CATEGORIES.filter((c) => c.slug !== slug).slice(0, 6);

  return (
    <main className="min-h-screen bg-surface">
      <div className="max-w-6xl mx-auto px-5 py-8 md:py-12">
        <SeoPageHeader
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Jobs", href: "/jobs" },
            { label: category.label, href: `/jobs/category/${slug}` },
          ]}
          title={`${category.label} Jobs in Kenya`}
          description={getCategoryIntro(category)}
          count={count || undefined}
        />

        {/* Salary overview */}
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

        {/* Listings placeholder or fallback */}
        {count > 0 ? (
          <div className="mb-10">
            <p className="text-[14px] text-muted">
              Showing {count} {category.label.toLowerCase()} jobs. Database connection coming soon.
            </p>
          </div>
        ) : (
          <div className="mb-10">
            <RichFallback
              category={category}
              listingCount={count}
              nearbyCounties={nearbyCounties}
              relatedCategories={relatedCategories}
            />
          </div>
        )}

        {/* Subcategory grid */}
        <div className="mb-10">
          <SubcategoryGrid category={category} />
        </div>

        {/* Browse by county */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[13px] font-semibold text-ink uppercase tracking-wider">
              {category.label} Jobs by County
            </h2>
            <Link
              href="/jobs"
              className="text-[12px] text-muted hover:text-ink transition-colors"
            >
              View all counties
            </Link>
          </div>
          <div className="flex flex-wrap gap-2">
            {KE_COUNTIES.map((county) => {
              const countySlug = slugifyCounty(county);
              return (
                <Link
                  key={countySlug}
                  href={`/jobs/category/${slug}/in-${countySlug}`}
                  className="text-[12px] font-medium px-3 py-1.5 rounded-lg bg-ink/[0.04] text-ink/70 hover:bg-ink/[0.08] hover:text-ink transition-colors"
                >
                  {county}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Related categories */}
        <div>
          <h2 className="text-[13px] font-semibold text-ink uppercase tracking-wider mb-4">
            Related Categories
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {relatedCategories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/jobs/category/${cat.slug}`}
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
