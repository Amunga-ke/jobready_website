import SectionNumber from './SectionNumber';
import JobClickable from './JobClickable';
import { featuredHeroJob, featuredJobs } from '@/lib/mock-jobs';

export default function Featured() {
  return (
    <section className="py-14 border-t border-divider relative overflow-hidden">
      <SectionNumber num="03" />
      <div className="max-w-6xl mx-auto px-5 relative">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading text-xl font-bold">Featured</h2>
          <span className="text-[10px] font-mono text-muted/50 uppercase tracking-widest">Sponsored</span>
        </div>

        {/* Hero featured job */}
        <JobClickable
          job={featuredHeroJob}
          className="border-l-2 border-accent pl-6 sm:pl-8 mb-10 group cursor-pointer"
        >
          <p className="font-mono text-[10px] text-muted uppercase tracking-[0.15em] mb-3">
            {featuredHeroJob.companyName} · Telecommunications
          </p>
          <h3 className="font-heading text-2xl sm:text-3xl font-bold leading-tight mb-3 group-hover:text-accent-dark transition-colors">
            {featuredHeroJob.title}
          </h3>
          <p className="text-sm text-muted leading-relaxed max-w-xl mb-4">
            Lead product strategy for 30M+ active users across East Africa. Work with a cross-functional team of 12+ engineers and designers.
          </p>
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            <span className="text-[11px] text-muted">{featuredHeroJob.location}</span>
            <span className="text-[11px] text-subtle">·</span>
            <span className="text-[11px] text-muted">{featuredHeroJob.employmentType}</span>
            <span className="text-[11px] text-subtle">·</span>
            <span className="text-[11px] text-muted">{featuredHeroJob.experienceLevel}</span>
            <span className="text-[11px] text-subtle">·</span>
            <span className="text-[11px] text-muted">30M+ users</span>
          </div>
        </JobClickable>

        <div className="divide-y divide-divider">
          {featuredJobs.map((job) => (
            <JobClickable
              key={job.id}
              job={job}
              className="flex items-center gap-3 py-3.5 group cursor-pointer hover:bg-surface rounded-lg -mx-2 px-2 transition-colors"
            >
              <div className="w-10 h-10 border border-divider rounded-lg flex items-center justify-center shrink-0 font-heading font-bold text-sm text-muted">
                {job.companyName.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate group-hover:text-accent transition-colors">{job.title}</p>
                <p className="text-[11px] text-muted">{job.companyName} · {job.location}</p>
              </div>
            </JobClickable>
          ))}
        </div>
      </div>
    </section>
  );
}
