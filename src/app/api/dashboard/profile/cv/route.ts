import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { extractTextFromCV, parseCVManual } from "@/lib/cv-parser";
import { KE_COUNTIES } from "@/lib/constants";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("cv") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // File extension validation
    const ext = file.name.split(".").pop()?.toLowerCase();
    const allowedExts = ["pdf", "doc", "docx"];
    if (!ext || !allowedExts.includes(ext)) {
      return NextResponse.json(
        { error: "Only PDF, DOC, and DOCX files are allowed" },
        { status: 400 }
      );
    }

    // File size check
    if (file.size < 1024) {
      return NextResponse.json(
        { error: "File is too small — may be empty or corrupt" },
        { status: 400 }
      );
    }
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size must be under 5MB" },
        { status: 400 }
      );
    }

    // Magic byte detection
    const buffer = Buffer.from(await file.arrayBuffer());
    const isPDF = buffer[0] === 0x25 && buffer[1] === 0x50 && buffer[2] === 0x44 && buffer[3] === 0x46; // %PDF
    const isDOCX = buffer[0] === 0x50 && buffer[1] === 0x4B; // PK (ZIP header for DOCX)
    const isDOC = !isPDF && !isDOCX && buffer.length > 512;

    if (ext === "pdf" && !isPDF) {
      return NextResponse.json(
        { error: "File is not a valid PDF" },
        { status: 400 }
      );
    }
    if (ext === "docx" && !isDOCX) {
      return NextResponse.json(
        { error: "File is not a valid DOCX" },
        { status: 400 }
      );
    }

    // Extract text from CV
    let rawText: string;
    try {
      rawText = await extractTextFromCV(file);
    } catch (extractError) {
      console.error("CV text extraction error:", extractError);
      return NextResponse.json(
        { error: "Failed to extract text from CV. Please ensure the file is not password-protected or corrupt." },
        { status: 400 }
      );
    }

    if (!rawText || rawText.trim().length < 20) {
      return NextResponse.json(
        { error: "Could not extract enough text from the CV. The file may be image-based or corrupt." },
        { status: 400 }
      );
    }

    // Parse CV
    const parsed = parseCVManual(rawText.trim());

    // Delete existing CVData if any
    await prisma.cVData.deleteMany({
      where: { userId: session.user.id },
    });

    // Create new CVData
    await prisma.cVData.create({
      data: {
        userId: session.user.id,
        rawText: rawText.trim().substring(0, 100000), // Limit raw text storage
        phone: parsed.phone,
        email: parsed.email,
        location: parsed.location,
        linkedin: parsed.linkedin,
        portfolio: parsed.portfolio,
        summary: parsed.summary,
        skills: parsed.skills.length > 0 ? JSON.stringify(parsed.skills) : null,
        strengths: parsed.strengths.length > 0 ? JSON.stringify(parsed.strengths) : null,
        experience: parsed.experience.length > 0 ? JSON.stringify(parsed.experience) : null,
        projects: parsed.projects.length > 0 ? JSON.stringify(parsed.projects) : null,
        education: parsed.education.length > 0 ? JSON.stringify(parsed.education) : null,
        certifications: parsed.certifications.length > 0 ? JSON.stringify(parsed.certifications) : null,
        awards: parsed.awards.length > 0 ? JSON.stringify(parsed.awards) : null,
        research: parsed.research.length > 0 ? JSON.stringify(parsed.research) : null,
        volunteering: parsed.volunteering.length > 0 ? JSON.stringify(parsed.volunteering) : null,
        languages: parsed.languages.length > 0 ? JSON.stringify(parsed.languages) : null,
        interests: parsed.interests.length > 0 ? JSON.stringify(parsed.interests) : null,
      },
    });

    // Auto-fill user profile
    const profileUpdate: Record<string, string | null> = {};
    const autoFilled: string[] = [];

    if (parsed.phone && !session.user.phone) {
      profileUpdate.phone = parsed.phone;
      autoFilled.push("phone");
    }

    if (parsed.location) {
      // Try to match location to a Kenyan county
      const locationLower = parsed.location.toLowerCase();
      const matchedCounty = KE_COUNTIES.find(c =>
        locationLower.includes(c.toLowerCase())
      );
      if (matchedCounty) {
        profileUpdate.county = matchedCounty;
        autoFilled.push("county");
      }
    }

    if (parsed.summary && !session.user.bio) {
      profileUpdate.bio = parsed.summary.substring(0, 500);
      autoFilled.push("bio");
    }

    // Update user profile and cvUrl sentinel
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        cvUrl: "parsed",
        ...profileUpdate,
      },
    });

    // Calculate extraction counts
    const sectionCounts: Record<string, number> = {};
    if (parsed.summary) sectionCounts.summary = 1;
    if (parsed.skills.length > 0) sectionCounts.skills = parsed.skills.length;
    if (parsed.strengths.length > 0) sectionCounts.strengths = parsed.strengths.length;
    if (parsed.experience.length > 0) sectionCounts.experience = parsed.experience.length;
    if (parsed.projects.length > 0) sectionCounts.projects = parsed.projects.length;
    if (parsed.education.length > 0) sectionCounts.education = parsed.education.length;
    if (parsed.certifications.length > 0) sectionCounts.certifications = parsed.certifications.length;
    if (parsed.awards.length > 0) sectionCounts.awards = parsed.awards.length;
    if (parsed.research.length > 0) sectionCounts.research = parsed.research.length;
    if (parsed.volunteering.length > 0) sectionCounts.volunteering = parsed.volunteering.length;
    if (parsed.languages.length > 0) sectionCounts.languages = parsed.languages.length;
    if (parsed.interests.length > 0) sectionCounts.interests = parsed.interests.length;

    return NextResponse.json({
      success: true,
      cvUrl: "parsed",
      sectionCounts,
      autoFilled,
      message: "CV parsed successfully",
    });
  } catch (error) {
    console.error("CV upload error:", error);
    return NextResponse.json(
      { error: "Failed to process CV" },
      { status: 500 }
    );
  }
}
