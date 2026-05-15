import { NextRequest, NextResponse } from "next/server";
import { getSalaryData } from "@/lib/services/salary-benchmark";

/**
 * GET /api/salary/data?jobTitle=Developer&county=Nairobi
 *
 * Returns aggregated salary data for benchmarking.
 * Public endpoint (no auth needed).
 *
 * Query params (all optional):
 *   - jobTitle: string (partial match)
 *   - industry: string (exact match)
 *   - county: string (exact match)
 *   - employmentType: string (exact match)
 *   - experienceLevel: string (exact match)
 *
 * Returns: { average, median, min, max, p25, p75, count, period, distribution, byCounty, byExperience }
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const jobTitle = searchParams.get("jobTitle") || undefined;
    const industry = searchParams.get("industry") || undefined;
    const county = searchParams.get("county") || undefined;
    const employmentType = searchParams.get("employmentType") || undefined;
    const experienceLevel = searchParams.get("experienceLevel") || undefined;

    const result = await getSalaryData({
      jobTitle,
      industry,
      county,
      employmentType,
      experienceLevel,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("[salary/data] Error:", error);
    return NextResponse.json(
      { error: "Failed to load salary data" },
      { status: 500 }
    );
  }
}
