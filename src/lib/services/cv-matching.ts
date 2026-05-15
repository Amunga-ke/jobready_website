import prisma from "@/lib/prisma";
import ZAI from "z-ai-web-dev-sdk";

// ─── Types ───

export interface CvMatchBreakdown {
  skills: number; // 0-100
  experience: number; // 0-100
  education: number; // 0-100
  overall: number; // 0-100
}

export interface CvMatchResult {
  score: number; // 0-100
  breakdown: CvMatchBreakdown;
  aiAnalysis: string;
}

export interface CvMatchRankedItem {
  userId: string;
  applicationId: string;
  score: number;
  aiAnalysis: string;
  userName: string;
}

export interface CvMatchHistoryItem {
  id: string;
  listingId: string;
  listingTitle: string;
  companyName: string;
  score: number;
  breakdown: CvMatchBreakdown;
  aiAnalysis: string;
  createdAt: string;
}

interface ListingContext {
  title: string;
  description: string;
  employmentType: string;
  experienceLevel: string;
  salaryMin?: number | null;
  salaryMax?: number | null;
  county: string;
  companyName: string;
  tags: string[];
}

interface CandidateContext {
  name: string;
  bio?: string | null;
  cvUrl?: string | null;
  county?: string | null;
  savedJobTitles: string[];
  savedJobCategories: string[];
  applicationCount: number;
}

// ─── Helpers ───

const MODEL_USED = "glm-4";

function parseAiResponse(raw: string): CvMatchResult | null {
  try {
    const jsonStr = raw
      .replace(/```json\s*/gi, "")
      .replace(/```\s*/gi, "")
      .trim();
    const parsed = JSON.parse(jsonStr);

    const score = Math.min(100, Math.max(0, Math.round(parsed.score || 0)));
    const skills = Math.min(100, Math.max(0, Math.round(parsed.skills || 0)));
    const experience = Math.min(100, Math.max(0, Math.round(parsed.experience || 0)));
    const education = Math.min(100, Math.max(0, Math.round(parsed.education || 0)));
    const overall = Math.min(100, Math.max(0, Math.round(parsed.overall || score)));

    return {
      score,
      breakdown: { skills, experience, education, overall },
      aiAnalysis: parsed.aiAnalysis || "",
    };
  } catch {
    return null;
  }
}

function buildScoringPrompt(listing: ListingContext, candidate: CandidateContext): string {
  const savedJobsSummary =
    candidate.savedJobTitles.length > 0
      ? `Jobs the candidate has saved/bookmarked: ${candidate.savedJobTitles.slice(0, 10).join(", ")}`
      : "No saved jobs found";

  const savedCategoriesSummary =
    candidate.savedJobCategories.length > 0
      ? `Categories the candidate is interested in: ${candidate.savedJobCategories.slice(0, 10).join(", ")}`
      : "No category preferences found";

  return `You are a professional CV analysis AI for the Kenyan job market (JobReady Kenya platform). Analyze how well this candidate matches the job listing and return ONLY valid JSON.

## Job Listing
- Title: ${listing.title}
- Company: ${listing.companyName}
- Description: ${listing.description.slice(0, 2000)}
- Employment Type: ${listing.employmentType}
- Experience Level: ${listing.experienceLevel}
- Salary Range: ${listing.salaryMin ? `KES ${listing.salaryMin.toLocaleString()}` : "Not disclosed"} - ${listing.salaryMax ? `KES ${listing.salaryMax.toLocaleString()}` : "Not disclosed"}
- Location: ${listing.county || "Kenya"}
- Tags: ${listing.tags.join(", ") || "None"}

## Candidate Profile
- Name: ${candidate.name}
- Bio/Summary: ${candidate.bio || "No bio provided"}
- Has CV uploaded: ${candidate.cvUrl ? "Yes" : "No"}
- Location: ${candidate.county || "Not specified"}
- Total applications submitted: ${candidate.applicationCount}
- ${savedJobsSummary}
- ${savedCategoriesSummary}

## Instructions
1. Extract required skills and nice-to-have skills from the job description
2. Compare against the candidate's profile (bio, job interests, application patterns)
3. Score each dimension (0-100): skills, experience, education
4. Calculate an overall score (0-100) weighted: skills 40%, experience 35%, education 25%
5. Write a 2-3 sentence analysis in professional tone mentioning strengths and gaps

Respond ONLY with a JSON object (no markdown, no code fences):
{
  "skills": <number 0-100>,
  "experience": <number 0-100>,
  "education": <number 0-100>,
  "overall": <number 0-100>,
  "score": <number 0-100>,
  "aiAnalysis": "<2-3 sentence analysis>"
}`;
}

async function callAiScoring(listing: ListingContext, candidate: CandidateContext): Promise<CvMatchResult> {
  const zai = await ZAI.create();
  const prompt = buildScoringPrompt(listing, candidate);

  const completion = await zai.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "You are a professional CV analysis AI for the Kenyan job market. Always respond with valid JSON only. No markdown, no code fences, no explanation.",
      },
      { role: "user", content: prompt },
    ],
    temperature: 0.3,
  });

  const raw = completion.choices[0]?.message?.content?.trim() || "";
  const result = parseAiResponse(raw);

  if (!result) {
    // Fallback: return a neutral score with generic analysis
    return {
      score: 50,
      breakdown: { skills: 50, experience: 50, education: 50, overall: 50 },
      aiAnalysis:
        "Unable to generate a detailed analysis. Consider updating your profile with a bio and CV for more accurate matching.",
    };
  }

  return result;
}

async function getListingContext(listingId: string): Promise<ListingContext | null> {
  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
    include: {
      company: { select: { name: true } },
      tags: { include: { tag: { select: { name: true } } } },
    },
  });

  if (!listing) return null;

  return {
    title: listing.title,
    description: listing.description,
    employmentType: listing.employmentType,
    experienceLevel: listing.experienceLevel,
    salaryMin: listing.salaryMin,
    salaryMax: listing.salaryMax,
    county: listing.county,
    companyName: listing.company.name,
    tags: listing.tags.map((t) => t.tag.name),
  };
}

async function getCandidateContext(userId: string): Promise<CandidateContext> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      name: true,
      bio: true,
      cvUrl: true,
      county: true,
    },
  });

  if (!user) {
    return {
      name: "Unknown",
      savedJobTitles: [],
      savedJobCategories: [],
      applicationCount: 0,
    };
  }

  // Get saved jobs pattern for profiling
  const savedJobs = await prisma.savedJob.findMany({
    where: { userId },
    include: {
      listing: {
        select: { title: true, category: { select: { name: true } } },
      },
    },
    take: 20,
    orderBy: { createdAt: "desc" },
  });

  const savedJobTitles = [...new Set(savedJobs.map((sj) => sj.listing.title))];
  const savedJobCategories = [
    ...new Set(savedJobs.map((sj) => sj.listing.category?.name).filter(Boolean) as string[]),
  ];

  const applicationCount = await prisma.application.count({
    where: { userId },
  });

  return {
    name: user.name,
    bio: user.bio,
    cvUrl: user.cvUrl,
    county: user.county,
    savedJobTitles,
    savedJobCategories,
    applicationCount,
  };
}

// ─── Public API ───

/**
 * Score how well a candidate's CV matches a job listing.
 * Uses AI to analyze the match across skills, experience, and education.
 */
export async function scoreCvMatch({
  userId,
  listingId,
  applicationId,
}: {
  userId: string;
  listingId: string;
  applicationId?: string;
}): Promise<CvMatchResult> {
  // Fetch listing and candidate data in parallel
  const [listingCtx, candidateCtx] = await Promise.all([
    getListingContext(listingId),
    getCandidateContext(userId),
  ]);

  if (!listingCtx) {
    throw new Error("Listing not found");
  }

  // Call AI for scoring
  const result = await callAiScoring(listingCtx, candidateCtx);

  // Persist the score (upsert based on unique userId+listingId)
  await prisma.cvMatchScore.upsert({
    where: {
      userId_listingId: { userId, listingId },
    },
    create: {
      userId,
      listingId,
      applicationId: applicationId || null,
      score: result.score,
      breakdown: JSON.stringify(result.breakdown),
      aiAnalysis: result.aiAnalysis,
      modelUsed: MODEL_USED,
    },
    update: {
      score: result.score,
      breakdown: JSON.stringify(result.breakdown),
      aiAnalysis: result.aiAnalysis,
      modelUsed: MODEL_USED,
      applicationId: applicationId || undefined,
    },
  });

  return result;
}

/**
 * Score ALL applications for a listing and return ranked array.
 * Intended for employer use.
 */
export async function scoreListingApplications({
  listingId,
}: {
  listingId: string;
}): Promise<CvMatchRankedItem[]> {
  // Get all applications for this listing
  const applications = await prisma.application.findMany({
    where: { listingId },
    include: {
      user: { select: { id: true, name: true } },
    },
  });

  if (applications.length === 0) return [];

  const listingCtx = await getListingContext(listingId);
  if (!listingCtx) throw new Error("Listing not found");

  const results: CvMatchRankedItem[] = [];

  for (const app of applications) {
    const candidateCtx = await getCandidateContext(app.userId);
    const result = await callAiScoring(listingCtx, candidateCtx);

    // Persist the score
    await prisma.cvMatchScore.upsert({
      where: {
        userId_listingId: { userId: app.userId, listingId },
      },
      create: {
        userId: app.userId,
        listingId,
        applicationId: app.id,
        score: result.score,
        breakdown: JSON.stringify(result.breakdown),
        aiAnalysis: result.aiAnalysis,
        modelUsed: MODEL_USED,
      },
      update: {
        score: result.score,
        breakdown: JSON.stringify(result.breakdown),
        aiAnalysis: result.aiAnalysis,
        modelUsed: MODEL_USED,
        applicationId: app.id,
      },
    });

    results.push({
      userId: app.userId,
      applicationId: app.id,
      score: result.score,
      aiAnalysis: result.aiAnalysis,
      userName: app.user.name,
    });
  }

  // Sort by score descending
  results.sort((a, b) => b.score - a.score);

  return results;
}

/**
 * Get a user's CV match score history with pagination.
 */
export async function getCvMatchHistory({
  userId,
  page = 1,
  limit = 10,
}: {
  userId: string;
  page?: number;
  limit?: number;
}): Promise<{
  items: CvMatchHistoryItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}> {
  const skip = (page - 1) * limit;

  const [scores, total] = await Promise.all([
    prisma.cvMatchScore.findMany({
      where: { userId },
      include: {
        listing: {
          select: {
            title: true,
            company: { select: { name: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.cvMatchScore.count({ where: { userId } }),
  ]);

  const items: CvMatchHistoryItem[] = scores.map((s) => ({
    id: s.id,
    listingId: s.listingId,
    listingTitle: s.listing.title,
    companyName: s.listing.company.name,
    score: s.score,
    breakdown: JSON.parse(s.breakdown) as CvMatchBreakdown,
    aiAnalysis: s.aiAnalysis || "",
    createdAt: s.createdAt.toISOString(),
  }));

  return {
    items,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}
