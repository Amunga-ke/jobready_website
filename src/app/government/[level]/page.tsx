import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { KE_COUNTIES, slugifyCounty } from "@/lib/constants";
import { getGovernmentJobsByLevel } from "@/lib/data";
import { SeoPageHeader, RichFallback } from "@/components/jobready/SeoPageLayout";
import { formatDateShortUTC } from "@/lib/format-date";
import type { Job } from "@/types";

const GOV_LEVELS = [
  {
    slug: "national",
    label: "National Government",
    description:
      "Browse job openings from Kenya's national government ministries, departments, and agencies. Civil service positions, parastatal roles, and public sector careers.",
    dbLevel: "NATIONAL" as const,
  },
  {
    slug: "county",
    label: "County Governments",
    description:
      "Find jobs across all 47 county governments in Kenya. County public service board announcements, county executive positions, and county assembly roles.",
    dbLevel: "COUNTY" as const,
  },
  {
    slug: "state-corporations",
    label: "State Corporations & Parastatals",
    description:
      "Explore career opportunities at Kenyan state corporations, parastatals, and semi-autonomous government agencies.",
    dbLevel: "STATE_CORPORATION" as const,
  },
] as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ level: string }>;
}): Promise<Metadata> {
  const { level } = await params;
  const gov = GOV_LEVELS.find((g) => g.slug === level);
  if (!gov) return { title: "Not Found | JobReady" };

  return {
    title: `${gov.label} Jobs in Kenya | JobReady`,
    description: gov.description,
    alternates: {
      canonical: `https://jobreadyke.co.ke/government/${level}`,
    },
    openGraph: {
      title: `${gov.label} Jobs | JobReady`,
      description: gov.description,
      url: `/government/${level}`,
      type: "website",
      siteName: "JobReady",
    },
  };
}

export const dynamic = 'force-dynamic';

export default async function GovernmentLevelPage({
  params,
}: {
  params: Promise<{ level: string }>;
}) {
  const { level } = await params;
  const gov = GOV_LEVELS.find((g) => g.slug === level);

  if (!gov) notFound();

  const jobs = await getGovernmentJobsByLevel(gov.dbLevel);
  const count = jobs.length;
  const otherLevels = GOV_LEVELS.filter((g) => g.slug !== level);

  return (
    <main className="bg-surface">
      <div className="max-w-6xl mx-auto px-5 py-8 md:py-12">
        <SeoPageHeader
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Government Jobs", href: "/government" },
            { label: gov.label, href: `/government/${level}` },
          ]}
          title={`${gov.label} Jobs`}
          description={gov.description}
          count={count || undefined}
        />

        {/* Blue gov badge */}
        <div className="mb-8 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-100">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
          <span className="text-[12px] font-medium">{gov.label}</span>
        </div>

        {/* Listings or fallback */}
        {count > 0 ? (
          <div className="mb-10">
            <p className="text-[14px] text-muted mb-4">
              Showing {count} {gov.label.toLowerCase()} positions.
            </p>
            <div className="space-y-0 divide-y divide-subtle">
              {jobs.map((job) => (
                <GovJobRow key={job.id} job={job} />
              ))}
            </div>
          </div>
        ) : (
          <div className="mb-10">
            <RichFallback listingCount={count} nearbyCounties={KE_COUNTIES.slice(0, 8) as unknown as string[]} />
          </div>
        )}

        {/* County-specific government pages */}
        {level === "county" && (
          <div className="mb-10">
            <h2 className="text-[13px] font-semibold text-ink uppercase tracking-wider mb-4">
              County Government Jobs by County
            </h2>
            <div className="flex flex-wrap gap-2">
              {KE_COUNTIES.map((county) => (
                <Link
                  key={slugifyCounty(county)}
                  href={`/government/county/${slugifyCounty(county)}`}
                  className="text-[12px] font-medium px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-100 hover:bg-blue-100 transition-colors"
                >
                  {county}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Other government levels */}
        <div>
          <h2 className="text-[13px] font-semibold text-ink uppercase tracking-wider mb-4">
            Other Government Sections
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {otherLevels.map((g) => (
              <Link
                key={g.slug}
                href={`/government/${g.slug}`}
                className="flex items-center justify-between px-4 py-3 rounded-lg border border-divider hover:border-blue-200 hover:bg-blue-50/50 transition-all group"
              >
                <span className="text-[13px] font-medium text-ink/80 group-hover:text-ink">
                  {g.label}
                </span>
                <svg
                  className="w-4 h-4 text-muted group-hover:text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </div>
        </div>

        {/* How to apply guide */}
        <div className="mt-10 rounded-xl border border-divider p-6">
          <h2 className="text-[15px] font-heading font-bold text-ink mb-2">
            How to Apply for {gov.label} Jobs
          </h2>
          <div className="text-[13px] text-ink/70 space-y-2">
            <p>
              Government job applications in Kenya follow a structured process. Here is what you need to know:
            </p>
            <ol className="list-decimal pl-5 space-y-1">
              <li>Check official announcements from the Public Service Commission (PSC) or County Public Service Boards</li>
              <li>Prepare your application: updated CV, cover letter, certified copies of certificates</li>
              <li>Submit before the stated deadline — late applications are never considered</li>
              <li>Shortlisted candidates are contacted for interviews and assessments</li>
              <li>Successful candidates undergo security clearance and verification</li>
            </ol>
            <p>
              All government jobs must comply with Chapter Six of the Constitution on Leadership and Integrity.
              Applications are free of charge — never pay for a government job application.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

/* ── Government job row (server component) ── */
function GovJobRow({ job }: { job: Job }) {
  return (
    <Link
      href={`/jobs/${job.slug}`}
      className="flex items-center justify-between py-3 group cursor-pointer rounded-lg hover:bg-white/60 -mx-2 px-2 transition-colors"
    >
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium group-hover:text-accent transition-colors leading-snug truncate">
          {job.title}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[12px] text-muted">{job.companyName}</span>
          {job.location && (
            <>
              <span className="text-divider">·</span>
              <span className="text-[12px] text-muted">{job.location}</span>
            </>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3 ml-4 shrink-0">
        {job.deadline && (
          <span className="font-mono text-[11px] text-muted tabular-nums">
            Closes {formatDateShortUTC(job.deadline)}
          </span>
        )}
        <svg
          className="w-4 h-4 text-muted/40 group-hover:text-accent transition-colors"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}
