import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireEmployer } from "@/lib/employer-guard";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireEmployer();
  if (guard.error) return guard.error;

  const { companyId } = guard;
  const { id } = await params;

  try {
    const job = await prisma.listing.findFirst({
      where: { id, companyId },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        subcategory: { select: { id: true, name: true, slug: true } },
        company: { select: { id: true, name: true, slug: true } },
        tags: { include: { tag: true } },
      },
    });

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    return NextResponse.json(job);
  } catch (error) {
    console.error("Get employer job error:", error);
    return NextResponse.json({ error: "Failed to load job" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireEmployer();
  if (guard.error) return guard.error;

  const { companyId } = guard;
  const { id } = await params;
  const body = await req.json();

  // Verify ownership
  const existing = await prisma.listing.findFirst({
    where: { id, companyId },
  });

  if (!existing) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  const {
    title,
    description,
    listingType,
    categoryId,
    subcategoryId,
    town,
    county,
    employmentType,
    experienceLevel,
    workMode,
    salaryMin,
    salaryMax,
    salaryPeriod,
    applicationUrl,
    applyEmail,
    deadline,
    featured,
    status,
    tags,
    governmentLevel,
    opportunityType,
  } = body;

  try {
    // If tags are provided, delete existing and recreate
    if (tags !== undefined) {
      await prisma.listingTag.deleteMany({ where: { listingId: id } });
    }

    const job = await prisma.listing.update({
      where: { id },
      data: {
        ...(title !== undefined && { title: title.trim() }),
        ...(description !== undefined && { description }),
        ...(listingType !== undefined && { listingType }),
        ...(categoryId !== undefined && { categoryId: categoryId || null }),
        ...(subcategoryId !== undefined && { subcategoryId: subcategoryId || null }),
        ...(town !== undefined && { town }),
        ...(county !== undefined && { county }),
        ...(employmentType !== undefined && { employmentType }),
        ...(experienceLevel !== undefined && { experienceLevel }),
        ...(workMode !== undefined && { workMode }),
        ...(salaryMin !== undefined && { salaryMin: salaryMin || null }),
        ...(salaryMax !== undefined && { salaryMax: salaryMax || null }),
        ...(salaryPeriod !== undefined && { salaryPeriod: salaryPeriod || null }),
        ...(applicationUrl !== undefined && { applicationUrl: applicationUrl || null }),
        ...(applyEmail !== undefined && { applyEmail: applyEmail || null }),
        ...(deadline !== undefined && { deadline: deadline ? new Date(deadline) : null }),
        ...(featured !== undefined && { featured }),
        ...(status !== undefined && { status }),
        ...(governmentLevel !== undefined && { governmentLevel: governmentLevel || null }),
        ...(opportunityType !== undefined && { opportunityType: opportunityType || null }),
        ...(tags && {
          tags: {
            create: await Promise.all(
              tags.map(async (tagName: string) => {
                const tag = await prisma.tag.upsert({
                  where: { name: tagName },
                  update: {},
                  create: { name: tagName },
                });
                return { tagId: tag.id };
              })
            ),
          },
        }),
      },
      include: { tags: { include: { tag: true } } },
    });

    return NextResponse.json(job);
  } catch (error) {
    console.error("Update job error:", error);
    return NextResponse.json({ error: "Failed to update job" }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireEmployer();
  if (guard.error) return guard.error;

  const { companyId } = guard;
  const { id } = await params;

  const existing = await prisma.listing.findFirst({
    where: { id, companyId },
  });

  if (!existing) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  try {
    await prisma.listing.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete job error:", error);
    return NextResponse.json({ error: "Failed to delete job" }, { status: 500 });
  }
}
