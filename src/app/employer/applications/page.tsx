"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FileText,
  Search,
  Filter,
  ChevronDown,
  Clock,
  MapPin,
  Briefcase,
} from "lucide-react";

interface Application {
  id: string;
  status: string;
  coverLetter: string | null;
  cvUrl: string | null;
  appliedAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    county: string | null;
    avatarUrl: string | null;
  };
  listing: {
    id: string;
    title: string;
    slug: string;
    listingType: string;
    employmentType: string;
  };
}

interface EmployerJob {
  id: string;
  title: string;
  slug: string;
  _count: { applications: number };
}

const STATUS_COLORS: Record<string, string> = {
  SUBMITTED: "bg-blue-50 text-blue-700 border-blue-100",
  VIEWED: "bg-cyan-50 text-cyan-700 border-cyan-100",
  SHORTLISTED: "bg-amber-50 text-amber-700 border-amber-100",
  INTERVIEW: "bg-purple-50 text-purple-700 border-purple-100",
  OFFERED: "bg-emerald-50 text-emerald-700 border-emerald-100",
  REJECTED: "bg-red-50 text-red-700 border-red-100",
  WITHDRAWN: "bg-gray-50 text-gray-600 border-gray-100",
  DRAFT: "bg-gray-50 text-gray-600 border-gray-100",
};

export default function EmployerApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [jobs, setJobs] = useState<EmployerJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [jobFilter, setJobFilter] = useState("");

  const loadApplications = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "ALL") params.set("status", statusFilter);
      if (jobFilter) params.set("listingId", jobFilter);
      if (search) params.set("search", search);
      const res = await fetch(`/api/employer/applications?${params}`);
      if (res.ok) {
        const data = await res.json();
        setApplications(data.applications);
        setTotal(data.total);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function loadJobs() {
      const res = await fetch("/api/employer/jobs?limit=100");
      if (res.ok) {
        const data = await res.json();
        setJobs(data.jobs);
      }
    }
    loadJobs();
    loadApplications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, jobFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadApplications();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-heading font-bold text-ink">Applications</h1>
        <p className="text-[13px] text-muted mt-1">{total} application{total !== 1 ? "s" : ""} received</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <form onSubmit={handleSearch} className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-divider text-[13px] text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent bg-white"
          />
        </form>
        <select
          value={jobFilter}
          onChange={(e) => setJobFilter(e.target.value)}
          className="px-3 py-2.5 rounded-lg border border-divider text-[13px] text-ink bg-white focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
        >
          <option value="">All Jobs</option>
          {jobs.map((job) => (
            <option key={job.id} value={job.id}>{job.title} ({job._count.applications})</option>
          ))}
        </select>
      </div>

      {/* Status filters */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {["ALL", "SUBMITTED", "VIEWED", "SHORTLISTED", "INTERVIEW", "OFFERED", "REJECTED"].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-medium whitespace-nowrap transition-colors ${
              statusFilter === s
                ? "bg-accent-bg text-accent border border-accent/20"
                : "bg-white text-muted hover:text-ink border border-divider"
            }`}
          >
            {s === "ALL" ? "All" : s.charAt(0) + s.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {/* Applications list */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 bg-white rounded-xl border border-divider animate-pulse" />
          ))}
        </div>
      ) : applications.length === 0 ? (
        <div className="bg-white rounded-xl border border-divider p-8 text-center">
          <FileText className="w-10 h-10 text-muted/30 mx-auto mb-3" />
          <p className="text-[13px] text-ink font-medium">No applications found</p>
          <p className="text-[12px] text-muted mt-1">
            {statusFilter !== "ALL" || jobFilter
              ? "Try adjusting your filters"
              : "Applications will appear when candidates apply to your jobs"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {applications.map((app) => (
            <Link
              key={app.id}
              href={`/employer/applications/${app.id}`}
              className="bg-white rounded-xl border border-divider p-4 hover:border-accent/20 transition-colors block"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-ink/[0.06] flex items-center justify-center text-[12px] font-semibold text-ink shrink-0">
                  {app.user.name?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "?"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-[14px] font-medium text-ink truncate">{app.user.name}</h3>
                    <span className={`flex-shrink-0 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium border ${STATUS_COLORS[app.status] || STATUS_COLORS.SUBMITTED}`}>
                      {app.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted">{app.user.email}</p>
                  <p className="text-[12px] text-ink mt-0.5 truncate">{app.listing.title}</p>
                  <div className="flex items-center gap-3 mt-1.5 text-[11px] text-muted">
                    {app.user.county && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {app.user.county}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(app.appliedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                    {app.cvUrl && (
                      <span className="text-accent font-medium">CV attached</span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
