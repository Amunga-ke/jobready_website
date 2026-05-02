import Link from "next/link";
import JobClickable from "./JobClickable";
import { formatDateShortUTC } from "@/lib/format-date";
import type { Job } from "@/types";

const QUICK_LINKS = [
  { label: "Remote", href: "/jobs?mode=REMOTE" },
  { label: "Entry Level", href: "/jobs?experience=Entry-level" },
  { label: "Government", href: "/government" },
  { label: "This Week", href: "/jobs?sort=closing" },
  { label: "Internships", href: "/opportunities/internship" },
];

interface HeroProps {
  jobs: Job[];
}

export default function Hero({ jobs }: HeroProps) {
  const justPosted = jobs.slice(0, 4);

  return (
    <section className="pt-8 pb-16 lg:pt-12 lg:pb-24 border-b border-divider">
      <div className="max-w-6xl mx-auto px-5">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16">
          <div className="lg:col-span-8">
            <p className="font-mono text-[11px] text-muted uppercase tracking-[0.2em] mb-6">
              Verified jobs from 800+ employers across Kenya
            </p>
            <h1 className="font-hero text-5xl sm:text-6xl lg:text-[76px] font-black leading-[0.95] tracking-tight mb-6">
              Your next job<br />
              <span className="text-muted">is here.</span>
            </h1>
            <p className="text-muted text-base max-w-md leading-relaxed mb-10">
              Real jobs from verified employers. No scams, no recruiter spam, no noise.
            </p>

            <div className="max-w-xl">
              <form action="/jobs" method="get">
                <div className="border border-divider rounded-xl p-1.5 mb-3">
                  <div className="flex">
                    <input
                      name="q"
                      type="text"
                      placeholder="Job title, company, keyword..."
                      className="flex-1 text-sm bg-transparent focus:outline-none placeholder-muted/60 pl-4 py-3"
                    />
                    <button type="submit" className="text-sm font-semibold text-ink hover:text-accent transition-colors shrink-0 pr-4">
                      Search →
                    </button>
                  </div>
                </div>
              </form>
              <div className="flex flex-wrap gap-3">
                {QUICK_LINKS.map((link) => (
                  <Link key={link.href} href={link.href} className="text-[11px] text-muted hover:text-ink transition-colors">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 border-t lg:border-t-0 lg:border-l border-divider pt-6 lg:pt-0 lg:pl-8">
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-[10px] text-muted uppercase tracking-widest">Just posted</span>
              <Link href="/jobs?sort=latest" className="text-[11px] font-mono text-muted hover:text-ink transition-colors uppercase tracking-wider">
                View all →
              </Link>
            </div>

            {justPosted.length > 0 ? (
              <div className="divide-y divide-divider">
                {justPosted.map((job) => (
                  <JobClickable
                    key={job.id}
                    job={job}
                    className="flex items-center gap-3 py-3 group cursor-pointer hover:bg-ink/[0.03] rounded-lg -mx-1 px-1 transition-colors"
                  >
                    <div className="w-9 h-9 border border-divider rounded-lg flex items-center justify-center shrink-0 font-heading font-bold text-[12px] text-muted">
                      {job.companyName.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium truncate group-hover:text-accent transition-colors">{job.title}</p>
                      <p className="text-[11px] text-muted">{job.companyName} · {formatDateShortUTC(job.createdAt)}</p>
                    </div>
                  </JobClickable>
                ))}
              </div>
            ) : (
              <p className="text-[12px] text-muted/60 mb-4">See the latest jobs from verified employers across Kenya.</p>
            )}

            <Link
              href="/jobs?sort=latest"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-ink text-white text-[13px] font-medium rounded-lg hover:bg-ink/90 transition-colors mt-2"
            >
              Browse all latest jobs
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
