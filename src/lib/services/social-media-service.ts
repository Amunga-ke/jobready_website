import prisma from "@/lib/prisma";
import { generateJobPoster, getPosterUrl, type ListingData, type PosterTemplate } from "./poster-generator";

// ─── Types ───

export interface PostResult {
  success: boolean;
  platform: string;
  postId?: string;
  postUrl?: string;
  error?: string;
}

export interface PostToListingPlatformsParams {
  accountId: string;
  listingId: string;
  platforms: string[];
  caption?: string;
  template?: PosterTemplate;
}

// ─── Meta (Facebook Page) Integration ───

const META_API_VERSION = "v19.0";
const META_GRAPH_URL = `https://graph.facebook.com/${META_API_VERSION}`;

async function postToFacebook(
  account: { pageId?: string | null; pageAccessToken?: string | null; accessToken?: string | null; platformUserId?: string | null },
  imageBuffer: Buffer,
  caption: string
): Promise<PostResult> {
  const pageAccessToken = account.pageAccessToken || account.accessToken;
  const pageId = account.pageId || account.platformUserId;

  if (!pageAccessToken || !pageId) {
    return { success: false, platform: "FACEBOOK", error: "Missing page access token or page ID" };
  }

  try {
    const formData = new FormData();
    formData.append("source", new Blob([new Uint8Array(imageBuffer)], { type: "image/png" }), "poster.png");
    formData.append("message", caption);
    formData.append("access_token", pageAccessToken);

    const response = await fetch(`${META_GRAPH_URL}/${pageId}/photos`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json() as Record<string, unknown>;

    if (response.ok && data.id) {
      const postId = data.id as string;
      const postUrl = `https://www.facebook.com/${pageId}/posts/${postId}`;
      return { success: true, platform: "FACEBOOK", postId, postUrl };
    }

    const error = (data.error as Record<string, unknown>)?.message || "Unknown Meta API error";
    return { success: false, platform: "FACEBOOK", error: String(error) };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error posting to Facebook";
    return { success: false, platform: "FACEBOOK", error: msg };
  }
}

// ─── Instagram (via Facebook Graph API) Integration ───

async function postToInstagram(
  account: {
    platformUserId?: string | null;
    pageId?: string | null;
    pageAccessToken?: string | null;
    accessToken?: string | null;
    metadata?: string | null;
  },
  imageBuffer: Buffer,
  caption: string
): Promise<PostResult> {
  const pageAccessToken = account.pageAccessToken || account.accessToken;
  const igUserId = account.platformUserId;
  const pageId = account.pageId;

  if (!pageAccessToken || !igUserId) {
    return { success: false, platform: "INSTAGRAM", error: "Missing IG user ID or access token" };
  }

  try {
    // Step 1: Upload image as media item to the page (get a reusable media ID)
    const uploadForm = new FormData();
    uploadForm.append("source", new Blob([new Uint8Array(imageBuffer)], { type: "image/png" }), "poster.png");
    uploadForm.append("access_token", pageAccessToken);

    const uploadRes = await fetch(`${META_GRAPH_URL}/${pageId}/photos`, {
      method: "POST",
      body: uploadForm,
    });
    const uploadData = await uploadRes.json() as Record<string, unknown>;

    if (!uploadRes.ok || !uploadData.id) {
      const error = ((uploadData.error as Record<string, unknown>)?.message) || "Failed to upload image";
      return { success: false, platform: "INSTAGRAM", error: String(error) };
    }

    // Step 2: Get the image URL from the uploaded photo
    const photoRes = await fetch(
      `${META_GRAPH_URL}/${uploadData.id}?fields=images&access_token=${pageAccessToken}`
    );
    const photoData = await photoRes.json() as Record<string, unknown>;
    const imageUrl = ((photoData.images as Record<string, unknown>[])?.[0]?.source) as string;

    if (!imageUrl) {
      return { success: false, platform: "INSTAGRAM", error: "Failed to get uploaded image URL" };
    }

    // Step 3: Create IG media container
    const containerRes = await fetch(`${META_GRAPH_URL}/${igUserId}/media`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        image_url: imageUrl,
        caption,
        access_token: pageAccessToken,
      }),
    });
    const containerData = await containerRes.json() as Record<string, unknown>;

    if (!containerRes.ok || !containerData.id) {
      const error = ((containerData.error as Record<string, unknown>)?.message) || "Failed to create IG container";
      return { success: false, platform: "INSTAGRAM", error: String(error) };
    }

    // Step 4: Publish the container
    const publishRes = await fetch(
      `${META_GRAPH_URL}/${igUserId}/media_publish`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          creation_id: containerData.id,
          access_token: pageAccessToken,
        }),
      }
    );
    const publishData = await publishRes.json() as Record<string, unknown>;

    if (publishRes.ok && publishData.id) {
      const postId = publishData.id as string;
      return { success: true, platform: "INSTAGRAM", postId, postUrl: `https://instagram.com/p/${postId}` };
    }

    const error = ((publishData.error as Record<string, unknown>)?.message) || "Failed to publish IG post";
    return { success: false, platform: "INSTAGRAM", error: String(error) };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error posting to Instagram";
    return { success: false, platform: "INSTAGRAM", error: msg };
  }
}

// ─── LinkedIn Integration ───

const LINKEDIN_API_URL = "https://api.linkedin.com/v2";

async function postToLinkedIn(
  account: {
    pageAccessToken?: string | null;
    accessToken?: string | null;
    pageId?: string | null;
    platformUserId?: string | null;
  },
  imageBuffer: Buffer,
  caption: string
): Promise<PostResult> {
  const accessToken = account.pageAccessToken || account.accessToken;
  const organizationId = account.pageId || account.platformUserId;

  if (!accessToken || !organizationId) {
    return { success: false, platform: "LINKEDIN", error: "Missing LinkedIn access token or organization ID" };
  }

  try {
    // Step 1: Register the image upload
    const registerRes = await fetch(`${LINKEDIN_API_URL}/assets?action=registerUpload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        registerUploadRequest: {
          recipes: ["urn:li:digitalmediaRecipe:feedshare-image"],
          owner: `urn:li:organization:${organizationId}`,
          serviceRelationships: [
            {
              relationshipType: "OWNER",
              identifier: "urn:li:userGeneratedContent",
            },
          ],
        },
      }),
    });

    const registerData = await registerRes.json() as Record<string, unknown>;

    if (!registerRes.ok || !registerData.value) {
      const error = registerData.message || "Failed to register image upload";
      return { success: false, platform: "LINKEDIN", error: String(error) };
    }

    const uploadMechanism = ((registerData.value as Record<string, unknown>)
      .uploadMechanism as Record<string, unknown>)[
      "com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest"
    ] as Record<string, unknown>;

    const uploadUrl = uploadMechanism?.uploadUrl as string;
    const assetUrn = uploadMechanism?.asset as string;

    if (!uploadUrl || !assetUrn) {
      return { success: false, platform: "LINKEDIN", error: "Failed to get upload URL from LinkedIn" };
    }

    // Step 2: Upload the image to LinkedIn's binary upload endpoint
    const uploadRes = await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "image/png",
      },
      body: new Uint8Array(imageBuffer),
    });

    if (!uploadRes.ok) {
      return { success: false, platform: "LINKEDIN", error: "Failed to upload image to LinkedIn" };
    }

    // Step 3: Create the UGC post
    const postRes = await fetch(`${LINKEDIN_API_URL}/ugcPosts`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        author: `urn:li:organization:${organizationId}`,
        lifecycleState: "PUBLISHED",
        specificContent: {
          "com.linkedin.ugc.ShareContent": {
            shareCommentary: {
              text: caption,
            },
            shareMediaCategory: "IMAGE",
            media: [
              {
                status: "READY",
                media: assetUrn,
                title: {
                  text: "JobReady Job Listing",
                },
              },
            ],
          },
        },
        visibility: {
          "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
        },
      }),
    });

    const postData = await postRes.json() as Record<string, unknown>;

    if (postRes.ok) {
      return {
        success: true,
        platform: "LINKEDIN",
        postId: postData.id as string,
      };
    }

    const error = postData.message || "Failed to create LinkedIn post";
    return { success: false, platform: "LINKEDIN", error: String(error) };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error posting to LinkedIn";
    return { success: false, platform: "LINKEDIN", error: msg };
  }
}

// ─── X (Twitter) — Stub ───

async function postToTwitter(
  _account: Record<string, unknown>,
  _imageBuffer: Buffer,
  _caption: string
): Promise<PostResult> {
  // X/Twitter API v2 integration is a stub for now.
  // Full implementation would use OAuth 2.0 with PKCE,
  // upload media via chunked upload, then create tweet with media_id
  return {
    success: false,
    platform: "TWITTER",
    error: "X (Twitter) posting is not yet implemented. Coming soon.",
  };
}

// ─── WhatsApp Channel Integration ───

async function postToWhatsApp(
  account: {
    pageId?: string | null;
    platformUserId?: string | null;
    pageAccessToken?: string | null;
    accessToken?: string | null;
    platformUsername?: string | null;
  },
  imageBuffer: Buffer,
  caption: string
): Promise<PostResult> {
  const accessToken = account.pageAccessToken || account.accessToken;
  const phoneId = account.pageId || account.platformUserId;

  if (!accessToken || !phoneId) {
    return { success: false, platform: "WHATSAPP_CHANNEL", error: "Missing WhatsApp phone ID or access token" };
  }

  try {
    // Step 1: Upload the image media
    const mediaForm = new FormData();
    mediaForm.append("file", new Blob([new Uint8Array(imageBuffer)], { type: "image/png" }), "poster.png");
    mediaForm.append("messaging_product", "whatsapp");
    mediaForm.append("type", "image");

    const mediaRes = await fetch(`${META_GRAPH_URL}/${phoneId}/media`, {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}` },
      body: mediaForm,
    });

    const mediaData = await mediaRes.json() as Record<string, unknown>;

    if (!mediaRes.ok || !mediaData.id) {
      const error = ((mediaData.error as Record<string, unknown>)?.message) || "Failed to upload WhatsApp media";
      return { success: false, platform: "WHATSAPP_CHANNEL", error: String(error) };
    }

    const mediaId = mediaData.id as string;

    // Step 2: Send the image message to the WhatsApp channel number
    const channelPhone = account.platformUsername; // Channel phone number stored in username field
    if (!channelPhone) {
      return { success: false, platform: "WHATSAPP_CHANNEL", error: "WhatsApp channel phone number not configured" };
    }

    const messageRes = await fetch(`${META_GRAPH_URL}/${phoneId}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: channelPhone,
        type: "image",
        image: {
          id: mediaId,
          caption,
        },
      }),
    });

    const messageData = await messageRes.json() as Record<string, unknown>;

    if (messageRes.ok) {
      return {
        success: true,
        platform: "WHATSAPP_CHANNEL",
        postId: messageData.messages?.[0]?.id as string,
      };
    }

    const error = ((messageData.error as Record<string, unknown>)?.message) || "Failed to send WhatsApp message";
    return { success: false, platform: "WHATSAPP_CHANNEL", error: String(error) };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error posting to WhatsApp";
    return { success: false, platform: "WHATSAPP_CHANNEL", error: msg };
  }
}

// ─── Platform dispatch ───

const PLATFORM_HANDLERS: Record<
  string,
  (
    account: Record<string, unknown>,
    imageBuffer: Buffer,
    caption: string
  ) => Promise<PostResult>
> = {
  FACEBOOK: postToFacebook,
  INSTAGRAM: postToInstagram,
  LINKEDIN: postToLinkedIn,
  TWITTER: postToTwitter,
  WHATSAPP_CHANNEL: postToWhatsApp,
};

// ─── Public: post to listing platforms ───

/**
 * Post a job listing to one or more social platforms.
 * Generates the poster image, creates SocialPost records, and dispatches.
 */
export async function postToListingPlatforms(
  params: PostToListingPlatformsParams
): Promise<PostResult[]> {
  const { accountId, listingId, platforms, caption: providedCaption, template = "modern" } = params;

  // Fetch the social account
  const account = await prisma.socialAccount.findUnique({
    where: { id: accountId },
  });

  if (!account) {
    return [{ success: false, platform: "ALL", error: "Social account not found" }];
  }

  // Fetch the listing with company
  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
    include: { company: true, category: true },
  });

  if (!listing) {
    return [{ success: false, platform: "ALL", error: "Listing not found" }];
  }

  // Build ListingData
  const listingData: ListingData = {
    id: listing.id,
    title: listing.title,
    company: { name: listing.company.name, logo: listing.company.logo },
    location: listing.town || listing.county,
    salaryMin: listing.salaryMin,
    salaryMax: listing.salaryMax,
    salaryPeriod: listing.salaryPeriod,
    employmentType: listing.employmentType,
    experienceLevel: listing.experienceLevel,
    workMode: listing.workMode,
    listingType: listing.listingType,
    slug: listing.slug,
    deadline: listing.deadline?.toISOString(),
    category: listing.category?.name,
  };

  // Generate poster
  let posterBuffer: Buffer;
  let posterUrl: string;
  try {
    posterBuffer = await generateJobPoster(listingData, template);
    posterUrl = getPosterUrl(listing.id, template);
  } catch (err) {
    return [{
      success: false,
      platform: "ALL",
      error: `Failed to generate poster: ${err instanceof Error ? err.message : "Unknown error"}`,
    }];
  }

  // Generate caption if not provided
  const caption = providedCaption || generateJobCaption(listingData);

  // Post to each platform
  const results: PostResult[] = [];

  for (const platform of platforms) {
    const handler = PLATFORM_HANDLERS[platform];
    if (!handler) {
      results.push({ success: false, platform, error: `Unsupported platform: ${platform}` });
      continue;
    }

    try {
      // Create a SocialPost record
      const socialPost = await prisma.socialPost.create({
        data: {
          accountId: account.id,
          listingId: listing.id,
          platform,
          caption,
          posterUrl,
          status: "PENDING",
          postType: "JOB_POSTER",
        },
      });

      const result = await handler(account as Record<string, unknown>, posterBuffer, caption);

      // Update the SocialPost record
      await prisma.socialPost.update({
        where: { id: socialPost.id },
        data: {
          status: result.success ? "POSTED" : "FAILED",
          platformPostId: result.postId,
          platformUrl: result.postUrl,
          errorMessage: result.error,
          postedAt: result.success ? new Date() : null,
        },
      });

      results.push(result);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      results.push({ success: false, platform, error: msg });
    }
  }

  // Update account's lastPostedAt
  if (results.some((r) => r.success)) {
    await prisma.socialAccount.update({
      where: { id: accountId },
      data: { lastPostedAt: new Date() },
    });
  }

  return results;
}

// ─── Public: generate job caption ───

/**
 * Generate a formatted caption for a job listing social post.
 */
export function generateJobCaption(listing: ListingData): string {
  const salaryStr = formatSalaryForCaption(listing.salaryMin, listing.salaryMax);
  const category = listing.category || "";
  const hashtag = category ? `#${category.replace(/\s+/g, "")}` : "#JobsInKenya";

  const lines = [
    `🔥 ${listing.title}`,
    `📍 ${listing.company.name} • ${listing.location || "Kenya"}`,
  ];

  if (salaryStr) {
    lines.push(`💰 ${salaryStr}`);
  }

  if (listing.employmentType || listing.experienceLevel) {
    const details: string[] = [];
    if (listing.employmentType) details.push(listing.employmentType);
    if (listing.experienceLevel) details.push(listing.experienceLevel);
    if (listing.workMode && listing.workMode !== "ONSITE") details.push(listing.workMode);
    lines.push(`📋 ${details.join(" • ")}`);
  }

  lines.push("");
  lines.push(`Apply now: https://jobready.co.ke/jobs/${listing.slug || ""}`);
  lines.push("");
  lines.push(`${hashtag} #Hiring #JobReady #JobsInKenya`);

  if (listing.deadline) {
    const deadlineDate = new Date(listing.deadline);
    if (!isNaN(deadlineDate.getTime())) {
      lines.push(`⏰ Deadline: ${deadlineDate.toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" })}`);
    }
  }

  return lines.join("\n");
}

function formatSalaryForCaption(
  min?: number | null,
  max?: number | null
): string {
  if (!min && !max) return "";
  const fmt = (n: number) =>
    n >= 1_000_000
      ? `KES ${n / 1_000_000}M+`
      : n >= 1_000
      ? `KES ${Math.round(n / 1_000)}K+`
      : `KES ${n}`;

  if (min && max) return `${fmt(min)} - ${fmt(max)}`;
  if (min) return `From ${fmt(min)}`;
  return `Up to ${fmt(max!)}`;
}
