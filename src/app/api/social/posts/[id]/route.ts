import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

/**
 * GET /api/social/posts/[id]
 * Get single post details.
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

    const post = await prisma.socialPost.findUnique({
      where: { id },
      include: {
        account: {
          select: {
            id: true,
            platform: true,
            platformUsername: true,
            pageName: true,
            userId: true,
          },
        },
        listing: {
          select: {
            id: true,
            title: true,
            slug: true,
            listingType: true,
            company: {
              select: { name: true, slug: true },
            },
          },
        },
      },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Non-admin users can only see their own posts
    if (
      post.account.userId !== session.user.id &&
      session.user.role !== "ADMIN"
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    return NextResponse.json({ post });
  } catch (error) {
    console.error("[GET /api/social/posts/:id] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch social post" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/social/posts/[id]
 * Delete a social post record. Attempts to remove from platform if possible.
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

    const post = await prisma.socialPost.findUnique({
      where: { id },
      include: {
        account: {
          select: { userId: true, platform: true, accessToken: true },
        },
      },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    if (post.account.userId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Attempt platform deletion (best effort)
    let platformDeleteResult: string | null = null;
    if (post.platformPostId && post.status === "POSTED") {
      try {
        platformDeleteResult = await attemptPlatformDeletion(
          post.platform,
          post.platformPostId,
          post.account.platform,
          post.account.accessToken || ""
        );
      } catch (err) {
        console.warn(
          `[DELETE /api/social/posts/:id] Platform deletion failed (non-fatal):`,
          err
        );
        platformDeleteResult = "Platform deletion attempted but may not have succeeded";
      }
    }

    // Update status to DELETED (soft delete to keep audit trail)
    await prisma.socialPost.update({
      where: { id },
      data: {
        status: "DELETED",
        metadata: JSON.stringify({
          ...(post.metadata ? JSON.parse(post.metadata) : {}),
          deletedAt: new Date().toISOString(),
          platformDeleteResult,
        }),
      },
    });

    return NextResponse.json({
      success: true,
      platformDeleteResult,
    });
  } catch (error) {
    console.error("[DELETE /api/social/posts/:id] Error:", error);
    return NextResponse.json(
      { error: "Failed to delete social post" },
      { status: 500 }
    );
  }
}

/**
 * Attempt to delete a post from the social platform.
 * This is a best-effort operation — platforms may or may not support programmatic deletion.
 */
async function attemptPlatformDeletion(
  _platform: string,
  _postId: string,
  _accountPlatform: string,
  _accessToken: string
): Promise<string> {
  // Platform-specific deletion would go here.
  // Most platforms require specific API calls to delete posts.
  // For now, return a message indicating this is a placeholder.
  return "Platform deletion not fully implemented — post record marked as deleted";
}
