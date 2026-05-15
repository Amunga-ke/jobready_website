import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * GET /api/skills-tests/available?listingId=xxx
 * Public endpoint — returns tests attached to a listing (or all active tests)
 * Does NOT expose questions or correct answers.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const listingId = searchParams.get("listingId");

    let tests;

    if (listingId) {
      // Return tests specifically attached to this listing
      const listingTests = await prisma.listingTest.findMany({
        where: { listingId },
        include: {
          test: {
            select: {
              id: true,
              title: true,
              description: true,
              category: true,
              durationMinutes: true,
              questionCount: true,
              passingScore: true,
              isActive: true,
              _count: { select: { results: true } },
            },
          },
        },
      });

      tests = listingTests
        .filter((lt) => lt.test.isActive)
        .map((lt) => ({
          testId: lt.test.id,
          title: lt.test.title,
          description: lt.test.description,
          category: lt.test.category,
          duration: lt.test.durationMinutes,
          questionCount: lt.test.questionCount,
          passingScore: lt.test.passingScore,
          isRequired: lt.isRequired,
          minScore: lt.minScore,
          timesCompleted: lt.test._count.results,
        }));
    } else {
      // Return all active tests
      const allTests = await prisma.skillTest.findMany({
        where: { isActive: true },
        select: {
          id: true,
          title: true,
          description: true,
          category: true,
          durationMinutes: true,
          questionCount: true,
          passingScore: true,
          _count: { select: { results: true } },
        },
        orderBy: { createdAt: "desc" },
      });

      tests = allTests.map((t) => ({
        testId: t.id,
        title: t.title,
        description: t.description,
        category: t.category,
        duration: t.durationMinutes,
        questionCount: t.questionCount,
        passingScore: t.passingScore,
        isRequired: null,
        minScore: null,
        timesCompleted: t._count.results,
      }));
    }

    return NextResponse.json({ tests });
  } catch (error) {
    console.error("Available tests error:", error);
    return NextResponse.json(
      { error: "Failed to fetch available tests" },
      { status: 500 },
    );
  }
}
