import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

/**
 * GET /api/social/accounts/[id]
 * Get single account details.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const account = await prisma.socialAccount.findUnique({
      where: { id },
      include: {
        company: {
          select: { id: true, name: true, slug: true },
        },
        _count: {
          select: { socialPosts: true },
        },
      },
    });

    if (!account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    // Only return to owner or admin
    if (account.userId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Sanitize tokens
    const sanitized = {
      id: account.id,
      platform: account.platform,
      platformUserId: account.platformUserId,
      platformUsername: account.platformUsername,
      pageId: account.pageId,
      pageName: account.pageName,
      isActive: account.isActive,
      autoPost: account.autoPost,
      autoPostJobTypes: account.autoPostJobTypes,
      lastPostedAt: account.lastPostedAt,
      tokenExpiresAt: account.tokenExpiresAt,
      createdAt: account.createdAt,
      updatedAt: account.updatedAt,
      company: account.company,
      postCount: account._count.socialPosts,
      // Mask the token for display
      hasToken: !!account.accessToken,
      tokenPreview: account.accessToken
        ? `${account.accessToken.substring(0, 8)}...${account.accessToken.substring(account.accessToken.length - 4)}`
        : null,
    };

    return NextResponse.json({ account: sanitized });
  } catch (error) {
    console.error("[GET /api/social/accounts/:id] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch social account" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/social/accounts/[id]
 * Update account (toggle autoPost, update token, etc.).
 *
 * Body: {
 *   accessToken?: string;
 *   refreshToken?: string;
 *   pageAccessToken?: string;
 *   platformUsername?: string;
 *   pageName?: string;
 *   isActive?: boolean;
 *   autoPost?: boolean;
 *   autoPostJobTypes?: string[];
 *   metadata?: object;
 * }
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    // Check ownership
    const existing = await prisma.socialAccount.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }
    if (existing.userId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Build update data
    const updateData: Record<string, unknown> = {};
    const {
      accessToken,
      refreshToken,
      pageAccessToken,
      platformUsername,
      pageName,
      isActive,
      autoPost,
      autoPostJobTypes,
      metadata,
    } = body;

    if (accessToken !== undefined) {
      updateData.accessToken = accessToken;
      updateData.pageAccessToken = accessToken; // sync page token
    }
    if (refreshToken !== undefined) updateData.refreshToken = refreshToken;
    if (pageAccessToken !== undefined) updateData.pageAccessToken = pageAccessToken;
    if (platformUsername !== undefined) updateData.platformUsername = platformUsername;
    if (pageName !== undefined) updateData.pageName = pageName;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (autoPost !== undefined) updateData.autoPost = autoPost;
    if (autoPostJobTypes !== undefined) {
      updateData.autoPostJobTypes = JSON.stringify(autoPostJobTypes);
    }
    if (metadata !== undefined) updateData.metadata = JSON.stringify(metadata);

    const account = await prisma.socialAccount.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      account: {
        id: account.id,
        platform: account.platform,
        isActive: account.isActive,
        autoPost: account.autoPost,
        autoPostJobTypes: account.autoPostJobTypes,
      },
    });
  } catch (error) {
    console.error("[PUT /api/social/accounts/:id] Error:", error);
    return NextResponse.json(
      { error: "Failed to update social account" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/social/accounts/[id]
 * Disconnect (delete) a social account.
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Check ownership
    const existing = await prisma.socialAccount.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }
    if (existing.userId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Delete account (cascades to social posts)
    await prisma.socialAccount.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE /api/social/accounts/:id] Error:", error);
    return NextResponse.json(
      { error: "Failed to delete social account" },
      { status: 500 }
    );
  }
}
