import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

/**
 * GET /api/social/accounts
 * List all social accounts for the authenticated user/company.
 *
 * Query params:
 *   - companyId: Filter by company (optional)
 *   - platform: Filter by platform (optional)
 *   - isActive: Filter by active status (optional, "true"/"false")
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = request.nextUrl;
    const companyId = searchParams.get("companyId");
    const platform = searchParams.get("platform");
    const isActive = searchParams.get("isActive");

    const where: Record<string, unknown> = {
      userId: session.user.id,
    };

    if (companyId) {
      where.companyId = companyId;
    }
    if (platform) {
      where.platform = platform.toUpperCase();
    }
    if (isActive !== null && isActive !== undefined) {
      where.isActive = isActive === "true";
    }

    const accounts = await prisma.socialAccount.findMany({
      where,
      include: {
        company: {
          select: { id: true, name: true, slug: true },
        },
        _count: {
          select: { socialPosts: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Sanitize: don't return tokens in the list response
    const sanitized = accounts.map((acc) => ({
      id: acc.id,
      platform: acc.platform,
      platformUserId: acc.platformUserId,
      platformUsername: acc.platformUsername,
      pageId: acc.pageId,
      pageName: acc.pageName,
      isActive: acc.isActive,
      autoPost: acc.autoPost,
      autoPostJobTypes: acc.autoPostJobTypes,
      lastPostedAt: acc.lastPostedAt,
      tokenExpiresAt: acc.tokenExpiresAt,
      createdAt: acc.createdAt,
      updatedAt: acc.updatedAt,
      company: acc.company,
      postCount: acc._count.socialPosts,
    }));

    return NextResponse.json({ accounts: sanitized });
  } catch (error) {
    console.error("[GET /api/social/accounts] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch social accounts" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/social/accounts
 * Add a new social account.
 *
 * Body: {
 *   platform: string;
 *   accessToken: string;
 *   refreshToken?: string;
 *   platformUserId?: string;
 *   platformUsername?: string;
 *   pageId?: string;
 *   pageName?: string;
 *   companyId?: string;
 *   autoPost?: boolean;
 *   autoPostJobTypes?: string[];
 *   metadata?: object;
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const {
      platform,
      accessToken,
      refreshToken,
      platformUserId,
      platformUsername,
      pageId,
      pageName,
      companyId,
      autoPost,
      autoPostJobTypes,
      metadata,
    } = body;

    // Validate required fields
    if (!platform || !accessToken) {
      return NextResponse.json(
        { error: "Platform and access token are required" },
        { status: 400 }
      );
    }

    // Validate platform
    const validPlatforms = [
      "FACEBOOK",
      "INSTAGRAM",
      "LINKEDIN",
      "TWITTER",
      "WHATSAPP_CHANNEL",
    ];
    const normalizedPlatform = platform.toUpperCase();
    if (!validPlatforms.includes(normalizedPlatform)) {
      return NextResponse.json(
        { error: `Invalid platform: ${platform}. Must be one of: ${validPlatforms.join(", ")}` },
        { status: 400 }
      );
    }

    // Check if companyId is provided and valid
    if (companyId) {
      const company = await prisma.company.findUnique({
        where: { id: companyId },
      });
      if (!company) {
        return NextResponse.json(
          { error: "Company not found" },
          { status: 404 }
        );
      }
    }

    // Create the social account
    const account = await prisma.socialAccount.create({
      data: {
        userId: session.user.id,
        companyId: companyId || null,
        platform: normalizedPlatform,
        platformUserId: platformUserId || null,
        platformUsername: platformUsername || null,
        accessToken,
        refreshToken: refreshToken || null,
        pageId: pageId || null,
        pageName: pageName || null,
        pageAccessToken: accessToken,
        isActive: true,
        autoPost: autoPost || false,
        autoPostJobTypes: autoPostJobTypes
          ? JSON.stringify(autoPostJobTypes)
          : null,
        metadata: metadata ? JSON.stringify(metadata) : null,
      },
    });

    return NextResponse.json(
      {
        success: true,
        account: {
          id: account.id,
          platform: account.platform,
          platformUsername: account.platformUsername,
          pageName: account.pageName,
          isActive: account.isActive,
          autoPost: account.autoPost,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/social/accounts] Error:", error);
    return NextResponse.json(
      { error: "Failed to create social account" },
      { status: 500 }
    );
  }
}
