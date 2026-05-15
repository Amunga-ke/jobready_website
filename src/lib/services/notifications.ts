import prisma from "@/lib/prisma";
import { sendJobAlertEmail } from "./email";
import { sendJobAlertSms } from "./sms";
import { sendJobAlertWhatsApp } from "./whatsapp";
import { SITE_URL } from "@/lib/config";

// ─── Types ───

type NotificationChannel = "email" | "sms" | "whatsapp";
type SubscriptionPlan = "FREE" | "PREMIUM_SMS" | "PREMIUM_ALL";

interface DispatchJobAlertParams {
  user: {
    id: string;
    email: string;
    name: string;
    phone?: string | null;
  };
  jobs: Array<{
    title: string;
    company: string;
    location: string;
    url: string;
  }>;
  channels?: NotificationChannel[];
}

interface DispatchResult {
  email: { success: boolean; error?: string } | null;
  sms: { success: boolean; error?: string } | null;
  whatsapp: { success: boolean; error?: string } | null;
}

interface ProcessJobAlertsResult {
  processed: number;
  sent: number;
  failed: number;
  details: Array<{ alertId: string; status: string; error?: string }>;
}

// ─── Plan → Channel Mapping ───

const PLAN_CHANNELS: Record<SubscriptionPlan, NotificationChannel[]> = {
  FREE: ["email"],
  PREMIUM_SMS: ["email", "sms"],
  PREMIUM_ALL: ["email", "sms", "whatsapp"],
};

/**
 * Determine which notification channels a user has access to
 * based on their subscription plan.
 */
async function getUserChannels(userId: string): Promise<NotificationChannel[]> {
  const subscription = await prisma.seekerSubscription.findUnique({
    where: { userId },
    select: { plan: true, status: true },
  });

  if (!subscription || subscription.status !== "ACTIVE") {
    return PLAN_CHANNELS.FREE;
  }

  return PLAN_CHANNELS[subscription.plan as SubscriptionPlan] || PLAN_CHANNELS.FREE;
}

/**
 * Dispatch a job alert across the user's enabled notification channels.
 *
 * Channel availability is determined by the user's subscription plan:
 * - FREE: email only
 * - PREMIUM_SMS: email + SMS
 * - PREMIUM_ALL: email + SMS + WhatsApp
 *
 * If `channels` is provided, it overrides the plan-based channel list
 * (filtered to only include channels the user has access to).
 */
export async function dispatchJobAlert({
  user,
  jobs,
  channels: requestedChannels,
}: DispatchJobAlertParams): Promise<DispatchResult> {
  const result: DispatchResult = {
    email: null,
    sms: null,
    whatsapp: null,
  };

  if (jobs.length === 0) {
    return result;
  }

  // Determine available channels
  let enabledChannels: NotificationChannel[];

  if (requestedChannels) {
    // Use requested channels filtered by what the user's plan allows
    const planChannels = await getUserChannels(user.id);
    enabledChannels = requestedChannels.filter((ch) =>
      planChannels.includes(ch)
    );
  } else {
    enabledChannels = await getUserChannels(user.id);
  }

  // Dispatch to each enabled channel in parallel
  const promises: Promise<void>[] = [];

  if (enabledChannels.includes("email")) {
    promises.push(
      sendJobAlertEmail({
        to: user.email,
        name: user.name || undefined,
        jobs,
      })
        .then((res) => {
          result.email = { success: res.success, error: res.error };
        })
        .catch((err) => {
          const message =
            err instanceof Error ? err.message : "Unknown email error";
          result.email = { success: false, error: message };
        })
    );
  }

  if (enabledChannels.includes("sms") && user.phone) {
    // For SMS, send the top job (individual SMS per job would be too many)
    const topJob = jobs[0];
    promises.push(
      sendJobAlertSms({
        userId: user.id,
        phone: user.phone,
        jobTitle: topJob.title,
        company: topJob.company,
        location: topJob.location,
        jobUrl: topJob.url,
      })
        .then((res) => {
          result.sms = { success: res.success, error: res.error };
        })
        .catch((err) => {
          const message =
            err instanceof Error ? err.message : "Unknown SMS error";
          result.sms = { success: false, error: message };
        })
    );
  }

  if (enabledChannels.includes("whatsapp") && user.phone) {
    // For WhatsApp, send the top job
    const topJob = jobs[0];
    promises.push(
      sendJobAlertWhatsApp({
        userId: user.id,
        phone: user.phone,
        jobTitle: topJob.title,
        company: topJob.company,
        location: topJob.location,
        jobUrl: topJob.url,
      })
        .then((res) => {
          result.whatsapp = { success: res.success, error: res.error };
        })
        .catch((err) => {
          const message =
            err instanceof Error ? err.message : "Unknown WhatsApp error";
          result.whatsapp = { success: false, error: message };
        })
    );
  }

  await Promise.allSettled(promises);

  return result;
}

/**
 * Process all active job alerts that are due for triggering.
 * This function is designed to be called by a cron job or scheduled task.
 *
 * For each alert:
 * 1. Checks if the alert frequency threshold has been met
 * 2. Parses the alert query to find matching jobs
 * 3. Dispatches notifications to the alert owner's enabled channels
 * 4. Updates the alert's lastTriggered timestamp
 */
export async function processJobAlerts(): Promise<ProcessJobAlertsResult> {
  const result: ProcessJobAlertsResult = {
    processed: 0,
    sent: 0,
    failed: 0,
    details: [],
  };

  try {
    // Frequency thresholds (how long to wait between triggers)
    const frequencyThresholds: Record<string, number> = {
      DAILY: 24 * 60 * 60 * 1000, // 24 hours
      WEEKLY: 7 * 24 * 60 * 60 * 1000, // 7 days
      MONTHLY: 30 * 24 * 60 * 60 * 1000, // 30 days
    };

    const now = new Date();

    // Get all active job alerts
    const alerts = await prisma.jobAlert.findMany({
      where: {
        isActive: true,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            phone: true,
          },
        },
      },
    });

    for (const alert of alerts) {
      try {
        // Check if the alert is due based on frequency
        const threshold =
          frequencyThresholds[alert.frequency] ||
          frequencyThresholds.DAILY;

        const lastTriggered = alert.lastTriggered
          ? new Date(alert.lastTriggered).getTime()
          : 0;
        const elapsed = now.getTime() - lastTriggered;

        if (elapsed < threshold) {
          continue; // Not yet due
        }

        result.processed++;

        // Parse the alert query to find matching jobs
        const matchingJobs = await findMatchingJobs(alert.query, lastTriggered);

        if (matchingJobs.length === 0) {
          result.details.push({
            alertId: alert.id,
            status: "NO_MATCH",
          });
          // Still update lastTriggered so we don't keep checking until the next period
          await prisma.jobAlert.update({
            where: { id: alert.id },
            data: { lastTriggered: now },
          });
          continue;
        }

        // Dispatch notifications
        const dispatchResult = await dispatchJobAlert({
          user: {
            id: alert.user.id,
            email: alert.user.email,
            name: alert.user.name,
            phone: alert.user.phone,
          },
          jobs: matchingJobs.map((job) => ({
            title: job.title,
            company: job.company.name,
            location: job.county || job.town,
            url: `${SITE_URL}/jobs/${job.slug}`,
          })),
        });

        // Check if at least one channel succeeded
        const anySuccess =
          (dispatchResult.email?.success ?? false) ||
          (dispatchResult.sms?.success ?? false) ||
          (dispatchResult.whatsapp?.success ?? false);

        // Update lastTriggered
        await prisma.jobAlert.update({
          where: { id: alert.id },
          data: { lastTriggered: now },
        });

        if (anySuccess) {
          result.sent++;
          result.details.push({
            alertId: alert.id,
            status: "SENT",
          });
        } else {
          result.failed++;
          result.details.push({
            alertId: alert.id,
            status: "FAILED",
            error: "All channels failed",
          });
        }
      } catch (error) {
        result.failed++;
        result.details.push({
          alertId: alert.id,
          status: "ERROR",
          error: error instanceof Error ? error.message : "Unknown error",
        });
        console.error(
          `[Notification] Error processing alert ${alert.id}:`,
          error
        );
      }
    }
  } catch (error) {
    console.error("[Notification] Error in processJobAlerts:", error);
  }

  console.log(
    `[Notification] processJobAlerts complete: ${result.processed} processed, ${result.sent} sent, ${result.failed} failed`
  );

  return result;
}

// ─── Internal: Job Matching ───

/**
 * Find jobs matching an alert's query that were created after the given timestamp.
 * The query can be a JSON string with filters or a plain text search string.
 */
async function findMatchingJobs(
  query: string,
  sinceTimestamp: number
): Promise<
  Array<{
    id: string;
    slug: string;
    title: string;
    county: string;
    town: string;
    company: { name: string };
  }>
> {
  const sinceDate = sinceTimestamp > 0 ? new Date(sinceTimestamp) : undefined;

  let where: Record<string, unknown> = {
    status: "ACTIVE",
    listingType: "JOB",
  };

  // Only look for jobs created after the last trigger
  if (sinceDate) {
    where.createdAt = { gte: sinceDate };
  }

  try {
    // Try to parse query as JSON filters
    const filters = JSON.parse(query);

    if (filters.county) {
      where.county = filters.county;
    }
    if (filters.category) {
      where.category = { slug: filters.category };
    }
    if (filters.employmentType) {
      where.employmentType = filters.employmentType;
    }
    if (filters.experienceLevel) {
      where.experienceLevel = filters.experienceLevel;
    }
    if (filters.keyword) {
      where.title = { contains: filters.keyword, mode: "insensitive" };
    }
  } catch {
    // If JSON parsing fails, treat as a text search on job title
    where.title = { contains: query, mode: "insensitive" };
  }

  return prisma.listing.findMany({
    where,
    select: {
      id: true,
      slug: true,
      title: true,
      county: true,
      town: true,
      company: {
        select: { name: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 20, // Limit results per alert
  });
}
