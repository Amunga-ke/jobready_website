import prisma from "@/lib/prisma";
import { normalizePhoneNumber } from "./sms";

// ─── WhatsApp Configuration ───
// This is a placeholder service. To activate:
// 1. Set up a Meta Business Account
// 2. Create a WhatsApp Business API app
// 3. Set the following environment variables:
//    - WHATSAPP_ACCESS_TOKEN
//    - WHATSAPP_PHONE_NUMBER_ID
//    - WHATSAPP_VERIFY_TOKEN (for webhook verification)

const WHATSAPP_API_URL = "https://graph.facebook.com/v18.0";

// ─── Types ───

interface SendWhatsAppParams {
  to: string;
  message: string;
  type?: string; // JOB_ALERT, VERIFICATION, MARKETING
  userId?: string;
}

interface SendJobAlertWhatsAppParams {
  userId: string;
  phone: string;
  jobTitle: string;
  company: string;
  location: string;
  jobUrl: string;
}

interface WhatsAppResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

// ─── Core WhatsApp Functions ───

/**
 * Send a WhatsApp message.
 *
 * Currently this is a placeholder implementation that logs the message
 * to SmsLog with type='WHATSAPP'. The actual Meta Cloud API integration
 * requires a Meta Business Account and WhatsApp Business API setup.
 *
 * To integrate with Meta Cloud API:
 * 1. Call POST /{phone_number_id}/messages
 * 2. Headers: Authorization: Bearer {access_token}
 * 3. Body: { messaging_product: "whatsapp", to: "254XXXXXXXXX", type: "text", text: { body: "..." } }
 */
export async function sendWhatsApp({
  to,
  message,
  type = "JOB_ALERT",
  userId,
}: SendWhatsAppParams): Promise<WhatsAppResult> {
  const phone = normalizePhoneNumber(to);

  // Check if WhatsApp API is configured
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (accessToken && phoneNumberId) {
    // Real WhatsApp Cloud API integration
    return sendWhatsAppViaApi({
      phone,
      message,
      type,
      userId,
      accessToken,
      phoneNumberId,
    });
  }

  // Fallback: log to DB as a placeholder
  try {
    await prisma.smsLog.create({
      data: {
        userId: userId || null,
        phone,
        message,
        senderId: "WHATSAPP",
        status: "SENT",
        type: "WHATSAPP",
        metadata: JSON.stringify({
          note: "WhatsApp message logged (Meta API not configured)",
          originalType: type,
        }),
      },
    });

    console.log(
      `[WhatsApp] Message logged to DB (API not configured): ${phone}`
    );
    return { success: true, messageId: `whatsapp-${Date.now()}` };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown WhatsApp error";
    console.error(`[WhatsApp] Failed to log message:`, error);
    return { success: false, error: errorMessage };
  }
}

/**
 * Send a formatted job alert via WhatsApp.
 */
export async function sendJobAlertWhatsApp({
  userId,
  phone,
  jobTitle,
  company,
  location,
  jobUrl,
}: SendJobAlertWhatsAppParams): Promise<WhatsAppResult> {
  const message = [
    `*JobReady Alert* 🔔`,
    ``,
    `*_${jobTitle}_*`,
    `🏢 ${company}`,
    `📍 ${location}`,
    ``,
    `🔗 Apply now: ${jobUrl}`,
    ``,
    `— JobReady | Kenya's #1 Job Board`,
  ].join("\n");

  return sendWhatsApp({
    to: phone,
    message,
    type: "JOB_ALERT",
    userId,
  });
}

// ─── Internal: Meta Cloud API Implementation ───

async function sendWhatsAppViaApi({
  phone,
  message,
  type,
  userId,
  accessToken,
  phoneNumberId,
}: {
  phone: string;
  message: string;
  type: string;
  userId?: string;
  accessToken: string;
  phoneNumberId: string;
}): Promise<WhatsAppResult> {
  // Create log entry
  const logEntry = await prisma.smsLog.create({
    data: {
      userId: userId || null,
      phone,
      message,
      senderId: "WHATSAPP",
      status: "PENDING",
      type: "WHATSAPP",
      metadata: JSON.stringify({ originalType: type }),
    },
  });

  try {
    const response = await fetch(
      `${WHATSAPP_API_URL}/${phoneNumberId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: phone,
          type: "text",
          text: {
            preview_url: true,
            body: message,
          },
        }),
      }
    );

    const data = await response.json();

    if (response.ok) {
      const messageId = data?.messages?.[0]?.id;

      await prisma.smsLog.update({
        where: { id: logEntry.id },
        data: {
          status: "SENT",
          providerRef: messageId || null,
          metadata: JSON.stringify({ apiResponse: data }),
        },
      });

      return { success: true, messageId };
    } else {
      const errorMessage =
        data?.error?.message || "WhatsApp API returned an error";

      await prisma.smsLog.update({
        where: { id: logEntry.id },
        data: {
          status: "FAILED",
          metadata: JSON.stringify({ apiResponse: data }),
        },
      });

      console.error(`[WhatsApp] API error for ${phone}: ${errorMessage}`);
      return { success: false, error: errorMessage };
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown WhatsApp API error";

    await prisma.smsLog.update({
      where: { id: logEntry.id },
      data: {
        status: "FAILED",
        metadata: JSON.stringify({ error: errorMessage }),
      },
    });

    console.error(`[WhatsApp] Exception for ${phone}:`, error);
    return { success: false, error: errorMessage };
  }
}
