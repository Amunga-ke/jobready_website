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

// ─── Social Media Services ───

export {
  postToListingPlatforms,
  generateJobCaption,
} from "./social-media-service";

export type { PostResult, PostToListingPlatformsParams } from "./social-media-service";

export {
  generateJobPoster,
  getPosterUrl,
} from "./poster-generator";

export type { ListingData, PosterTemplate } from "./poster-generator";
