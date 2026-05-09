import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getJobBySlug } from "@/lib/data";
import { JobPostingJsonLd, BreadcrumbJsonLd } from "@/components/jobready/JsonLd";
import { formatDateUTC } from "@/lib/format-date";

export const revalidate = 300;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return { title: `Job | JobReady` };
}

export default async function SlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const job = await getJobBySlug(slug).catch(() => null);
  if (!job) notFound();

  return (
    <main className="bg-surface">
      <JobPostingJsonLd
        title={job.title}
        description={job.description || ""}
        datePosted={new Date(job.createdAt).toISOString()}
        employmentType={job.employmentType}
        hiringOrganization={job.companyName}
        jobLocation={job.location || job.county || "Kenya"}
        url={`https://jobreadyke.co.ke/jobs/${slug}`}
      />
      <BreadcrumbJsonLd items={[
        { name: "Home", url: "https://jobreadyke.co.ke/" },
        { name: "Jobs", url: "https://jobreadyke.co.ke/jobs" },
        { name: job.title, url: `https://jobreadyke.co.ke/jobs/${slug}` },
      ]} />
      <div className="max-w-3xl mx-auto px-5 py-8">
        <h1 className="text-2xl font-bold">{job.title}</h1>
        <p className="text-muted">{job.companyName} — {job.location}</p>
        <p className="text-sm">{formatDateUTC(job.createdAt)}</p>
        {job.description && (
          <div dangerouslySetInnerHTML={{ __html: job.description }} />
        )}
      </div>
    </main>
  );
}
