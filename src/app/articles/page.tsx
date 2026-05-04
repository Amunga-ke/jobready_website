import type { Metadata } from "next";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { SeoPageHeader } from "@/components/jobready/SeoPageLayout";
import { Clock, ArrowRight, BookOpen, TrendingUp } from "lucide-react";
import { BreadcrumbJsonLd, CollectionPageJsonLd } from "@/components/jobready/JsonLd";
import AdSlot from "@/components/jobready/AdSlot";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Career Resources & Articles | JobReady",
  description:
    "Expert career advice for Kenyan job seekers. CV writing tips, interview preparation, salary negotiation guides and career growth strategies.",
  alternates: { canonical: "https://jobreadyke.co.ke/articles" },
  openGraph: {
    title: "Career Resources & Articles | JobReady",
    description:
      "Expert career advice for Kenyan job seekers. CV writing tips, interview preparation and salary guides.",
    url: "https://jobreadyke.co.ke/articles",
    siteName: "JobReady",
    type: "website",
    images: [{ url: "https://jobreadyke.co.ke/opengraph-image.png", width: 1200, height: 630, alt: "JobReady" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Career Resources & Articles | JobReady",
    description:
      "Expert career advice for Kenyan job seekers. CV writing tips, interview preparation and salary guides.",
  },
};

/* ── Fetch all published articles ── */
async function getArticles() {
  const articles = await prisma.article.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
    take: 50,
  }).catch(() => []);

  return articles;
}

/* ── Fetch articles by category ── */
async function getArticlesByCategory(category: string) {
  const articles = await prisma.article.findMany({
    where: { status: "PUBLISHED", category },
    orderBy: { publishedAt: "desc" },
    take: 50,
  }).catch(() => []);

  return articles;
}

/* ── Get category distribution ── */
async function getCategoryCounts() {
  const rows = await prisma.$queryRaw<Array<{ category: string; _count: bigint }>>`
    SELECT category, COUNT(*) as _count
    FROM Article
    WHERE status = 'PUBLISHED'
    GROUP BY category
    ORDER BY _count DESC
  `.catch(() => []);

  return rows.map((r) => ({ category: r.category, count: Number(r._count) }));
}

/* ── Format date ── */
function formatDate(date: Date) {
  return date.toLocaleDateString("en-KE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

interface ArticlesPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function ArticlesPage({ searchParams }: ArticlesPageProps) {
  const params = await searchParams;
  const activeCategory = params.category ? decodeURIComponent(params.category) : null;

  const [articles, categoryCounts] = await Promise.all([
    activeCategory ? getArticlesByCategory(activeCategory) : getArticles(),
    getCategoryCounts(),
  ]);

  const featured = articles.filter((a) => a.featured);
  const latest = articles.filter((a) => !a.featured);

  const categories = [...new Map(categoryCounts.map((c) => [c.category, c])).values()];

  return (
    <main className="bg-surface">
      <BreadcrumbJsonLd items={[{ name: "Home", url: "https://jobreadyke.co.ke/" }, { name: "Resources", url: "https://jobreadyke.co.ke/articles" }]} />
      <CollectionPageJsonLd name="Career Resources & Articles" description="Expert career advice for Kenyan job seekers" url="https://jobreadyke.co.ke/articles" numberOfItems={articles.length} />
      <div className="max-w-6xl mx-auto px-5 py-8 md:py-12">
        <SeoPageHeader
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Resources", href: "/articles" },
            ...(activeCategory ? [{ label: activeCategory, href: `/articles?category=${encodeURIComponent(activeCategory)}` }] : []),
          ]}
          title={activeCategory ? `${activeCategory} Articles | JobReady` : "Career Resources & Articles"}
          description={activeCategory ? `Browse ${activeCategory} articles for Kenyan job seekers.` : "Expert career advice for Kenyan job seekers. CV writing, interview tips, salary guides, and professional development strategies to advance your career."}
        />

        {/* ── Active category indicator ── */}
        {activeCategory && (
          <div className="mb-6 flex items-center gap-3">
            <span className="text-[13px] text-muted">Showing articles in:</span>
            <span className="text-[13px] font-semibold text-ink bg-accent-bg text-accent px-3 py-1 rounded-lg">
              {activeCategory}
            </span>
            <Link href="/articles" className="text-[12px] text-muted hover:text-ink transition-colors underline">
              Clear filter
            </Link>
          </div>
        )}

        {/* ── Featured articles (hero grid) ── */}
        {featured.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-accent" />
              <h2 className="text-[13px] font-semibold text-ink uppercase tracking-wider">
                Featured Articles
              </h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {featured.map((article) => (
                <Link
                  key={article.slug}
                  href={`/articles/${article.slug}`}
                  className="group rounded-xl border border-divider hover:border-accent/30 overflow-hidden bg-white transition-all hover:shadow-md"
                >
                  {/* Cover image placeholder */}
                  <div className="h-40 bg-gradient-to-br from-accent/10 to-accent/5 flex items-center justify-center">
                    <BookOpen className="w-10 h-10 text-accent/40" />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-accent-bg text-accent">
                        {article.category}
                      </span>
                      {article.featured && (
                        <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-amber-50 text-amber-600">
                          Featured
                        </span>
                      )}
                    </div>
                    <h3 className="text-[15px] font-heading font-bold text-ink group-hover:text-accent transition-colors mb-2 line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-[13px] text-muted line-clamp-2 mb-3">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-[11px] text-muted">
                      <span>{formatDate(article.publishedAt)}</span>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{article.readTime} min read</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Ad slot between featured and latest */}
        <div className="mb-8">
          <AdSlot format="auto" style={{ display: 'block', minHeight: '90px' }} />
        </div>

        {/* ── Latest articles ── */}
        {latest.length > 0 && (
          <div className="mb-10">
            <h2 className="text-[13px] font-semibold text-ink uppercase tracking-wider mb-4">
              Latest Articles
            </h2>
            <div className="divide-y divide-divider rounded-xl border border-divider bg-white overflow-hidden">
              {latest.map((article) => (
                <Link
                  key={article.slug}
                  href={`/articles/${article.slug}`}
                  className="group flex flex-col sm:flex-row sm:items-center gap-3 px-5 py-4 hover:bg-ink/[0.02] transition-colors"
                >
                  {/* Category badge */}
                  <div className="shrink-0 sm:w-32">
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-ink/[0.04] text-ink/60">
                      {article.category}
                    </span>
                  </div>

                  {/* Title & excerpt */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[14px] font-medium text-ink group-hover:text-accent transition-colors line-clamp-1">
                      {article.title}
                    </h3>
                    <p className="text-[12px] text-muted line-clamp-1 mt-0.5">
                      {article.excerpt}
                    </p>
                  </div>

                  {/* Meta */}
                  <div className="flex items-center gap-4 shrink-0 text-[11px] text-muted">
                    <span>{formatDate(article.publishedAt)}</span>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{article.readTime} min</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-muted group-hover:text-accent transition-colors sm:hidden" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Ad slot above categories */}
        <div className="mb-8">
          <AdSlot format="auto" style={{ display: 'block', minHeight: '90px' }} />
        </div>

        {/* ── Browse by category ── */}
        {categories.length > 0 && (
          <div className="mb-10">
            <h2 className="text-[13px] font-semibold text-ink uppercase tracking-wider mb-4">
              Browse by Category
            </h2>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <Link
                  key={cat.category}
                  href={`/articles?category=${encodeURIComponent(cat.category)}`}
                  className="text-[12px] font-medium px-3 py-1.5 rounded-lg bg-ink/[0.04] text-ink/70 hover:bg-ink/[0.08] hover:text-ink transition-colors"
                >
                  {cat.category}
                  <span className="ml-1.5 font-mono text-[11px] text-accent">{cat.count}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ── Career resources CTA ── */}
        <div className="rounded-xl border border-divider p-6 bg-white">
          <h2 className="text-[15px] font-heading font-bold text-ink mb-2">
            Need More Help With Your Job Search?
          </h2>
          <p className="text-[13px] text-muted mb-4">
            Explore our tools and resources designed to help Kenyan job seekers find and land their dream jobs.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/jobs"
              className="inline-flex items-center gap-1.5 text-[13px] font-medium px-4 py-2 rounded-lg bg-accent text-white hover:bg-accent-dark transition-colors"
            >
              Browse Jobs
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/salary-guide"
              className="inline-flex items-center gap-1.5 text-[13px] font-medium px-4 py-2 rounded-lg border border-divider text-ink/70 hover:bg-ink/[0.04] transition-colors"
            >
              Salary Guide
            </Link>
            <Link
              href="/updates"
              className="inline-flex items-center gap-1.5 text-[13px] font-medium px-4 py-2 rounded-lg border border-divider text-ink/70 hover:bg-ink/[0.04] transition-colors"
            >
              Latest Updates
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
