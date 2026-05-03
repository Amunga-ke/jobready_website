import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { KE_COUNTIES, slugifyCounty } from "@/lib/constants";
import { getRobotsMeta, type SeoTier } from "@/lib/seo/page-thresholds";
import { SeoPageHeader } from "@/components/jobready/SeoPageLayout";
import JobRowClickable from "@/components/jobready/JobRowClickable";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; subcategory: string; county: string }>;
}): Promise<Metadata> {
  const { slug, subcategory: subSlug, county: countySlug } = await params;

  const category = await prisma.category.findUnique({ where: { slug } });
  if (!category) return { title: "Not Found | JobReady" };

  const sub = await prisma.subcategory.findUnique({
    where: { slug: subSlug, categoryId: category.id },
  });
  if (!sub) return { title: "Not Found | JobReady" };

  let countyName = KE_COUNTIES.find((c) => slugifyCounty(c) === countySlug);
  if (!countyName) {
    const countyRec = await prisma.county.findUnique({ where: { slug: countySlug } });
    if (countyRec) countyName = countyRec.name;
  }
  if (!countyName) return { title: "Not Found | JobReady" };

  const count = await prisma.listing.count({
    where: {
      subcategoryId: sub.id,
      status: "ACTIVE",
      countyName,
    },
  });

  const title = `${sub.name} Jobs in ${countyName}${count > 0 ? ` (${count})` : ""} | JobReady`;
  const description = `Browse ${count} ${sub.name.toLowerCase()} jobs in ${countyName}, Kenya on JobReady.`;
  const robots = getRobotsMeta(count, "SUBCAT_COUNTY" as SeoTier);

  return {
    title,
    description,
    robots,
    alternates: {
      canonical: `https://jobreadyke.co.ke/jobs/category/${slug}/${subSlug}/in-${countySlug}`,
    },
    openGraph: {
      title,
      description,
      siteName: "JobReady",
      type: "website",
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function SubcategoryCountyPage({
  params,
}: {
  params: Promise<{ slug: string; subcategory: string; county: string }>;
}) {
  const { slug, subcategory: subSlug, county: countySlug } = await params;

  const category = await prisma.category.findUnique({ where: { slug } });
  if (!category) notFound();

  const sub = await prisma.subcategory.findUnique({
    where: { slug: subSlug, categoryId: category.id },
  });
  if (!sub) notFound();

  let countyName = KE_COUNTIES.find((c) => slugifyCounty(c) === countySlug);
  if (!countyName) {
    const countyRec = await prisma.county.findUnique({ where: { slug: countySlug } });
    if (countyRec) countyName = countyRec.name;
  }
  if (!countyName) notFound();

  // Fetch listings
  const listings = await prisma.listing.findMany({
    where: {
      subcategoryId: sub.id,
      status: "ACTIVE",
      countyName,
    },
    include: { company: true, category: true, subcategory: true, tags: { include: { tag: true } } },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  const count = await prisma.listing.count({
    where: { subcategoryId: sub.id, status: "ACTIVE", countyName },
  });

  // Sibling subcategories in this county
  const siblings = await prisma.subcategory.findMany({
    where: { categoryId: category.id, active: true, id: { not: sub.id } },
    orderBy: { sortOrder: "asc" },
    select: { slug: true, name: true },
  });

  // Other categories in this county
  const otherCategories = await prisma.category.findMany({
    where: { active: true, id: { not: category.id } },
    orderBy: { name: "asc" },
    select: { slug: true, name: true },
    take: 8,
  });

  // Nearby counties
  const idx = KE_COUNTIES.indexOf(countyName as typeof KE_COUNTIES[number]);
  const start = Math.max(0, idx - 2);
  const end = Math.min(KE_COUNTIES.length, idx + 5);
  const nearby = idx >= 0 ? KE_COUNTIES.slice(start, end) as unknown as string[] : KE_COUNTIES.slice(0, 5) as unknown as string[];

  return (
    <main className="bg-surface">
      <div className="max-w-6xl mx-auto px-5 py-8 md:py-12">
        <SeoPageHeader
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Jobs", href: "/jobs" },
            { label: category.name, href: `/jobs/category/${slug}` },
            { label: sub.name, href: `/jobs/category/${slug}/${subSlug}` },
            { label: countyName, href: `/jobs/category/${slug}/${subSlug}/in-${countySlug}` },
          ]}
          title={`${sub.name} Jobs in ${countyName}`}
          description={`Browse ${count} ${sub.name.toLowerCase()} jobs in ${countyName}, Kenya.`}
          count={count || undefined}
        />

        {/* Listings */}
        {listings.length > 0 ? (
          <div className="mb-10">
            <div className="hidden sm:grid sm:grid-cols-12 gap-4 pb-2 border-b border-divider text-[10px] font-mono text-muted uppercase tracking-widest mb-1">
              <div className="col-span-5">Position</div>
              <div className="col-span-3">Company</div>
              <div className="col-span-2">Type</div>
              <div className="col-span-2 text-right">Deadline</div>
            </div>
            <div className="divide-y divide-subtle">
              {listings.map((job) => {
                const dl = job.deadline
                  ? Math.ceil(
                      (job.deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
                    )
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
                        <span className="text-[11px] text-muted">{job.company.name}</span>
                        <span className="text-[11px] text-subtle">&middot;</span>
                        <span className="text-[11px] text-muted">{job.location}</span>
                      </div>
                    </div>
                    <div className="hidden sm:block sm:col-span-3 text-[12px] text-muted truncate">
                      {job.company.name}
                    </div>
                    <div className="col-span-6 sm:col-span-2 flex items-center">
                      <span className="text-[11px] text-muted">
                        {job.employmentType || job.listingType}
                      </span>
                    </div>
                    <div className="col-span-6 sm:col-span-2 flex sm:justify-end items-center">
                      {dl !== null ? (
                        <span
                          className={`font-mono text-[12px] font-medium tabular-nums ${
                            dl <= 0
                              ? "text-muted/40"
                              : urgent
                              ? "text-accent"
                              : "text-muted"
                          }`}
                        >
                          {dl <= 0 ? "Closed" : `${dl}d left`}
                        </span>
                      ) : (
                        <span className="text-[11px] text-muted/50">&mdash;</span>
                      )}
                    </div>
                  </JobRowClickable>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="mb-10 rounded-xl bg-accent-bg border border-accent/10 px-5 py-6 text-center">
            <p className="text-[14px] text-ink/80">
              No {sub.name.toLowerCase()} jobs listed in {countyName} at the moment.
            </p>
            <div className="flex items-center justify-center gap-3 mt-4">
              <Link
                href={`/jobs/category/${slug}/${subSlug}`}
                className="text-[13px] font-medium text-accent hover:text-accent-dark transition-colors"
              >
                All {sub.name.toLowerCase()} jobs &rarr;
              </Link>
              <Link
                href={`/jobs/in-${countySlug}`}
                className="text-[13px] font-medium text-muted hover:text-ink transition-colors"
              >
                All jobs in {countyName} &rarr;
              </Link>
            </div>
          </div>
        )}

        {/* Other subcategories in this county */}
        <div className="mb-10">
          <h2 className="text-[13px] font-semibold text-ink uppercase tracking-wider mb-4">
            Other {category.name} Jobs in {countyName}
          </h2>
          <div className="flex flex-wrap gap-2">
            {siblings.map((s) => (
              <Link
                key={s.slug}
                href={`/jobs/category/${slug}/${s.slug}/in-${countySlug}`}
                className="text-[12px] font-medium px-3 py-1.5 rounded-lg bg-ink/[0.04] text-ink/70 hover:bg-ink/[0.08] hover:text-ink transition-colors"
              >
                {s.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Other categories in this county */}
        <div className="mb-10">
          <h2 className="text-[13px] font-semibold text-ink uppercase tracking-wider mb-4">
            Other Jobs in {countyName}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {otherCategories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/jobs/category/${cat.slug}/in-${countySlug}`}
                className="group flex items-center justify-between px-4 py-3 rounded-lg border border-divider hover:border-accent/30 hover:bg-accent-bg/50 transition-all"
              >
                <span className="text-[13px] font-medium text-ink/80 group-hover:text-ink">
                  {cat.name}
                </span>
                <svg
                  className="w-4 h-4 text-muted group-hover:text-accent"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            ))}
          </div>
        </div>

        {/* Nearby counties */}
        <div>
          <h2 className="text-[13px] font-semibold text-ink uppercase tracking-wider mb-4">
            {sub.name} Jobs Nearby
          </h2>
          <div className="flex flex-wrap gap-2">
            {nearby
              .filter((c) => c !== countyName)
              .map((c) => (
                <Link
                  key={c}
                  href={`/jobs/category/${slug}/${subSlug}/in-${slugifyCounty(c)}`}
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
