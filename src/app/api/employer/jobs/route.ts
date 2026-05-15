import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireEmployer } from "@/lib/employer-guard";
import { slugify } from "@/lib/constants";

export async function GET(req: Request) {
  const guard = await requireEmployer();
  if (guard.error) return guard.error;

  const { companyId } = guard;
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const search = searchParams.get("search");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");

  const where: Record<string, unknown> = { companyId };
  if (status && status !== "ALL") where.status = status;
  if (search) {
    where.OR = [
      { title: { contains: search } },
      { town: { contains: search } },
    ];
  }

  try {
    const [jobs, total] = await Promise.all([
      prisma.listing.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          slug: true,
          title: true,
          listingType: true,
          employmentType: true,
          experienceLevel: true,
          workMode: true,
          town: true,
          county: true,
          status: true,
          featured: true,
          salaryMin: true,
          salaryMax: true,
          salaryPeriod: true,
          deadline: true,
          applyCount: true,
          viewCount: true,
          createdAt: true,
          _count: { select: { applications: true } },
        },
      }),
      prisma.listing.count({ where }),
    ]);

    return NextResponse.json({ jobs, total, page, limit });
  } catch (error) {
    console.error("Employer jobs list error:", error);
    return NextResponse.json({ error: "Failed to load jobs" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const guard = await requireEmployer();
  if (guard.error) return guard.error;

  const { companyId } = guard;
  const body = await req.json();

  const {
    title,
    description,
    listingType = "JOB",
    categoryId,
    subcategoryId,
    town,
    county,
    employmentType = "Full-time",
    experienceLevel = "Mid-level",
    workMode = "ONSITE",
    salaryMin,
    salaryMax,
    salaryPeriod,
    applicationUrl,
    applyEmail,
    deadline,
    featured = false,
    tags,
    governmentLevel,
    opportunityType,
  } = body;

  if (!title || !description) {
    return NextResponse.json({ error: "Title and description are required" }, { status: 400 });
  }

  const slug = slugify(title) + "-" + Date.now().toString(36);

  try {
    const job = await prisma.listing.create({
      data: {
        slug,
        title: title.trim(),
        description,
        listingType,
        companyId,
        categoryId: categoryId || null,
        subcategoryId: subcategoryId || null,
        town: town || "",
        county: county || "",
        employmentType,
        experienceLevel,
        workMode,
        salaryMin: salaryMin || null,
        salaryMax: salaryMax || null,
        salaryPeriod: salaryPeriod || null,
        applicationUrl: applicationUrl || null,
        applyEmail: applyEmail || null,
        deadline: deadline ? new Date(deadline) : null,
        featured,
        governmentLevel: governmentLevel || null,
        opportunityType: opportunityType || null,
        tags: tags
          ? {
              create: await Promise.all(
                (tags as string[]).map(async (tagName: string) => {
                  const tag = await prisma.tag.upsert({
                    where: { name: tagName },
                    update: {},
                    create: { name: tagName },
                  });
                  return { tagId: tag.id };
                })
              ),
            }
          : undefined,
      },
      include: { tags: { include: { tag: true } } },
    });

    return NextResponse.json(job, { status: 201 });
  } catch (error) {
    console.error("Create job error:", error);
    return NextResponse.json({ error: "Failed to create job" }, { status: 500 });
  }
}
