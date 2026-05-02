import prisma from "@/lib/prisma";

const SITE_URL = "https://jobreadyke.co.ke";
const SITE_TITLE = "JobReady Kenya — Latest Jobs & Updates";
const SITE_DESCRIPTION =
  "Latest job listings, government opportunities, and career updates from Kenya's most trusted job board.";

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function rfc822Date(date: Date): string {
  return date.toUTCString();
}

function truncate(str: string, maxLen: number): string {
  if (!str) return "";
  const clean = str.replace(/<[^>]*>/g, "").trim();
  return clean.length > maxLen ? clean.slice(0, maxLen) + "..." : clean;
}

export async function GET() {
  const [listings, updates] = await Promise.all([
    prisma.listing.findMany({
      where: { status: "ACTIVE" },
      include: {
        company: { select: { name: true } },
        category: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
    prisma.jobUpdate.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
  ]);

  const jobItems = listings
    .map(
      (job) => `
    <item>
      <title><![CDATA[${escapeXml(job.title)}]]></title>
      <link>${SITE_URL}/jobs/${job.slug}</link>
      <description><![CDATA[${escapeXml(truncate(job.description, 200))}]]></description>
      <category><![CDATA[${escapeXml(job.category?.name || job.listingType)}]]></category>
      <pubDate>${rfc822Date(job.createdAt)}</pubDate>
      <guid isPermaLink="true">${SITE_URL}/jobs/${job.slug}</guid>
    </item>`
    )
    .join("");

  const updateItems = updates
    .map(
      (update) => `
    <item>
      <title><![CDATA[${escapeXml(update.title)}]]></title>
      <link>${SITE_URL}/updates/${update.slug}</link>
      <description><![CDATA[${escapeXml(truncate(update.body || "", 200))}]]></description>
      <category><![CDATA[${escapeXml(update.updateType)}]]></category>
      <pubDate>${rfc822Date(update.createdAt)}</pubDate>
      <guid isPermaLink="true">${SITE_URL}/updates/${update.slug}</guid>
    </item>`
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_TITLE)}</title>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <link>${SITE_URL}</link>
    <language>en-ke</language>
    <copyright>JobReady Kenya</copyright>
    <lastBuildDate>${rfc822Date(new Date())}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
    ${jobItems}
    ${updateItems}
  </channel>
</rss>`;

  return new Response(xml.trim(), {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600",
    },
  });
}
