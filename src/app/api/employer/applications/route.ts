import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireEmployer } from "@/lib/employer-guard";

export async function GET(req: Request) {
  const guard = await requireEmployer();
  if (guard.error) return guard.error;

  const { companyId } = guard;
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const listingId = searchParams.get("listingId");
  const search = searchParams.get("search");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");

  const where: Record<string, unknown> = {
    listing: { companyId },
  };
  if (status && status !== "ALL") where.status = status;
  if (listingId) where.listingId = listingId;
  if (search) {
    where.OR = [
      { user: { name: { contains: search } } },
      { user: { email: { contains: search } } },
    ];
  }

  try {
    const [applications, total] = await Promise.all([
      prisma.application.findMany({
        where,
        orderBy: { appliedAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          status: true,
          coverLetter: true,
          cvUrl: true,
          appliedAt: true,
          updatedAt: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              county: true,
              avatarUrl: true,
            },
          },
          listing: {
            select: {
              id: true,
              title: true,
              slug: true,
              listingType: true,
              employmentType: true,
            },
          },
        },
      }),
      prisma.application.count({ where }),
    ]);

    return NextResponse.json({ applications, total, page, limit });
  } catch (error) {
    console.error("Employer applications error:", error);
    return NextResponse.json({ error: "Failed to load applications" }, { status: 500 });
  }
}
