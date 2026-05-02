"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  Bookmark,
  FileText,
  CalendarCheck,
  UserCheck,
  ArrowRight,
  Search,
  Upload,
  BellPlus,
} from "lucide-react";

interface Stats {
  savedJobs: number;
  totalApplications: number;
  submittedApplications: number;
  shortlistedApplications: number;
  interviewApplications: number;
  offeredApplications: number;
  draftApplications: number;
  profileCompletion: number;
}

interface RecentSavedJob {
  id: string;
  job: {
    title: string;
    companyName: string;
    slug: string;
    location: string;
    deadline: string | null;
    employmentType: string;
    salaryMin: number | null;
    salaryMax: number | null;
    salaryCurrency: string;
  };
  savedAt: string;
}

interface RecentApplication {
  id: string;
  status: string;
  appliedAt: string;
  job: {
    title: string;
    companyName: string;
    slug: string;
  };
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

function daysUntil(dateStr: string | null): string | null {
  if (!dateStr) return null;
  const diff = Math.ceil((new Date(dateStr).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  if (diff < 0) return "Closed";
  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  return `${diff}d left`;
}

export default function DashboardOverview() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentSaved, setRecentSaved] = useState<RecentSavedJob[]>([]);
  const [recentApplications, setRecentApplications] = useState<RecentApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [statsRes, savedRes, appsRes] = await Promise.all([
          fetch("/api/dashboard/stats"),
          fetch("/api/dashboard/saved-jobs"),
          fetch("/api/dashboard/applications"),
        ]);

        if (statsRes.ok) setStats(await statsRes.json());
        if (savedRes.ok) setRecentSaved((await savedRes.json()).slice(0, 5));
        if (appsRes.ok) setRecentApplications((await appsRes.json()).slice(0, 5));
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const firstName = session?.user?.name?.split(" ")[0] || "there";

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-ink/[0.04] rounded-lg animate-pulse" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-white rounded-xl border border-divider animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-heading font-bold text-ink">
          Welcome back, {firstName}
        </h1>
        <p className="text-[13px] text-muted mt-1">
          Here&apos;s what&apos;s happening with your job search.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Bookmark}
          label="Saved Jobs"
          value={stats?.savedJobs ?? 0}
          color="text-accent"
          bg="bg-accent-bg"
        />
        <StatCard
          icon={FileText}
          label="Applications"
          value={stats?.totalApplications ?? 0}
          color="text-blue-600"
          bg="bg-blue-50"
        />
        <StatCard
          icon={CalendarCheck}
          label="Interviews"
          value={stats?.interviewApplications ?? 0}
          color="text-purple-600"
          bg="bg-purple-50"
        />
        <StatCard
          icon={UserCheck}
          label="Profile"
          value={`${stats?.profileCompletion ?? 0}%`}
          color="text-emerald-600"
          bg="bg-emerald-50"
        />
      </div>

      {/* Profile completion bar */}
      {(stats?.profileCompletion ?? 0) < 100 && (
        <div className="bg-white rounded-xl border border-divider p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[12px] font-medium text-ink">Complete your profile</p>
            <p className="text-[11px] text-muted">{stats?.profileCompletion}% done</p>
          </div>
          <div className="w-full h-1.5 bg-ink/[0.06] rounded-full overflow-hidden">
            <div
              className="h-full bg-accent rounded-full transition-all duration-500"
              style={{ width: `${stats?.profileCompletion ?? 0}%` }}
            />
          </div>
          <Link
            href="/dashboard/profile"
            className="inline-flex items-center gap-1 text-[11px] text-accent hover:text-accent-dark font-medium mt-2 transition-colors"
          >
            Update profile <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Saved Jobs */}
        <div className="bg-white rounded-xl border border-divider">
          <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-divider">
            <h2 className="text-[13px] font-heading font-semibold text-ink">Recent Saved Jobs</h2>
            {recentSaved.length > 0 && (
              <Link href="/dashboard/saved-jobs" className="text-[11px] text-accent hover:text-accent-dark font-medium transition-colors">
                View all
              </Link>
            )}
          </div>
          <div className="divide-y divide-divider">
            {recentSaved.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <Bookmark className="w-8 h-8 text-muted/40 mx-auto mb-2" />
                <p className="text-[12px] text-muted">No saved jobs yet</p>
                <Link
                  href="/jobs"
                  className="inline-flex items-center gap-1 text-[11px] text-accent hover:text-accent-dark font-medium mt-2 transition-colors"
                >
                  Browse jobs <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            ) : (
              recentSaved.map((item) => (
                <div key={item.id} className="px-4 py-3 hover:bg-ink/[0.02] transition-colors">
                  <p className="text-[13px] font-medium text-ink truncate">{item.job.title}</p>
                  <p className="text-[11px] text-muted mt-0.5">{item.job.companyName}</p>
                  <div className="flex items-center gap-3 mt-1.5 text-[11px] text-muted">
                    <span>{item.job.location}</span>
                    {item.job.deadline && (
                      <span className={
                        daysUntil(item.job.deadline) === "Closed"
                          ? "text-red-500"
                          : "text-accent"
                      }>
                        {daysUntil(item.job.deadline)}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Applications */}
        <div className="bg-white rounded-xl border border-divider">
          <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-divider">
            <h2 className="text-[13px] font-heading font-semibold text-ink">Recent Applications</h2>
            {recentApplications.length > 0 && (
              <Link href="/dashboard/applications" className="text-[11px] text-accent hover:text-accent-dark font-medium transition-colors">
                View all
              </Link>
            )}
          </div>
          <div className="divide-y divide-divider">
            {recentApplications.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <FileText className="w-8 h-8 text-muted/40 mx-auto mb-2" />
                <p className="text-[12px] text-muted">No applications yet</p>
                <Link
                  href="/jobs"
                  className="inline-flex items-center gap-1 text-[11px] text-accent hover:text-accent-dark font-medium mt-2 transition-colors"
                >
                  Browse jobs <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            ) : (
              recentApplications.map((app) => (
                <div key={app.id} className="px-4 py-3 hover:bg-ink/[0.02] transition-colors">
                  <p className="text-[13px] font-medium text-ink truncate">{app.job.title}</p>
                  <p className="text-[11px] text-muted mt-0.5">{app.job.companyName}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium border ${STATUS_COLORS[app.status] || STATUS_COLORS.DRAFT}`}>
                      {app.status}
                    </span>
                    <span className="text-[10px] text-muted">
                      {new Date(app.appliedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-3">
        <Link
          href="/jobs"
          className="flex items-center gap-3 bg-white rounded-xl border border-divider p-4 hover:border-accent/30 hover:bg-accent-bg/30 transition-all group"
        >
          <div className="w-9 h-9 rounded-lg bg-accent-bg flex items-center justify-center shrink-0">
            <Search className="w-4 h-4 text-accent" />
          </div>
          <div>
            <p className="text-[12px] font-medium text-ink group-hover:text-accent transition-colors">Browse Jobs</p>
            <p className="text-[10px] text-muted">Find opportunities</p>
          </div>
        </Link>
        <Link
          href="/dashboard/profile"
          className="flex items-center gap-3 bg-white rounded-xl border border-divider p-4 hover:border-blue-200 hover:bg-blue-50/30 transition-all group"
        >
          <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
            <Upload className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <p className="text-[12px] font-medium text-ink group-hover:text-blue-600 transition-colors">Update Profile</p>
            <p className="text-[10px] text-muted">Upload your CV</p>
          </div>
        </Link>
        <Link
          href="/dashboard/alerts"
          className="flex items-center gap-3 bg-white rounded-xl border border-divider p-4 hover:border-amber-200 hover:bg-amber-50/30 transition-all group"
        >
          <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
            <BellPlus className="w-4 h-4 text-amber-600" />
          </div>
          <div>
            <p className="text-[12px] font-medium text-ink group-hover:text-amber-600 transition-colors">Create Alert</p>
            <p className="text-[10px] text-muted">Get job notifications</p>
          </div>
        </Link>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
  bg,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number | string;
  color: string;
  bg: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-divider p-4">
      <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center mb-3`}>
        <Icon className={`w-4 h-4 ${color}`} />
      </div>
      <p className="text-xl font-heading font-bold text-ink">{value}</p>
      <p className="text-[11px] text-muted mt-0.5">{label}</p>
    </div>
  );
}
