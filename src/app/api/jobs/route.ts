import { NextRequest, NextResponse } from "next/server";
import { getJobs } from "@/lib/data";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const jobs = await getJobs({
      q: searchParams.get("q") ?? undefined,
      category: searchParams.get("category") ?? undefined,
      county: searchParams.get("county") ?? undefined,
      listingType: searchParams.get("type") ?? undefined,
      employmentType: searchParams.get("employment") ?? undefined,
      experienceLevel: searchParams.get("experience") ?? undefined,
      workMode: searchParams.get("mode") ?? undefined,
      governmentLevel: searchParams.get("govt") ?? undefined,
      opportunityType: searchParams.get("opportunity") ?? undefined,
      sort: searchParams.get("sort") ?? "latest",
      page: Number(searchParams.get("page")) || 1,
      limit: Math.min(Number(searchParams.get("limit")) || 20, 100),
    });

    return NextResponse.json(jobs);
  } catch (error) {
    console.error('[GET /api/jobs] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch jobs' },
      { status: 500 },
    );
  }
}
