import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, MapPin, Clock, Building2, ExternalLink } from "lucide-react";
import { formatDateUTC } from "@/lib/format-date";
import { getJobBySlug } from "@/lib/data";
import ShareButton from "@/components/jobready/ShareButton";

// ─── Dynamic metadata for SEO ───
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const job = await getJobBySlug(slug);
  if (!job) return { title: "Job Not Found | JobReady" };

  return {
    title: `${job.title} at ${job.companyName} | JobReady`,
    description: `Apply for ${job.title} at ${job.companyName} in ${job.location}. ${job.listingType === "JOB" ? "Job" : "Opportunity"} posted on JobReady — Kenya's most trusted job board.`,
    openGraph: {
      title: `${job.title} at ${job.companyName}`,
      description: `Apply for ${job.title} at ${job.companyName} in ${job.location} on JobReady`,
      url: `https://jobreadyke.co.ke/jobs/${slug}`,
      type: "article",
      siteName: "JobReady",
    },
    twitter: {
      card: "summary_large_image",
      title: `${job.title} at ${job.companyName}`,
      description: `Apply for ${job.title} at ${job.companyName} in ${job.location} on JobReady`,
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
  const job = await getJobBySlug(slug);

  if (!job) {
    notFound();
  }

  return (
    <main className="bg-surface">
      {/* Top bar */}
      <div className="border-b border-divider bg-white/60 backdrop-blur-sm sticky top-0 z-30">
        <div className="max-w-3xl mx-auto px-5 py-3 flex items-center gap-3">
          <Link
            href="/"
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
            {job.employmentType}
          </span>
          <span>{job.workMode}</span>
          <span>{job.experienceLevel}</span>
          {job.deadline && (
            <span className="text-accent font-medium">
              Deadline: {formatDateUTC(job.deadline)}
            </span>
          )}
        </div>

        {/* Type badges */}
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[12px] font-medium bg-ink/[0.05] text-ink/70">
            {job.listingType === "JOB"
              ? "Job"
              : job.listingType === "GOVERNMENT"
              ? "Government"
              : job.listingType === "CASUAL"
              ? "Casual"
              : "Opportunity"}
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
          {job.tags.map((tag) => (
            <span key={tag} className="inline-flex items-center px-2.5 py-1 rounded-md text-[12px] font-medium bg-surface text-muted border border-subtle">
              #{tag}
            </span>
          ))}
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
        {job.description && (
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
        )}

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
