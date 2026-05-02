import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

function relativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / (1000 * 60));
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);
  if (diffMin < 60) return "Just now";
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return `${Math.floor(diffDay / 7)}w ago`;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = Math.min(Number(searchParams.get("limit")) || 10, 50);
  const page = Number(searchParams.get("page")) || 1;
  const type = searchParams.get("type"); // filter by updateType
  const offset = (page - 1) * limit;

  try {
    const where: Record<string, unknown> = { status: "PUBLISHED" };
    if (type && type !== "ALL") {
      where.updateType = type;
    }

    const [updates, total] = await Promise.all([
      prisma.jobUpdate.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: offset,
      }),
      prisma.jobUpdate.count({ where }),
    ]);

    const items = updates.map((u) => ({
      id: u.id,
      slug: u.slug,
      title: u.title,
      body: u.body,
      source: u.source,
      updateType: u.updateType,
      pdfUrl: u.pdfUrl,
      imageUrl: u.imageUrl,
      listingSlug: u.listingSlug,
      postedBy: u.postedBy,
      date: relativeTime(u.createdAt),
      createdAt: u.createdAt.toISOString(),
    }));

    return NextResponse.json({
      updates: items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("[GET /api/updates] Error:", error);
    return NextResponse.json({ updates: [], pagination: { page: 1, limit, total: 0, totalPages: 0 } });
  }
}
