import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

/**
 * GET /api/cv-match/ranking?listingId=xxx
 *
 * Returns all applications for a listing ranked by CV match score.
 * Requires authentication + EMPLOYER role check.
 *
 * Query: ?listingId=string
 * Returns: Array<{ userId, applicationId, score, aiAnalysis, userName }>
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check employer role
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (!user || user.role !== "EMPLOYER") {
      return NextResponse.json(
        { error: "Forbidden. Employer role required." },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const listingId = searchParams.get("listingId");

    if (!listingId) {
      return NextResponse.json(
        { error: "listingId query parameter is required" },
        { status: 400 }
      );
    }

    // Verify the listing exists and belongs to this employer
    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      select: { companyId: true },
    });

    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    // Fetch ranked CV match scores for this listing
    const matchScores = await prisma.cvMatchScore.findMany({
      where: { listingId },
      include: {
        user: {
          select: { id: true, name: true },
        },
      },
      orderBy: { score: "desc" },
    });

    // Also include applications that don't have scores yet
    const applications = await prisma.application.findMany({
      where: { listingId },
      include: {
        user: { select: { id: true, name: true } },
      },
    });

    // Merge scored and unscored applications
    const scoredUserIds = new Set(matchScores.map((ms) => ms.userId));
    const unscoredApps = applications
      .filter((app) => !scoredUserIds.has(app.userId))
      .map((app) => ({
        userId: app.userId,
        applicationId: app.id,
        score: 0,
        aiAnalysis: "Not yet scored. The candidate has not been evaluated yet.",
        userName: app.user.name,
      }));

    const rankedResults = [
      ...matchScores.map((ms) => ({
        userId: ms.userId,
        applicationId: ms.applicationId || "",
        score: ms.score,
        aiAnalysis: ms.aiAnalysis || "",
        userName: ms.user.name,
      })),
      ...unscoredApps,
    ];

    // Re-sort: scored entries first by score desc, then unscored
    rankedResults.sort((a, b) => {
      if (a.score === 0 && b.score === 0) return 0;
      if (a.score === 0) return 1;
      if (b.score === 0) return -1;
      return b.score - a.score;
    });

    return NextResponse.json({
      listingId,
      totalApplications: applications.length,
      scoredCount: matchScores.length,
      results: rankedResults,
    });
  } catch (error) {
    console.error("[cv-match/ranking] Error:", error);
    return NextResponse.json(
      { error: "Failed to load ranking" },
      { status: 500 }
    );
  }
}
