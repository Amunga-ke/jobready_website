import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireEmployer } from "@/lib/employer-guard";

export async function GET() {
  const guard = await requireEmployer();
  if (guard.error) return guard.error;

  const { companyId } = guard;

  try {
    const [
      totalJobs,
      activeJobs,
      closedJobs,
      totalApplications,
      recentApplications,
      totalViews,
    ] = await Promise.all([
      prisma.listing.count({ where: { companyId } }),
      prisma.listing.count({ where: { companyId, status: "ACTIVE" } }),
      prisma.listing.count({ where: { companyId, status: { in: ["CLOSED", "EXPIRED", "FILLED"] } } }),
      prisma.application.count({
        where: { listing: { companyId } },
      }),
      prisma.application.findMany({
        where: { listing: { companyId } },
        orderBy: { appliedAt: "desc" },
        take: 5,
        select: {
          id: true,
          status: true,
          appliedAt: true,
          user: { select: { name: true, email: true } },
          listing: { select: { title: true, slug: true } },
        },
      }),
      prisma.listing.aggregate({
        where: { companyId },
        _sum: { viewCount: true, applyCount: true },
      }),
    ]);

    // Count applications by status
    const appByStatus = await prisma.application.groupBy({
      by: ["status"],
      where: { listing: { companyId } },
      _count: { status: true },
    });

    const statusCounts: Record<string, number> = {};
    for (const item of appByStatus) {
      statusCounts[item.status] = item._count.status;
    }

    return NextResponse.json({
      totalJobs,
      activeJobs,
      closedJobs,
      totalApplications,
      recentApplications,
      totalViews: totalViews._sum.viewCount || 0,
      totalClicks: totalViews._sum.applyCount || 0,
      statusCounts,
    });
  } catch (error) {
    console.error("Employer stats error:", error);
    return NextResponse.json({ error: "Failed to load stats" }, { status: 500 });
  }
}
