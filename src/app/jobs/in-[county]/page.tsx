import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { KE_COUNTIES, slugifyCounty, JOB_CATEGORIES, getCountyBySlug } from "@/lib/constants";
import { getRobotsMeta, type SeoTier } from "@/lib/seo/page-thresholds";
import { getCountyIntro, getNearbyCounties, getSalaryContext } from "@/lib/seo/fallback-content";
import { SeoPageHeader, RichFallback } from "@/components/fursa/SeoPageLayout";

async function getListingCount(countySlug: string) {
  return 0;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ county: string }>;
}): Promise<Metadata> {
  const { county: countySlug } = await params;
  const countyName = getCountyBySlug(countySlug);

  if (!countyName) return { title: "Not Found | FursaKE" };

  const count = await getListingCount(countySlug);
  const robots = getRobotsMeta(count, "COUNTY" as SeoTier);

  return {
    title: `Jobs in ${countyName}, Kenya (${count || ""} Openings) | FursaKE`,
    description: getCountyIntro(countyName),
    robots,
    alternates: {
      canonical: `https://fursake.co.ke/jobs/in-${countySlug}`,
    },
    openGraph: {
      title: `Jobs in ${countyName} | FursaKE`,
      description: getCountyIntro(countyName),
      url: `/jobs/in-${countySlug}`,
      type: "website",
      siteName: "FursaKE",
    },
  };
}

export async function generateStaticParams() {
  return KE_COUNTIES.map((county) => ({
    county: slugifyCounty(county),
  }));
}

export default async function CountyPage({
  params,
}: {
  params: Promise<{ county: string }>;
}) {
  const { county: countySlug } = await params;
  const countyName = getCountyBySlug(countySlug);

  if (!countyName) notFound();

  const count = await getListingCount(countySlug);
  const nearby = getNearbyCounties(countyName);
  const relatedCategories = JOB_CATEGORIES.slice(0, 8);

  return (
    <main className="min-h-screen bg-surface">
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
        {count > 0 ? (
          <div className="mb-10">
            <p className="text-[14px] text-muted">
              Showing {count} jobs in {countyName}. Database connection coming soon.
            </p>
          </div>
        ) : (
          <div className="mb-10">
            <RichFallback
              county={countyName}
              listingCount={count}
              nearbyCounties={nearby}
              relatedCategories={relatedCategories}
            />
          </div>
        )}

        {/* Jobs by category */}
        <div className="mb-10">
          <h2 className="text-[13px] font-semibold text-ink uppercase tracking-wider mb-4">
            Jobs in {countyName} by Category
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {JOB_CATEGORIES.slice(0, 12).map((cat) => (
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
