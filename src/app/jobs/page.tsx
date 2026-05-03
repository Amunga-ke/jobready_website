import Link from "next/link";
import type { Metadata } from "next";
import { getJobs } from "@/lib/data";
import { formatDateShortUTC } from "@/lib/format-date";
import JobClickable from "@/components/jobready/JobClickable";
import { Search, SlidersHorizontal, Briefcase, ChevronLeft, ChevronRight } from "lucide-react";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function generateMetadata({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }): Promise<Metadata> {
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q : undefined;
  const listingType = typeof params.type === "string" ? params.type : undefined;
  const workMode = typeof params.mode === "string" ? params.mode : undefined;
  const employmentType = typeof params.employment === "string" ? params.employment : undefined;
  const opportunityType = typeof params.opportunity === "string" ? params.opportunity : undefined;

  let title = "Browse All Jobs | JobReady";
  let description = "Search and browse thousands of jobs from verified employers across Kenya.";

  if (q) {
    title = `Results for "${q}" | JobReady`;
    description = `Search results for "${q}" on JobReady Kenya. Find matching jobs from verified employers.`;
  } else if (workMode === "REMOTE") {
    title = "Remote Jobs in Kenya | JobReady";
    description = "Browse work-from-home and remote job opportunities from Kenyan and international employers.";
  } else if (listingType === "GOVERNMENT") {
    title = "Government Jobs in Kenya | JobReady";
    description = "Browse government positions from national, county and state corporations.";
  } else if (listingType === "CASUAL") {
    title = "Casual & Part-Time Jobs | JobReady";
    description = "Find daily-wage, weekend and flexible casual jobs across Kenya.";
  } else if (opportunityType) {
    const label = opportunityType.replace(/_/g, " ").toLowerCase();
    title = `${label.charAt(0).toUpperCase() + label.slice(1)} Opportunities | JobReady`;
    description = `Browse the latest ${label} opportunities available in Kenya.`;
  } else if (employmentType) {
    const label = employmentType.replace(/_/g, " ").toLowerCase();
    title = `${label.charAt(0).toUpperCase() + label.slice(1)} Jobs | JobReady`;
    description = `Browse ${label} positions from verified employers across Kenya.`;
  }

  return {
    title,
    description,
    alternates: { canonical: "https://jobreadyke.co.ke/jobs" },
    openGraph: {
      title,
      description,
      url: "https://jobreadyke.co.ke/jobs",
      siteName: "JobReady",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

// ─── Filter pills config ───
const FILTER_PILLS: { label: string; param: string; value: string }[] = [
  { label: "Remote", param: "mode", value: "REMOTE" },
  { label: "Full-Time", param: "employment", value: "FULL_TIME" },
  { label: "Part-Time", param: "employment", value: "PART_TIME" },
  { label: "Government", param: "type", value: "GOVERNMENT" },
  { label: "Internships", param: "opportunity", value: "INTERNSHIP" },
  { label: "Entry Level", param: "experience", value: "Entry-level" },
  { label: "Closing Soon", param: "sort", value: "closing" },
  { label: "Casual", param: "type", value: "CASUAL" },
];

// Params that represent filter criteria (not sort, not page, not search)
const FILTER_PARAM_KEYS = ["mode", "type", "employment", "opportunity", "experience", "govt"];

function deadlineText(job: { deadline?: string | null }): { text: string; urgent: boolean } {
  if (!job.deadline) return { text: "", urgent: false };
  const now = new Date();
  const end = new Date(job.deadline);
  const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (diff <= 0) return { text: "Closed", urgent: false };
  if (diff === 1) return { text: "1d left", urgent: true };
  if (diff <= 3) return { text: `${diff}d left`, urgent: true };
  return { text: `${diff}d left`, urgent: false };
}

function buildFilterUrl(currentParams: URLSearchParams, remove?: string, add?: { key: string; value: string }, resetPage = true) {
  const url = new URLSearchParams(currentParams);
  if (remove) url.delete(remove);
  if (add) {
    url.set(add.key, add.value);
  }
  if (resetPage) url.delete("page");
  const qs = url.toString();
  return qs ? `/jobs?${qs}` : "/jobs";
}

function hasActiveFilters(params: URLSearchParams): boolean {
  for (const key of FILTER_PARAM_KEYS) {
    if (params.has(key)) return true;
  }
  return params.get("sort") === "closing";
}

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;

  // Map URL params to getJobs params
  const q = typeof params.q === "string" ? params.q : undefined;
  const category = typeof params.category === "string" ? params.category : undefined;
  const county = typeof params.county === "string" ? params.county : undefined;
  const listingType = typeof params.type === "string" ? params.type : undefined;
  const employmentType = typeof params.employment === "string" ? params.employment : undefined;
  const experienceLevel = typeof params.experience === "string" ? params.experience : undefined;
  const workMode = typeof params.mode === "string" ? params.mode : undefined;
  const governmentLevel = typeof params.govt === "string" ? params.govt : undefined;
  const opportunityType = typeof params.opportunity === "string" ? params.opportunity : undefined;
  const sort = typeof params.sort === "string" ? params.sort : "latest";
  const page = Number(params.page) || 1;

  // Fetch jobs and categories in parallel
  const [{ jobs, total, totalPages }, categoriesWithCounts] = await Promise.all([
    getJobs({
      q,
      category,
      county,
      listingType,
      employmentType,
      experienceLevel,
      workMode,
      governmentLevel,
      opportunityType,
      sort,
      page,
      limit: 20,
    }),
    prisma.category.findMany({
      where: { active: true },
      include: { _count: { select: { listings: { where: { status: "ACTIVE" } } } } },
      orderBy: { name: "asc" },
    }),
  ]);

  const currentUrlParams = new URLSearchParams(
    Object.entries(params).filter(([, v]) => typeof v === "string") as [string, string][]
  );

  const anyFiltersActive = hasActiveFilters(currentUrlParams);

  // Build heading text
  let headingText = "All Jobs";
  if (q) headingText = `Results for "${q}"`;
  else if (workMode === "REMOTE") headingText = "Remote Jobs";
  else if (listingType === "GOVERNMENT") headingText = "Government Jobs";
  else if (listingType === "CASUAL") headingText = "Casual Jobs";
  else if (opportunityType) headingText = `${opportunityType.replace(/_/g, " ")} Opportunities`;
  else if (employmentType) headingText = `${employmentType.replace(/_/g, " ")} Jobs`;
  else if (sort === "closing") headingText = "Jobs Closing Soon";

  return (
    <main className="bg-surface">
      <div className="max-w-6xl mx-auto px-5 py-10">
        {/* Header */}
        <div className="mb-8">
          <p className="font-mono text-[11px] text-muted uppercase tracking-[0.2em] mb-2">
            Browse {total} {total === 1 ? "job" : "jobs"}
          </p>
          <h1 className="text-2xl font-heading font-bold text-ink">{headingText}</h1>
          <p className="text-[14px] text-muted mt-1">
            Find the latest jobs across Kenya from verified employers
          </p>
        </div>

        {/* Search bar */}
        <form action="/jobs" method="get" className="max-w-2xl mb-6">
          <div className="flex items-center gap-3 bg-white border border-divider rounded-xl px-4 py-3">
            <Search className="w-5 h-5 text-muted shrink-0" />
            <input
              name="q"
              type="text"
              defaultValue={q || ""}
              placeholder="Search jobs by title, company, or keyword..."
              className="flex-1 bg-transparent text-[14px] text-ink placeholder:text-muted/50 outline-none"
            />
            {q && (
              <Link
                href="/jobs"
                className="text-[12px] text-muted hover:text-ink transition-colors shrink-0"
              >
                Clear
              </Link>
            )}
            <button
              type="submit"
              className="text-[13px] font-medium text-ink hover:text-accent transition-colors shrink-0"
            >
              Search →
            </button>
          </div>
          {/* Preserve existing filters as hidden inputs */}
          {listingType && <input type="hidden" name="type" value={listingType} />}
          {workMode && <input type="hidden" name="mode" value={workMode} />}
          {employmentType && <input type="hidden" name="employment" value={employmentType} />}
          {experienceLevel && <input type="hidden" name="experience" value={experienceLevel} />}
          {opportunityType && <input type="hidden" name="opportunity" value={opportunityType} />}
          {category && <input type="hidden" name="category" value={category} />}
          {county && <input type="hidden" name="county" value={county} />}
          {sort && sort !== "latest" && <input type="hidden" name="sort" value={sort} />}
        </form>

        {/* Filter pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
          <SlidersHorizontal className="w-4 h-4 text-muted shrink-0 mr-1" />
          {/* "All Jobs" pill — clears all filters */}
          <Link
            href={anyFiltersActive ? "/jobs" : undefined}
            className={`text-[12px] font-medium px-3 py-1.5 rounded-full border whitespace-nowrap transition-colors ${
              !anyFiltersActive
                ? "bg-ink text-white border-ink"
                : "bg-white text-muted border-divider hover:border-ink/30 hover:text-ink"
            }`}
          >
            All Jobs
          </Link>
          {FILTER_PILLS.map((pill) => {
            const isActive = currentUrlParams.get(pill.param) === pill.value;

            // If active, clicking untoggles (removes the param)
            const href = isActive
              ? buildFilterUrl(currentUrlParams, pill.param)
              : buildFilterUrl(currentUrlParams, undefined, { key: pill.param, value: pill.value });

            return (
              <Link
                key={pill.label}
                href={href}
                className={`text-[12px] font-medium px-3 py-1.5 rounded-full border whitespace-nowrap transition-colors ${
                  isActive
                    ? "bg-ink text-white border-ink"
                    : "bg-white text-muted border-divider hover:border-ink/30 hover:text-ink"
                }`}
              >
                {pill.label}
              </Link>
            );
          })}
        </div>

        {/* Sort options */}
        <div className="flex items-center gap-3 mb-6">
          <span className="text-[11px] font-mono text-muted uppercase tracking-widest">Sort:</span>
          {[
            { label: "Latest", value: "latest" },
            { label: "Closing Soon", value: "closing" },
          ].map((s) => (
            <Link
              key={s.value}
              href={buildFilterUrl(currentUrlParams, "sort", { key: "sort", value: s.value })}
              className={`text-[12px] font-medium transition-colors ${
                sort === s.value
                  ? "text-ink"
                  : "text-muted hover:text-ink"
              }`}
            >
              {s.label}
            </Link>
          ))}
        </div>

        {/* Job list */}
        {jobs.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-ink/[0.04] flex items-center justify-center">
              <Briefcase className="w-7 h-7 text-muted" />
            </div>
            <h2 className="text-lg font-heading font-bold text-ink mb-1">No jobs found</h2>
            <p className="text-[14px] text-muted mb-4 max-w-md mx-auto">
              {q
                ? `We couldn't find any jobs matching "${q}". Try a different search or adjust your filters.`
                : "No jobs match the current filters. Try removing some filters to see more results."}
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <Link
                href="/jobs"
                className="text-[13px] font-medium px-4 py-2 rounded-lg bg-ink text-white hover:bg-ink/90 transition-colors"
              >
                View all jobs
              </Link>
              <Link
                href="/jobs?sort=closing"
                className="text-[13px] font-medium px-4 py-2 rounded-lg border border-divider text-muted hover:text-ink hover:border-ink/30 transition-colors"
              >
                Closing soon
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Column headers — desktop */}
            <div className="hidden sm:grid sm:grid-cols-12 gap-4 pb-2 border-b border-divider text-[10px] font-mono text-muted uppercase tracking-widest">
              <div className="col-span-5">Position</div>
              <div className="col-span-3">Company</div>
              <div className="col-span-2">Posted</div>
              <div className="col-span-2 text-right">Deadline</div>
            </div>
            <div className="divide-y divide-subtle">
              {jobs.map((job) => {
                const dl = deadlineText(job);
                return (
                  <JobClickable
                    key={job.id}
                    job={job}
                    className="grid grid-cols-12 gap-4 py-3.5 group cursor-pointer hover:bg-ink/[0.02] rounded-lg -mx-2 px-2 transition-colors"
                  >
                    <div className="col-span-12 sm:col-span-5">
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
                    <div className="hidden sm:flex sm:col-span-2 items-center">
                      <span className="text-[11px] text-muted">{formatDateShortUTC(job.createdAt)}</span>
                    </div>
                    <div className="col-span-12 sm:col-span-2 flex sm:justify-end items-center">
                      {dl.text ? (
                        <span
                          className={`font-mono text-[12px] font-medium tabular-nums ${
                            dl.urgent ? "text-accent" : "text-muted"
                          }`}
                        >
                          {dl.text}
                        </span>
                      ) : (
                        <span className="text-[11px] text-muted/50">—</span>
                      )}
                    </div>
                  </JobClickable>
                );
              })}
            </div>
          </>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10 pt-6 border-t border-divider">
            {page > 1 ? (
              <Link
                href={buildFilterUrl(currentUrlParams, undefined, { key: "page", value: String(page - 1) }, false)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] font-medium text-muted border border-divider hover:text-ink hover:border-ink/30 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Link>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] font-medium text-muted/30 border border-divider cursor-not-allowed">
                <ChevronLeft className="w-4 h-4" />
                Previous
              </span>
            )}

            <span className="text-[12px] font-mono text-muted px-3">
              Page {page} of {totalPages}
            </span>

            {page < totalPages ? (
              <Link
                href={buildFilterUrl(currentUrlParams, undefined, { key: "page", value: String(page + 1) }, false)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] font-medium text-muted border border-divider hover:text-ink hover:border-ink/30 transition-colors"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Link>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] font-medium text-muted/30 border border-divider cursor-not-allowed">
                Next
                <ChevronRight className="w-4 h-4" />
              </span>
            )}
          </div>
        )}

        {/* Results count at bottom */}
        {total > 0 && (
          <p className="text-center text-[11px] font-mono text-muted/40 mt-6">
            Showing {((page - 1) * 20) + 1}–{Math.min(page * 20, total)} of {total} jobs
          </p>
        )}

        {/* ─── Browse by Category ─── */}
        {categoriesWithCounts.length > 0 && (
          <section className="mt-14 pt-10 border-t border-divider">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-[15px] font-heading font-semibold text-ink">Browse by Category</h2>
                <p className="text-[12px] text-muted mt-1">
                  {categoriesWithCounts.length} categories with active listings
                </p>
              </div>
              <Link href="/jobs" className="text-[12px] text-accent hover:text-accent-dark font-medium transition-colors">
                View all
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
              {categoriesWithCounts.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/jobs/category/${cat.slug}`}
                  className="group flex items-center justify-between px-4 py-3 rounded-lg border border-divider hover:border-accent/30 hover:bg-accent-bg/50 transition-all"
                >
                  <span className="text-[13px] font-medium text-ink/80 group-hover:text-ink transition-colors truncate mr-2">
                    {cat.name}
                  </span>
                  <span className="text-[11px] font-mono text-accent shrink-0">
                    {cat._count.listings}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
