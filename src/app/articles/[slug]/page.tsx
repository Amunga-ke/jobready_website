import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { Clock, ArrowLeft, ArrowRight, Calendar, User, BookOpen } from "lucide-react";
import ArticleShareButton from "@/components/jobready/ArticleShareButton";

/* ── Generate static params for known slugs ── */
export async function generateStaticParams() {
  const articles = await prisma.article.findMany({
    where: { status: "PUBLISHED" },
    select: { slug: true },
    take: 100,
  }).catch(() => []);

  return articles.map((a) => ({ slug: a.slug }));
}

/* ── Dynamic metadata ── */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await prisma.article.findUnique({
    where: { slug, status: "PUBLISHED" },
    select: {
      title: true,
      excerpt: true,
      coverImage: true,
      category: true,
      publishedAt: true,
    },
  }).catch(() => null);

  if (!article) return { title: "Article Not Found | JobReady" };

  const ogUrl = `https://jobreadyke.co.ke/articles/${slug}`;

  return {
    title: `${article.title} | JobReady`,
    description: article.excerpt,
    alternates: { canonical: ogUrl },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      url: ogUrl,
      siteName: "JobReady",
      type: "article",
      publishedTime: article.publishedAt.toISOString(),
      section: article.category,
      ...(article.coverImage && { images: [{ url: article.coverImage }] }),
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      ...(article.coverImage && { images: [article.coverImage] }),
    },
  };
}

/* ── Format date ── */
function formatDate(date: Date) {
  return date.toLocaleDateString("en-KE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/* ── Simple markdown-to-HTML converter ── */
function renderMarkdown(body: string) {
  const lines = body.split("\n");
  const elements: { type: string; content: string; items?: string[]; rows?: string[][] }[] = [];
  let currentList: string[] = [];
  let listType = "";
  let currentRows: string[][] = [];
  let inTable = false;

  for (const line of lines) {
    const trimmed = line.trim();

    // Table detection
    if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
      if (!inTable) {
        inTable = true;
        currentRows = [];
      }
      if (trimmed.replace(/[\|\-\s]/g, "") === "") continue;
      const cells = trimmed.split("|").filter((c) => c.trim() !== "").map((c) => c.trim());
      currentRows.push(cells);
      continue;
    } else if (inTable) {
      elements.push({ type: "table", content: "", rows: [...currentRows] });
      inTable = false;
      currentRows = [];
    }

    // Headings
    if (trimmed.startsWith("## ")) {
      flushList();
      elements.push({ type: "h2", content: trimmed.slice(3) });
      continue;
    }
    if (trimmed.startsWith("### ")) {
      flushList();
      elements.push({ type: "h3", content: trimmed.slice(4) });
      continue;
    }
    if (trimmed.startsWith("#### ")) {
      flushList();
      elements.push({ type: "h4", content: trimmed.slice(5) });
      continue;
    }

    // Ordered list
    if (/^\d+\.\s/.test(trimmed)) {
      if (listType !== "ol") {
        flushList();
        listType = "ol";
      }
      currentList.push(trimmed.replace(/^\d+\.\s/, ""));
      continue;
    }

    // Unordered list
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      if (listType !== "ul") {
        flushList();
        listType = "ul";
      }
      currentList.push(trimmed.slice(2));
      continue;
    }

    // Checkbox list
    if (trimmed.startsWith("- [ ] ") || trimmed.startsWith("- [x] ")) {
      if (listType !== "check") {
        flushList();
        listType = "check";
      }
      currentList.push(trimmed);
      continue;
    }

    // Blockquote
    if (trimmed.startsWith("> ")) {
      flushList();
      elements.push({ type: "blockquote", content: trimmed.slice(2) });
      continue;
    }

    // Empty line
    if (trimmed === "") {
      flushList();
      if (inTable) {
        elements.push({ type: "table", content: "", rows: [...currentRows] });
        inTable = false;
        currentRows = [];
      }
      continue;
    }

    // Horizontal rule
    if (trimmed === "---" || trimmed === "***") {
      flushList();
      elements.push({ type: "hr", content: "" });
      continue;
    }

    // Paragraph
    flushList();
    elements.push({ type: "p", content: trimmed });
  }

  flushList();
  if (inTable) {
    elements.push({ type: "table", content: "", rows: [...currentRows] });
  }

  return elements;

  function flushList() {
    if (currentList.length > 0) {
      elements.push({ type: listType, content: "", items: [...currentList] });
      currentList = [];
      listType = "";
    }
  }
}

/* ── Render inline markdown (bold, italic, code) ── */
function renderInline(text: string) {
  const parts: { text: string; bold: boolean; italic: boolean; code: boolean }[] = [];
  let remaining = text;

  while (remaining.length > 0) {
    const codeMatch = remaining.match(/^`([^`]+)`/);
    if (codeMatch) {
      parts.push({ text: codeMatch[1], bold: false, italic: false, code: true });
      remaining = remaining.slice(codeMatch[0].length);
      continue;
    }

    const biMatch = remaining.match(/^\*\*\*([^*]+)\*\*\*/);
    if (biMatch) {
      parts.push({ text: biMatch[1], bold: true, italic: true, code: false });
      remaining = remaining.slice(biMatch[0].length);
      continue;
    }

    const bMatch = remaining.match(/^\*\*([^*]+)\*\*/);
    if (bMatch) {
      parts.push({ text: bMatch[1], bold: true, italic: false, code: false });
      remaining = remaining.slice(bMatch[0].length);
      continue;
    }

    const iMatch = remaining.match(/^\*([^*]+)\*/);
    if (iMatch) {
      parts.push({ text: iMatch[1], bold: false, italic: true, code: false });
      remaining = remaining.slice(iMatch[0].length);
      continue;
    }

    const nextSpecial = remaining.search(/[*`]/);
    if (nextSpecial === -1) {
      parts.push({ text: remaining, bold: false, italic: false, code: false });
      remaining = "";
    } else {
      parts.push({ text: remaining.slice(0, nextSpecial), bold: false, italic: false, code: false });
      remaining = remaining.slice(nextSpecial);
    }
  }

  return parts.map((part, i) => {
    const className = [
      part.code && "bg-ink/[0.06] px-1.5 py-0.5 rounded text-[13px] font-mono",
      part.bold && "font-semibold",
      part.italic && "italic",
    ].filter(Boolean).join(" ");

    return <span key={i} className={className || undefined}>{part.text}</span>;
  });
}

/* ── Article detail page ── */
export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const article = await prisma.article.findUnique({
    where: { slug, status: "PUBLISHED" },
  }).catch(() => null);

  if (!article) {
    notFound();
  }

  // Get related articles (same category, different slug)
  const related = await prisma.article.findMany({
    where: {
      status: "PUBLISHED",
      category: article.category,
      slug: { not: article.slug },
    },
    orderBy: { publishedAt: "desc" },
    take: 3,
    select: {
      slug: true,
      title: true,
      excerpt: true,
      category: true,
      readTime: true,
      publishedAt: true,
    },
  }).catch(() => []);

  // Get all categories for sidebar
  const allCategories = await prisma.$queryRaw<Array<{ category: string; _count: bigint }>>`
    SELECT category, COUNT(*) as _count
    FROM Article
    WHERE status = 'PUBLISHED'
    GROUP BY category
    ORDER BY _count DESC
  `.catch(() => []);

  const parsedContent = renderMarkdown(article.body);

  return (
    <main className="bg-surface min-h-screen">
      <div className="max-w-6xl mx-auto px-5 py-8 md:py-12">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1.5 text-[12px] text-muted mb-6 flex-wrap">
          <Link href="/" className="hover:text-ink transition-colors">Home</Link>
          <span className="text-divider">/</span>
          <Link href="/articles" className="hover:text-ink transition-colors">Resources</Link>
          <span className="text-divider">/</span>
          <Link href={`/articles?category=${encodeURIComponent(article.category)}`} className="hover:text-ink transition-colors">
            {article.category}
          </Link>
          <span className="text-divider">/</span>
          <span className="text-ink font-medium truncate max-w-[200px]">{article.title}</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* ── Main content ── */}
          <article className="flex-1 min-w-0">
            {/* Article header */}
            <div className="bg-white rounded-xl border border-divider p-6 md:p-8 mb-6">
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <span className="text-[11px] font-medium px-2.5 py-1 rounded-md bg-accent-bg text-accent">
                  {article.category}
                </span>
                {article.featured && (
                  <span className="text-[11px] font-medium px-2.5 py-1 rounded-md bg-amber-50 text-amber-600">
                    Featured
                  </span>
                )}
                {article.tags && (
                  <span className="text-[11px] text-muted hidden sm:inline">
                    {article.tags.split(",").map((t) => t.trim()).join(" · ")}
                  </span>
                )}
              </div>

              <h1 className="text-2xl md:text-3xl font-heading font-black text-ink leading-tight mb-4">
                {article.title}
              </h1>

              <p className="text-[15px] text-muted leading-relaxed mb-5">
                {article.excerpt}
              </p>

              {/* Meta bar */}
              <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-divider text-[12px] text-muted">
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" />
                  <span className="font-medium text-ink/70">{article.author}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{formatDate(article.publishedAt)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{article.readTime} min read</span>
                </div>
              </div>
            </div>

            {/* Article body */}
            <div className="bg-white rounded-xl border border-divider p-6 md:p-8 mb-6">
              <div>
                {parsedContent.map((element, i) => {
                  switch (element.type) {
                    case "h2":
                      return (
                        <h2 key={i} className="text-xl font-heading font-bold text-ink mt-8 mb-3 first:mt-0">
                          {renderInline(element.content)}
                        </h2>
                      );
                    case "h3":
                      return (
                        <h3 key={i} className="text-[17px] font-heading font-bold text-ink mt-6 mb-2">
                          {renderInline(element.content)}
                        </h3>
                      );
                    case "h4":
                      return (
                        <h4 key={i} className="text-[15px] font-semibold text-ink mt-5 mb-2">
                          {renderInline(element.content)}
                        </h4>
                      );
                    case "p":
                      return (
                        <p key={i} className="text-[14px] text-ink/80 leading-relaxed mb-4">
                          {renderInline(element.content)}
                        </p>
                      );
                    case "blockquote":
                      return (
                        <blockquote key={i} className="border-l-4 border-accent pl-4 py-2 my-4 bg-accent-bg/30 rounded-r-lg">
                          <p className="text-[14px] text-ink/70 italic leading-relaxed">
                            {renderInline(element.content)}
                          </p>
                        </blockquote>
                      );
                    case "ul":
                      return (
                        <ul key={i} className="space-y-2 my-4 ml-4">
                          {element.items?.map((item, j) => (
                            <li key={j} className="text-[14px] text-ink/80 leading-relaxed flex gap-2">
                              <span className="text-accent shrink-0 mt-1">•</span>
                              <span>{renderInline(item)}</span>
                            </li>
                          ))}
                        </ul>
                      );
                    case "ol":
                      return (
                        <ol key={i} className="space-y-2 my-4 ml-4">
                          {element.items?.map((item, j) => (
                            <li key={j} className="text-[14px] text-ink/80 leading-relaxed flex gap-2">
                              <span className="text-accent font-semibold shrink-0">{j + 1}.</span>
                              <span>{renderInline(item)}</span>
                            </li>
                          ))}
                        </ol>
                      );
                    case "check":
                      return (
                        <ul key={i} className="space-y-2 my-4 ml-4">
                          {element.items?.map((item, j) => {
                            const checked = item.startsWith("- [x] ");
                            const text = checked ? item.slice(6) : item.slice(6);
                            return (
                              <li key={j} className="text-[14px] text-ink/80 leading-relaxed flex gap-2">
                                <span className={`shrink-0 mt-0.5 w-4 h-4 rounded border flex items-center justify-center text-[10px] ${checked ? "bg-accent border-accent text-white" : "border-divider"}`}>
                                  {checked && "\u2713"}
                                </span>
                                <span>{renderInline(text)}</span>
                              </li>
                            );
                          })}
                        </ul>
                      );
                    case "hr":
                      return <hr key={i} className="my-6 border-divider" />;
                    case "table":
                      return (
                        <div key={i} className="overflow-x-auto my-4">
                          <table className="w-full text-[13px] border border-divider rounded-lg overflow-hidden">
                            <thead>
                              <tr className="bg-ink/[0.03]">
                                {element.rows?.[0]?.map((cell, j) => (
                                  <th key={j} className="text-left px-4 py-2.5 font-semibold text-ink border-b border-divider">
                                    {cell}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {element.rows?.slice(1).map((row, j) => (
                                <tr key={j} className="hover:bg-ink/[0.02]">
                                  {row.map((cell, k) => (
                                    <td key={k} className="px-4 py-2.5 text-ink/70 border-b border-subtle">
                                      {renderInline(cell)}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      );
                    default:
                      return null;
                  }
                })}
              </div>
            </div>

            {/* Share + Tags */}
            <div className="bg-white rounded-xl border border-divider p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex flex-wrap gap-2">
                {article.tags?.split(",").map((tag) => tag.trim()).filter(Boolean).map((tag) => (
                  <Link
                    key={tag}
                    href={`/articles?category=${encodeURIComponent(article.category)}`}
                    className="text-[11px] font-medium px-2.5 py-1 rounded-md bg-ink/[0.04] text-ink/50 hover:bg-ink/[0.08] hover:text-ink/70 transition-colors"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
              <ArticleShareButton url={`https://jobreadyke.co.ke/articles/${article.slug}`} />
            </div>
          </article>

          {/* ── Sidebar ── */}
          <aside className="lg:w-80 shrink-0 space-y-6">
            {/* Back to articles */}
            <Link
              href="/articles"
              className="flex items-center gap-2 text-[13px] font-medium text-ink/60 hover:text-accent transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              All Resources
            </Link>

            {/* Categories */}
            {allCategories.length > 0 && (
              <div className="bg-white rounded-xl border border-divider p-5">
                <h3 className="text-[13px] font-semibold text-ink uppercase tracking-wider mb-3">
                  Categories
                </h3>
                <div className="space-y-1">
                  {allCategories.map((cat) => (
                    <Link
                      key={cat.category}
                      href={`/articles?category=${encodeURIComponent(cat.category)}`}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg text-[12px] transition-colors ${
                        cat.category === article.category
                          ? "bg-accent-bg text-accent font-medium"
                          : "text-ink/60 hover:bg-ink/[0.04] hover:text-ink"
                      }`}
                    >
                      <span>{cat.category}</span>
                      <span className="font-mono text-[11px] text-muted">{Number(cat._count)}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Related articles */}
            {related.length > 0 && (
              <div className="bg-white rounded-xl border border-divider p-5">
                <h3 className="text-[13px] font-semibold text-ink uppercase tracking-wider mb-3">
                  Related Articles
                </h3>
                <div className="space-y-3">
                  {related.map((r) => (
                    <Link
                      key={r.slug}
                      href={`/articles/${r.slug}`}
                      className="group block"
                    >
                      <h4 className="text-[13px] font-medium text-ink/80 group-hover:text-accent transition-colors line-clamp-2">
                        {r.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-muted">
                        <span>{r.readTime} min</span>
                        <span>·</span>
                        <span>{formatDate(r.publishedAt)}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="rounded-xl border border-accent/20 bg-accent-bg/30 p-5">
              <BookOpen className="w-6 h-6 text-accent mb-3" />
              <h3 className="text-[14px] font-heading font-bold text-ink mb-1">
                Ready to Apply?
              </h3>
              <p className="text-[12px] text-muted mb-3">
                Put your new knowledge into practice. Browse the latest job openings across Kenya.
              </p>
              <Link
                href="/jobs"
                className="inline-flex items-center gap-1.5 text-[13px] font-medium text-accent hover:text-accent-dark transition-colors"
              >
                Browse Jobs
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
