import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { listingToJob } from "@/lib/transforms";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const savedJobs = await prisma.savedJob.findMany({
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
      orderBy: { createdAt: "desc" },
    });

    const result = savedJobs.map((sj) => ({
      id: sj.id,
      note: sj.note,
      savedAt: sj.createdAt.toISOString(),
      job: listingToJob(sj.listing),
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error("Get saved jobs error:", error);
    return NextResponse.json({ error: "Failed to load saved jobs" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { listingId, note } = await req.json();
    if (!listingId) {
      return NextResponse.json({ error: "Listing ID is required" }, { status: 400 });
    }

    const saved = await prisma.savedJob.create({
      data: {
        userId: session.user.id,
        listingId,
        note: note || null,
      },
    });

    return NextResponse.json({ id: saved.id }, { status: 201 });
  } catch (error: unknown) {
    const prismaError = error as { code?: string };
    if (prismaError.code === "P2002") {
      return NextResponse.json({ error: "Job already saved" }, { status: 409 });
    }
    console.error("Save job error:", error);
    return NextResponse.json({ error: "Failed to save job" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const listingId = searchParams.get("listingId");
    if (!listingId) {
      return NextResponse.json({ error: "Listing ID is required" }, { status: 400 });
    }

    await prisma.savedJob.deleteMany({
      where: {
        userId: session.user.id,
        listingId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Unsave job error:", error);
    return NextResponse.json({ error: "Failed to unsave job" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { listingId, note } = await req.json();
    if (!listingId) {
      return NextResponse.json({ error: "Listing ID is required" }, { status: 400 });
    }

    const updated = await prisma.savedJob.updateMany({
      where: {
        userId: session.user.id,
        listingId,
      },
      data: { note: note || null },
    });

    return NextResponse.json({ success: true, count: updated.count });
  } catch (error) {
    console.error("Update saved job note error:", error);
    return NextResponse.json({ error: "Failed to update note" }, { status: 500 });
  }
}
