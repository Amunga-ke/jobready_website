import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

/**
 * Server-side guard: verifies the user is authenticated with EMPLOYER role
 * and has a linked company. Returns { userId, companyId } or an error response.
 */
export async function requireEmployer() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }

  if (session.user.role !== "EMPLOYER") {
    return { error: NextResponse.json({ error: "Forbidden: Employer access required" }, { status: 403 }) };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, companyId: true },
  });

  if (!user?.companyId) {
    return { error: NextResponse.json({ error: "No company linked to your account" }, { status: 403 }) };
  }

  return { userId: user.id, companyId: user.companyId };
}
