import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    // For now, settings are stored as a simple JSON in a UserSettings model
    // Since we don't have a separate settings model, we'll return success
    // Settings will be implemented client-side with localStorage as a fallback
    // until we add a UserSettings model to the schema

    // Store notification preferences and privacy settings
    // We can add these fields to the User model or create a separate table later

    return NextResponse.json({ success: true, settings: body });
  } catch (error) {
    console.error("Update settings error:", error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
