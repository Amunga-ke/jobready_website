import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// ─── Plan Configuration ───

const PLAN_CONFIG: Record<
  string,
  { name: string; amount: number; periodDays: number; features: string[] }
> = {
  PREMIUM_SMS: {
    name: "Premium SMS Plan",
    amount: 500,
    periodDays: 30,
    features: [
      "email_alerts",
      "sms_alerts",
      "daily_frequency",
      "weekly_frequency",
      "priority_applications",
    ],
  },
  PREMIUM_ALL: {
    name: "Premium All Plan",
    amount: 1000,
    periodDays: 30,
    features: [
      "email_alerts",
      "sms_alerts",
      "whatsapp_alerts",
      "daily_frequency",
      "weekly_frequency",
      "priority_applications",
      "early_access_featured",
    ],
  },
};

const VALID_PLANS = new Set(Object.keys(PLAN_CONFIG));

/**
 * POST /api/notifications/subscribe
 *
 * Subscribe a user to a premium notification plan.
 * Body: { plan: "PREMIUM_SMS" | "PREMIUM_ALL", paymentMethod: "MPESA" }
 *
 * For now, creates the subscription directly.
 * M-Pesa integration can be added later.
 */
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { plan, paymentMethod = "MPESA" } = body;

    // Validate plan
    if (!plan || !VALID_PLANS.has(plan)) {
      return NextResponse.json(
        {
          error: `Invalid plan. Must be one of: ${Array.from(VALID_PLANS).join(", ")}`,
        },
        { status: 400 }
      );
    }

    // Validate payment method
    if (!["MPESA", "MANUAL", "FREE"].includes(paymentMethod)) {
      return NextResponse.json(
        { error: "Invalid payment method" },
        { status: 400 }
      );
    }

    const planConfig = PLAN_CONFIG[plan];
    const now = new Date();
    const periodEnd = new Date(
      now.getTime() + planConfig.periodDays * 24 * 60 * 60 * 1000
    );

    // Check if user already has an active subscription
    const existing = await prisma.seekerSubscription.findUnique({
      where: { userId: session.user.id },
    });

    if (existing && existing.status === "ACTIVE" && existing.currentPeriodEnd > now) {
      return NextResponse.json(
        {
          error: "You already have an active subscription",
          currentPlan: existing.plan,
          periodEnd: existing.currentPeriodEnd.toISOString(),
        },
        { status: 409 }
      );
    }

    // Create or update subscription
    const subscription = await prisma.seekerSubscription.upsert({
      where: { userId: session.user.id },
      create: {
        userId: session.user.id,
        plan,
        status: "ACTIVE",
        amount: planConfig.amount,
        currency: "KES",
        paymentMethod,
        currentPeriodStart: now,
        currentPeriodEnd: periodEnd,
        features: JSON.stringify(planConfig.features),
      },
      update: {
        plan,
        status: "ACTIVE",
        amount: planConfig.amount,
        paymentMethod,
        currentPeriodStart: now,
        currentPeriodEnd: periodEnd,
        features: JSON.stringify(planConfig.features),
      },
    });

    return NextResponse.json({
      success: true,
      subscription: {
        id: subscription.id,
        plan: subscription.plan,
        planName: planConfig.name,
        amount: subscription.amount,
        currency: subscription.currency,
        status: subscription.status,
        paymentMethod: subscription.paymentMethod,
        currentPeriodStart: subscription.currentPeriodStart.toISOString(),
        currentPeriodEnd: subscription.currentPeriodEnd.toISOString(),
        features: planConfig.features,
      },
    });
  } catch (error) {
    console.error("[POST /api/notifications/subscribe] Error:", error);
    return NextResponse.json(
      { error: "Failed to process subscription" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/notifications/subscribe
 *
 * Get the current user's subscription status.
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const subscription = await prisma.seekerSubscription.findUnique({
      where: { userId: session.user.id },
    });

    if (!subscription) {
      return NextResponse.json({
        plan: "FREE",
        status: "NONE",
        features: ["email_alerts"],
      });
    }

    const now = new Date();

    // Check if expired
    if (subscription.status === "ACTIVE" && subscription.currentPeriodEnd < now) {
      await prisma.seekerSubscription.update({
        where: { id: subscription.id },
        data: { status: "EXPIRED" },
      });

      return NextResponse.json({
        id: subscription.id,
        plan: subscription.plan,
        status: "EXPIRED",
        currentPeriodEnd: subscription.currentPeriodEnd.toISOString(),
        features: ["email_alerts"],
      });
    }

    return NextResponse.json({
      id: subscription.id,
      plan: subscription.plan,
      planName: subscription.plan === "PREMIUM_SMS" ? "Premium SMS Plan" :
               subscription.plan === "PREMIUM_ALL" ? "Premium All Plan" : "Free",
      status: subscription.status,
      amount: subscription.amount,
      currency: subscription.currency,
      paymentMethod: subscription.paymentMethod,
      currentPeriodStart: subscription.currentPeriodStart.toISOString(),
      currentPeriodEnd: subscription.currentPeriodEnd.toISOString(),
      features: JSON.parse(subscription.features || "[]"),
    });
  } catch (error) {
    console.error("[GET /api/notifications/subscribe] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch subscription" },
      { status: 500 }
    );
  }
}
