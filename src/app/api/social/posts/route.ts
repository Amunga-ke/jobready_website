import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { postToListingPlatforms, generateJobCaption } from "@/lib/services/social-media-service";
import type { PosterTemplate } from "@/lib/services/poster-generator";

/**
 * GET /api/social/posts
 * List social posts with filtering.
 *
 * Query params:
 *   - platform: Filter by platform (FACEBOOK, INSTAGRAM, etc.)
 *   - status: Filter by status (PENDING, POSTED, FAILED, DELETED)
 *   - listingId: Filter by listing
 *   - accountId: Filter by account
 *   - page: Page number (default 1)
 *   - limit: Items per page (default 20, max 100)
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = request.nextUrl;
    const platform = searchParams.get("platform");
    const status = searchParams.get("status");
    const listingId = searchParams.get("listingId");
    const accountId = searchParams.get("accountId");
    const page = Math.max(Number(searchParams.get("page")) || 1, 1);
    const limit = Math.min(Number(searchParams.get("limit")) || 20, 100);

    const where: Record<string, unknown> = {};

    if (platform) {
      where.platform = platform.toUpperCase();
    }
    if (status) {
      where.status = status.toUpperCase();
    }
    if (listingId) {
      where.listingId = listingId;
    }
    if (accountId) {
      where.accountId = accountId;
    }

    // Non-admin users can only see their own posts
    if (session.user.role !== "ADMIN") {
      where.account = {
        userId: session.user.id,
      };
    }

    const [posts, total] = await Promise.all([
      prisma.socialPost.findMany({
        where,
        include: {
          account: {
            select: {
              id: true,
              platform: true,
              platformUsername: true,
              pageName: true,
            },
          },
          listing: {
            select: {
              id: true,
              title: true,
              slug: true,
              listingType: true,
              company: {
                select: { name: true },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.socialPost.count({ where }),
    ]);

    return NextResponse.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("[GET /api/social/posts] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch social posts" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/social/posts
 * Manually trigger a post to social media.
 *
 * Body: {
 *   accountId: string;
 *   listingId: string;
 *   platforms?: string[];  // defaults to the account's platform
 *   caption?: string;      // auto-generated if not provided
 *   template?: 'modern' | 'minimal' | 'corporate';
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { accountId, listingId, platforms, caption, template } = body;

    if (!accountId || !listingId) {
      return NextResponse.json(
        { error: "accountId and listingId are required" },
        { status: 400 }
      );
    }

    // Verify the account belongs to the user (or is admin)
    const account = await prisma.socialAccount.findUnique({
      where: { id: accountId },
    });

    if (!account) {
      return NextResponse.json(
        { error: "Social account not found" },
        { status: 404 }
      );
    }

    if (account.userId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // If no platforms specified, use the account's platform
    const targetPlatforms = platforms || [account.platform];

    // Generate caption if not provided
    let finalCaption = caption;
    if (!finalCaption) {
      const listing = await prisma.listing.findUnique({
        where: { id: listingId },
        include: { company: true, category: true },
      });
      if (listing) {
        finalCaption = generateJobCaption({
          title: listing.title,
          company: { name: listing.company.name },
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
        });
      } else {
        finalCaption = "Check out this opportunity on JobReady!";
      }
    }

    // Post to platforms
    const results = await postToListingPlatforms({
      accountId,
      listingId,
      platforms: targetPlatforms,
      caption: finalCaption,
      template: (template as PosterTemplate) || "modern",
    });

    const succeeded = results.filter((r) => r.success).length;
    const failed = results.filter((r) => !r.success).length;

    return NextResponse.json({
      success: succeeded > 0,
      results,
      summary: {
        total: results.length,
        succeeded,
        failed,
      },
    });
  } catch (error) {
    console.error("[POST /api/social/posts] Error:", error);
    return NextResponse.json(
      { error: "Failed to create social post" },
      { status: 500 }
    );
  }
}
