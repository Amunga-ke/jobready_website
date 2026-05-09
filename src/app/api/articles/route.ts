import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/* GET /api/articles — List articles with optional category filter and pagination */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const category = searchParams.get("category") ?? undefined;
  const page = Number(searchParams.get("page")) || 1;
  const limit = Math.min(Number(searchParams.get("limit")) || 20, 50);
  const featured = searchParams.get("featured") === "true" ? true : undefined;

  const where: Record<string, unknown> = { status: "PUBLISHED" };
  if (category) where.category = category;
  if (featured !== undefined) where.featured = featured;

  const [articles, total] = await Promise.all([
    prisma.article.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        slug: true,
        title: true,
        excerpt: true,
        category: true,
        tags: true,
        author: true,
        coverImage: true,
        featured: true,
        readTime: true,
        publishedAt: true,
      },
    }).catch(() => []),
    prisma.article.count({ where }).catch(() => 0),
  ]);

  return NextResponse.json({
    articles,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  });
}
