import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { slugify } from "@/lib/constants";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password, companyName, companyIndustry, companyLocation, companyWebsite, companyCounty, companyOrgType } = body;

    // ── Input validation ──
    if (!email || !password || !companyName) {
      return NextResponse.json({ error: "Email, password, and company name are required" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email address" }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    }
    if (!/[A-Z]/.test(password)) {
      return NextResponse.json({ error: "Password must contain at least one uppercase letter" }, { status: 400 });
    }
    if (!/[0-9]/.test(password)) {
      return NextResponse.json({ error: "Password must contain at least one number" }, { status: 400 });
    }

    const trimmedName = (name || "").trim();
    if (!trimmedName || trimmedName.length < 2) {
      return NextResponse.json({ error: "Name must be at least 2 characters" }, { status: 400 });
    }

    if (!companyName.trim() || companyName.trim().length < 2) {
      return NextResponse.json({ error: "Company name must be at least 2 characters" }, { status: 400 });
    }

    // ── Check for existing account ──
    const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
    if (existing) {
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });
    }

    // Check for existing company slug
    const companySlug = slugify(companyName.trim());
    const existingCompany = await prisma.company.findUnique({ where: { slug: companySlug } });
    const finalSlug = existingCompany ? `${companySlug}-${Date.now().toString(36)}` : companySlug;

    const passwordHash = await bcrypt.hash(password, 14);

    // Create company and user in transaction
    const company = await prisma.company.create({
      data: {
        slug: finalSlug,
        name: companyName.trim(),
        industry: companyIndustry?.trim() || null,
        location: companyLocation?.trim() || null,
        county: companyCounty?.trim() || null,
        website: companyWebsite?.trim() || null,
        orgType: companyOrgType || "PRIVATE",
      },
    });

    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase().trim(),
        passwordHash,
        name: trimmedName,
        role: "EMPLOYER",
        companyId: company.id,
      },
    });

    return NextResponse.json(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        companyId: company.id,
        companyName: company.name,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Employer registration error:", error);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
