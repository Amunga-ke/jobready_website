import prisma from "@/lib/prisma";

// ─── TalkSasa Bulk SMS API Configuration ───
const TALKSASA_BASE_URL = "https://bulksms.talksasa.com/api/v3";
const TALKSASA_API_TOKEN = "2659|FnfdH7nCnLtOkVf1p37QQWPKp5DNnt7tN7MV718b16a3065f";
const TALKSASA_SENDER_ID = "TALK-SASA";

// ─── Types ───

interface SendSmsParams {
  to: string;
  message: string;
  type?: string; // JOB_ALERT, VERIFICATION, MARKETING
  userId?: string;
}

interface SendBulkSmsParams {
  recipients: Array<{ phone: string; message?: string }>;
  message?: string; // fallback if per-recipient message not provided
  type?: string;
}

interface SendJobAlertSmsParams {
  userId: string;
  phone: string;
  jobTitle: string;
  company: string;
  location: string;
  jobUrl: string;
}

interface SmsResult {
  success: boolean;
  messageId?: string;
  cost?: number;
  error?: string;
}

interface BulkSmsResult {
  success: boolean;
  sent: number;
  failed: number;
  totalCost: number;
  errors: Array<{ phone: string; error: string }>;
}

// ─── Helpers ───

/**
 * Normalize a Kenyan phone number to the 254XXXXXXXXX format.
 * Handles: 07XX, +254XX, 254XX, 7XX
 */
export function normalizePhoneNumber(phone: string): string {
  const digits = phone.replace(/\D/g, "");

  if (digits.startsWith("254") && digits.length === 12) {
    return digits;
  }

  if (digits.startsWith("0") && digits.length === 10) {
    return `254${digits.slice(1)}`;
  }

  if (digits.startsWith("7") && digits.length === 9) {
    return `254${digits}`;
  }

  // If already in expected format or unrecognized, return as-is
  return digits.length >= 10 ? digits : phone;
}

// ─── Core SMS Functions ───

/**
 * Send a single SMS via TalkSasa API.
 * Logs the attempt to SmsLog regardless of outcome.
 */
export async function sendSms({
  to,
  message,
  type = "JOB_ALERT",
  userId,
}: SendSmsParams): Promise<SmsResult> {
  const phone = normalizePhoneNumber(to);

  // Create log entry as PENDING
  const logEntry = await prisma.smsLog.create({
    data: {
      userId: userId || null,
      phone,
      message,
      senderId: TALKSASA_SENDER_ID,
      status: "PENDING",
      type,
    },
  });

  try {
    const response = await fetch(`${TALKSASA_BASE_URL}/sms/send`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${TALKSASA_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        recipients: [phone],
        message,
        sender_id: TALKSASA_SENDER_ID,
      }),
    });

    const data = await response.json();

    if (response.ok && data?.success) {
      const messageId =
        data?.data?.message_id ||
        data?.message_id ||
        logEntry.id;

      const cost = data?.data?.cost ?? 1.0;

      // Update log as SENT
      await prisma.smsLog.update({
        where: { id: logEntry.id },
        data: {
          status: "SENT",
          providerRef: messageId,
          cost,
        },
      });

      return { success: true, messageId, cost };
    } else {
      // API returned an error
      const errorMessage =
        data?.message || data?.error || "TalkSasa API returned an error";

      await prisma.smsLog.update({
        where: { id: logEntry.id },
        data: {
          status: "FAILED",
          metadata: JSON.stringify({ apiResponse: data }),
        },
      });

      console.error(`[SMS] Failed to send to ${phone}: ${errorMessage}`);
      return { success: false, error: errorMessage };
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown SMS send error";

    await prisma.smsLog.update({
      where: { id: logEntry.id },
      data: {
        status: "FAILED",
        metadata: JSON.stringify({ error: errorMessage }),
      },
    });

    console.error(`[SMS] Exception sending to ${phone}:`, error);
    return { success: false, error: errorMessage };
  }
}

/**
 * Send the same message to multiple recipients in one batch call.
 * Falls back to individual sends if the batch API fails.
 */
export async function sendBulkSms({
  recipients,
  message: defaultMessage,
  type = "JOB_ALERT",
}: SendBulkSmsParams): Promise<BulkSmsResult> {
  const errors: Array<{ phone: string; error: string }> = [];
  let sent = 0;
  let failed = 0;
  let totalCost = 0;

  // Normalize all phone numbers and prepare recipients
  const normalizedRecipients = recipients.map((r) => ({
    phone: normalizePhoneNumber(r.phone),
    message: r.message || defaultMessage || "",
  }));

  // Separate recipients with custom messages vs. those using the default
  const defaultRecipients = normalizedRecipients
    .filter((r) => r.message === defaultMessage)
    .map((r) => r.phone);

  const customRecipients = normalizedRecipients.filter(
    (r) => r.message !== defaultMessage
  );

  // Try batch send for recipients with the default message
  if (defaultRecipients.length > 0 && defaultMessage) {
    try {
      const response = await fetch(`${TALKSASA_BASE_URL}/sms/send`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${TALKSASA_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recipients: defaultRecipients,
          message: defaultMessage,
          sender_id: TALKSASA_SENDER_ID,
        }),
      });

      const data = await response.json();

      if (response.ok && data?.success) {
        sent += defaultRecipients.length;
        totalCost += data?.data?.cost ?? defaultRecipients.length * 1.0;

        // Log each recipient
        for (const phone of defaultRecipients) {
          await prisma.smsLog.create({
            data: {
              phone,
              message: defaultMessage!,
              senderId: TALKSASA_SENDER_ID,
              status: "SENT",
              type,
              providerRef: data?.data?.message_id || null,
              cost: data?.data?.cost
                ? data.data.cost / defaultRecipients.length
                : 1.0,
            },
          });
        }
      } else {
        // Batch failed, fall back to individual sends
        console.warn(
          "[SMS] Batch send failed, falling back to individual sends"
        );
        const individualResults = await Promise.allSettled(
          defaultRecipients.map((phone) =>
            sendSms({ to: phone, message: defaultMessage!, type })
          )
        );

        for (const result of individualResults) {
          if (result.status === "fulfilled" && result.value.success) {
            sent++;
            totalCost += result.value.cost ?? 1.0;
          } else {
            failed++;
            errors.push({
              phone: "unknown",
              error:
                result.status === "fulfilled"
                  ? result.value.error || "Unknown error"
                  : "Promise rejected",
            });
          }
        }
      }
    } catch (error) {
      console.error("[SMS] Batch send exception:", error);
      // Fall back to individual sends
      const individualResults = await Promise.allSettled(
        defaultRecipients.map((phone) =>
          sendSms({ to: phone, message: defaultMessage!, type })
        )
      );

      for (const result of individualResults) {
        if (result.status === "fulfilled" && result.value.success) {
          sent++;
          totalCost += result.value.cost ?? 1.0;
        } else {
          failed++;
          errors.push({
            phone: "unknown",
            error:
              result.status === "fulfilled"
                ? result.value.error || "Unknown error"
                : "Promise rejected",
          });
        }
      }
    }
  }

  // Send custom messages individually
  for (const recipient of customRecipients) {
    try {
      const result = await sendSms({
        to: recipient.phone,
        message: recipient.message,
        type,
      });
      if (result.success) {
        sent++;
        totalCost += result.cost ?? 1.0;
      } else {
        failed++;
        errors.push({
          phone: recipient.phone,
          error: result.error || "Send failed",
        });
      }
    } catch {
      failed++;
      errors.push({
        phone: recipient.phone,
        error: "Exception during send",
      });
    }
  }

  return {
    success: failed === 0,
    sent,
    failed,
    totalCost,
    errors,
  };
}

/**
 * Send a formatted job alert SMS.
 * Formats the message as:
 * "JobReady Alert: {jobTitle} at {company}, {location}. Apply: {jobUrl}"
 */
export async function sendJobAlertSms({
  userId,
  phone,
  jobTitle,
  company,
  location,
  jobUrl,
}: SendJobAlertSmsParams): Promise<SmsResult> {
  const message = `JobReady Alert: ${jobTitle} at ${company}, ${location}. Apply: ${jobUrl}`;

  return sendSms({
    to: phone,
    message,
    type: "JOB_ALERT",
    userId,
  });
}
