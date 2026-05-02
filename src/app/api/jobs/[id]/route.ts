import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { listingToJob } from "@/lib/transforms";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    // The `id` param is treated as a slug
    const listing = await prisma.listing.findUnique({
      where: { slug: id },
      include: {
        company: true,
        category: true,
        subcategory: true,
        county: true,
        tags: { include: { tag: true } },
      },
    });

    if (!listing) {
      return NextResponse.json(
        { error: "Job not found" },
        { status: 404 },
      );
    }

    const job = listingToJob(listing);
    return NextResponse.json({ job });
  } catch (error) {
    console.error("[GET /api/jobs/[id]] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch job" },
      { status: 500 },
    );
  }
}
