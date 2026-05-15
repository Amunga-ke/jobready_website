import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { postToListingPlatforms, generateJobCaption } from "@/lib/services/social-media-service";
import type { PosterTemplate } from "@/lib/services/poster-generator";

/**
 * POST /api/social/auto-post
 *
 * Called when a listing is published. Checks which accounts have autoPost
 * enabled for the listing type, generates poster, and queues posts.
 *
 * Security: requires CRON_SECRET header for non-authenticated calls.
 * Authenticated admin users can also call this directly.
 *
 * Body: { listingId: string; template?: string }
 * Header: { "x-cron-secret": string } (for server-to-server calls)
 */
export async function POST(request: NextRequest) {
  try {
    const cronSecret = request.headers.get("x-cron-secret");
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

    // Authenticate: either cron secret or session
    let isAuthorized = false;

    if (cronSecret && cronSecret === process.env.CRON_SECRET) {
      isAuthorized = true;
    } else {
      // Check for session auth
      const { getServerSession } = await import("next-auth");
      const { authOptions } = await import("@/lib/auth");
      const session = await getServerSession(authOptions);
      if (session?.user?.id && session.user.role === "ADMIN") {
        isAuthorized = true;
      }
    }

    if (!isAuthorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch the listing
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

    // Find all social accounts with autoPost enabled
    const accounts = await prisma.socialAccount.findMany({
      where: {
        isActive: true,
        autoPost: true,
      },
    });

    if (accounts.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No auto-post accounts configured",
        processed: 0,
      });
    }

    // Filter accounts that match the listing type
    const eligibleAccounts = accounts.filter((account) => {
      if (!account.autoPostJobTypes) return true; // If no types specified, post everything
      try {
        const types: string[] = JSON.parse(account.autoPostJobTypes);
        return types.includes(listing.listingType);
      } catch {
        return true;
      }
    });

    if (eligibleAccounts.length === 0) {
      return NextResponse.json({
        success: true,
        message: `No accounts configured for listing type: ${listing.listingType}`,
        processed: 0,
        totalAccounts: accounts.length,
      });
    }

    // Generate caption
    const caption = generateJobCaption({
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
    });

    // Post to each eligible account
    const allResults: Array<{
      accountId: string;
      platform: string;
      results: Array<{ success: boolean; platform: string; error?: string }>;
    }> = [];

    for (const account of eligibleAccounts) {
      try {
        const results = await postToListingPlatforms({
          accountId: account.id,
          listingId: listing.id,
          platforms: [account.platform],
          caption,
          template: (template as PosterTemplate) || "modern",
        });

        allResults.push({
          accountId: account.id,
          platform: account.platform,
          results,
        });
      } catch (err) {
        allResults.push({
          accountId: account.id,
          platform: account.platform,
          results: [
            {
              success: false,
              platform: account.platform,
              error: err instanceof Error ? err.message : "Unknown error",
            },
          ],
        });
      }
    }

    const totalSucceeded = allResults.filter((r) =>
      r.results.some((res) => res.success)
    ).length;
    const totalFailed = allResults.filter((r) =>
      r.results.every((res) => !res.success)
    ).length;

    return NextResponse.json({
      success: totalSucceeded > 0,
      message: `Processed ${eligibleAccounts.length} accounts: ${totalSucceeded} succeeded, ${totalFailed} failed`,
      listingId,
      listingTitle: listing.title,
      results: allResults,
      summary: {
        totalAccounts: accounts.length,
        eligible: eligibleAccounts.length,
        succeeded: totalSucceeded,
        failed: totalFailed,
      },
    });
  } catch (error) {
    console.error("[POST /api/social/auto-post] Error:", error);
    return NextResponse.json(
      { error: "Auto-post failed" },
      { status: 500 }
    );
  }
}
