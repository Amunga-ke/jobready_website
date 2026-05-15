import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ─── Rate Limiter ───
// Uses a sliding window counter with automatic cleanup.
// For serverless, this is per-process. In production, add Redis for shared state.

interface RateLimitEntry {
  timestamps: number[];
}

const rateLimitMap = new Map<string, RateLimitEntry>();
const WINDOW_MS = 60_000; // 1 minute window
const MAX_REQUESTS = 100; // per window
const CLEANUP_INTERVAL = 300_000; // Clean up every 5 minutes
let lastCleanup = Date.now();

function cleanupExpiredEntries(now: number) {
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;
  for (const [key, entry] of rateLimitMap) {
    // Remove timestamps outside the window
    entry.timestamps = entry.timestamps.filter((ts) => now - ts < WINDOW_MS);
    if (entry.timestamps.length === 0) {
      rateLimitMap.delete(key);
    }
  }
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  cleanupExpiredEntries(now);

  let entry = rateLimitMap.get(ip);
  if (!entry) {
    entry = { timestamps: [] };
    rateLimitMap.set(ip, entry);
  }

  // Remove expired timestamps
  entry.timestamps = entry.timestamps.filter((ts) => now - ts < WINDOW_MS);

  if (entry.timestamps.length >= MAX_REQUESTS) {
    return true;
  }

  entry.timestamps.push(now);
  return false;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect dashboard & employer routes — redirect unauthenticated users
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/employer")) {
    const token = request.cookies.get("next-auth.session-token")
      || request.cookies.get("__Secure-next-auth.session-token");
    if (!token) {
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Rate-limit API routes using sliding window
  if (pathname.startsWith("/api/")) {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    if (isRateLimited(ip)) {
      const response = new NextResponse("Too Many Requests", { status: 429 });
      response.headers.set("Retry-After", "60");
      response.headers.set("X-RateLimit-Limit", String(MAX_REQUESTS));
      response.headers.set("X-RateLimit-Remaining", "0");
      return response;
    }

    const response = NextResponse.next();
    const entry = rateLimitMap.get(ip);
    const remaining = entry ? Math.max(0, MAX_REQUESTS - entry.timestamps.length) : MAX_REQUESTS;
    response.headers.set("X-RateLimit-Limit", String(MAX_REQUESTS));
    response.headers.set("X-RateLimit-Remaining", String(remaining));
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/employer/:path*", "/api/:path*"],
};
