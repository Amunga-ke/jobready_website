import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getCvMatchHistory } from "@/lib/services/cv-matching";

/**
 * GET /api/cv-match/history?page=1&limit=10
 *
 * Returns the current user's CV match score history with pagination.
 * Requires authentication.
 *
 * Query: ?page=number&limit=number
 * Returns: { items, total, page, limit, totalPages }
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1);
    const limit = Math.min(
      50,
      Math.max(1, parseInt(searchParams.get("limit") || "10", 10) || 10)
    );

    const result = await getCvMatchHistory({
      userId: session.user.id,
      page,
      limit,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("[cv-match/history] Error:", error);
    return NextResponse.json(
      { error: "Failed to load match history" },
      { status: 500 }
    );
  }
}
