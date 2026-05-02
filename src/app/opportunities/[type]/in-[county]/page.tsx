import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { OPPORTUNITY_TYPES, KE_COUNTIES, slugifyCounty, getCountyBySlug } from "@/lib/constants";
import { getRobotsMeta, type SeoTier } from "@/lib/seo/page-thresholds";
import { SeoPageHeader, RichFallback } from "@/components/jobready/SeoPageLayout";

async function getListingCount(typeSlug: string, countySlug: string) {
  return 0;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ type: string; county: string }>;
}): Promise<Metadata> {
  const { type: typeSlug, county: countySlug } = await params;
  const opp = OPPORTUNITY_TYPES.find((t) => t.slug === typeSlug);
  const county = getCountyBySlug(countySlug);
  if (!opp || !county) return { title: "Not Found | JobReady" };

  const count = await getListingCount(typeSlug, countySlug);
  const robots = getRobotsMeta(count, "OPP_COUNTY" as SeoTier);

  return {
    title: `${opp.label} in ${county}, Kenya | JobReady`,
    description: `Find ${opp.label.toLowerCase()} opportunities in ${county}, Kenya. Application details and deadlines on JobReady.`,
    robots,
    alternates: {
      canonical: `https://jobreadyke.co.ke/opportunities/${typeSlug}/in-${countySlug}`,
    },
  };
}

// Only pre-generate when DB confirms ≥3 listings
export async function generateStaticParams() {
  return [];
}

export default async function OpportunityCountyPage({
  params,
}: {
  params: Promise<{ type: string; county: string }>;
}) {
  const { type: typeSlug, county: countySlug } = await params;
  const opp = OPPORTUNITY_TYPES.find((t) => t.slug === typeSlug);
  const county = getCountyBySlug(countySlug);

  if (!opp || !county) notFound();

  const count = await getListingCount(typeSlug, countySlug);
  const nearby = KE_COUNTIES.slice(0, 8) as unknown as string[];
  const otherTypes = OPPORTUNITY_TYPES.filter((t) => t.slug !== typeSlug).slice(0, 8);

  return (
    <main className="min-h-screen bg-surface">
      <div className="max-w-6xl mx-auto px-5 py-8 md:py-12">
        <SeoPageHeader
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Opportunities", href: "/opportunities" },
            { label: opp.label, href: `/opportunities/${typeSlug}` },
            { label: county, href: `/jobs/in-${countySlug}` },
          ]}
          title={`${opp.label} in ${county}`}
          description={`Browse ${opp.label.toLowerCase()} opportunities available in ${county}, Kenya.`}
          count={count || undefined}
        />

        {count > 0 ? (
          <div className="mb-10">
            <p className="text-[14px] text-muted">
              Showing {count} {opp.label.toLowerCase()} opportunities in {county}.
            </p>
          </div>
        ) : (
          <div className="mb-10">
            <RichFallback
              county={county}
              listingCount={count}
              nearbyCounties={nearby}
            />
          </div>
        )}

        {/* Other opportunity types in this county */}
        <div>
          <h2 className="text-[13px] font-semibold text-ink uppercase tracking-wider mb-4">
            Other Opportunities in {county}
          </h2>
          <div className="flex flex-wrap gap-2">
            {otherTypes.map((t) => (
              <Link
                key={t.slug}
                href={`/opportunities/${t.slug}/in-${countySlug}`}
                className="text-[12px] font-medium px-3 py-1.5 rounded-lg bg-amber-50 text-amber-700 border border-amber-100 hover:bg-amber-100 transition-colors"
              >
                {t.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
