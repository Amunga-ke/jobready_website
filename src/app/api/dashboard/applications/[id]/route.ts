import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const application = await prisma.application.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    await prisma.application.update({
      where: { id },
      data: { status: "WITHDRAWN" },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Withdraw application error:", error);
    return NextResponse.json({ error: "Failed to withdraw application" }, { status: 500 });
  }
}
