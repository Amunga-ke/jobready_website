import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const counties = await prisma.county.findMany({
      where: { active: true },
      orderBy: { name: "asc" },
      select: {
        id: true,
        slug: true,
        name: true,
        code: true,
      },
    });

    return NextResponse.json({ counties });
  } catch (error) {
    console.error("[GET /api/locations] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch locations" },
      { status: 500 }
    );
  }
}
