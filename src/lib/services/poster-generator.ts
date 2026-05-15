import sharp from "sharp";
import path from "path";
import fs from "fs";

// ─── Types ───

export interface ListingData {
  id?: string;
  title: string;
  company: {
    name: string;
    logo?: string | null;
  };
  location: string;
  salaryMin?: number | null;
  salaryMax?: number | null;
  salaryPeriod?: string | null;
  employmentType?: string | null;
  experienceLevel?: string | null;
  workMode?: string | null;
  listingType?: string | null;
  slug?: string | null;
  deadline?: string | null;
  category?: string | null;
}

export type PosterTemplate = "modern" | "minimal" | "corporate";

// ─── Constants ───

const POSTER_WIDTH = 1200;
const POSTER_HEIGHT = 630;

const FONT_REGULAR = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf";
const FONT_BOLD = "/usr/share/fonts/truetype/english/Tinos-Bold.ttf";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "posters");

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// ─── Color Schemes per Template ───

interface ColorScheme {
  bg1: string;       // header gradient start
  bg2: string;       // header gradient end
  bg3: string;       // body background
  tagBg: string;     // "NOW HIRING" tag background
  tagText: string;   // tag text color
  titleText: string;
  companyText: string;
  detailsText: string;
  ctaBg: string;     // CTA button background
  ctaText: string;   // CTA button text
  qrBorder: string;  // QR placeholder border
  qrText: string;    // QR placeholder text
  accentLine: string; // decorative accent
}

const TEMPLATES: Record<PosterTemplate, ColorScheme> = {
  modern: {
    bg1: "#1a56db",
    bg2: "#3b82f6",
    bg3: "#ffffff",
    tagBg: "#f59e0b",
    tagText: "#000000",
    titleText: "#111827",
    companyText: "#4b5563",
    detailsText: "#374151",
    ctaBg: "#1a56db",
    ctaText: "#ffffff",
    qrBorder: "#d1d5db",
    qrText: "#6b7280",
    accentLine: "#3b82f6",
  },
  minimal: {
    bg1: "#ffffff",
    bg2: "#f9fafb",
    bg3: "#ffffff",
    tagBg: "#111827",
    tagText: "#ffffff",
    titleText: "#111827",
    companyText: "#6b7280",
    detailsText: "#4b5563",
    ctaBg: "#111827",
    ctaText: "#ffffff",
    qrBorder: "#e5e7eb",
    qrText: "#9ca3af",
    accentLine: "#f59e0b",
  },
  corporate: {
    bg1: "#0f172a",
    bg2: "#1e293b",
    bg3: "#0f172a",
    tagBg: "#f59e0b",
    tagText: "#000000",
    titleText: "#ffffff",
    companyText: "#94a3b8",
    detailsText: "#cbd5e1",
    ctaBg: "#f59e0b",
    ctaText: "#000000",
    qrBorder: "#334155",
    qrText: "#64748b",
    accentLine: "#f59e0b",
  },
};

// ─── Utility: draw rounded rectangle via SVG ───

function roundedRectSVG(
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
  fill: string
): string {
  const rr = Math.min(r, w / 2, h / 2);
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rr}" ry="${rr}" fill="${fill}"/>`;
}

function textSVG(
  x: number,
  y: number,
  content: string,
  opts: {
    fontSize?: number;
    fontFamily?: string;
    fontWeight?: string;
    fill?: string;
    textAnchor?: string;
  } = {}
): string {
  const {
    fontSize = 20,
    fontFamily = "DejaVu Sans",
    fontWeight = "normal",
    fill = "#000000",
    textAnchor = "start",
  } = opts;

  const escaped = content
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

  return `<text x="${x}" y="${y}" font-size="${fontSize}" font-family="${fontFamily}" font-weight="${fontWeight}" fill="${fill}" text-anchor="${textAnchor}">${escaped}</text>`;
}

// ─── Utility: truncate text to fit width ───

function truncateText(text: string, maxChars: number): string {
  if (text.length <= maxChars) return text;
  return text.substring(0, maxChars - 3) + "...";
}

// ─── Format salary string ───

function formatSalary(
  min?: number | null,
  max?: number | null,
  period?: string | null
): string {
  if (!min && !max) return "Not disclosed";
  const fmt = (n: number) =>
    n >= 1_000_000
      ? `${(n / 1_000_000).toFixed(1)}M`
      : n >= 1_000
      ? `${(n / 1_000).toFixed(0)}K`
      : `${n}`;

  if (min && max) return `KES ${fmt(min)} - ${fmt(max)}`;
  if (min) return `From KES ${fmt(min)}`;
  return `Up to KES ${fmt(max!)}`;
}

// ─── Main: generate a poster SVG and rasterise it with sharp ───

async function generateJobPosterSVG(
  listing: ListingData,
  template: PosterTemplate = "modern"
): Promise<string> {
  const colors = TEMPLATES[template];
  const W = POSTER_WIDTH;
  const H = POSTER_HEIGHT;
  const headerH = 110;
  const bodyY = headerH;
  const bodyH = H - headerH;

  // Tag label based on listing type
  const tagLabel =
    listing.listingType === "OPPORTUNITY"
      ? "NEW OPPORTUNITY"
      : listing.listingType === "GOVERNMENT"
      ? "GOVERNMENT JOB"
      : "NOW HIRING";

  const salaryStr = formatSalary(
    listing.salaryMin,
    listing.salaryMax,
    listing.salaryPeriod
  );

  // Build detail chips
  const details: string[] = [];
  if (listing.location) details.push(listing.location);
  if (salaryStr !== "Not disclosed") details.push(salaryStr);
  if (listing.employmentType) details.push(listing.employmentType);
  if (listing.experienceLevel) details.push(listing.experienceLevel);
  if (listing.workMode && listing.workMode !== "ONSITE")
    details.push(listing.workMode);

  const detailsLine = details.join("  •  ");

  // Category hashtag
  const hashtag = listing.category
    ? `#${listing.category.replace(/\s+/g, "")}`
    : "#JobsInKenya";

  // Determine fonts based on template
  const titleFont = "Tinos";
  const bodyFont = "DejaVu Sans";

  let svg = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">`;

  // ─── Defs: gradient, fonts ───
  svg += `
    <defs>
      <linearGradient id="headerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style="stop-color:${colors.bg1};stop-opacity:1" />
        <stop offset="100%" style="stop-color:${colors.bg2};stop-opacity:1" />
      </linearGradient>
    </defs>`;

  // ─── Background ───
  svg += `<rect width="${W}" height="${H}" fill="${colors.bg3}"/>`;

  // ─── Header gradient bar ───
  svg += roundedRectSVG(0, 0, W, headerH, 0, "url(#headerGrad)");

  // ─── "JobReady" branding text (top-left) ───
  svg += textSVG(40, 42, "JobReady", {
    fontSize: 28,
    fontFamily: titleFont,
    fontWeight: "bold",
    fill: "#ffffff",
  });
  svg += textSVG(40, 70, "Kenya's #1 Job Board", {
    fontSize: 14,
    fontFamily: bodyFont,
    fill: "rgba(255,255,255,0.8)",
  });

  // ─── Tag pill (top-right area) ───
  const tagTextW = tagLabel.length * 10 + 40;
  const tagX = W - tagTextW - 30;
  const tagY = 30;
  const tagH = 36;
  svg += roundedRectSVG(tagX, tagY, tagTextW, tagH, 18, colors.tagBg);
  svg += textSVG(tagX + tagTextW / 2, tagY + tagH / 2 + 5, tagLabel, {
    fontSize: 13,
    fontFamily: bodyFont,
    fontWeight: "bold",
    fill: colors.tagText,
    textAnchor: "middle",
  });

  // ─── Accent line under header ───
  svg += `<rect x="0" y="${headerH}" width="${W}" height="4" fill="${colors.accentLine}"/>`;

  // ─── Body ───
  svg += `<rect x="0" y="${bodyY}" width="${W}" height="${bodyH}" fill="${colors.bg3}"/>`;

  // ─── Job title ───
  const titleY = bodyY + 50;
  const titleLines = wrapText(listing.title, 50);
  titleLines.forEach((line, i) => {
    svg += textSVG(50, titleY + i * 44, truncateText(line, 48), {
      fontSize: titleLines.length > 1 ? 32 : 38,
      fontFamily: titleFont,
      fontWeight: "bold",
      fill: colors.titleText,
    });
  });

  const afterTitle = titleY + titleLines.length * 44 + 8;

  // ─── Company name ───
  svg += textSVG(50, afterTitle, listing.company.name, {
    fontSize: 22,
    fontFamily: bodyFont,
    fill: colors.companyText,
  });

  const afterCompany = afterTitle + 40;

  // ─── Detail chips ───
  if (detailsLine) {
    svg += textSVG(50, afterCompany, truncateText(detailsLine, 70), {
      fontSize: 15,
      fontFamily: bodyFont,
      fill: colors.detailsText,
    });
  }

  const afterDetails = afterCompany + 36;

  // ─── Separator line ───
  svg += `<rect x="50" y="${afterDetails}" width="${W - 100}" height="1" fill="${colors.accentLine}" opacity="0.3"/>`;

  const afterSep = afterDetails + 20;

  // ─── CTA area: Apply URL + QR placeholder ───
  const ctaY = afterSep + 30;
  const applyUrl = `https://jobready.co.ke/jobs/${listing.slug || ""}`;

  // QR placeholder box (right side)
  const qrSize = 120;
  const qrX = W - qrSize - 50;
  const qrY = ctaY - 10;
  svg += `<rect x="${qrX}" y="${qrY}" width="${qrSize}" height="${qrSize}" rx="8" fill="${colors.bg3}" stroke="${colors.qrBorder}" stroke-width="2"/>`;
  svg += textSVG(qrX + qrSize / 2, qrY + qrSize / 2 - 6, "Scan to", {
    fontSize: 14,
    fontFamily: bodyFont,
    fill: colors.qrText,
    textAnchor: "middle",
  });
  svg += textSVG(qrX + qrSize / 2, qrY + qrSize / 2 + 14, "Apply", {
    fontSize: 14,
    fontFamily: bodyFont,
    fontWeight: "bold",
    fill: colors.qrText,
    textAnchor: "middle",
  });

  // CTA button (left side)
  const ctaBtnW = 300;
  const ctaBtnH = 44;
  const ctaBtnX = 50;
  const ctaBtnY = ctaY + 15;
  svg += roundedRectSVG(ctaBtnX, ctaBtnY, ctaBtnW, ctaBtnH, 8, colors.ctaBg);
  svg += textSVG(
    ctaBtnX + ctaBtnW / 2,
    ctaBtnY + ctaBtnH / 2 + 6,
    "Apply on jobready.co.ke",
    {
      fontSize: 16,
      fontFamily: bodyFont,
      fontWeight: "bold",
      fill: colors.ctaText,
      textAnchor: "middle",
    }
  );

  // Hashtag under CTA
  svg += textSVG(50, ctaBtnY + ctaBtnH + 28, hashtag, {
    fontSize: 14,
    fontFamily: bodyFont,
    fill: colors.detailsText,
  });
  svg += textSVG(50, ctaBtnY + ctaBtnH + 48, "#Hiring #JobReady", {
    fontSize: 14,
    fontFamily: bodyFont,
    fill: colors.detailsText,
  });

  // ─── Footer bar ───
  svg += `<rect x="0" y="${H - 36}" width="${W}" height="36" fill="${colors.accentLine}" opacity="0.1"/>`;
  svg += textSVG(
    W / 2,
    H - 12,
    `© ${new Date().getFullYear()} JobReady.co.ke  •  ${applyUrl}`,
    {
      fontSize: 11,
      fontFamily: bodyFont,
      fill: colors.detailsText,
      textAnchor: "middle",
    }
  );

  svg += `</svg>`;
  return svg;
}

// ─── Simple text wrapping for long titles ───

function wrapText(text: string, maxCharsPerLine: number): string[] {
  if (text.length <= maxCharsPerLine) return [text];

  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    if ((currentLine + " " + word).trim().length <= maxCharsPerLine) {
      currentLine = (currentLine + " " + word).trim();
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
      if (lines.length >= 2) {
        // Max 2 lines for title
        lines[1] = truncateText(
          (lines[1] || "") + " " + currentLine,
          maxCharsPerLine
        );
        return lines;
      }
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines.slice(0, 2);
}

// ─── Public API ───

/**
 * Generate a job poster image and save it to disk.
 *
 * Returns the PNG buffer. Also saves the file to:
 *   public/uploads/posters/{listingId}-{template}.png
 */
export async function generateJobPoster(
  listing: ListingData,
  template: PosterTemplate = "modern"
): Promise<Buffer> {
  const svgString = await generateJobPosterSVG(listing, template);

  const imageBuffer = await sharp(Buffer.from(svgString))
    .resize(POSTER_WIDTH, POSTER_HEIGHT)
    .png({ quality: 90 })
    .toBuffer();

  // Save to disk if we have a listing id
  if (listing.id) {
    const filePath = path.join(UPLOAD_DIR, `${listing.id}-${template}.png`);
    fs.writeFileSync(filePath, imageBuffer);
    console.log(`[PosterGenerator] Saved poster: ${filePath}`);
  }

  return imageBuffer;
}

/**
 * Get the public URL for a generated poster.
 */
export function getPosterUrl(
  listingId: string,
  template: PosterTemplate = "modern"
): string {
  return `/uploads/posters/${listingId}-${template}.png`;
}
