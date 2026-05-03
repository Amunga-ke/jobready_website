import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const [savedCount, applications, user] = await Promise.all([
      prisma.savedJob.count({ where: { userId } }),
      prisma.application.findMany({
        where: { userId },
        select: { status: true },
      }),
      prisma.user.findUnique({
        where: { id: userId },
        select: { name: true, phone: true, county: true, bio: true, cvUrl: true },
      }),
    ]);

    const statusCounts: Record<string, number> = {};
    for (const app of applications) {
      statusCounts[app.status] = (statusCounts[app.status] || 0) + 1;
    }

    // Profile completion percentage
    let profileFields = 0;
    const totalFields = 5;
    if (user?.name && user.name.trim()) profileFields++;
    if (user?.phone && user.phone.trim()) profileFields++;
    if (user?.county && user.county.trim()) profileFields++;
    if (user?.bio && user.bio.trim()) profileFields++;
    if (user?.cvUrl && user.cvUrl.trim()) profileFields++;
    const profileCompletion = Math.round((profileFields / totalFields) * 100);

    return NextResponse.json({
      savedJobs: savedCount,
      totalApplications: applications.length,
      submittedApplications: statusCounts["SUBMITTED"] || 0,
      viewedApplications: statusCounts["VIEWED"] || 0,
      shortlistedApplications: statusCounts["SHORTLISTED"] || 0,
      interviewApplications: statusCounts["INTERVIEW"] || 0,
      offeredApplications: statusCounts["OFFERED"] || 0,
      rejectedApplications: statusCounts["REJECTED"] || 0,
      withdrawnApplications: statusCounts["WITHDRAWN"] || 0,
      draftApplications: statusCounts["DRAFT"] || 0,
      profileCompletion,
    });
  } catch (error) {
    console.error("Stats error:", error);
    return NextResponse.json({ error: "Failed to load stats" }, { status: 500 });
  }
}
