"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Briefcase,
  PlusCircle,
  Search,
  Eye,
  Users,
  Clock,
  MoreVertical,
  Trash2,
  Edit,
  Filter,
} from "lucide-react";

interface Job {
  id: string;
  slug: string;
  title: string;
  listingType: string;
  employmentType: string;
  experienceLevel: string;
  workMode: string;
  town: string;
  county: string;
  status: string;
  featured: boolean;
  salaryMin: number | null;
  salaryMax: number | null;
  salaryPeriod: string | null;
  deadline: string | null;
  applyCount: number;
  viewCount: number;
  createdAt: string;
  _count: { applications: number };
}

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: "bg-emerald-50 text-emerald-700 border-emerald-100",
  DRAFT: "bg-gray-50 text-gray-600 border-gray-100",
  CLOSED: "bg-red-50 text-red-700 border-red-100",
  EXPIRED: "bg-amber-50 text-amber-700 border-amber-100",
  FILLED: "bg-blue-50 text-blue-700 border-blue-100",
  PAUSED: "bg-purple-50 text-purple-700 border-purple-100",
};

export default function EmployerJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [total, setTotal] = useState(0);
  const [deleting, setDeleting] = useState<string | null>(null);

  const loadJobs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (statusFilter !== "ALL") params.set("status", statusFilter);
      const res = await fetch(`/api/employer/jobs?${params}`);
      if (res.ok) {
        const data = await res.json();
        setJobs(data.jobs);
        setTotal(data.total);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadJobs();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this job? This action cannot be undone.")) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/employer/jobs/${id}`, { method: "DELETE" });
      if (res.ok) {
        setJobs(jobs.filter((j) => j.id !== id));
        setTotal((t) => t - 1);
      }
    } catch {
      // silent
    } finally {
      setDeleting(null);
    }
  };

  const formatSalary = (min: number | null, max: number | null, period: string | null) => {
    if (!min && !max) return null;
    const fmt = (n: number) => n >= 1000000 ? `${(n / 1000000).toFixed(1)}M` : n >= 1000 ? `${(n / 1000).toFixed(0)}K` : `${n}`;
    if (min && max) return `KES ${fmt(min)} - ${fmt(max)}`;
    if (min) return `From KES ${fmt(min)}`;
    return `Up to KES ${fmt(max!)}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-heading font-bold text-ink">My Jobs</h1>
          <p className="text-[13px] text-muted mt-1">{total} job{total !== 1 ? "s" : ""} posted</p>
        </div>
        <Link
          href="/employer/jobs/new"
          className="flex items-center gap-2 bg-accent hover:bg-accent-dark text-white text-[12px] font-medium px-4 py-2.5 rounded-lg transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          Post a Job
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <form onSubmit={handleSearch} className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search jobs..."
            className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-divider text-[13px] text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors bg-white"
          />
        </form>
        <div className="flex gap-2 overflow-x-auto">
          {["ALL", "ACTIVE", "DRAFT", "CLOSED", "PAUSED"].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 rounded-lg text-[12px] font-medium whitespace-nowrap transition-colors ${
                statusFilter === s
                  ? "bg-accent-bg text-accent border border-accent/20"
                  : "bg-white text-muted hover:text-ink border border-divider"
              }`}
            >
              {s === "ALL" ? "All" : s.charAt(0) + s.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Jobs list */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 bg-white rounded-xl border border-divider animate-pulse" />
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <div className="bg-white rounded-xl border border-divider p-8 text-center">
          <Briefcase className="w-10 h-10 text-muted/30 mx-auto mb-3" />
          <p className="text-[13px] text-ink font-medium">No jobs found</p>
          <p className="text-[12px] text-muted mt-1">
            {statusFilter !== "ALL" ? "Try changing the filter or " : "Get started by "}
            <Link href="/employer/jobs/new" className="text-accent hover:text-accent-dark font-medium">
              posting a new job
            </Link>
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {jobs.map((job) => (
            <div key={job.id} className="bg-white rounded-xl border border-divider p-4 hover:border-accent/20 transition-colors">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-[14px] font-medium text-ink truncate">{job.title}</h3>
                    {job.featured && (
                      <span className="flex-shrink-0 text-[9px] bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded font-medium border border-amber-100">
                        Featured
                      </span>
                    )}
                    <span className={`flex-shrink-0 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium border ${STATUS_COLORS[job.status] || STATUS_COLORS.DRAFT}`}>
                      {job.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-muted flex-wrap">
                    {job.town && <span>{job.town}</span>}
                    {job.county && <span>{job.county}</span>}
                    <span>{job.employmentType}</span>
                    <span>{job.experienceLevel}</span>
                    <span className="capitalize">{job.workMode.toLowerCase()}</span>
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-[11px] text-muted">
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {job._count.applications} applications
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {job.viewCount} views
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(job.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                    {formatSalary(job.salaryMin, job.salaryMax, job.salaryPeriod) && (
                      <span className="text-ink font-medium">{formatSalary(job.salaryMin, job.salaryMax, job.salaryPeriod)}</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <Link
                    href={`/employer/jobs/${job.id}/edit`}
                    className="p-2 text-muted hover:text-accent hover:bg-accent-bg rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(job.id)}
                    disabled={deleting === job.id}
                    className="p-2 text-muted hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
