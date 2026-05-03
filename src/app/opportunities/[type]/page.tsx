import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { OPPORTUNITY_TYPES, KE_COUNTIES, slugifyCounty } from "@/lib/constants";
import { getRobotsMeta, type SeoTier } from "@/lib/seo/page-thresholds";
import { getOpportunityIntro } from "@/lib/seo/fallback-content";
import { SeoPageHeader, RichFallback } from "@/components/jobready/SeoPageLayout";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ type: string }>;
}): Promise<Metadata> {
  const { type: typeSlug } = await params;
  const opp = OPPORTUNITY_TYPES.find((t) => t.slug === typeSlug);
  if (!opp) return { title: "Not Found | JobReady" };

  const dbType = opp.value.replace(/-/g, "_");
  const count = await prisma.listing.count({
    where: { status: "ACTIVE", opportunityType: dbType },
  });
  const robots = getRobotsMeta(count, "OPPORTUNITY" as SeoTier);

  return {
    title: `${opp.label} Opportunities in Kenya | JobReady`,
    description: getOpportunityIntro(opp.label),
    robots,
    alternates: {
      canonical: `https://jobreadyke.co.ke/opportunities/${typeSlug}`,
    },
    openGraph: {
      title: `${opp.label} in Kenya | JobReady`,
      description: getOpportunityIntro(opp.label),
      url: `https://jobreadyke.co.ke/opportunities/${typeSlug}`,
      type: "website",
      siteName: "JobReady",
    },
    twitter: {
      card: "summary_large_image",
      title: `${opp.label} in Kenya | JobReady`,
      description: getOpportunityIntro(opp.label),
    },
  };
}

export async function generateStaticParams() {
  return OPPORTUNITY_TYPES.map((opp) => ({ type: opp.slug }));
}

export default async function OpportunityTypePage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type: typeSlug } = await params;
  const opp = OPPORTUNITY_TYPES.find((t) => t.slug === typeSlug);

  if (!opp) notFound();

  const dbType = opp.value.replace(/-/g, "_");
  const count = await prisma.listing.count({
    where: { status: "ACTIVE", opportunityType: dbType },
  });
  const nearbyCounties = KE_COUNTIES.slice(0, 8) as unknown as string[];

  return (
    <main className="bg-surface">
      <div className="max-w-6xl mx-auto px-5 py-8 md:py-12">
        <SeoPageHeader
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Opportunities", href: "/opportunities" },
            { label: opp.label, href: `/opportunities/${typeSlug}` },
          ]}
          title={`${opp.label} in Kenya`}
          description={getOpportunityIntro(opp.label)}
          count={count || undefined}
        />

        {/* Listings or fallback */}
        {count > 0 ? (
          <div className="mb-10">
            <p className="text-[14px] text-muted">
              Showing {count} {opp.label.toLowerCase()} opportunities.
            </p>
          </div>
        ) : (
          <div className="mb-10">
            <RichFallback
              listingCount={count}
              nearbyCounties={nearbyCounties}
            />
          </div>
        )}

        {/* Browse by county */}
        <div className="mb-10">
          <h2 className="text-[13px] font-semibold text-ink uppercase tracking-wider mb-4">
            {opp.label} by County
          </h2>
          <div className="flex flex-wrap gap-2">
            {KE_COUNTIES.map((county) => {
              const countySlug = slugifyCounty(county);
              return (
                <Link
                  key={countySlug}
                  href={`/opportunities/${typeSlug}/in-${countySlug}`}
                  className="text-[12px] font-medium px-3 py-1.5 rounded-lg bg-ink/[0.04] text-ink/70 hover:bg-ink/[0.08] hover:text-ink transition-colors"
                >
                  {county}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Other opportunity types */}
        <div>
          <h2 className="text-[13px] font-semibold text-ink uppercase tracking-wider mb-4">
            Other Opportunities
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {OPPORTUNITY_TYPES.filter((t) => t.slug !== typeSlug).map((t) => (
              <Link
                key={t.slug}
                href={`/opportunities/${t.slug}`}
                className="flex items-center justify-between px-4 py-3 rounded-lg border border-divider hover:border-accent/30 hover:bg-accent-bg/50 transition-all group"
              >
                <span className="text-[13px] font-medium text-ink/80 group-hover:text-ink">
                  {t.label}
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
