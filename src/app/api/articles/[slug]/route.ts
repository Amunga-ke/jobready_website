import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/* GET /api/articles/[slug] — Fetch single article by slug */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const article = await prisma.article.findUnique({
    where: { slug, status: "PUBLISHED" },
  }).catch(() => null);

  if (!article) {
    return NextResponse.json({ error: "Article not found" }, { status: 404 });
  }

  return NextResponse.json(article);
}
