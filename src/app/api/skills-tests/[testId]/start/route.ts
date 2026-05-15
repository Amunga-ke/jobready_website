import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

/**
 * POST /api/skills-tests/[testId]/start?listingId=xxx
 * Requires authentication.
 * Checks for existing completed result; if found, returns it.
 * Otherwise creates an IN_PROGRESS result and returns shuffled questions (no answers).
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ testId: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { testId } = await params;
    const { searchParams } = new URL(req.url);
    const listingId = searchParams.get("listingId") || null;

    // Verify the test exists and is active
    const test = await prisma.skillTest.findUnique({
      where: { id: testId },
    });

    if (!test || !test.isActive) {
      return NextResponse.json(
        { error: "Test not found or inactive" },
        { status: 404 },
      );
    }

    // If listingId is provided, verify the listing exists
    if (listingId) {
      const listing = await prisma.listing.findUnique({
        where: { id: listingId },
        select: { id: true },
      });
      if (!listing) {
        return NextResponse.json(
          { error: "Listing not found" },
          { status: 404 },
        );
      }
    }

    // Check if user already completed this test for this listing
    const existingResult = await prisma.skillTestResult.findFirst({
      where: {
        testId,
        userId: session.user.id,
        listingId,
        status: "COMPLETED",
      },
    });

    if (existingResult) {
      return NextResponse.json({
        alreadyCompleted: true,
        testResultId: existingResult.id,
        score: existingResult.score,
        passed: existingResult.passed,
        timeTakenSeconds: existingResult.timeTakenSeconds,
        completedAt: existingResult.completedAt?.toISOString(),
      });
    }

    // Check for an in-progress attempt
    const inProgressResult = await prisma.skillTestResult.findFirst({
      where: {
        testId,
        userId: session.user.id,
        listingId,
        status: "IN_PROGRESS",
      },
    });

    if (inProgressResult) {
      // Return the same test result ID so the user can continue/resubmit
      const questions = await prisma.skillTestQuestion.findMany({
        where: { testId },
        orderBy: { sortOrder: "asc" },
      });

      return NextResponse.json({
        alreadyCompleted: false,
        resumed: true,
        testResultId: inProgressResult.id,
        testId,
        durationMinutes: test.durationMinutes,
        questions: questions.map((q) => ({
          id: q.id,
          question: q.question,
          questionType: q.questionType,
          options: JSON.parse(q.options),
          points: q.points,
        })),
      });
    }

    // Create IN_PROGRESS result
    const testResult = await prisma.skillTestResult.create({
      data: {
        testId,
        userId: session.user.id,
        listingId,
        status: "IN_PROGRESS",
        score: 0,
        totalPoints: 0,
        maxPoints: 0,
        answers: "[]",
        timeTakenSeconds: 0,
        passed: false,
      },
    });

    // Fetch questions and shuffle order (without correct answers)
    const questions = await prisma.skillTestQuestion.findMany({
      where: { testId },
      orderBy: { sortOrder: "asc" },
    });

    // Fisher-Yates shuffle
    const shuffled = [...questions];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return NextResponse.json({
      alreadyCompleted: false,
      resumed: false,
      testResultId: testResult.id,
      testId,
      durationMinutes: test.durationMinutes,
      questions: shuffled.map((q) => ({
        id: q.id,
        question: q.question,
        questionType: q.questionType,
        options: JSON.parse(q.options),
        points: q.points,
      })),
    });
  } catch (error) {
    console.error("Start test error:", error);
    return NextResponse.json(
      { error: "Failed to start test" },
      { status: 500 },
    );
  }
}
