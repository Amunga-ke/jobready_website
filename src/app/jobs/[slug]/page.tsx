import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, MapPin, Clock, Building2, ExternalLink, Share2 } from "lucide-react";
import { formatDateUTC } from "@/lib/format-date";
import type { Job } from "@/types";

// ─── Mock data until DB is connected ───
// In production, this would fetch from the database via Prisma
const MOCK_JOBS: Job[] = [
  {
    id: "1",
    slug: "senior-software-engineer-safaricom-nairobi",
    title: "Senior Software Engineer",
    companyName: "Safaricom PLC",
    companyLogo: null,
    companyVerified: true,
    location: "Nairobi, Kenya",
    county: "Nairobi",
    country: "Kenya",
    category: "TECHNOLOGY",
    subcategory: "SOFTWARE_ENGINEERING",
    listingType: "JOB",
    employmentType: "FULL_TIME",
    experienceLevel: "SENIOR",
    workMode: "HYBRID",
    salaryMin: 250000,
    salaryMax: 400000,
    salaryCurrency: "KES",
    salaryPeriod: "month",
    description:
      "<p>Safaricom is looking for a Senior Software Engineer to join our Digital Services team. You will be responsible for designing, developing, and maintaining scalable software solutions that serve over 30 million customers across Kenya.</p><p>The ideal candidate has strong experience in modern web and mobile technologies, with a passion for building products that make a difference in people's lives.</p>",
    requirements:
      "<ul><li>BSc in Computer Science, Software Engineering, or related field</li><li>5+ years of professional software development experience</li><li>Strong proficiency in TypeScript, React, Node.js, and cloud services (AWS/Azure)</li><li>Experience with microservices architecture and RESTful APIs</li><li>Familiarity with DevOps practices and CI/CD pipelines</li></ul>",
    instructions:
      "<p>Interested candidates should submit their application through the Safaricom careers portal. Include your updated CV and a cover letter detailing your relevant experience.</p><p>Applications close on the deadline date. Only shortlisted candidates will be contacted.</p>",
    tags: ["typescript", "react", "nodejs", "aws", "mobile"],
    createdAt: "2025-05-01T10:00:00Z",
    deadline: "2025-06-15T23:59:59Z",
    source: "safaricom.co.ke",
    applicationUrl: "https://safaricom.co.ke/careers",
    applyCount: 142,
    featured: true,
  },
  {
    id: "2",
    slug: "county-director-of-health-kisumu",
    title: "County Director of Health Services",
    companyName: "County Government of Kisumu",
    companyLogo: null,
    companyVerified: true,
    location: "Kisumu, Kenya",
    county: "Kisumu",
    country: "Kenya",
    category: "GOVERNMENT_PUBLIC_SECTOR",
    subcategory: "PUBLIC_ADMINISTRATION",
    listingType: "GOVERNMENT",
    governmentLevel: "COUNTY",
    employmentType: "FULL_TIME",
    experienceLevel: "DIRECTOR",
    workMode: "ONSITE",
    salaryMin: null,
    salaryMax: null,
    predictedSalary: "KES 180,000 – 350,000 / month",
    isPredictedSalary: true,
    description:
      "<p>The County Government of Kisumu invites applications from qualified Kenyan citizens for the position of County Director of Health Services.</p><p>This is a senior leadership role responsible for planning, coordinating, and implementing county health policies and programs in alignment with the national health agenda.</p>",
    requirements:
      "<ul><li>Master's degree in Public Health, Medicine, or related field</li><li>10+ years of experience in health services management</li><li>Registration with relevant professional body</li><li>Demonstrated leadership in public health administration</li></ul>",
    instructions:
      "<p>Applications should be submitted to:</p><p><strong>The County Secretary</strong><br/>County Government of Kisumu<br/>P.O. Box 2901-40100<br/>Kisumu, Kenya</p><p>Include: Application letter, CV, copies of certificates, and national ID. Clearly mark the envelope with the position applied for.</p>",
    tags: ["health", "government", "county", "leadership"],
    createdAt: "2025-04-28T08:00:00Z",
    deadline: "2025-05-30T17:00:00Z",
    source: "kisumu.go.ke",
    applicationUrl: null,
    applyCount: 67,
    featured: false,
  },
  {
    id: "3",
    slug: "google-developer-scholarship-2025",
    title: "Google Africa Developer Scholarship 2025",
    companyName: "Google",
    companyLogo: null,
    companyVerified: true,
    location: "Remote, Kenya",
    county: "Nairobi",
    country: "Kenya",
    category: "TECHNOLOGY",
    subcategory: "AI_MACHINE_LEARNING",
    listingType: "OPPORTUNITY",
    opportunityType: "SCHOLARSHIP",
    employmentType: "FULL_TIME",
    experienceLevel: "ENTRY_LEVEL",
    workMode: "REMOTE",
    salaryMin: null,
    salaryMax: null,
    description:
      "<p>Google is offering the Africa Developer Scholarship program for 2025, aimed at aspiring and intermediate software developers across Africa. The program provides free access to world-class training in Android, Web, and Google Cloud technologies.</p><p>Selected scholars will gain access to the Pluralsight platform, peer-to-peer learning communities, and mentorship from Google engineers.</p>",
    requirements:
      "<ul><li>Must be a resident of an African country</li><li>Basic knowledge of programming (any language)</li><li>Access to a computer and reliable internet</li><li>Commitment to completing the program within the specified timeline</li></ul>",
    instructions:
      "<p>Apply through the official Google Africa Developer Scholarship website. You will need to complete a short assessment as part of the application process.</p>",
    tags: ["google", "scholarship", "developer", "remote", "free"],
    createdAt: "2025-04-25T12:00:00Z",
    deadline: "2025-07-31T23:59:59Z",
    source: "grow.google",
    applicationUrl: "https://grow.google/africa/dev-scholarship/",
    applyCount: 2340,
    featured: true,
  },
];

function getJobBySlug(slug: string): Job | undefined {
  return MOCK_JOBS.find((j) => j.slug === slug);
}

// ─── Dynamic metadata for SEO ───
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const job = getJobBySlug(slug);
  if (!job) return { title: "Job Not Found | FursaKE" };

  return {
    title: `${job.title} at ${job.companyName} | FursaKE`,
    description: `Apply for ${job.title} at ${job.companyName} in ${job.location}. ${job.listingType === "JOB" ? "Job" : "Opportunity"} posted on FursaKE — Kenya's most trusted job board.`,
    openGraph: {
      title: `${job.title} at ${job.companyName}`,
      description: `Apply for ${job.title} at ${job.companyName} in ${job.location} on FursaKE`,
      url: `/jobs/${slug}`,
      type: "article",
      siteName: "FursaKE",
    },
  };
}

// ─── Page component ───
export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const job = getJobBySlug(slug);

  if (!job) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-surface">
      {/* Top bar */}
      <div className="border-b border-divider bg-white/60 backdrop-blur-sm sticky top-0 z-30">
        <div className="max-w-3xl mx-auto px-5 py-3 flex items-center gap-3">
          <Link
            href="/jobs"
            className="inline-flex items-center gap-1 text-[13px] text-muted hover:text-ink transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
        </div>
      </div>

      <article className="max-w-3xl mx-auto px-5 py-8 space-y-6">
        {/* Title block */}
        <div>
          <div className="flex items-start gap-3 mb-1">
            <div className="w-12 h-12 rounded-xl bg-ink/[0.06] flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5 text-muted" />
            </div>
            <div className="min-w-0">
              <h1 className="text-xl md:text-2xl font-heading font-bold text-ink leading-tight">
                {job.title}
              </h1>
              <p className="text-[15px] text-muted mt-0.5">
                {job.companyName}
                {job.companyVerified && (
                  <span className="ml-2 text-[12px] text-accent font-medium">
                    Verified
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] text-muted">
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="w-4 h-4" />
            {job.location}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            Posted {formatDateUTC(job.createdAt)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Building2 className="w-4 h-4" />
            {job.employmentType.replace(/_/g, " ")}
          </span>
          <span>{job.workMode}</span>
          <span>{job.experienceLevel.replace(/_/g, " ")}</span>
          {job.deadline && (
            <span className="text-accent font-medium">
              Deadline: {formatDateUTC(job.deadline)}
            </span>
          )}
        </div>

        {/* Type badges */}
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[12px] font-medium bg-ink/[0.05] text-ink/70">
            {job.category.replace(/_/g, " ")}
          </span>
          {job.governmentLevel && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[12px] font-medium bg-blue-50 text-blue-700 border border-blue-100">
              {job.governmentLevel === "NATIONAL"
                ? "National Government"
                : job.governmentLevel === "COUNTY"
                ? "County Government"
                : "State Corporation"}
            </span>
          )}
          {job.opportunityType && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[12px] font-medium bg-amber-50 text-amber-700 border border-amber-100">
              {job.opportunityType.replace(/_/g, " ")}
            </span>
          )}
        </div>

        {/* Salary */}
        <div className="rounded-lg bg-emerald-50/60 border border-emerald-100/80 px-5 py-4">
          <p className="text-[11px] font-medium text-emerald-600 uppercase tracking-wider mb-1.5">
            {job.listingType === "OPPORTUNITY" ? "Value" : "Compensation"}
          </p>
          {job.salaryMin != null && job.salaryMax != null ? (
            <p className="text-base font-semibold text-ink">
              {job.salaryCurrency || "KES"} {job.salaryMin?.toLocaleString()} –{" "}
              {job.salaryMax?.toLocaleString()}
              {job.salaryPeriod && (
                <span className="font-normal text-muted">
                  {" "}
                  / {job.salaryPeriod}
                </span>
              )}
            </p>
          ) : (
            <>
              <p className="text-base font-medium text-ink/60">
                {job.predictedSalary || "Not disclosed"}
              </p>
              {job.isPredictedSalary && (
                <p className="text-[12px] text-muted mt-1">
                  Estimated based on similar roles in{" "}
                  {job.county || job.location}
                </p>
              )}
            </>
          )}
        </div>

        {/* Description */}
        <div>
          <h2 className="text-[13px] font-semibold text-ink uppercase tracking-wider mb-3">
            Description
          </h2>
          <div
            className="text-[14px] text-ink/80 leading-relaxed
              [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5
              [&_li]:mb-1.5 [&_p]:mb-3 [&_strong]:font-semibold [&_strong]:text-ink"
            dangerouslySetInnerHTML={{ __html: job.description }}
          />
        </div>

        {/* Requirements */}
        {job.requirements && (
          <div>
            <h2 className="text-[13px] font-semibold text-ink uppercase tracking-wider mb-3">
              Requirements
            </h2>
            <div
              className="text-[14px] text-ink/80 leading-relaxed
                [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5
                [&_li]:mb-1.5 [&_p]:mb-3"
              dangerouslySetInnerHTML={{ __html: job.requirements }}
            />
          </div>
        )}

        {/* Instructions */}
        {job.instructions && (
          <div>
            <h2 className="text-[13px] font-semibold text-ink uppercase tracking-wider mb-3">
              How to Apply
            </h2>
            <div
              className="text-[14px] text-ink/80 leading-relaxed
                [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5
                [&_li]:mb-1.5 [&_p]:mb-3 [&_strong]:font-semibold [&_strong]:text-ink"
              dangerouslySetInnerHTML={{ __html: job.instructions }}
            />
          </div>
        )}

        {/* Tags */}
        {job.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {job.tags.map((tag) => (
              <span
                key={tag}
                className="text-[12px] text-muted bg-ink/[0.03] px-2 py-0.5 rounded"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Apply CTA */}
        <div className="pt-4 border-t border-divider flex items-center justify-between gap-4">
          <ShareButton slug={job.slug} title={job.title} />
          {job.applicationUrl ? (
            <a
              href={job.applicationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-ink text-white text-[14px] font-medium hover:bg-ink/90 transition-colors"
            >
              Apply Now
              <ExternalLink className="w-4 h-4" />
            </a>
          ) : (
            <button className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-ink text-white text-[14px] font-medium hover:bg-ink/90 transition-colors">
              Apply Now
              <ExternalLink className="w-4 h-4" />
            </button>
          )}
        </div>
      </article>
    </main>
  );
}

// ─── Share button (server-safe) ───
function ShareButton({ slug, title }: { slug: string; title: string }) {
  return (
    <button
      onClick={() => {
        if (typeof window !== "undefined") {
          const url = `${window.location.origin}/jobs/${slug}`;
          if (navigator.share) {
            navigator.share({ title, url });
          } else {
            navigator.clipboard.writeText(url);
          }
        }
      }}
      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-[13px] font-medium text-muted hover:text-ink hover:bg-ink/[0.04] transition-colors"
    >
      <Share2 className="w-4 h-4" />
      Share
    </button>
  );
}
