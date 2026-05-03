import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { slugifyCounty } from "@/lib/constants";
import { SeoPageHeader } from "@/components/jobready/SeoPageLayout";
import JobRowClickable from "@/components/jobready/JobRowClickable";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; subcategory: string }>;
}): Promise<Metadata> {
  const { slug, subcategory: subSlug } = await params;

  const category = await prisma.category.findUnique({ where: { slug } });
  if (!category) return { title: "Not Found | JobReady" };

  const sub = await prisma.subcategory.findFirst({
    where: { slug: subSlug, categoryId: category.id },
  });
  if (!sub) return { title: "Not Found | JobReady" };

  const count = await prisma.listing.count({
    where: { subcategoryId: sub.id, status: "ACTIVE" },
  });

  const title = `${sub.name} Jobs in Kenya${count > 0 ? ` (${count})` : ""} | JobReady`;
  const description = `Browse ${count} ${sub.name.toLowerCase()} job openings across Kenya on JobReady.`;

  return {
    title,
    description,
    alternates: { canonical: `https://jobreadyke.co.ke/jobs/category/${slug}/${subSlug}` },
    openGraph: { title, description, siteName: "JobReady", type: "website" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function SubcategoryPage({
  params,
}: {
  params: Promise<{ slug: string; subcategory: string }>;
}) {
  const { slug, subcategory: subSlug } = await params;

  // Look up category from DB
  const category = await prisma.category.findUnique({ where: { slug } });
  if (!category) notFound();

  // Look up subcategory from DB
  const sub = await prisma.subcategory.findFirst({
    where: { slug: subSlug, categoryId: category.id },
    include: {
      _count: { select: { listings: { where: { status: "ACTIVE" } } } },
    },
  });
  if (!sub) notFound();

  const count = sub._count.listings;

  // Fetch sibling subcategories
  const siblings = await prisma.subcategory.findMany({
    where: { categoryId: category.id, active: true, id: { not: sub.id } },
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { listings: { where: { status: "ACTIVE" } } } } },
  });

  // Fetch listings for this subcategory
  const listings = await prisma.listing.findMany({
    where: { subcategoryId: sub.id, status: "ACTIVE" },
    include: { company: true, category: true, subcategory: true, tags: { include: { tag: true } } },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  // Fetch top counties for this subcategory
  const countiesWithCounts = await prisma.$queryRaw<
    Array<{ countyName: string; _count: bigint }>
  >`
    SELECT l.countyName, COUNT(*) as _count
    FROM Listing l
    WHERE l.status = 'ACTIVE' AND l.subcategoryId = ${sub.id}
      AND l.countyName IS NOT NULL AND l.countyName != ''
    GROUP BY l.countyName
    ORDER BY _count DESC
    LIMIT 15
  `;

  return (
    <main className="bg-surface">
      <div className="max-w-6xl mx-auto px-5 py-8 md:py-12">
        <SeoPageHeader
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Jobs", href: "/jobs" },
            { label: category.name, href: `/jobs/category/${slug}` },
            { label: sub.name, href: `/jobs/category/${slug}/${subSlug}` },
          ]}
          title={`${sub.name} Jobs in Kenya`}
          description={`Browse ${count} ${sub.name.toLowerCase()} job openings across Kenya.`}
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
            {count > 20 && (
              <Link
                href={`/jobs?subcategory=${sub.id}`}
                className="inline-flex items-center gap-1 text-[13px] font-medium text-accent hover:text-accent-dark transition-colors mt-4"
              >
                View all {count} {sub.name.toLowerCase()} jobs &rarr;
              </Link>
            )}
          </div>
        ) : (
          <div className="mb-10 text-center py-12">
            <p className="text-[14px] text-muted">
              No {sub.name.toLowerCase()} jobs listed at the moment. Check back soon.
            </p>
          </div>
        )}

        {/* Browse by county */}
        {countiesWithCounts.length > 0 && (
          <div className="mb-10">
            <h2 className="text-[13px] font-semibold text-ink uppercase tracking-wider mb-4">
              {sub.name} Jobs by County
            </h2>
            <div className="flex flex-wrap gap-2">
              {countiesWithCounts.map((c) => {
                const countySlug = c.countyName
                  .toLowerCase()
                  .replace(/[^a-z0-9]+/g, "-")
                  .replace(/^-|-$/g, "");
                return (
                  <Link
                    key={c.countyName}
                    href={`/jobs/category/${slug}/${subSlug}/in-${countySlug}`}
                    className="text-[12px] font-medium px-3 py-1.5 rounded-lg bg-ink/[0.04] text-ink/70 hover:bg-ink/[0.08] hover:text-ink transition-colors inline-flex items-center gap-1.5"
                  >
                    {c.countyName}
                    <span className="text-[10px] font-mono text-accent">
                      {Number(c._count)}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Other subcategories */}
        {siblings.length > 0 && (
          <div>
            <h2 className="text-[13px] font-semibold text-ink uppercase tracking-wider mb-4">
              Other {category.name} Subcategories
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {siblings.map((s) => (
                <Link
                  key={s.slug}
                  href={`/jobs/category/${slug}/${s.slug}`}
                  className="group flex items-center justify-between px-4 py-3 rounded-lg border border-divider hover:border-accent/30 hover:bg-accent-bg/50 transition-all"
                >
                  <span className="text-[13px] font-medium text-ink/80 group-hover:text-ink">
                    {s.name}
                  </span>
                  <div className="flex items-center gap-2 shrink-0">
                    {s._count.listings > 0 && (
                      <span className="text-[11px] font-mono text-accent">
                        {s._count.listings}
                      </span>
                    )}
                    <svg
                      className="w-4 h-4 text-muted group-hover:text-accent transition-colors"
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
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
