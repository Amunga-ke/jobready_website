import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { status } = await req.json();

    const validStatuses = ["DRAFT", "SUBMITTED", "VIEWED", "SHORTLISTED", "INTERVIEW", "OFFERED", "REJECTED", "WITHDRAWN"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const application = await prisma.application.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    const updated = await prisma.application.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({ id: updated.id, status: updated.status });
  } catch (error) {
    console.error("Update application status error:", error);
    return NextResponse.json({ error: "Failed to update status" }, { status: 500 });
  }
}
