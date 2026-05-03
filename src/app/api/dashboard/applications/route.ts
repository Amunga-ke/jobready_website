import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { listingToJob } from "@/lib/transforms";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const applications = await prisma.application.findMany({
      where: { userId: session.user.id },
      include: {
        listing: {
          include: {
            company: true,
            category: true,
            subcategory: true,
            tags: { include: { tag: true } },
          },
        },
      },
      orderBy: { appliedAt: "desc" },
    });

    const result = applications.map((app) => ({
      id: app.id,
      status: app.status,
      coverLetter: app.coverLetter,
      cvUrl: app.cvUrl,
      appliedAt: app.appliedAt.toISOString(),
      updatedAt: app.updatedAt.toISOString(),
      job: listingToJob(app.listing),
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error("Get applications error:", error);
    return NextResponse.json({ error: "Failed to load applications" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { listingId, coverLetter, cvUrl } = await req.json();
    if (!listingId) {
      return NextResponse.json({ error: "Listing ID is required" }, { status: 400 });
    }

    const application = await prisma.application.create({
      data: {
        userId: session.user.id,
        listingId,
        status: "SUBMITTED",
        coverLetter: coverLetter || null,
        cvUrl: cvUrl || null,
      },
    });

    return NextResponse.json({ id: application.id, status: application.status }, { status: 201 });
  } catch (error: unknown) {
    const prismaError = error as { code?: string };
    if (prismaError.code === "P2002") {
      return NextResponse.json({ error: "You have already applied to this job" }, { status: 409 });
    }
    console.error("Create application error:", error);
    return NextResponse.json({ error: "Failed to submit application" }, { status: 500 });
  }
}
