"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  Briefcase,
  Eye,
  Users,
  TrendingUp,
  ArrowRight,
  PlusCircle,
  BarChart3,
  Clock,
} from "lucide-react";

interface EmployerStats {
  totalJobs: number;
  activeJobs: number;
  closedJobs: number;
  totalApplications: number;
  totalViews: number;
  totalClicks: number;
  recentApplications: Array<{
    id: string;
    status: string;
    appliedAt: string;
    user: { name: string; email: string };
    listing: { title: string; slug: string };
  }>;
  statusCounts: Record<string, number>;
}

const STATUS_COLORS: Record<string, string> = {
  SUBMITTED: "bg-blue-50 text-blue-700 border-blue-100",
  VIEWED: "bg-cyan-50 text-cyan-700 border-cyan-100",
  SHORTLISTED: "bg-amber-50 text-amber-700 border-amber-100",
  INTERVIEW: "bg-purple-50 text-purple-700 border-purple-100",
  OFFERED: "bg-emerald-50 text-emerald-700 border-emerald-100",
  REJECTED: "bg-red-50 text-red-700 border-red-100",
};

export default function EmployerOverview() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<EmployerStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/employer/stats");
        if (res.ok) setStats(await res.json());
      } catch {
        // silent
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
        <div className="h-8 w-64 bg-ink/[0.04] rounded-lg animate-pulse" />
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
          Manage your job postings and track applications.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Briefcase}
          label="Active Jobs"
          value={stats?.activeJobs ?? 0}
          sub={`${stats?.totalJobs ?? 0} total`}
          color="text-accent"
          bg="bg-accent-bg"
        />
        <StatCard
          icon={Users}
          label="Applications"
          value={stats?.totalApplications ?? 0}
          sub={`${stats?.statusCounts?.SHORTLISTED ?? 0} shortlisted`}
          color="text-blue-600"
          bg="bg-blue-50"
        />
        <StatCard
          icon={Eye}
          label="Total Views"
          value={stats?.totalViews ?? 0}
          sub={`${stats?.totalClicks ?? 0} clicks`}
          color="text-purple-600"
          bg="bg-purple-50"
        />
        <StatCard
          icon={TrendingUp}
          label="Closed Jobs"
          value={stats?.closedJobs ?? 0}
          sub="completed"
          color="text-emerald-600"
          bg="bg-emerald-50"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Link
          href="/employer/jobs/new"
          className="flex items-center gap-3 bg-white rounded-xl border border-divider p-4 hover:border-accent/30 hover:bg-accent-bg/30 transition-all group"
        >
          <div className="w-10 h-10 rounded-lg bg-accent-bg flex items-center justify-center shrink-0">
            <PlusCircle className="w-5 h-5 text-accent" />
          </div>
          <div>
            <p className="text-[13px] font-medium text-ink group-hover:text-accent transition-colors">Post a New Job</p>
            <p className="text-[11px] text-muted">Reach thousands of candidates</p>
          </div>
        </Link>
        <Link
          href="/employer/applications"
          className="flex items-center gap-3 bg-white rounded-xl border border-divider p-4 hover:border-blue-200 hover:bg-blue-50/30 transition-all group"
        >
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
            <BarChart3 className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-[13px] font-medium text-ink group-hover:text-blue-600 transition-colors">Review Applications</p>
            <p className="text-[11px] text-muted">
              {stats?.recentApplications?.length
                ? `${stats.recentApplications.length} new applications`
                : "No new applications"}
            </p>
          </div>
        </Link>
      </div>

      {/* Application Pipeline */}
      {((stats?.totalApplications ?? 0) > 0) && stats?.statusCounts && (
        <div className="bg-white rounded-xl border border-divider p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[13px] font-heading font-semibold text-ink">Application Pipeline</h2>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {Object.entries(STATUS_COLORS).filter(([s]) => stats.statusCounts[s] && stats.statusCounts[s] > 0).map(([status, colorClass]) => (
              <div key={status} className="flex-shrink-0 text-center px-3 py-2 rounded-lg border border-divider">
                <p className="text-lg font-heading font-bold text-ink">{stats.statusCounts[status] || 0}</p>
                <p className="text-[10px] text-muted">{status}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Applications */}
      <div className="bg-white rounded-xl border border-divider">
        <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-divider">
          <h2 className="text-[13px] font-heading font-semibold text-ink">Recent Applications</h2>
          {(stats?.recentApplications?.length ?? 0) > 0 && (
            <Link href="/employer/applications" className="text-[11px] text-accent hover:text-accent-dark font-medium transition-colors">
              View all
            </Link>
          )}
        </div>
        <div className="divide-y divide-divider">
          {(!stats?.recentApplications || stats.recentApplications.length === 0) ? (
            <div className="px-4 py-8 text-center">
              <Users className="w-8 h-8 text-muted/40 mx-auto mb-2" />
              <p className="text-[12px] text-muted">No applications received yet</p>
              <p className="text-[11px] text-muted mt-1">Applications will appear here when candidates apply</p>
            </div>
          ) : (
            stats.recentApplications.map((app) => (
              <Link
                key={app.id}
                href={`/employer/applications/${app.id}`}
                className="px-4 py-3 hover:bg-ink/[0.02] transition-colors block"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[13px] font-medium text-ink">{app.user.name}</p>
                    <p className="text-[11px] text-muted">{app.listing.title}</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium border ${STATUS_COLORS[app.status] || STATUS_COLORS.SUBMITTED}`}>
                      {app.status}
                    </span>
                    <p className="text-[10px] text-muted mt-1">
                      {new Date(app.appliedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </p>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  color,
  bg,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number | string;
  sub?: string;
  color: string;
  bg: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-divider p-4">
      <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center mb-3`}>
        <Icon className={`w-4 h-4 ${color}`} />
      </div>
      <p className="text-xl font-heading font-bold text-ink">{value}</p>
      <p className="text-[11px] text-muted mt-0.5">{label}</p>
      {sub && <p className="text-[10px] text-muted/70">{sub}</p>}
    </div>
  );
}
