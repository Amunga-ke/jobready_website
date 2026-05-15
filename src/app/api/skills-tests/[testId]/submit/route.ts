import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

interface SubmittedAnswer {
  questionId: string;
  answer: string;
}

/**
 * POST /api/skills-tests/[testId]/submit
 * Body: { testResultId, answers, timeTakenSeconds }
 * Scores each answer, calculates percentage, updates result to COMPLETED.
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
    const body = await req.json();
    const { testResultId, answers, timeTakenSeconds } = body as {
      testResultId: string;
      answers: SubmittedAnswer[];
      timeTakenSeconds: number;
    };

    if (!testResultId || !answers || !Array.isArray(answers)) {
      return NextResponse.json(
        { error: "testResultId and answers array are required" },
        { status: 400 },
      );
    }

    // Verify the test result belongs to this user and is in progress
    const testResult = await prisma.skillTestResult.findFirst({
      where: {
        id: testResultId,
        testId,
        userId: session.user.id,
        status: "IN_PROGRESS",
      },
    });

    if (!testResult) {
      // Check if already completed
      const completedResult = await prisma.skillTestResult.findFirst({
        where: {
          id: testResultId,
          testId,
          userId: session.user.id,
          status: "COMPLETED",
        },
        select: {
          id: true,
          score: true,
          passed: true,
          timeTakenSeconds: true,
          completedAt: true,
          answers: true,
        },
      });

      if (completedResult) {
        return NextResponse.json({
          alreadyCompleted: true,
          score: completedResult.score,
          passed: completedResult.passed,
          timeTakenSeconds: completedResult.timeTakenSeconds,
          completedAt: completedResult.completedAt?.toISOString(),
        });
      }

      return NextResponse.json(
        { error: "Test result not found or not in progress" },
        { status: 404 },
      );
    }

    // Fetch the test and questions with correct answers
    const test = await prisma.skillTest.findUnique({
      where: { id: testId },
    });

    if (!test) {
      return NextResponse.json(
        { error: "Test not found" },
        { status: 404 },
      );
    }

    const questions = await prisma.skillTestQuestion.findMany({
      where: { testId },
    });

    // Build a map for quick lookup
    const questionMap = new Map(questions.map((q) => [q.id, q]));

    // Score each answer
    let totalPoints = 0;
    let maxPoints = 0;
    const breakdown: Array<{
      questionId: string;
      correct: boolean;
      userAnswer: string;
      correctAnswer: string;
      explanation?: string;
      points: number;
    }> = [];

    for (const submitted of answers) {
      const question = questionMap.get(submitted.questionId);
      if (!question) continue;

      maxPoints += question.points;
      const isCorrect =
        submitted.answer.trim().toLowerCase() ===
        question.correctAnswer.trim().toLowerCase();

      if (isCorrect) {
        totalPoints += question.points;
      }

      breakdown.push({
        questionId: submitted.questionId,
        correct: isCorrect,
        userAnswer: submitted.answer,
        correctAnswer: question.correctAnswer,
        explanation: question.explanation || undefined,
        points: question.points,
      });
    }

    const percentage =
      maxPoints > 0 ? Math.round((totalPoints / maxPoints) * 100) : 0;
    const passed = percentage >= test.passingScore;

    // Store answers as JSON
    const answersJson = JSON.stringify(
      answers.map((a) => ({
        questionId: a.questionId,
        answer: a.answer,
        isCorrect: breakdown.find((b) => b.questionId === a.questionId)
          ?.correct,
      })),
    );

    // Update the test result
    const updatedResult = await prisma.skillTestResult.update({
      where: { id: testResultId },
      data: {
        score: percentage,
        totalPoints,
        maxPoints,
        answers: answersJson,
        timeTakenSeconds: timeTakenSeconds || 0,
        status: "COMPLETED",
        passed,
        completedAt: new Date(),
      },
    });

    // Also update the test's questionCount if it seems stale (best-effort)
    // No need — questionCount is set on creation.

    return NextResponse.json({
      testResultId: updatedResult.id,
      score: percentage,
      totalPoints,
      maxPoints,
      passed,
      timeTakenSeconds: updatedResult.timeTakenSeconds,
      completedAt: updatedResult.completedAt?.toISOString(),
      breakdown,
    });
  } catch (error) {
    console.error("Submit test error:", error);
    return NextResponse.json(
      { error: "Failed to submit test" },
      { status: 500 },
    );
  }
}
