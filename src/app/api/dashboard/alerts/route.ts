import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const alerts = await prisma.jobAlert.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    const result = alerts.map((alert) => ({
      id: alert.id,
      name: alert.name,
      query: alert.query,
      frequency: alert.frequency,
      isActive: alert.isActive,
      createdAt: alert.createdAt.toISOString(),
      lastTriggered: alert.lastTriggered?.toISOString() || null,
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error("Get alerts error:", error);
    return NextResponse.json({ error: "Failed to load alerts" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, query, frequency = "DAILY" } = await req.json();

    if (!name || !query) {
      return NextResponse.json({ error: "Name and query are required" }, { status: 400 });
    }

    const alert = await prisma.jobAlert.create({
      data: {
        userId: session.user.id,
        name: name.trim(),
        query: typeof query === "string" ? query : JSON.stringify(query),
        frequency,
      },
    });

    return NextResponse.json(
      {
        id: alert.id,
        name: alert.name,
        query: alert.query,
        frequency: alert.frequency,
        isActive: alert.isActive,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create alert error:", error);
    return NextResponse.json({ error: "Failed to create alert" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Alert ID is required" }, { status: 400 });
    }

    const alert = await prisma.jobAlert.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!alert) {
      return NextResponse.json({ error: "Alert not found" }, { status: 404 });
    }

    await prisma.jobAlert.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete alert error:", error);
    return NextResponse.json({ error: "Failed to delete alert" }, { status: 500 });
  }
}
