import Image from "next/image";
import Link from "next/link";
import SectionNumber from "./SectionNumber";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function CareerResources() {
  // Fetch real articles from DB
  const articles = await prisma.article
    .findMany({
      where: { status: "PUBLISHED" },
      orderBy: { publishedAt: "desc" },
      take: 6,
    })
    .catch(() => []);

  // First article is the featured hero, rest are sidebar list
  const featured = articles[0] || null;
  const sidebar = articles.slice(1, 6);

  return (
    <section className="py-14 relative overflow-hidden">
      <SectionNumber num="10" />
      <div className="max-w-6xl mx-auto px-5 relative">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading text-xl font-bold">Career Resources</h2>
          <Link
            href="/articles"
            className="text-[11px] font-mono text-muted hover:text-ink transition-colors uppercase tracking-wider"
          >
            All articles &rarr;
          </Link>
        </div>

        {articles.length === 0 ? (
          /* Fallback when no articles in DB */
          <div className="rounded-xl border border-divider bg-white p-8 text-center">
            <p className="text-sm text-muted">
              Career resources coming soon. Check back for expert advice on CV writing,
              interview tips, and salary negotiation.
            </p>
            <Link
              href="/articles"
              className="inline-block mt-4 text-[13px] font-medium text-accent hover:text-accent-dark transition-colors"
            >
              Browse Articles &rarr;
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-5 gap-8">
            {/* Featured article card */}
            {featured && (
              <Link
                href={`/articles/${featured.slug}`}
                className="md:col-span-3 group"
              >
                <div className="aspect-[16/9] bg-subtle rounded-xl overflow-hidden border border-divider">
                  {featured.coverImage ? (
                    <Image
                      src={featured.coverImage}
                      alt={featured.title}
                      width={800}
                      height={450}
                      unoptimized
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <Image
                      src="https://picsum.photos/seed/jobready-featured/800/450.jpg"
                      alt={featured.title}
                      width={800}
                      height={450}
                      unoptimized
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  )}
                </div>
                <div className="mt-4 border-t border-divider pt-4">
                  <span className="font-mono text-[10px] text-accent uppercase tracking-widest">
                    {featured.category}
                  </span>
                  <h3 className="font-heading text-xl font-bold mt-1.5 group-hover:text-accent-dark transition-colors">
                    {featured.title}
                  </h3>
                  <p className="text-[13px] text-muted mt-2 leading-relaxed line-clamp-2">
                    {featured.excerpt}
                  </p>
                </div>
              </Link>
            )}

            {/* Sidebar article list */}
            <div className="md:col-span-2">
              <div className="space-y-0 divide-y divide-divider">
                {sidebar.map((article, i) => (
                  <Link
                    key={article.id}
                    href={`/articles/${article.slug}`}
                    className={`block py-4 group ${i === 0 ? "first:pt-0" : ""} ${
                      i === sidebar.length - 1 ? "last:pb-0" : ""
                    }`}
                  >
                    <h4 className="text-sm font-medium group-hover:text-accent transition-colors">
                      {article.title}
                    </h4>
                    <span className="font-mono text-[11px] text-muted mt-1 block">
                      {article.readTime} min read &middot; {article.category}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
