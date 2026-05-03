import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, MapPin, Clock, Building2, ExternalLink } from "lucide-react";
import { formatDateUTC } from "@/lib/format-date";
import { getJobBySlug, getJobCountByCounty, getJobsByCounty } from "@/lib/data";
import ShareButton from "@/components/jobready/ShareButton";
import { KE_COUNTIES, slugifyCounty, JOB_CATEGORIES, getCountyBySlug } from "@/lib/constants";
import { getRobotsMeta, type SeoTier } from "@/lib/seo/page-thresholds";
import { getCountyIntro, getNearbyCounties } from "@/lib/seo/fallback-content";
import { SeoPageHeader, RichFallback } from "@/components/jobready/SeoPageLayout";
import JobRowClickable from "@/components/jobready/JobRowClickable";

export const dynamic = "force-dynamic";

const COUNTY_PREFIX = "in-";

// ─── Dynamic metadata for SEO ───
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  try {
    const { slug } = await params;

    // ── County page metadata ──
    if (slug.startsWith(COUNTY_PREFIX)) {
      const countySlug = slug.slice(COUNTY_PREFIX.length);
      const countyName = getCountyBySlug(countySlug);

      if (!countyName) return { title: "Not Found | JobReady" };

      const count = await getJobCountByCounty(countySlug).catch(() => 0);
      const robots = getRobotsMeta(count, "COUNTY" as SeoTier);

      return {
        title: `Jobs in ${countyName}, Kenya (${count || ""} Openings) | JobReady`,
        description: getCountyIntro(countyName),
        robots,
        alternates: {
          canonical: `https://jobreadyke.co.ke/jobs/in-${countySlug}`,
        },
        openGraph: {
          title: `Jobs in ${countyName} | JobReady`,
          description: getCountyIntro(countyName),
          url: `https://jobreadyke.co.ke/jobs/in-${countySlug}`,
          type: "website",
          siteName: "JobReady",
        },
        twitter: {
          card: "summary_large_image",
          title: `Jobs in ${countyName} | JobReady`,
          description: getCountyIntro(countyName),
        },
      };
    }

    // ── Job detail metadata ──
    const job = await getJobBySlug(slug);
    if (!job) return { title: "Job Not Found | JobReady" };

    return {
      title: `${job.title} at ${job.companyName} | JobReady`,
      description: `Apply for ${job.title} at ${job.companyName} in ${job.location}. ${job.listingType === "JOB" ? "Job" : "Opportunity"} posted on JobReady — Kenya's most trusted job board.`,
      openGraph: {
        title: `${job.title} at ${job.companyName}`,
        description: `Apply for ${job.title} at ${job.companyName} in ${job.location} on JobReady`,
        url: `https://jobreadyke.co.ke/jobs/${slug}`,
        type: "article",
        siteName: "JobReady",
      },
      twitter: {
        card: "summary_large_image",
        title: `${job.title} at ${job.companyName}`,
        description: `Apply for ${job.title} at ${job.companyName} in ${job.location} on JobReady`,
      },
    };
  } catch {
    return { title: "Not Found | JobReady" };
  }
}

// ─── Page component ───
export default async function SlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  try {
    const { slug } = await params;

    // ── County page ──
    if (slug.startsWith(COUNTY_PREFIX)) {
      const countySlug = slug.slice(COUNTY_PREFIX.length);
      const countyName = getCountyBySlug(countySlug);

      if (!countyName) notFound();

      const [countResult, nearby, relatedCategories] = await Promise.all([
        getJobsByCounty(countySlug, 20).catch(() => ({ jobs: [] as Job[], count: 0 })),
        Promise.resolve(getNearbyCounties(countyName)),
        Promise.resolve(JOB_CATEGORIES.slice(0, 8)),
      ]);
      const count = countResult.count;
      const countyJobs = countResult.jobs;

      return (
        <main className="bg-surface">
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
            {countyJobs.length > 0 ? (
              <div className="mb-10">
                <div className="hidden sm:grid sm:grid-cols-12 gap-4 pb-2 border-b border-divider text-[10px] font-mono text-muted uppercase tracking-widest mb-1">
                  <div className="col-span-5">Position</div>
                  <div className="col-span-3">Company</div>
                  <div className="col-span-2">Type</div>
                  <div className="col-span-2 text-right">Deadline</div>
                </div>
                <div className="divide-y divide-subtle">
                  {countyJobs.map((job) => {
                    const dl = job.deadline
                      ? Math.ceil((new Date(job.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
                      : null;
                    const urgent = dl !== null && dl <= 3 && dl > 0;
                    return (
                      <JobRowClickable
                        key={job.id}
                        slug={job.slug}
                        className="grid grid-cols-12 gap-4 py-3.5 group cursor-pointer hover:bg-ink/[0.02] rounded-lg -mx-2 px-2 transition-colors"
                      >
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
                            {job.listingType === "GOVERNMENT" ? "Gov" : job.listingType === "CASUAL" ? "Casual" : job.employmentType || "Job"}
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
                      </JobRowClickable>
                    );
                  })}
                </div>
                {count > 20 && (
                  <Link
                    href={`/jobs?county=${countySlug}`}
                    className="inline-flex items-center gap-1 text-[13px] font-medium text-accent hover:text-accent-dark transition-colors mt-4"
                  >
                    View all {count} jobs in {countyName} →
                  </Link>
                )}
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

    // ── Job detail page ──
    const job = await getJobBySlug(slug);

    if (!job) {
      notFound();
    }

    return (
      <main className="bg-surface">
        {/* Top bar */}
        <div className="border-b border-divider bg-white/60 backdrop-blur-sm sticky top-0 z-30">
          <div className="max-w-3xl mx-auto px-5 py-3 flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-[13px] text-muted hover:text-ink transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Link>
          </div>
        </div>

        <article className="max-w-3xl mx-auto px-5 py-8 space-y-6">
          {/* Title block */}
          <div>
            <div className="flex items-start gap-3 mb-1">
              <div className="w-12 h-12 rounded-xl bg-ink/[0.06] flex items-center justify-center shrink-0">
                <Building2 className="w-5 h-5 text-muted" />
              </div>
              <div className="min-w-0">
                <h1 className="text-xl md:text-2xl font-heading font-bold text-ink leading-tight">
                  {job.title}
                </h1>
                <p className="text-[15px] text-muted mt-0.5">
                  {job.companyName}
                  {job.companyVerified && (
                    <span className="ml-2 text-[12px] text-accent font-medium">
                      Verified
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] text-muted">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="w-4 h-4" />
              {job.location}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              Posted {formatDateUTC(job.createdAt)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Building2 className="w-4 h-4" />
              {job.employmentType}
            </span>
            <span>{job.workMode}</span>
            <span>{job.experienceLevel}</span>
            {job.deadline && (
              <span className="text-accent font-medium">
                Deadline: {formatDateUTC(job.deadline)}
              </span>
            )}
          </div>

          {/* Type badges */}
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[12px] font-medium bg-ink/[0.05] text-ink/70">
              {job.listingType === "JOB"
                ? "Job"
                : job.listingType === "GOVERNMENT"
                ? "Government"
                : job.listingType === "CASUAL"
                ? "Casual"
                : "Opportunity"}
            </span>
            {job.governmentLevel && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[12px] font-medium bg-blue-50 text-blue-700 border border-blue-100">
                {job.governmentLevel === "NATIONAL"
                  ? "National Government"
                  : job.governmentLevel === "COUNTY"
                  ? "County Government"
                  : "State Corporation"}
              </span>
            )}
            {job.opportunityType && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[12px] font-medium bg-amber-50 text-amber-700 border border-amber-100">
                {job.opportunityType.replace(/_/g, " ")}
              </span>
            )}
            {job.tags.map((tag) => (
              <span key={tag} className="inline-flex items-center px-2.5 py-1 rounded-md text-[12px] font-medium bg-surface text-muted border border-subtle">
                #{tag}
              </span>
            ))}
          </div>

          {/* Salary */}
          <div className="rounded-lg bg-emerald-50/60 border border-emerald-100/80 px-5 py-4">
            <p className="text-[11px] font-medium text-emerald-600 uppercase tracking-wider mb-1.5">
              {job.listingType === "OPPORTUNITY" ? "Value" : "Compensation"}
            </p>
            {job.salaryMin != null && job.salaryMax != null ? (
              <p className="text-base font-semibold text-ink">
                KES {job.salaryMin?.toLocaleString()} –{" "}
                {job.salaryMax?.toLocaleString()}
                {job.salaryPeriod && (
                  <span className="font-normal text-muted">
                    {" "}
                    / {job.salaryPeriod}
                  </span>
                )}
              </p>
            ) : (
              <>
                <p className="text-base font-medium text-ink/60">
                  {job.predictedSalary || "Not disclosed"}
                </p>
                {job.predictedSalary && (
                  <p className="text-[12px] text-muted mt-1">
                    Estimated based on similar roles in{" "}
                    {job.county || job.location}
                  </p>
                )}
              </>
            )}
          </div>

          {/* Description */}
          {job.description && (
            <div>
              <h2 className="text-[13px] font-semibold text-ink uppercase tracking-wider mb-3">
                Description
              </h2>
              <div
                className="text-[14px] text-ink/80 leading-relaxed
                  [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5
                  [&_li]:mb-1.5 [&_p]:mb-3 [&_strong]:font-semibold [&_strong]:text-ink"
                dangerouslySetInnerHTML={{ __html: job.description }}
              />
            </div>
          )}

          {/* Apply CTA */}
          <div className="pt-4 border-t border-divider flex items-center justify-between gap-4">
            <ShareButton slug={job.slug} title={job.title} />
            {job.applicationUrl ? (
              <a
                href={job.applicationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-ink text-white text-[14px] font-medium hover:bg-ink/90 transition-colors"
              >
                Apply Now
                <ExternalLink className="w-4 h-4" />
              </a>
            ) : (
              <button className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-ink text-white text-[14px] font-medium hover:bg-ink/90 transition-colors">
                Apply Now
                <ExternalLink className="w-4 h-4" />
              </button>
            )}
          </div>
        </article>
      </main>
    );
  } catch {
    notFound();
  }
}
