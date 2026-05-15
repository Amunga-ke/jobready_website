import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { scoreCvMatch } from "@/lib/services/cv-matching";

/**
 * POST /api/cv-match/score
 *
 * Scores how well the current user's CV matches a job listing.
 * Requires authentication.
 *
 * Body: { listingId: string }
 * Returns: { score, breakdown, aiAnalysis }
 */
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { listingId } = body as { listingId?: string };

    if (!listingId) {
      return NextResponse.json(
        { error: "listingId is required" },
        { status: 400 }
      );
    }

    const result = await scoreCvMatch({
      userId: session.user.id,
      listingId,
    });

    return NextResponse.json({
      score: result.score,
      breakdown: result.breakdown,
      aiAnalysis: result.aiAnalysis,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";

    // Handle specific errors
    if (msg === "Listing not found") {
      return NextResponse.json({ error: msg }, { status: 404 });
    }

    console.error("[cv-match/score] Error:", error);
    return NextResponse.json(
      { error: "Failed to score CV match" },
      { status: 500 }
    );
  }
}
