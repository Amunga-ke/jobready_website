import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireEmployer } from "@/lib/employer-guard";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireEmployer();
  if (guard.error) return guard.error;

  const { companyId } = guard;
  const { id } = await params;

  try {
    const application = await prisma.application.findFirst({
      where: { id, listing: { companyId } },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            county: true,
            bio: true,
            avatarUrl: true,
            cvUrl: true,
            cvData: {
              select: {
                skills: true,
                experience: true,
                education: true,
                summary: true,
                certifications: true,
              },
            },
          },
        },
        listing: {
          select: {
            id: true,
            title: true,
            slug: true,
            listingType: true,
            company: { select: { name: true } },
          },
        },
      },
    });

    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    // Mark as VIEWED if still SUBMITTED
    if (application.status === "SUBMITTED") {
      await prisma.application.update({
        where: { id },
        data: { status: "VIEWED" },
      });
      application.status = "VIEWED";
    }

    // Fetch CV match scores separately (no direct relation from Application)
    const cvMatchScores = await prisma.cvMatchScore.findMany({
      where: {
        userId: application.userId,
        listingId: application.listingId,
      },
      select: { score: true, breakdown: true, aiAnalysis: true, createdAt: true },
      orderBy: { createdAt: "desc" },
      take: 1,
    });

    return NextResponse.json({ ...application, cvMatchScores });
  } catch (error) {
    console.error("Get application error:", error);
    return NextResponse.json({ error: "Failed to load application" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireEmployer();
  if (guard.error) return guard.error;

  const { companyId } = guard;
  const { id } = await params;
  const body = await req.json();
  const { status, note } = body;

  const validStatuses = ["SUBMITTED", "VIEWED", "SHORTLISTED", "INTERVIEW", "OFFERED", "REJECTED", "WITHDRAWN"];
  if (status && !validStatuses.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const existing = await prisma.application.findFirst({
    where: { id, listing: { companyId } },
  });

  if (!existing) {
    return NextResponse.json({ error: "Application not found" }, { status: 404 });
  }

  try {
    const application = await prisma.application.update({
      where: { id },
      data: {
        ...(status && { status }),
      },
    });

    return NextResponse.json(application);
  } catch (error) {
    console.error("Update application error:", error);
    return NextResponse.json({ error: "Failed to update application" }, { status: 500 });
  }
}
