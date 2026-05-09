import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import UpdateDetailPage from "./UpdateDetailPage";
import { BreadcrumbJsonLd } from "@/components/jobready/JsonLd";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { slug } = await params;
    const update = await prisma.jobUpdate.findUnique({
      where: { slug, status: "PUBLISHED" },
      select: { title: true, updateType: true, source: true, createdAt: true },
    }).catch(() => null);

    if (!update) return { title: "Update Not Found | JobReady" };

  return {
    title: `${update.title} | JobReady`,
    description: `${update.updateType} from ${update.source} — posted on JobReady Kenya.`,
    alternates: { canonical: `https://jobreadyke.co.ke/updates/${slug}` },
    openGraph: {
      title: update.title,
      description: `${update.updateType} from ${update.source}`,
      url: `https://jobreadyke.co.ke/updates/${slug}`,
      type: "article",
      siteName: "JobReady",
      publishedTime: update.createdAt.toISOString(),
    },
    twitter: {
      card: "summary_large_image",
      title: update.title,
      description: `${update.updateType} from ${update.source}`,
    },
  };
  } catch {
    return { title: "Update Not Found | JobReady" };
  }
}

export default async function UpdateSlugPage({ params }: Props) {
  const { slug } = await params;

  let update = null;
  try {
    update = await prisma.jobUpdate.findUnique({
      where: { slug, status: "PUBLISHED" },
    });
  } catch (error) {
    console.error("[UpdateSlugPage] DB error:", error);
  }

  if (!update) {
    notFound();
  }

  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: "Home", url: "https://jobreadyke.co.ke/" },
        { name: "Updates", url: "https://jobreadyke.co.ke/updates" },
        { name: update.title, url: `https://jobreadyke.co.ke/updates/${slug}` },
      ]} />
      <UpdateDetailPage update={update} />
    </>
  );
}
