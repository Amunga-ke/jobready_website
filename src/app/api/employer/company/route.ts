import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireEmployer } from "@/lib/employer-guard";

export async function GET() {
  const guard = await requireEmployer();
  if (guard.error) return guard.error;

  const { companyId } = guard;

  try {
    const company = await prisma.company.findUnique({
      where: { id: companyId },
      include: {
        _count: { select: { listings: true, users: true } },
      },
    });

    if (!company) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    return NextResponse.json(company);
  } catch (error) {
    console.error("Get company error:", error);
    return NextResponse.json({ error: "Failed to load company" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const guard = await requireEmployer();
  if (guard.error) return guard.error;

  const { companyId } = guard;
  const body = await req.json();

  const {
    name,
    logo,
    description,
    website,
    location,
    county,
    industry,
    orgType,
  } = body;

  try {
    const company = await prisma.company.update({
      where: { id: companyId },
      data: {
        ...(name && { name: name.trim() }),
        ...(logo !== undefined && { logo: logo || null }),
        ...(description !== undefined && { description }),
        ...(website !== undefined && { website: website || null }),
        ...(location !== undefined && { location }),
        ...(county !== undefined && { county }),
        ...(industry !== undefined && { industry }),
        ...(orgType && { orgType }),
      },
    });

    return NextResponse.json(company);
  } catch (error) {
    console.error("Update company error:", error);
    return NextResponse.json({ error: "Failed to update company" }, { status: 500 });
  }
}
