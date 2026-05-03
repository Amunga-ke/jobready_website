import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { getCountyBySlug } from "@/lib/constants";
import { SeoPageHeader } from "@/components/jobready/SeoPageLayout";
import JobRowClickable from "@/components/jobready/JobRowClickable";

export const dynamic = "force-dynamic";

function parseLocation(raw: string) {
  if (!raw.startsWith("in-")) return null;
  const countySlug = raw.replace(/^in-/, "");
  const county = getCountyBySlug(countySlug);
  if (!county) return null;
  return { countySlug, county };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; subcategory: string; location: string }>;
}): Promise<Metadata> {
  try {
    const { slug, subcategory: subSlug, location: rawLoc } = await params;
    const loc = parseLocation(rawLoc);
    if (!loc) return { title: "Not Found | JobReady" };

    const { countySlug, county } = loc;
    const category = await prisma.category
      .findUnique({ where: { slug } })
      .catch(() => null);
    if (!category) return { title: "Not Found | JobReady" };

    const sub = await prisma.subcategory
      .findFirst({ where: { slug: subSlug, categoryId: category.id } })
      .catch(() => null);
    if (!sub) return { title: "Not Found | JobReady" };

    const count = await prisma.listing
      .count({
        where: { subcategoryId: sub.id, status: "ACTIVE", countyName: county },
      })
      .catch(() => 0);

    const title = `${sub.name} Jobs in ${county}${count > 0 ? ` (${count})` : ""} | JobReady`;
    const description = `Find ${count} ${sub.name.toLowerCase()} jobs in ${county}, Kenya.`;

    return {
      title,
      description,
      alternates: { canonical: `https://jobreadyke.co.ke/jobs/category/${slug}/${subSlug}/in-${countySlug}` },
      openGraph: { title, description, siteName: "JobReady", type: "website" },
      twitter: { card: "summary_large_image", title, description },
    };
  } catch {
    return { title: "Not Found | JobReady" };
  }
}

export default async function SubcategoryCountyPage({
  params,
}: {
  params: Promise<{ slug: string; subcategory: string; location: string }>;
}) {
  try {
    const { slug, subcategory: subSlug, location: rawLoc } = await params;
    const loc = parseLocation(rawLoc);
    if (!loc) notFound();

    const { countySlug, county } = loc;

    const category = await prisma.category
      .findUnique({ where: { slug } })
      .catch(() => null);
    if (!category) notFound();

    const sub = await prisma.subcategory
      .findFirst({ where: { slug: subSlug, categoryId: category.id } })
      .catch(() => null);
    if (!sub) notFound();

    const [listings, countiesWithCounts] = await Promise.all([
      prisma.listing
        .findMany({
          where: { subcategoryId: sub.id, status: "ACTIVE", countyName: county },
          include: { company: true, category: true, subcategory: true, tags: { include: { tag: true } } },
          orderBy: { createdAt: "desc" },
          take: 20,
        })
        .catch(() => []),
      prisma.$queryRaw<Array<{ countyName: string; _count: bigint }>>`
        SELECT l.countyName, COUNT(*) as _count
        FROM Listing l
        WHERE l.status = 'ACTIVE' AND l.subcategoryId = ${sub.id}
          AND l.countyName IS NOT NULL AND l.countyName != ''
        GROUP BY l.countyName
        ORDER BY _count DESC
        LIMIT 15
      `.catch(() => []),
    ]);

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
              { label: county, href: `/jobs/category/${slug}/${subSlug}/in-${countySlug}` },
            ]}
            title={`${sub.name} Jobs in ${county}`}
            description={`Browse ${sub.name.toLowerCase()} job openings in ${county}, Kenya.`}
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
                    ? Math.ceil((job.deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
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
                          <span className="text-[11px] text-muted">{job.company?.name || ""}</span>
                          <span className="text-[11px] text-subtle">&middot;</span>
                          <span className="text-[11px] text-muted">{job.location || ""}</span>
                        </div>
                      </div>
                      <div className="hidden sm:block sm:col-span-3 text-[12px] text-muted truncate">
                        {job.company?.name || ""}
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
                No {sub.name.toLowerCase()} jobs in {county} at the moment. Check back soon.
              </p>
            </div>
          )}

          {/* Other counties with jobs in this subcategory */}
          {countiesWithCounts.length > 0 && (
            <div className="mb-10">
              <h2 className="text-[13px] font-semibold text-ink uppercase tracking-wider mb-4">
                {sub.name} Jobs by County
              </h2>
              <div className="flex flex-wrap gap-2">
                {countiesWithCounts.map((c) => {
                  const cSlug = c.countyName
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, "-")
                    .replace(/^-|-$/g, "");
                  return (
                    <Link
                      key={c.countyName}
                      href={`/jobs/category/${slug}/${subSlug}/in-${cSlug}`}
                      className={`text-[12px] font-medium px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5 transition-colors ${
                        cSlug === countySlug
                          ? "bg-accent text-white"
                          : "bg-ink/[0.04] text-ink/70 hover:bg-ink/[0.08] hover:text-ink"
                      }`}
                    >
                      {c.countyName}
                      <span className={`text-[10px] font-mono ${cSlug === countySlug ? "text-white/80" : "text-accent"}`}>
                        {Number(c._count)}
                      </span>
                    </Link>
                  );
                })}
              </div>
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
              All {category.name} jobs in {county} &rarr;
            </Link>
          </div>
        </div>
      </main>
    );
  } catch {
    notFound();
  }
}
