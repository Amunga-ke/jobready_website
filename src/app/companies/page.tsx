import Link from "next/link";
import { Building2, CheckCircle, MapPin, Briefcase } from "lucide-react";
import { getCompanies, getCompanyIndustries } from "@/lib/data";
import { SeoPageHeader } from "@/components/jobready/SeoPageLayout";
import CompanySearchBar from "@/components/jobready/CompanySearchBar";

export const dynamic = "force-dynamic";

export default async function CompaniesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; industry?: string }>;
}) {
  const params = await searchParams;
  const query = params.q || undefined;
  const industry = params.industry || undefined;

  const [companies, industries] = await Promise.all([
    getCompanies({ q: query, industry }),
    getCompanyIndustries(),
  ]);

  // Only show industries that have companies
  const activeIndustries = industries.filter((ind) => ind.count > 0);

  return (
    <main className="bg-surface min-h-screen">
      <div className="max-w-6xl mx-auto px-5 py-8 md:py-12">
        <SeoPageHeader
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Companies", href: "/companies" },
          ]}
          title="Verified Employers & Companies"
          description="Explore verified employers hiring across Kenya. Browse open positions and discover your next career opportunity."
          count={companies.length}
        />

        {/* Search + Industry filter */}
        <div className="mb-8 space-y-4">
          <CompanySearchBar initialQuery={query} />

          {/* Industry chips */}
          {activeIndustries.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {activeIndustries.map((ind) => (
                <Link
                  key={ind.industry}
                  href={industry === ind.industry
                    ? "/companies"
                    : `/companies?industry=${encodeURIComponent(ind.industry)}`
                  }
                  className={`text-[12px] font-medium px-3 py-1.5 rounded-lg transition-colors ${
                    industry === ind.industry
                      ? "bg-accent text-white"
                      : "bg-ink/[0.04] text-ink/70 hover:bg-ink/[0.08] hover:text-ink"
                  }`}
                >
                  {ind.industry}
                  <span className="ml-1.5 font-mono text-[11px] opacity-70">{ind.count}</span>
                </Link>
              ))}
            </div>
          )}

          {/* Active filter indicator */}
          {(query || industry) && (
            <div className="flex items-center gap-3 text-[13px] text-muted">
              <span>Filtering by:</span>
              {query && (
                <span className="bg-accent-bg text-accent px-2.5 py-1 rounded-lg font-medium">
                  &quot;{query}&quot;
                </span>
              )}
              {industry && (
                <span className="bg-accent-bg text-accent px-2.5 py-1 rounded-lg font-medium">
                  {industry}
                </span>
              )}
              <Link href="/companies" className="text-accent hover:text-accent-dark underline">
                Clear all
              </Link>
            </div>
          )}
        </div>

        {/* Company listing — same row style as /casual, /jobs */}
        {companies.length === 0 ? (
          /* Empty state */
          <div className="text-center py-20 bg-white rounded-xl border border-divider">
            <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-7 h-7 text-muted/40" />
            </div>
            <h3 className="font-heading text-lg font-bold mb-2">
              {query || industry ? "No companies match your filters" : "No companies yet"}
            </h3>
            <p className="text-[13px] text-muted max-w-sm mx-auto leading-relaxed mb-4">
              {query || industry
                ? "Try adjusting your search or selecting a different industry filter."
                : "We're building our database of verified employers. Check back soon for updates."}
            </p>
            {(query || industry) && (
              <Link
                href="/companies"
                className="text-[13px] font-medium text-accent hover:text-accent-dark transition-colors"
              >
                View all companies
              </Link>
            )}
          </div>
        ) : (
          <>
            {/* Table header */}
            <div className="hidden sm:grid sm:grid-cols-12 gap-4 pb-2 border-b border-divider text-[10px] font-mono text-muted uppercase tracking-widest mb-1">
              <div className="col-span-5">Company</div>
              <div className="col-span-3">Industry</div>
              <div className="col-span-2">Location</div>
              <div className="col-span-2 text-right">Open Jobs</div>
            </div>
            <div className="divide-y divide-subtle">
              {companies.map((company) => (
                <Link
                  key={company.id}
                  href={`/companies/${company.slug}`}
                  className="grid grid-cols-12 gap-4 py-3.5 group cursor-pointer hover:bg-ink/[0.02] rounded-lg -mx-2 px-2 transition-colors"
                >
                  {/* Name + verified */}
                  <div className="col-span-12 sm:col-span-5 min-w-0 flex items-center gap-2">
                    <span className="w-8 h-8 border border-divider rounded-lg flex items-center justify-center shrink-0 font-heading font-bold text-sm text-muted bg-surface group-hover:border-accent/30 transition-colors">
                      {company.name.charAt(0).toUpperCase()}
                    </span>
                    <div className="flex items-center gap-1.5 min-w-0">
                      <p className="text-[13px] font-medium truncate group-hover:text-accent transition-colors">
                        {company.name}
                      </p>
                      {company.verified && (
                        <CheckCircle className="w-3.5 h-3.5 text-accent shrink-0" />
                      )}
                    </div>
                    {/* Mobile meta */}
                    <div className="sm:hidden flex items-center gap-2 ml-auto text-[11px] text-muted">
                      {company.industry && <span>{company.industry}</span>}
                      {company.location && (
                        <>
                          <span className="text-subtle">&middot;</span>
                          <span>{company.location}</span>
                        </>
                      )}
                      <span className="text-subtle">&middot;</span>
                      <span className="font-medium text-ink">{company._count.listings}</span>
                    </div>
                  </div>

                  {/* Industry */}
                  <div className="hidden sm:flex sm:col-span-3 items-center text-[12px] text-muted truncate">
                    {company.industry || "\u2014"}
                  </div>

                  {/* Location */}
                  <div className="hidden sm:flex sm:col-span-2 items-center">
                    <span className="text-[11px] text-muted">
                      {company.location || company.county || "\u2014"}
                    </span>
                  </div>

                  {/* Open jobs count */}
                  <div className="hidden sm:flex sm:col-span-2 sm:justify-end items-center">
                    {company._count.listings > 0 ? (
                      <span className="font-mono text-[12px] font-medium text-ink/70">
                        {company._count.listings} open
                      </span>
                    ) : (
                      <span className="text-[11px] text-muted/50">&mdash;</span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
            <p className="text-center text-[11px] text-muted mt-8">
              {companies.length} verified employer{companies.length !== 1 ? "s" : ""}
            </p>
          </>
        )}
      </div>
    </main>
  );
}
