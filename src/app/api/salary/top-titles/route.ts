import { NextRequest, NextResponse } from "next/server";
import { getTopJobTitles } from "@/lib/services/salary-benchmark";

/**
 * GET /api/salary/top-titles?limit=20
 *
 * Returns top job titles by number of salary submissions.
 * Public endpoint (no auth needed).
 *
 * Query params:
 *   - limit: number (default 20, max 100)
 *
 * Returns: Array<{ jobTitle, count, averageSalary }>
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const rawLimit = parseInt(searchParams.get("limit") || "20", 10) || 20;
    const limit = Math.min(100, Math.max(1, rawLimit));

    const result = await getTopJobTitles(limit);

    return NextResponse.json(result);
  } catch (error) {
    console.error("[salary/top-titles] Error:", error);
    return NextResponse.json(
      { error: "Failed to load top job titles" },
      { status: 500 }
    );
  }
}
