import Link from "next/link";
import type { JobCategory } from "@/lib/constants";
import { getSalaryContext } from "@/lib/seo/fallback-content";

/**
 * Shared SEO page layout wrapper.
 * Provides consistent header, breadcrumbs, and rich fallback content.
 */
export function SeoPageHeader({
  breadcrumbs,
  title,
  description,
  count,
}: {
  breadcrumbs: { label: string; href: string }[];
  title: string;
  description: string;
  count?: number;
}) {
  return (
    <div className="mb-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-[12px] text-muted mb-4 flex-wrap">
        {breadcrumbs.map((crumb, i) => (
          <span key={crumb.href} className="flex items-center gap-1.5">
            {i > 0 && <span className="text-divider">/</span>}
            <Link href={crumb.href} className="hover:text-ink transition-colors">
              {crumb.label}
            </Link>
          </span>
        ))}
        <span className="text-divider">/</span>
        <span className="text-ink font-medium truncate">{title}</span>
      </nav>

      <h1 className="text-xl md:text-2xl font-heading font-bold text-ink">{title}</h1>
      <p className="text-[14px] text-muted mt-1.5 max-w-2xl">{description}</p>
      {typeof count === "number" && (
        <p className="text-[13px] text-accent font-medium mt-2">
          {count} {count === 1 ? "opening" : "openings"}
        </p>
      )}
    </div>
  );
}

/**
 * Rich fallback content shown when a page has few/no listings.
 */
export function RichFallback({
  category,
  county,
  listingCount,
  nearbyCounties,
  relatedCategories,
}: {
  category?: JobCategory;
  county?: string;
  listingCount: number;
  nearbyCounties?: string[];
  relatedCategories?: JobCategory[];
}) {
  const salaryContext = category ? getSalaryContext(category.value) : null;

  return (
    <div className="space-y-8">
      {/* Status banner */}
      <div className="rounded-xl bg-accent-bg border border-accent/10 px-5 py-4">
        <p className="text-[14px] text-ink/80">
          {listingCount === 0
            ? "No listings match this search right now. Here's what we found nearby:"
            : `Only ${listingCount} ${listingCount === 1 ? "listing" : "listings"} found. Here are more options:`}
        </p>
      </div>

      {/* Salary context (if available) */}
      {salaryContext && (
        <div className="rounded-lg bg-emerald-50/60 border border-emerald-100/80 px-5 py-4">
          <p className="text-[11px] font-medium text-emerald-600 uppercase tracking-wider mb-1">
            Salary Overview
          </p>
          <p className="text-sm font-semibold text-ink">{salaryContext}</p>
          <p className="text-[12px] text-muted mt-1">
            Average range based on market data across Kenya
          </p>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Nearby counties */}
        {nearbyCounties && nearbyCounties.length > 0 && (
          <div className="rounded-xl border border-divider p-5">
            <h3 className="text-[13px] font-semibold text-ink mb-3">
              {county ? `Jobs near ${county}` : "Browse by location"}
            </h3>
            <div className="flex flex-wrap gap-2">
              {nearbyCounties.map((c) => (
                <Link
                  key={c}
                  href={`/jobs/in-${c.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                  className="text-[12px] font-medium px-3 py-1.5 rounded-lg bg-ink/[0.04] text-ink/70 hover:bg-ink/[0.08] hover:text-ink transition-colors"
                >
                  {c}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Related categories */}
        {relatedCategories && relatedCategories.length > 0 && (
          <div className="rounded-xl border border-divider p-5">
            <h3 className="text-[13px] font-semibold text-ink mb-3">
              {category ? "Related categories" : "Browse by category"}
            </h3>
            <div className="flex flex-wrap gap-2">
              {relatedCategories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/jobs/category/${cat.slug}`}
                  className="text-[12px] font-medium px-3 py-1.5 rounded-lg bg-ink/[0.04] text-ink/70 hover:bg-ink/[0.08] hover:text-ink transition-colors"
                >
                  {cat.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* CTA to browse all */}
      <div className="text-center py-4">
        <Link
          href="/jobs"
          className="inline-flex items-center gap-2 text-[13px] font-medium text-accent hover:text-accent-dark transition-colors"
        >
          Browse all jobs
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>
    </div>
  );
}

/**
 * Subcategory grid for category pages.
 */
export function SubcategoryGrid({
  category,
  countySlug,
}: {
  category: JobCategory;
  countySlug?: string;
}) {
  return (
    <div>
      <h2 className="text-[13px] font-semibold text-ink uppercase tracking-wider mb-4">
        {category.label} Subcategories
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
        {category.subcategories.map((sub) => {
          const href = countySlug
            ? `/jobs/category/${category.slug}/${sub.slug}/in-${countySlug}`
            : `/jobs/category/${category.slug}/${sub.slug}`;
          return (
            <Link
              key={sub.slug}
              href={href}
              className="group flex items-center justify-between px-4 py-3 rounded-lg border border-divider hover:border-accent/30 hover:bg-accent-bg/50 transition-all"
            >
              <span className="text-[13px] font-medium text-ink/80 group-hover:text-ink transition-colors">
                {sub.label}
              </span>
              <svg
                className="w-4 h-4 text-muted group-hover:text-accent transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

/**
 * County grid for category or homepage.
 */
export function CountyGrid({
  activeCounty,
}: {
  activeCounty?: string;
}) {
  const { KE_COUNTIES, slugifyCounty } = require("@/lib/constants");
  return (
    <div>
      <h2 className="text-[13px] font-semibold text-ink uppercase tracking-wider mb-4">
        Browse by County
      </h2>
      <div className="flex flex-wrap gap-2">
        {KE_COUNTIES.map((county: string) => {
          const slug = slugifyCounty(county);
          const isActive = activeCounty === slug;
          return (
            <Link
              key={slug}
              href={`/jobs/in-${slug}`}
              className={`text-[12px] font-medium px-3 py-1.5 rounded-lg border transition-colors ${
                isActive
                  ? "bg-accent text-white border-accent"
                  : "bg-ink/[0.04] text-ink/70 border-transparent hover:bg-ink/[0.08] hover:text-ink"
              }`}
            >
              {county}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
