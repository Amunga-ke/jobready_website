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
  const limit = Number(searchParams.get("limit")) || 8;

  try {
    const updates = await prisma.jobUpdate.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    const items = updates.map((u) => {
      // Map DB updateType to the frontend display type
      let displayType: "posted" | "shortlisted" | "deadline" | "closing" = "posted";
      if (u.updateType === "SHORTLISTED") displayType = "shortlisted";
      else if (u.updateType === "CLOSING_SOON") displayType = "closing";
      else if (u.updateType === "DEADLINE_PASSED") displayType = "deadline";
      else displayType = "posted";

      return {
        id: u.id,
        title: u.title,
        body: u.body,
        source: u.source,
        type: displayType,
        date: relativeTime(u.createdAt),
        slug: u.listingSlug || "",
        createdAt: u.createdAt.toISOString(),
      };
    });

    return NextResponse.json({ updates: items });
  } catch (error) {
    console.error("[GET /api/updates] Error:", error);
    return NextResponse.json({ updates: [] });
  }
}
