import type { Metadata } from "next";
import Link from "next/link";
import { KE_COUNTIES, slugifyCounty, JOB_CATEGORIES } from "@/lib/constants";
import { SeoPageHeader, RichFallback } from "@/components/jobready/SeoPageLayout";
import JobRowClickable from "@/components/jobready/JobRowClickable";
import prisma from "@/lib/prisma";
import { Hammer } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Casual & Part-Time Jobs in Kenya | JobReady",
  description:
    "Find daily-wage, weekend and flexible part-time jobs across Kenya. Browse casual positions in Nairobi, Mombasa, Kisumu and all 47 counties.",
  alternates: { canonical: "https://jobreadyke.co.ke/casual" },
  openGraph: {
    title: "Casual & Part-Time Jobs in Kenya | JobReady",
    description:
      "Find daily-wage, weekend and flexible part-time jobs across Kenya.",
    url: "https://jobreadyke.co.ke/casual",
    siteName: "JobReady",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Casual & Part-Time Jobs in Kenya | JobReady",
    description:
      "Find daily-wage, weekend and flexible part-time jobs across Kenya.",
  },
};

/* ── Fetch casual jobs from DB ── */
async function getCasualData() {
  const [listings, countyCounts, topEmployers, categoryCounts] = await Promise.all([
    prisma.listing.findMany({
      where: { status: "ACTIVE", listingType: "CASUAL" },
      include: {
        company: true,
        category: true,
        subcategory: true,
        tags: { include: { tag: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    }).catch(() => []),
    // County distribution
    prisma.$queryRaw<Array<{ county: string; _count: bigint }>>`
      SELECT county, COUNT(*) as _count
      FROM Listing
      WHERE status = 'ACTIVE' AND listingType = 'CASUAL'
        AND county IS NOT NULL AND county != ''
      GROUP BY county
      ORDER BY _count DESC
      LIMIT 20
    `.catch(() => []),
    // Top employers
    prisma.$queryRaw<Array<{ companyName: string; _count: bigint }>>`
      SELECT c.name as companyName, COUNT(*) as _count
      FROM Listing l
      JOIN Company c ON l.companyId = c.id
      WHERE l.status = 'ACTIVE' AND l.listingType = 'CASUAL'
      GROUP BY c.name
      ORDER BY _count DESC
      LIMIT 8
    `.catch(() => []),
    // Category distribution
    prisma.$queryRaw<Array<{ categoryName: string; _count: bigint }>>`
      SELECT cat.name as categoryName, COUNT(*) as _count
      FROM Listing l
      LEFT JOIN Category cat ON l.categoryId = cat.id
      WHERE l.status = 'ACTIVE' AND l.listingType = 'CASUAL'
      GROUP BY cat.name
      ORDER BY _count DESC
      LIMIT 8
    `.catch(() => []),
  ]);

  return {
    listings,
    countyCounts: countyCounts.map((r) => ({ county: r.county, count: Number(r._count) })),
    topEmployers: topEmployers.map((e) => ({ name: e.companyName, count: Number(e._count) })),
    categoryCounts: categoryCounts.map((c) => ({ name: c.categoryName || "Other", count: Number(c._count) })),
  };
}

export default async function CasualPage() {
  const data = await getCasualData();
  const total = data.listings.length;

  return (
    <main className="bg-surface">
      <div className="max-w-6xl mx-auto px-5 py-8 md:py-12">
        <SeoPageHeader
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Casual & Part-Time", href: "/casual" },
          ]}
          title="Casual & Part-Time Jobs in Kenya"
          description="Daily-wage, weekend and flexible positions across all 47 counties. From construction to hospitality, find short-term work that fits your schedule."
          count={total || undefined}
        />

        {/* ── Recent casual listings ── */}
        {data.listings.length > 0 ? (
          <div className="mb-10">
            <h2 className="text-[13px] font-semibold text-ink uppercase tracking-wider mb-4">
              Latest Casual Listings
            </h2>
            <div className="hidden sm:grid sm:grid-cols-12 gap-4 pb-2 border-b border-divider text-[10px] font-mono text-muted uppercase tracking-widest mb-1">
              <div className="col-span-5">Position</div>
              <div className="col-span-3">Company</div>
              <div className="col-span-2">Location</div>
              <div className="col-span-2 text-right">Pay</div>
            </div>
            <div className="divide-y divide-subtle">
              {data.listings.map((job) => (
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
                      <span className="text-[11px] text-muted">{job.town || job.county || ""}</span>
                    </div>
                  </div>
                  <div className="hidden sm:block sm:col-span-3 text-[12px] text-muted truncate">
                    {job.company?.name || ""}
                  </div>
                  <div className="col-span-6 sm:col-span-2 flex items-center">
                    <span className="text-[11px] text-muted">
                      {job.town || job.county}
                    </span>
                  </div>
                  <div className="col-span-6 sm:col-span-2 flex sm:justify-end items-center">
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
          </div>
        ) : (
          /* ── Rich fallback when no listings ── */
          <div className="mb-10">
            <RichFallback
              listingCount={0}
              nearbyCounties={["Nairobi", "Mombasa", "Kisumu", "Nakuru", "Eldoret", "Thika", "Kiambu", "Machakos"]}
              relatedCategories={JOB_CATEGORIES.slice(0, 6)}
            />

            {/* Salary guidance for casual workers */}
            <div className="mt-6 grid md:grid-cols-2 gap-4">
              <div className="rounded-xl border border-divider p-5">
                <h3 className="text-[13px] font-semibold text-ink mb-3">
                  Casual Salary Guide
                </h3>
                <div className="space-y-2 text-[12px] text-ink/70">
                  <div className="flex justify-between py-1 border-b border-subtle">
                    <span>Construction Labourer</span>
                    <span className="font-mono text-muted">KES 800-1,500/day</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-subtle">
                    <span>Waiter / Waitress</span>
                    <span className="font-mono text-muted">KES 500-1,200/day</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-subtle">
                    <span>Office Assistant</span>
                    <span className="font-mono text-muted">KES 15,000-25,000/mo</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-subtle">
                    <span>Delivery Rider</span>
                    <span className="font-mono text-muted">KES 800-2,000/day</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-subtle">
                    <span>Cleaner / Domestic Help</span>
                    <span className="font-mono text-muted">KES 12,000-20,000/mo</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Farm Worker</span>
                    <span className="font-mono text-muted">KES 600-1,200/day</span>
                  </div>
                </div>
                <p className="text-[11px] text-muted mt-3">
                  Average ranges based on market data across Kenya. Actual pay varies by location and employer.
                </p>
              </div>

              {/* Career tips for casual workers */}
              <div className="rounded-xl border border-divider p-5">
                <h3 className="text-[13px] font-semibold text-ink mb-3">
                  Tips for Casual Job Seekers
                </h3>
                <div className="space-y-3 text-[12px] text-ink/70">
                  <div className="flex gap-2">
                    <span className="text-accent font-bold shrink-0">1.</span>
                    <p><strong>Always have your ID and documents ready.</strong> Most casual employers require a valid national ID, KRA PIN, and sometimes a good conduct certificate.</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-accent font-bold shrink-0">2.</span>
                    <p><strong>Join local WhatsApp and Telegram groups.</strong> Many casual jobs in Kenya are shared through community groups before they appear on job boards.</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-accent font-bold shrink-0">3.</span>
                    <p><strong>Negotiate pay before starting.</strong> Agree on daily or monthly rates, payment schedule, and working hours upfront to avoid disputes.</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-accent font-bold shrink-0">4.</span>
                    <p><strong>Build a reputation.</strong> Reliable casual workers get repeat referrals. Show up on time, do quality work, and maintain professional conduct.</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-accent font-bold shrink-0">5.</span>
                    <p><strong>Know your rights.</strong> Casual workers in Kenya are protected under labour laws. You deserve safe working conditions and fair compensation.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Browse by county ── */}
        <div className="mb-10">
          <h2 className="text-[13px] font-semibold text-ink uppercase tracking-wider mb-4">
            Casual Jobs by County
          </h2>
          <div className="flex flex-wrap gap-2">
            {KE_COUNTIES.map((county) => {
              const countySlug = slugifyCounty(county);
              const cCount = data.countyCounts.find((c) => c.county === county)?.count || 0;
              return (
                <Link
                  key={countySlug}
                  href={`/jobs?type=CASUAL&county=${encodeURIComponent(county)}`}
                  className={`text-[12px] font-medium px-3 py-1.5 rounded-lg transition-colors ${
                    cCount > 0
                      ? "bg-ink/[0.04] text-ink/70 hover:bg-ink/[0.08] hover:text-ink"
                      : "bg-ink/[0.02] text-muted/40"
                  }`}
                >
                  {county}
                  {cCount > 0 && (
                    <span className="ml-1.5 font-mono text-[11px] text-accent">{cCount}</span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* ── Top casual employers ── */}
        {data.topEmployers.length > 0 && (
          <div className="mb-10">
            <h2 className="text-[13px] font-semibold text-ink uppercase tracking-wider mb-4">
              Top Casual Employers
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {data.topEmployers.map((emp) => (
                <Link
                  key={emp.name}
                  href={`/companies`}
                  className="flex items-center justify-between px-4 py-3 rounded-lg border border-divider hover:border-accent/30 hover:bg-accent-bg/50 transition-all group"
                >
                  <span className="text-[12px] font-medium text-ink/80 group-hover:text-ink truncate">
                    {emp.name}
                  </span>
                  <span className="font-mono text-[11px] text-muted ml-2 shrink-0">{emp.count}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ── Browse by category ── */}
        {data.categoryCounts.length > 0 && (
          <div className="mb-10">
            <h2 className="text-[13px] font-semibold text-ink uppercase tracking-wider mb-4">
              Casual Jobs by Category
            </h2>
            <div className="flex flex-wrap gap-2">
              {data.categoryCounts.map((cat) => (
                <Link
                  key={cat.name}
                  href={`/jobs?type=CASUAL&q=${encodeURIComponent(cat.name)}`}
                  className="text-[12px] font-medium px-3 py-1.5 rounded-lg bg-ink/[0.04] text-ink/70 hover:bg-ink/[0.08] hover:text-ink transition-colors"
                >
                  {cat.name}
                  <span className="ml-1.5 font-mono text-[11px] text-accent">{cat.count}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ── How to find casual jobs guide ── */}
        <div className="rounded-xl border border-divider p-6 mb-10">
          <h2 className="text-[15px] font-heading font-bold text-ink mb-2">
            How to Find Casual Jobs in Kenya
          </h2>
          <div className="text-[13px] text-ink/70 space-y-2">
            <p>
              The casual job market in Kenya is vast and largely informal. Whether you are looking for daily-wage work,
              weekend gigs, or part-time positions, there are several channels you can explore to find opportunities
              that match your skills and availability.
            </p>
            <ol className="list-decimal pl-5 space-y-1">
              <li><strong>Online job boards</strong> — Sites like JobReady aggregate casual listings from employers across all 47 counties</li>
              <li><strong>Social media groups</strong> — Facebook and Telegram groups for specific towns often post casual openings daily</li>
              <li><strong>Local notice boards</strong> — Many hardware stores, supermarkets, and community centres post casual job notices</li>
              <li><strong>Labour offices</strong> — County labour offices maintain registers of casual workers available for short-term assignments</li>
              <li><strong>Referrals</strong> — Word of mouth remains the most common way casual workers find repeat employment</li>
            </ol>
            <p>
              Always verify the legitimacy of any job opportunity. Never pay to get a job, and ensure you agree on
              terms before starting work. Casual workers in Kenya are protected under the Employment Act 2007.
            </p>
          </div>
        </div>

        {/* ── Browse all link ── */}
        <div className="text-center py-4">
          <Link
            href="/jobs?type=CASUAL"
            className="inline-flex items-center gap-2 text-[13px] font-medium text-accent hover:text-accent-dark transition-colors"
          >
            Browse all casual & part-time jobs
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </main>
  );
}
