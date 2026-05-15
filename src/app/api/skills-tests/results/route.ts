import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

/**
 * GET /api/skills-tests/results?listingId=xxx
 * Returns all test results for the authenticated user, optionally filtered by listingId.
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const listingId = searchParams.get("listingId") || null;

    const where: Record<string, unknown> = {
      userId: session.user.id,
      status: "COMPLETED",
    };
    if (listingId) {
      where.listingId = listingId;
    }

    const results = await prisma.skillTestResult.findMany({
      where,
      include: {
        test: {
          select: {
            id: true,
            title: true,
            category: true,
            durationMinutes: true,
            passingScore: true,
          },
        },
        listing: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: { completedAt: "desc" },
    });

    return NextResponse.json({
      results: results.map((r) => ({
        id: r.id,
        testId: r.test.id,
        testTitle: r.test.title,
        testCategory: r.test.category,
        testDuration: r.test.durationMinutes,
        score: r.score,
        totalPoints: r.totalPoints,
        maxPoints: r.maxPoints,
        passed: r.passed,
        timeTakenSeconds: r.timeTakenSeconds,
        completedAt: r.completedAt?.toISOString(),
        createdAt: r.createdAt.toISOString(),
        listing: r.listing
          ? { id: r.listing.id, title: r.listing.title }
          : null,
      })),
    });
  } catch (error) {
    console.error("Test results error:", error);
    return NextResponse.json(
      { error: "Failed to fetch test results" },
      { status: 500 },
    );
  }
}
