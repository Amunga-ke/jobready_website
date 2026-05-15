// ─── Notification Services ───
// Barrel export for all notification-related services.

export {
  sendSms,
  sendBulkSms,
  sendJobAlertSms,
  normalizePhoneNumber,
} from "./sms";

export {
  sendEmail,
  sendJobAlertEmail,
  sendWelcomeEmail,
  sendSubscriptionConfirmationEmail,
} from "./email";

export {
  sendWhatsApp,
  sendJobAlertWhatsApp,
} from "./whatsapp";

export {
  dispatchJobAlert,
  processJobAlerts,
} from "./notifications";
