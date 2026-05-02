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

function deadlineDays(deadline: Date): string {
  const diff = Math.ceil((deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  if (diff <= 0) return "Closed";
  if (diff === 1) return "1 day left";
  if (diff <= 3) return `${diff} days left`;
  return `${diff} days left`;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = Number(searchParams.get("limit")) || 8;

  try {
    // Fetch latest active listings — these ARE the "updates"
    const listings = await prisma.listing.findMany({
      where: { status: "ACTIVE" },
      include: { company: true },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    const updates = listings.map((l) => {
      const isClosingSoon = l.deadline
        ? Math.ceil((l.deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24)) <= 3
        : false;

      return {
        id: l.id,
        title: l.title,
        source: l.company?.name || "Unknown",
        type: isClosingSoon ? "closing" : ("posted" as const),
        date: relativeTime(l.createdAt),
        slug: l.slug,
      };
    });

    return NextResponse.json({ updates });
  } catch (error) {
    console.error("[GET /api/updates] Error:", error);
    return NextResponse.json({ updates: [] });
  }
}
