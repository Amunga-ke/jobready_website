import Link from "next/link";
import Image from "next/image";
import { Building2, CheckCircle, MapPin, Briefcase, Search, Globe, ExternalLink } from "lucide-react";
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

        {/* Company grid */}
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
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {companies.map((company) => (
                <Link
                  key={company.id}
                  href={`/companies/${company.slug}`}
                  className="group border border-divider rounded-xl p-5 hover:bg-white transition-all hover:border-accent/20 hover:shadow-sm"
                >
                  <div className="flex items-start gap-4">
                    {/* Logo or initial */}
                    {company.logo ? (
                      <div className="w-14 h-14 border border-divider rounded-xl overflow-hidden shrink-0 bg-white group-hover:border-accent/30 transition-colors">
                        <Image
                          src={company.logo}
                          alt={company.name}
                          width={56}
                          height={56}
                          unoptimized
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-14 h-14 border border-divider rounded-xl flex items-center justify-center shrink-0 font-heading font-bold text-xl text-muted bg-white group-hover:border-accent/30 transition-colors">
                        {company.name.charAt(0).toUpperCase()}
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      {/* Name & verified */}
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-heading text-[15px] font-bold truncate group-hover:text-accent transition-colors">
                          {company.name}
                        </h3>
                        {company.verified && (
                          <CheckCircle className="w-3.5 h-3.5 text-accent shrink-0" />
                        )}
                      </div>

                      {/* Industry */}
                      {company.industry && (
                        <p className="text-[11px] text-muted mt-0.5 flex items-center gap-1">
                          <Briefcase className="w-3 h-3" />
                          {company.industry}
                        </p>
                      )}

                      {/* Org type */}
                      <p className="text-[11px] text-muted/60 mt-0.5">
                        {company.orgType.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                      </p>

                      {/* Meta row */}
                      <div className="flex items-center gap-3 mt-3 pt-3 border-t border-subtle">
                        <span className="flex items-center gap-1 text-[11px] text-muted">
                          <Briefcase className="w-3 h-3" />
                          <span className="font-medium text-ink">{company._count.listings}</span> open
                        </span>
                        {company.location && (
                          <span className="flex items-center gap-1 text-[11px] text-muted">
                            <MapPin className="w-3 h-3" />
                            {company.location}
                          </span>
                        )}
                      </div>
                    </div>
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
