import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import JobRowClickable from "@/components/jobready/JobRowClickable";
import {
  Building2,
  CheckCircle,
  MapPin,
  Briefcase,
  Globe,
  ExternalLink,
  ArrowLeft,
  ArrowRight,
  Users,
} from "lucide-react";
import { getCompanyBySlug, getCompanyJobs } from "@/lib/data";
import { CompanyJsonLd, BreadcrumbJsonLd } from "@/components/jobready/JsonLd";
import AdSlot from "@/components/jobready/AdSlot";

export const dynamic = "force-dynamic";

/* ── Generate static params for known slugs ── */
export async function generateStaticParams() {
  const companies = await prisma.company.findMany({
    select: { slug: true },
    take: 200,
  }).catch(() => []);

  return companies.map((c) => ({ slug: c.slug }));
}

/* ── Dynamic metadata ── */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const company = await getCompanyBySlug(slug);

  if (!company) return { title: "Company Not Found | JobReady" };

  const ogUrl = `https://jobreadyke.co.ke/companies/${slug}`;
  const jobCount = company._count.listings;

  return {
    title: `${company.name} Jobs & Careers | JobReady`,
    description: company.description
      ? `${company.description.slice(0, 155)}${company.description.length > 155 ? "..." : ""}`
      : `Explore ${jobCount} open positions at ${company.name}. Apply now on JobReady — Kenya's most trusted job board.`,
    alternates: { canonical: ogUrl },
    openGraph: {
      title: `${company.name} Jobs & Careers | JobReady`,
      description: `Explore ${jobCount} open positions at ${company.name}. Apply now on JobReady.`,
      url: ogUrl,
      siteName: "JobReady",
      type: "website",
      ...(company.logo && { images: [{ url: company.logo }] }),
    },
    twitter: {
      card: "summary_large_image",
      title: `${company.name} Jobs & Careers | JobReady`,
      description: `Explore ${jobCount} open positions at ${company.name}.`,
      ...(company.logo && { images: [company.logo] }),
    },
  };
}

/* ── Format salary (used in mobile row) ── */
function formatSalary(job: { salaryMin?: number | null; salaryMax?: number | null; salaryPeriod?: string | undefined; predictedSalary?: string }) {
  if (job.salaryMin != null && job.salaryMax != null) {
    return `KES ${job.salaryMin.toLocaleString()} – ${job.salaryMax.toLocaleString()}`;
  }
  if (job.salaryMin != null) {
    return `KES ${job.salaryMin.toLocaleString()}`;
  }
  if (job.predictedSalary) {
    return `~${job.predictedSalary}`;
  }
  return null;
}

/* ── Company detail page ── */
export default async function CompanyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Fetch company first (needed for notFound + dependent queries)
  const company = await getCompanyBySlug(slug);

  if (!company) {
    notFound();
  }

  // Now fetch jobs and related companies in parallel
  const [jobs, relatedCompanies] = await Promise.all([
    getCompanyJobs(company.id, 30),
    // Get related companies (same industry or county)
    (async () => {
      const where: Record<string, unknown> = {
        id: { not: company.id },
      };
      if (company.industry) {
        (where as Record<string, unknown>).OR = [
          { industry: company.industry },
          ...(company.county ? [{ county: company.county }] : []),
        ];
      } else if (company.county) {
        (where as Record<string, unknown>).county = company.county;
      }
      return prisma.company
        .findMany({
          where,
          include: {
            _count: { select: { listings: { where: { status: "ACTIVE" } } } },
          },
          orderBy: { createdAt: "desc" },
          take: 6,
        })
        .catch(() => []);
    })(),
  ]);

  const jobCount = company._count.listings;

  // Format org type for display
  const orgTypeDisplay = company.orgType
    .replace(/_/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());
  const companyUrl = `https://jobreadyke.co.ke/companies/${company.slug}`;

  return (
    <main className="bg-surface min-h-screen">
      {/* JSON-LD structured data */}
      <CompanyJsonLd
        name={company.name}
        description={company.description}
        url={companyUrl}
        logo={company.logo}
        location={company.location}
        industry={company.industry}
        website={company.website}
      />
      <BreadcrumbJsonLd items={[
        { name: "Home", url: "https://jobreadyke.co.ke/" },
        { name: "Companies", url: "https://jobreadyke.co.ke/companies" },
        { name: company.name, url: companyUrl },
      ]} />
      <div className="max-w-6xl mx-auto px-5 py-8 md:py-12">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1.5 text-[12px] text-muted mb-6 flex-wrap">
          <Link href="/" className="hover:text-ink transition-colors">Home</Link>
          <span className="text-divider">/</span>
          <Link href="/companies" className="hover:text-ink transition-colors">Companies</Link>
          <span className="text-divider">/</span>
          <span className="text-ink font-medium truncate max-w-[200px]">{company.name}</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* ── Main content ── */}
          <div className="flex-1 min-w-0">
            {/* Company header card */}
            <div className="bg-white rounded-xl border border-divider p-6 md:p-8 mb-6">
              <div className="flex flex-col sm:flex-row items-start gap-5">
                {/* Logo */}
                {company.logo ? (
                  <div className="w-20 h-20 border border-divider rounded-xl overflow-hidden shrink-0 bg-white">
                    <Image
                      src={company.logo}
                      alt={company.name}
                      width={80}
                      height={80}
                      unoptimized
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-20 h-20 border border-divider rounded-xl flex items-center justify-center shrink-0 font-heading font-bold text-3xl text-muted bg-surface">
                    {company.name.charAt(0).toUpperCase()}
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  {/* Name & verified */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-2xl md:text-3xl font-heading font-black text-ink leading-tight">
                      {company.name}
                    </h1>
                    {company.verified && (
                      <span className="flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md bg-accent-bg text-accent">
                        <CheckCircle className="w-3 h-3" />
                        Verified
                      </span>
                    )}
                  </div>

                  {/* Meta tags */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-[13px] text-muted">
                    {company.industry && (
                      <span className="flex items-center gap-1">
                        <Briefcase className="w-3.5 h-3.5" />
                        {company.industry}
                      </span>
                    )}
                    {company.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {company.location}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      {orgTypeDisplay}
                    </span>
                    <span className="flex items-center gap-1 font-medium text-ink">
                      <Briefcase className="w-3.5 h-3.5" />
                      {jobCount} open position{jobCount !== 1 ? "s" : ""}
                    </span>
                  </div>

                  {/* Website link */}
                  {company.website && (
                    <a
                      href={company.website.startsWith("http") ? company.website : `https://${company.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 mt-3 text-[13px] font-medium text-accent hover:text-accent-dark transition-colors"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      {company.website.replace(/^https?:\/\//, "")}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>

              {/* Description */}
              {company.description && (
                <div className="mt-6 pt-5 border-t border-divider">
                  <p className="text-[14px] text-ink/80 leading-relaxed">
                    {company.description}
                  </p>
                </div>
              )}

              {/* County */}
              {company.county && (
                <div className="mt-4 flex items-center gap-2">
                  <span className="text-[11px] text-muted">Based in:</span>
                  <span className="text-[12px] font-medium text-ink/70">{company.county}</span>
                  <span className="text-[11px] text-muted">{company.country || "Kenya"}</span>
                </div>
              )}
            </div>

            {/* Ad slot between profile and jobs */}
            <div className="mb-6">
              <AdSlot format="auto" style={{ display: 'block', minHeight: '90px' }} />
            </div>

            {/* Job listings — same row style as /casual, /jobs */}
            {jobs.length > 0 ? (
              <div className="mb-10">
                <h2 className="text-[13px] font-semibold text-ink uppercase tracking-wider mb-4">
                  Open Positions
                  <span className="ml-2 text-[12px] font-mono text-muted font-normal">
                    ({jobs.length})
                  </span>
                </h2>
                <div className="hidden sm:grid sm:grid-cols-12 gap-4 pb-2 border-b border-divider text-[10px] font-mono text-muted uppercase tracking-widest mb-1">
                  <div className="col-span-5">Position</div>
                  <div className="col-span-3">Location</div>
                  <div className="col-span-2">Type</div>
                  <div className="col-span-2 text-right">Pay</div>
                </div>
                <div className="divide-y divide-subtle">
                  {jobs.map((job) => (
                    <JobRowClickable
                      key={job.id}
                      slug={job.slug}
                      className="grid grid-cols-12 gap-4 py-3.5 group cursor-pointer hover:bg-ink/[0.02] rounded-lg -mx-2 px-2 transition-colors"
                    >
                      {/* Title */}
                      <div className="col-span-12 sm:col-span-5 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-[13px] font-medium truncate group-hover:text-accent transition-colors">
                            {job.title}
                          </p>
                          {job.featured && (
                            <span className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-amber-50 text-amber-600 shrink-0 uppercase tracking-wide">
                              Featured
                            </span>
                          )}
                        </div>
                        <div className="sm:hidden flex items-center gap-2 mt-0.5">
                          <span className="text-[11px] text-muted">{job.location || job.county || ""}</span>
                          <span className="text-[11px] text-subtle">&middot;</span>
                          <span className="text-[11px] text-muted">{job.employmentType}</span>
                          {formatSalary(job) && (
                            <>
                              <span className="text-[11px] text-subtle">&middot;</span>
                              <span className="text-[11px] font-mono font-medium text-ink/70">{formatSalary(job)}</span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Location */}
                      <div className="hidden sm:flex sm:col-span-3 items-center text-[12px] text-muted truncate">
                        {job.location || job.county || "\u2014"}
                      </div>

                      {/* Type */}
                      <div className="hidden sm:flex sm:col-span-2 items-center">
                        <span className="text-[11px] text-muted">
                          {job.employmentType}
                        </span>
                      </div>

                      {/* Pay */}
                      <div className="hidden sm:flex sm:col-span-2 sm:justify-end items-center">
                        {job.salaryMin ? (
                          <span className="font-mono text-[12px] font-medium text-ink/70">
                            KES {job.salaryMin.toLocaleString()}{job.salaryPeriod ? `/${job.salaryPeriod}` : ""}
                          </span>
                        ) : job.predictedSalary ? (
                          <span className="text-[11px] text-muted">{job.predictedSalary}</span>
                        ) : (
                          <span className="text-[11px] text-muted/50">&mdash;</span>
                        )}
                      </div>
                    </JobRowClickable>
                  ))}
                </div>
                {/* Below-jobs ad slot */}
                <div className="mt-6">
                  <AdSlot format="auto" style={{ display: 'block', minHeight: '90px' }} />
                </div>
              </div>
            ) : (
              <div className="mb-10 rounded-xl border border-divider p-8 text-center">
                <Briefcase className="w-8 h-8 text-muted/30 mx-auto mb-3" />
                <h3 className="font-heading text-[15px] font-bold text-ink/70 mb-1">
                  No open positions right now
                </h3>
                <p className="text-[13px] text-muted mb-4">
                  Check back later or explore jobs from other companies.
                </p>
                <Link
                  href="/jobs"
                  className="inline-flex items-center gap-1.5 text-[13px] font-medium text-accent hover:text-accent-dark transition-colors"
                >
                  Browse All Jobs
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>

          {/* ── Sidebar ── */}
          <aside className="lg:w-80 shrink-0 space-y-6">
            {/* Back to companies */}
            <Link
              href="/companies"
              className="flex items-center gap-2 text-[13px] font-medium text-ink/60 hover:text-accent transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              All Companies
            </Link>

            {/* Quick stats */}
            <div className="bg-white rounded-xl border border-divider p-5">
              <h3 className="text-[13px] font-semibold text-ink uppercase tracking-wider mb-4">
                Company Info
              </h3>
              <div className="space-y-3">
                {company.industry && (
                  <div className="flex items-start gap-3">
                    <Briefcase className="w-4 h-4 text-muted mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[11px] text-muted">Industry</p>
                      <p className="text-[13px] font-medium text-ink">{company.industry}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-3">
                  <Users className="w-4 h-4 text-muted mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[11px] text-muted">Organization Type</p>
                    <p className="text-[13px] font-medium text-ink">{orgTypeDisplay}</p>
                  </div>
                </div>
                {company.location && (
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-muted mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[11px] text-muted">Location</p>
                      <p className="text-[13px] font-medium text-ink">
                        {company.location}
                        {company.county && `, ${company.county}`}
                      </p>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-3">
                  <Briefcase className="w-4 h-4 text-muted mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[11px] text-muted">Open Positions</p>
                    <p className="text-[13px] font-medium text-ink">{jobCount}</p>
                  </div>
                </div>
                {company.verified && (
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[11px] text-muted">Verification</p>
                      <p className="text-[13px] font-medium text-accent">Verified Employer</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Related companies */}
            {relatedCompanies.length > 0 && (
              <div className="bg-white rounded-xl border border-divider p-5">
                <h3 className="text-[13px] font-semibold text-ink uppercase tracking-wider mb-3">
                  Related Companies
                </h3>
                <div className="space-y-2">
                  {relatedCompanies.map((rc) => (
                    <Link
                      key={rc.id}
                      href={`/companies/${rc.slug}`}
                      className="group flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-ink/[0.03] transition-colors"
                    >
                      {/* Logo or initial */}
                      {rc.logo ? (
                        <div className="w-9 h-9 border border-divider rounded-lg overflow-hidden shrink-0 bg-white">
                          <Image
                            src={rc.logo}
                            alt={rc.name}
                            width={36}
                            height={36}
                            unoptimized
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-9 h-9 border border-divider rounded-lg flex items-center justify-center shrink-0 font-heading font-bold text-sm text-muted bg-surface">
                          {rc.name.charAt(0)}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-[13px] font-medium text-ink group-hover:text-accent transition-colors truncate">
                          {rc.name}
                        </h4>
                        <p className="text-[11px] text-muted">
                          {rc._count.listings} open position{rc._count.listings !== 1 ? "s" : ""}
                        </p>
                      </div>
                      {rc.verified && (
                        <CheckCircle className="w-3 h-3 text-accent shrink-0" />
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* CTA: Browse all companies */}
            <div className="rounded-xl border border-accent/20 bg-accent-bg/30 p-5">
              <Building2 className="w-6 h-6 text-accent mb-3" />
              <h3 className="text-[14px] font-heading font-bold text-ink mb-1">
                Looking for More Employers?
              </h3>
              <p className="text-[12px] text-muted mb-3">
                Browse hundreds of verified companies hiring across Kenya on JobReady.
              </p>
              <Link
                href="/companies"
                className="inline-flex items-center gap-1.5 text-[13px] font-medium text-accent hover:text-accent-dark transition-colors"
              >
                Browse All Companies
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
