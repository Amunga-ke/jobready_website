import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const cvData = await prisma.cVData.findUnique({
      where: { userId: session.user.id },
    });

    if (!cvData) {
      return NextResponse.json({ error: "No CV data found" }, { status: 404 });
    }

    // JSON-parse all JSON fields
    const safeParse = <T>(value: string | null, fallback: T): T => {
      if (!value) return fallback;
      try {
        return JSON.parse(value) as T;
      } catch {
        return fallback;
      }
    };

    return NextResponse.json({
      id: cvData.id,
      rawText: cvData.rawText,
      phone: cvData.phone,
      email: cvData.email,
      location: cvData.location,
      linkedin: cvData.linkedin,
      portfolio: cvData.portfolio,
      summary: cvData.summary,
      skills: safeParse<string[]>(cvData.skills, []),
      strengths: safeParse<{ area: string; description: string }[]>(cvData.strengths, []),
      experience: safeParse<{ title: string; company: string; location: string; duration: string; description: string }[]>(cvData.experience, []),
      projects: safeParse<{ name: string; role: string; year: string; technologies: string; description: string; achievements: string }[]>(cvData.projects, []),
      education: safeParse<{ degree: string; field: string; institution: string; year: string }[]>(cvData.education, []),
      certifications: safeParse<{ name: string; issuer: string; year: string }[]>(cvData.certifications, []),
      awards: safeParse<{ title: string; issuer: string; year: string }[]>(cvData.awards, []),
      research: safeParse<{ title: string; publisher: string; year: string; description: string }[]>(cvData.research, []),
      volunteering: safeParse<{ organization: string; role: string; duration: string; responsibilities: string }[]>(cvData.volunteering, []),
      languages: safeParse<{ language: string; proficiency: string }[]>(cvData.languages, []),
      interests: safeParse<string[]>(cvData.interests, []),
      createdAt: cvData.createdAt.toISOString(),
      updatedAt: cvData.updatedAt.toISOString(),
    });
  } catch (error) {
    console.error("Get CV data error:", error);
    return NextResponse.json(
      { error: "Failed to load CV data" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.cVData.deleteMany({
      where: { userId: session.user.id },
    });

    // Reset user cvUrl
    await prisma.user.update({
      where: { id: session.user.id },
      data: { cvUrl: null },
    });

    return NextResponse.json({ success: true, message: "CV data deleted" });
  } catch (error) {
    console.error("Delete CV data error:", error);
    return NextResponse.json(
      { error: "Failed to delete CV data" },
      { status: 500 }
    );
  }
}
