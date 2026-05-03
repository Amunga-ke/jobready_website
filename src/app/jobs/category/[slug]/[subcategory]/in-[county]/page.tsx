import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { SeoPageHeader } from "@/components/jobready/SeoPageLayout";
import JobRowClickable from "@/components/jobready/JobRowClickable";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; subcategory: string; county: string }>;
}): Promise<Metadata> {
  const { slug, subcategory: subSlug, county: countySlug } = await params;

  const category = await prisma.category
    .findUnique({ where: { slug } })
    .catch(() => null);
  if (!category) return { title: "Not Found | JobReady" };

  const sub = await prisma.subcategory
    .findFirst({
      where: { slug: subSlug, categoryId: category.id },
    })
    .catch(() => null);
  if (!sub) return { title: "Not Found | JobReady" };

  // Derive county name from slug (replace hyphens, title-case)
  const countyName = countySlug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  const count = await prisma.listing
    .count({
      where: {
        subcategoryId: sub.id,
        status: "ACTIVE",
        countyName,
      },
    })
    .catch(() => 0);

  const title = `${sub.name} Jobs in ${countyName}${count > 0 ? ` (${count})` : ""} | JobReady`;
  const description = `Find ${count} ${sub.name.toLowerCase()} jobs in ${countyName}, Kenya.`;

  return {
    title,
    description,
    alternates: { canonical: `https://jobreadyke.co.ke/jobs/category/${slug}/${subSlug}/in-${countySlug}` },
    openGraph: { title, description, siteName: "JobReady", type: "website" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function SubcategoryCountyPage({
  params,
}: {
  params: Promise<{ slug: string; subcategory: string; county: string }>;
}) {
  const { slug, subcategory: subSlug, county: countySlug } = await params;

  // Look up from DB
  const category = await prisma.category
    .findUnique({ where: { slug } })
    .catch(() => null);
  if (!category) notFound();

  const sub = await prisma.subcategory
    .findFirst({
      where: { slug: subSlug, categoryId: category.id },
    })
    .catch(() => null);
  if (!sub) notFound();

  // Derive county name from slug
  const countyName = countySlug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  // Fetch listings
  const listings = await prisma.listing
    .findMany({
      where: {
        subcategoryId: sub.id,
        status: "ACTIVE",
        countyName,
      },
      include: { company: true, category: true, subcategory: true, tags: { include: { tag: true } } },
      orderBy: { createdAt: "desc" },
      take: 20,
    })
    .catch(() => []);

  const count = listings.length;

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
          description={`Browse ${sub.name.toLowerCase()} job openings in ${countyName}, Kenya.`}
          count={count || undefined}
        />

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
                            dl <= 0 ? "text-muted/40" : urgent ? "text-accent" : "text-muted"
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
          <div className="mb-10 text-center py-12">
            <p className="text-[14px] text-muted">
              No {sub.name.toLowerCase()} jobs in {countyName} at the moment. Check back soon.
            </p>
          </div>
        )}

        {/* Navigation links */}
        <div className="flex flex-wrap gap-3">
          <Link
            href={`/jobs/category/${slug}/${subSlug}`}
            className="text-[13px] font-medium text-accent hover:text-accent-dark transition-colors"
          >
            &larr; All {sub.name} jobs
          </Link>
          <Link
            href={`/jobs/category/${slug}/in-${countySlug}`}
            className="text-[13px] font-medium text-accent hover:text-accent-dark transition-colors"
          >
            All {category.name} jobs in {countyName} &rarr;
          </Link>
        </div>
      </div>
    </main>
  );
}
