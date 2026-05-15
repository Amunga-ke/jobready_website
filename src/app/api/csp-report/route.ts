import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // Log CSP violations for monitoring
    // In production, send to a logging service
    const report = await request.json();
    console.warn("[CSP Violation]", JSON.stringify(report, null, 2));
    return new NextResponse(null, { status: 204 });
  } catch {
    return new NextResponse(null, { status: 204 });
  }
}
