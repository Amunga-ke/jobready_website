import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

/**
 * GET /api/social/auth/[platform]/callback
 *
 * Handles OAuth callback from Meta and LinkedIn.
 * Currently supports manual token exchange — the admin enters the access token directly.
 *
 * Query params:
 *   - code: OAuth authorization code (future use)
 *   - state: CSRF state (future use)
 *   - access_token: Direct token for manual flow
 *   - platform: From URL param
 *
 * For manual token flow, accept POST with { accessToken, pageId, pageName, platformUserId, ... } body.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ platform: string }> }
) {
  const { platform } = await params;
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;

    // For now, this endpoint is informational.
    // Full OAuth redirect flow would exchange code for token here.
    return NextResponse.json({
      message: `OAuth callback for ${platform} received.`,
      note: "Please use POST /api/social/accounts with your access token to connect a social account.",
      platform,
    });
  } catch (error) {
    console.error(`[GET /api/social/auth/${platform}/callback] Error:`, error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/social/auth/[platform]/callback
 *
 * Manual token flow: accepts the access token directly and stores it.
 * Body: { accessToken, pageId?, pageName?, platformUserId?, metadata? }
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ platform: string }> }
) {
  const { platform } = await params;
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const {
      accessToken,
      refreshToken,
      pageId,
      pageName,
      platformUserId,
      platformUsername,
      metadata,
      companyId,
    } = body;

    if (!accessToken) {
      return NextResponse.json(
        { error: "Access token is required" },
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
        { error: `Invalid platform: ${platform}` },
        { status: 400 }
      );
    }

    // Upsert the social account
    const account = await prisma.socialAccount.upsert({
      where: {
        userId_platform_companyId: {
          userId: session.user.id,
          platform: normalizedPlatform,
          companyId: companyId || null,
        },
      },
      create: {
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
        metadata: metadata ? JSON.stringify(metadata) : null,
        isActive: true,
        autoPost: false,
      },
      update: {
        accessToken,
        refreshToken: refreshToken || undefined,
        pageAccessToken: accessToken,
        platformUserId: platformUserId || undefined,
        platformUsername: platformUsername || undefined,
        pageId: pageId || undefined,
        pageName: pageName || undefined,
        metadata: metadata ? JSON.stringify(metadata) : undefined,
        isActive: true,
      },
    });

    return NextResponse.json({
      success: true,
      account: {
        id: account.id,
        platform: account.platform,
        pageName: account.pageName,
        platformUsername: account.platformUsername,
        isActive: account.isActive,
      },
    });
  } catch (error) {
    console.error(`[POST /api/social/auth/${platform}/callback] Error:`, error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
