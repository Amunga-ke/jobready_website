import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

// ─── Brand constants ───
const BRAND_DARK = "#0f172a";
const BRAND_BLUE = "#2563eb";
const BRAND_BLUE_LIGHT = "#dbeafe";
const BRAND_WHITE = "#ffffff";
const BRAND_GRAY = "#64748b";
const BRAND_LIGHT_BG = "#f8fafc";

// ─── SVG icon paths (24x24 viewBox, drawn at any size) ───
const icons = {
  briefcase: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="${BRAND_BLUE}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`,
  document: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="${BRAND_BLUE}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>`,
  building: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="${BRAND_BLUE}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>`,
};

// ─── Badge config per type ───
const typeConfig: Record<string, { icon: string; label: string }> = {
  job: { icon: icons.briefcase, label: "Job Listing" },
  article: { icon: icons.document, label: "Article" },
  company: { icon: icons.building, label: "Company Profile" },
  default: { icon: icons.briefcase, label: "JobReady" },
};

// ─── Auto-size title font based on length ───
function getTitleFontSize(title: string): number {
  const len = title.length;
  if (len <= 30) return 56;
  if (len <= 50) return 46;
  if (len <= 70) return 38;
  if (len <= 90) return 32;
  return 26;
}

// ─── Truncate description to fit ───
function truncateDescription(desc: string, maxLen = 120): string {
  if (!desc) return "";
  if (desc.length <= maxLen) return desc;
  return desc.slice(0, maxLen).trimEnd() + "…";
}

// ─── Escape XML special characters for SVG text content ───
function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const title = searchParams.get("title") || "JobReady — Jobs for Kenyans";
  const description = searchParams.get("description") || "";
  const type = searchParams.get("type") || "default";
  const config = typeConfig[type] || typeConfig.default;

  const fontSize = getTitleFontSize(title);
  const descText = truncateDescription(description);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: BRAND_WHITE,
          fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
        }}
      >
        {/* ── Top accent bar ── */}
        <div
          style={{
            width: "100%",
            height: "6px",
            backgroundColor: BRAND_BLUE,
          }}
        />

        {/* ── Main content area ── */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            padding: "48px 64px 40px 64px",
          }}
        >
          {/* ── Logo + badge row ── */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "40px",
            }}
          >
            {/* Logo text */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  backgroundColor: BRAND_DARK,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    color: BRAND_WHITE,
                    fontSize: "22px",
                    fontWeight: 800,
                    letterSpacing: "-0.5px",
                  }}
                >
                  J
                </div>
              </div>
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: 800,
                  color: BRAND_DARK,
                  letterSpacing: "-0.5px",
                }}
              >
                JobReady
              </div>
            </div>

            {/* Type badge */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 16px",
                backgroundColor: BRAND_BLUE_LIGHT,
                borderRadius: "8px",
              }}
            >
              <div dangerouslySetInnerHTML={{ __html: config.icon }} />
              <div
                style={{
                  fontSize: "15px",
                  fontWeight: 600,
                  color: BRAND_BLUE,
                }}
              >
                {config.label}
              </div>
            </div>
          </div>

          {/* ── Title ── */}
          <div
            style={{
              fontSize: `${fontSize}px`,
              fontWeight: 800,
              color: BRAND_DARK,
              lineHeight: 1.15,
              letterSpacing: "-1px",
              marginBottom: "16px",
              flexShrink: 0,
            }}
          >
            {escapeXml(title)}
          </div>

          {/* ── Description ── */}
          {descText && (
            <div
              style={{
                fontSize: "22px",
                fontWeight: 400,
                color: BRAND_GRAY,
                lineHeight: 1.4,
                marginBottom: "auto",
                flexShrink: 0,
              }}
            >
              {escapeXml(descText)}
            </div>
          )}

          {/* ── Spacer to push footer down ── */}
          <div style={{ flex: 1 }} />

          {/* ── Bottom separator ── */}
          <div
            style={{
              width: "100%",
              height: "1px",
              backgroundColor: "#e2e8f0",
              marginBottom: "16px",
            }}
          />

          {/* ── Footer ── */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                fontSize: "15px",
                fontWeight: 500,
                color: BRAND_GRAY,
              }}
            >
              jobready.co.ke
            </div>
            <div
              style={{
                fontSize: "14px",
                fontWeight: 400,
                color: "#94a3b8",
              }}
            >
              Kenya&apos;s Most Trusted Job Board
            </div>
          </div>
        </div>

        {/* ── Bottom accent bar ── */}
        <div
          style={{
            width: "100%",
            height: "6px",
            backgroundColor: BRAND_DARK,
          }}
        />
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
