import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const update = await prisma.jobUpdate.findUnique({
      where: { slug, status: "PUBLISHED" },
    });

    if (!update) {
      return NextResponse.json({ error: "Update not found" }, { status: 404 });
    }

    return NextResponse.json({
      update: {
        id: update.id,
        slug: update.slug,
        title: update.title,
        body: update.body,
        source: update.source,
        updateType: update.updateType,
        pdfUrl: update.pdfUrl,
        imageUrl: update.imageUrl,
        listingSlug: update.listingSlug,
        postedBy: update.postedBy,
        createdAt: update.createdAt.toISOString(),
        updatedAt: update.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("[GET /api/updates/:slug] Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
