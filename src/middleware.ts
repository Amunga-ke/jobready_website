import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const rateLimitMap = new Map<string, { count: number; lastReset: number }>();
const WINDOW_MS = 60_000; // 1 minute
const MAX_REQUESTS = 100; // per window

export function middleware(request: NextRequest) {
  // Only rate-limit API routes
  if (!request.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now - record.lastReset > WINDOW_MS) {
    rateLimitMap.set(ip, { count: 1, lastReset: now });
    return NextResponse.next();
  }

  if (record.count >= MAX_REQUESTS) {
    return new NextResponse("Too Many Requests", { status: 429 });
  }

  record.count++;
  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};
