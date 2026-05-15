import { NextResponse } from "next/server";
import { processJobAlerts } from "@/lib/services/notifications";

// ─── Configuration ───
// The CRON secret must match the X-CRON-SECRET header
// sent by the cron scheduler (e.g., Vercel Cron, GitHub Actions, etc.)
const CRON_SECRET = process.env.CRON_SECRET || "jobready-cron-2024";

/**
 * POST /api/notifications/alerts/process
 *
 * Cron endpoint to process all active job alerts.
 * Protected by X-CRON-SECRET header for security.
 *
 * Headers:
 *   X-CRON-SECRET: <secret value>
 */
export async function POST(req: Request) {
  try {
    // Validate cron secret
    const cronSecret = req.headers.get("x-cron-secret");
    if (!cronSecret || cronSecret !== CRON_SECRET) {
      console.warn(
        "[POST /api/notifications/alerts/process] Invalid or missing cron secret"
      );
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("[Cron] Starting job alert processing...");

    const result = await processJobAlerts();

    console.log(
      `[Cron] Job alert processing complete: ${JSON.stringify({
        processed: result.processed,
        sent: result.sent,
        failed: result.failed,
      })}`
    );

    return NextResponse.json({
      success: true,
      ...result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error(
      "[POST /api/notifications/alerts/process] Error:",
      error
    );
    return NextResponse.json(
      { error: "Failed to process job alerts" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/notifications/alerts/process
 *
 * Health check endpoint — returns current status without processing.
 */
export async function GET() {
  try {
    const cronSecret = process.env.CRON_SECRET;
    const isConfigured = !!cronSecret && cronSecret !== "jobready-cron-2024";

    return NextResponse.json({
      status: "healthy",
      cronConfigured: isConfigured,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error(
      "[GET /api/notifications/alerts/process] Error:",
      error
    );
    return NextResponse.json(
      { error: "Health check failed" },
      { status: 500 }
    );
  }
}
