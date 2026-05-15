import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { generateJobPoster, type PosterTemplate } from "@/lib/services/poster-generator";

/**
 * POST /api/social/poster-preview
 * Generate and return a poster preview as base64.
 *
 * Body: { listingId: string; template?: 'modern' | 'minimal' | 'corporate' }
 *
 * Returns: { posterBase64: string, posterUrl: string }
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { listingId, template } = body as {
      listingId: string;
      template?: string;
    };

    if (!listingId) {
      return NextResponse.json(
        { error: "listingId is required" },
        { status: 400 }
      );
    }

    // Fetch listing with company and category
    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      include: { company: true, category: true },
    });

    if (!listing) {
      return NextResponse.json(
        { error: "Listing not found" },
        { status: 404 }
      );
    }

    const posterTemplate: PosterTemplate =
      (template as PosterTemplate) || "modern";

    // Validate template
    if (!["modern", "minimal", "corporate"].includes(posterTemplate)) {
      return NextResponse.json(
        { error: `Invalid template: ${template}` },
        { status: 400 }
      );
    }

    // Generate poster
    const imageBuffer = await generateJobPoster(
      {
        id: listing.id,
        title: listing.title,
        company: { name: listing.company.name, logo: listing.company.logo },
        location: listing.town || listing.county,
        salaryMin: listing.salaryMin,
        salaryMax: listing.salaryMax,
        salaryPeriod: listing.salaryPeriod,
        employmentType: listing.employmentType,
        experienceLevel: listing.experienceLevel,
        workMode: listing.workMode,
        listingType: listing.listingType,
        slug: listing.slug,
        deadline: listing.deadline?.toISOString(),
        category: listing.category?.name,
      },
      posterTemplate
    );

    const posterBase64 = imageBuffer.toString("base64");
    const posterUrl = `/uploads/posters/${listing.id}-${posterTemplate}.png`;

    return NextResponse.json({
      posterBase64,
      posterUrl,
      template: posterTemplate,
      listingTitle: listing.title,
    });
  } catch (error) {
    console.error("[POST /api/social/poster-preview] Error:", error);
    return NextResponse.json(
      { error: "Failed to generate poster preview" },
      { status: 500 }
    );
  }
}
