import nodemailer from "nodemailer";
import prisma from "@/lib/prisma";
import { SITE_URL, SITE_TITLE } from "@/lib/config";

// ─── SMTP Configuration ───
const SMTP_HOST = "mail.jobready.co.ke";
const SMTP_PORT = 587;
const SMTP_USER = "cv@jobready.co.ke";
const SMTP_PASS = "Amush@100%";

// ─── Types ───

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  template?: string;
  userId?: string;
}

interface JobListing {
  title: string;
  company: string;
  location: string;
  url: string;
}

interface SendJobAlertEmailParams {
  to: string;
  name: string;
  jobs: JobListing[];
}

interface SendWelcomeEmailParams {
  to: string;
  name: string;
}

interface SendSubscriptionConfirmationEmailParams {
  to: string;
  name: string;
  plan: string;
  amount: number;
  periodEnd: string;
}

interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

// ─── Transporter (lazy-initialized singleton) ───

let transporterInstance: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter {
  if (!transporterInstance) {
    transporterInstance = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: false, // STARTTLS on port 587
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });
  }
  return transporterInstance;
}

// ─── Email Template Helpers ───

const BRAND_COLORS = {
  primary: "#16a34a", // green-600
  secondary: "#15803d", // green-700
  bg: "#f0fdf4", // green-50
  text: "#1a1a1a",
  muted: "#6b7280",
};

function emailWrapper({
  title,
  content,
  name,
}: {
  title: string;
  content: string;
  name?: string;
}): string {
  const greeting = name ? `Hi ${name},` : "Hello,";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
</head>
<body style="margin:0; padding:0; background-color:#f9fafb; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9fafb; padding:32px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 1px 3px rgba(0,0,0,0.1); max-width:600px; width:100%;">

          <!-- Header -->
          <tr>
            <td style="background-color:${BRAND_COLORS.primary}; padding:24px 32px; text-align:center;">
              <a href="${SITE_URL}" style="text-decoration:none; color:#ffffff; font-size:24px; font-weight:700; letter-spacing:-0.5px;">
                JobReady
              </a>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              <p style="margin:0 0 16px; font-size:18px; font-weight:600; color:${BRAND_COLORS.text};">
                ${title}
              </p>
              <p style="margin:0 0 24px; font-size:16px; color:${BRAND_COLORS.muted};">
                ${greeting}
              </p>
              <div style="font-size:15px; line-height:1.6; color:${BRAND_COLORS.text};">
                ${content}
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 32px; border-top:1px solid #e5e7eb; text-align:center;">
              <p style="margin:0 0 8px; font-size:13px; color:${BRAND_COLORS.muted};">
                You received this email because you have an account on ${SITE_TITLE}.
              </p>
              <p style="margin:0; font-size:13px; color:${BRAND_COLORS.muted};">
                &copy; ${new Date().getFullYear()} JobReady. All rights reserved.
                <br />
                <a href="${SITE_URL}" style="color:${BRAND_COLORS.primary}; text-decoration:underline;">${SITE_URL.replace("https://", "")}</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ─── Core Email Functions ───

/**
 * Send an email via SMTP.
 * Logs the attempt to EmailLog regardless of outcome.
 */
export async function sendEmail({
  to,
  subject,
  html,
  template,
  userId,
}: SendEmailParams): Promise<EmailResult> {
  // Create log entry
  const logEntry = await prisma.emailLog.create({
    data: {
      userId: userId || null,
      to,
      subject,
      status: "PENDING",
      template: template || null,
    },
  });

  try {
    const transporter = getTransporter();

    const info = await transporter.sendMail({
      from: `"JobReady" <${SMTP_USER}>`,
      to,
      subject,
      html,
    });

    const messageId = info.messageId;

    await prisma.emailLog.update({
      where: { id: logEntry.id },
      data: {
        status: "SENT",
        metadata: JSON.stringify({ messageId }),
      },
    });

    return { success: true, messageId };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown email send error";

    await prisma.emailLog.update({
      where: { id: logEntry.id },
      data: {
        status: "FAILED",
        metadata: JSON.stringify({ error: errorMessage }),
      },
    });

    console.error(`[Email] Failed to send to ${to}:`, error);
    return { success: false, error: errorMessage };
  }
}

/**
 * Send a job alert email with formatted HTML listings.
 */
export async function sendJobAlertEmail({
  to,
  name,
  jobs,
}: SendJobAlertEmailParams): Promise<EmailResult> {
  if (jobs.length === 0) {
    return { success: false, error: "No jobs to send" };
  }

  const jobItemsHtml = jobs
    .slice(0, 20) // Limit to 20 jobs per email
    .map(
      (job, index) => `
      <tr>
        <td style="padding:16px 0; ${index < jobs.length - 1 ? "border-bottom:1px solid #e5e7eb;" : ""}">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding:4px 0;">
                <a href="${job.url}" style="font-size:16px; font-weight:600; color:${BRAND_COLORS.primary}; text-decoration:none;">
                  ${escapeHtml(job.title)}
                </a>
              </td>
            </tr>
            <tr>
              <td style="padding:4px 0; font-size:14px; color:${BRAND_COLORS.muted};">
                ${escapeHtml(job.company)} &middot; ${escapeHtml(job.location)}
              </td>
            </tr>
            <tr>
              <td style="padding:8px 0;">
                <a href="${job.url}" style="display:inline-block; padding:8px 16px; background-color:${BRAND_COLORS.primary}; color:#ffffff; text-decoration:none; border-radius:6px; font-size:13px; font-weight:500;">
                  View & Apply
                </a>
              </td>
            </tr>
          </table>
        </td>
      </tr>`
    )
    .join("");

  const moreCount = jobs.length - 20;
  const moreText =
    moreCount > 0
      ? `<p style="margin-top:16px; font-size:14px; color:${BRAND_COLORS.muted};">
          ...and ${moreCount} more jobs waiting for you on JobReady!
        </p>`
      : "";

  const content = `
    <p>We found <strong>${jobs.length} new job${jobs.length > 1 ? "s" : ""}</strong> matching your alert:</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      ${jobItemsHtml}
    </table>
    ${moreText}
    <p style="margin-top:24px; font-size:14px; color:${BRAND_COLORS.muted};">
      Good luck with your job search!
    </p>
  `;

  const html = emailWrapper({
    title: `New Jobs Matching Your Alert`,
    content,
    name,
  });

  return sendEmail({
    to,
    subject: `JobReady: ${jobs.length} new job${jobs.length > 1 ? "s" : ""} matching your alert`,
    html,
    template: "JOB_ALERT",
  });
}

/**
 * Send a welcome email to a newly registered user.
 */
export async function sendWelcomeEmail({
  to,
  name,
}: SendWelcomeEmailParams): Promise<EmailResult> {
  const content = `
    <p>Welcome to <strong>JobReady</strong> — Kenya's fastest-growing job board!</p>
    <p>Here's what you can do:</p>
    <ul style="padding-left:20px; line-height:2;">
      <li><strong>Browse jobs</strong> from verified employers across all 47 counties</li>
      <li><strong>Create job alerts</strong> and get notified when new opportunities match your criteria</li>
      <li><strong>Apply directly</strong> to positions with your profile and CV</li>
      <li><strong>Track applications</strong> and manage your job search in one place</li>
    </ul>
    <p style="margin-top:24px;">
      <a href="${SITE_URL}/jobs" style="display:inline-block; padding:12px 24px; background-color:${BRAND_COLORS.primary}; color:#ffffff; text-decoration:none; border-radius:8px; font-weight:600;">
        Start Browsing Jobs
      </a>
    </p>
    <p style="margin-top:16px; font-size:14px; color:${BRAND_COLORS.muted};">
      If you didn't create this account, you can safely ignore this email.
    </p>
  `;

  const html = emailWrapper({
    title: "Welcome to JobReady! 🎉",
    content,
    name,
  });

  return sendEmail({
    to,
    subject: "Welcome to JobReady — Your Job Search Starts Here",
    html,
    template: "WELCOME",
  });
}

/**
 * Send a subscription confirmation email after a premium plan purchase.
 */
export async function sendSubscriptionConfirmationEmail({
  to,
  name,
  plan,
  amount,
  periodEnd,
}: SendSubscriptionConfirmationEmailParams): Promise<EmailResult> {
  const planNames: Record<string, string> = {
    PREMIUM_SMS: "Premium SMS Plan",
    PREMIUM_ALL: "Premium All Plan",
  };

  const planFeatures: Record<string, string[]> = {
    PREMIUM_SMS: [
      "Email job alerts",
      "SMS job alerts delivered to your phone",
      "Daily or weekly alert frequency",
      "Priority application processing",
    ],
    PREMIUM_ALL: [
      "Email job alerts",
      "SMS job alerts delivered to your phone",
      "WhatsApp job alerts",
      "Daily or weekly alert frequency",
      "Priority application processing",
      "Early access to featured jobs",
    ],
  };

  const planName = planNames[plan] || plan;
  const features = planFeatures[plan] || [];

  const featuresHtml = features
    .map(
      (f) => `
    <li style="padding:6px 0; font-size:14px;">
      <span style="color:${BRAND_COLORS.primary}; margin-right:8px;">&#10003;</span>
      ${f}
    </li>`
    )
    .join("");

  const content = `
    <p>Thank you for upgrading to <strong>${planName}</strong>!</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0; background-color:${BRAND_COLORS.bg}; border-radius:8px; padding:20px;">
      <tr>
        <td style="padding:20px;">
          <p style="margin:0 0 8px; font-size:14px; color:${BRAND_COLORS.muted};">Plan</p>
          <p style="margin:0 0 16px; font-size:18px; font-weight:600; color:${BRAND_COLORS.text};">${planName}</p>
          <p style="margin:0 0 8px; font-size:14px; color:${BRAND_COLORS.muted};">Amount Paid</p>
          <p style="margin:0 0 16px; font-size:18px; font-weight:600; color:${BRAND_COLORS.text};">KES ${amount.toLocaleString()}</p>
          <p style="margin:0 0 8px; font-size:14px; color:${BRAND_COLORS.muted};">Valid Until</p>
          <p style="margin:0; font-size:18px; font-weight:600; color:${BRAND_COLORS.text};">${periodEnd}</p>
        </td>
      </tr>
    </table>
    <p style="margin-top:16px; font-weight:600;">Your plan includes:</p>
    <ul style="padding-left:0; list-style:none; margin-top:12px;">
      ${featuresHtml}
    </ul>
    <p style="margin-top:24px; font-size:14px; color:${BRAND_COLORS.muted};">
      You can manage your subscription from your dashboard at any time.
    </p>
  `;

  const html = emailWrapper({
    title: "Subscription Confirmed",
    content,
    name,
  });

  return sendEmail({
    to,
    subject: `JobReady: Your ${planName} is now active!`,
    html,
    template: "SUBSCRIPTION_CONFIRMATION",
  });
}

// ─── Utility ───

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
