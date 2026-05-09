import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getJobBySlug } from "@/lib/data";

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
      <div className="max-w-3xl mx-auto px-5 py-8">
        <h1 className="text-2xl font-bold">{job.title}</h1>
        <p className="text-muted">{job.companyName} — {job.location}</p>
        <p className="text-sm text-ink/60">{job.employmentType} — {job.workMode}</p>
        <div className="mt-4 text-sm">
          {job.description}
        </div>
      </div>
    </main>
  );
}
