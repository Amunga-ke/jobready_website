import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import UpdateDetailPage from "./UpdateDetailPage";
import { BreadcrumbJsonLd, ArticleJsonLd } from "@/components/jobready/JsonLd";
import { SITE_URL } from "@/lib/config";

export const revalidate = 300;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const updates = await prisma.jobUpdate.findMany({ where: { status: "PUBLISHED" }, select: { slug: true }, take: 200 }).catch(() => []);
  return updates.map((u) => ({ slug: u.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { slug } = await params;
    const update = await prisma.jobUpdate.findUnique({
      where: { slug, status: "PUBLISHED" },
      select: { title: true, updateType: true, source: true, createdAt: true },
    }).catch(() => null);

    if (!update) return { title: "Update Not Found" };

  return {
    title: `${update.title}`,
    description: `${update.updateType} from ${update.source} — read the full announcement and details on JobReady Kenya.`,
    alternates: { canonical: `${SITE_URL}/updates/${slug}`, languages: { 'en-KE': `${SITE_URL}/updates/${slug}`, 'x-default': `${SITE_URL}/updates/${slug}` } },
    openGraph: {
      title: update.title,
      description: `${update.updateType} from ${update.source}`,
      url: `${SITE_URL}/updates/${slug}`,
      type: "article",
      siteName: "JobReady",
      publishedTime: update.createdAt.toISOString(),
      images: [{ url: `/api/og?title=${encodeURIComponent(update.title)}&description=${encodeURIComponent(update.updateType || "")}&type=article`, width: 1200, height: 630, alt: update.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: update.title,
      description: `${update.updateType} from ${update.source}`,
      images: [`/api/og?title=${encodeURIComponent(update.title)}&description=${encodeURIComponent(update.updateType || "")}&type=article`],
    },
  };
  } catch {
    return { title: "Update Not Found" };
  }
}

export default async function UpdateSlugPage({ params }: Props) {
  const { slug } = await params;

  try {
    const update = await prisma.jobUpdate.findUnique({
      where: { slug, status: "PUBLISHED" },
    });

    if (!update) {
      notFound();
    }

    return (
      <>
        <BreadcrumbJsonLd items={[
          { name: "Home", url: `${SITE_URL}/` },
          { name: "Updates", url: `${SITE_URL}/updates` },
          { name: update.title, url: `${SITE_URL}/updates/${slug}` },
        ]} />
        <ArticleJsonLd
          title={update.title}
          description={update.body || undefined}
          url={`${SITE_URL}/updates/${slug}`}
          datePublished={update.createdAt?.toISOString() || ""}
          author={update.postedBy === "admin" ? "JobReady" : update.postedBy}
        />
        <UpdateDetailPage update={update} />
      </>
    );
  } catch (error) {
    console.error("[UpdateSlugPage] DB error:", error);
    notFound();
  }
}
