import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("cv") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Only PDF and DOC files are allowed" }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File size must be under 5MB" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = file.name.split(".").pop() || "pdf";
    const fileName = `cv_${session.user.id}_${Date.now()}.${ext}`;

    const uploadDir = path.join(process.cwd(), "public", "uploads", "cv");
    await mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, fileName);
    await writeFile(filePath, buffer);

    const cvUrl = `/uploads/cv/${fileName}`;

    await prisma.user.update({
      where: { id: session.user.id },
      data: { cvUrl },
    });

    return NextResponse.json({ cvUrl });
  } catch (error) {
    console.error("CV upload error:", error);
    return NextResponse.json({ error: "Failed to upload CV" }, { status: 500 });
  }
}
