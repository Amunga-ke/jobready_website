"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  FileText,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  Star,
  Calendar,
  Briefcase,
  User,
  Download,
  Loader2,
} from "lucide-react";

interface ApplicationDetail {
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
    bio: string | null;
    avatarUrl: string | null;
    cvUrl: string | null;
    cvData: {
      skills: string | null;
      experience: string | null;
      education: string | null;
      summary: string | null;
      certifications: string | null;
    } | null;
  };
  listing: {
    id: string;
    title: string;
    slug: string;
    listingType: string;
    company: { name: string };
  };
  cvMatchScores: Array<{
    score: number;
    breakdown: string;
    aiAnalysis: string | null;
    createdAt: string;
  }>;
}

const STATUS_COLORS: Record<string, string> = {
  SUBMITTED: "bg-blue-50 text-blue-700 border-blue-100",
  VIEWED: "bg-cyan-50 text-cyan-700 border-cyan-100",
  SHORTLISTED: "bg-amber-50 text-amber-700 border-amber-100",
  INTERVIEW: "bg-purple-50 text-purple-700 border-purple-100",
  OFFERED: "bg-emerald-50 text-emerald-700 border-emerald-100",
  REJECTED: "bg-red-50 text-red-700 border-red-100",
  WITHDRAWN: "bg-gray-50 text-gray-600 border-gray-100",
};

const STATUSES = ["SUBMITTED", "VIEWED", "SHORTLISTED", "INTERVIEW", "OFFERED", "REJECTED"];

export default function ApplicationDetailPage() {
  const router = useRouter();
  const params = useParams();
  const appId = params.id as string;
  const [app, setApp] = useState<ApplicationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/employer/applications/${appId}`);
        if (res.ok) setApp(await res.json());
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [appId]);

  const updateStatus = async (newStatus: string) => {
    if (!app || newStatus === app.status) return;
    setUpdating(true);
    try {
      const res = await fetch(`/api/employer/applications/${appId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setApp({ ...app, status: newStatus });
      }
    } catch {
      // silent
    } finally {
      setUpdating(false);
    }
  };

  const parseJSON = (str: string | null | undefined) => {
    if (!str) return [];
    try {
      return JSON.parse(str);
    } catch {
      return [];
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 bg-ink/[0.04] rounded-lg animate-pulse" />
        <div className="h-64 bg-white rounded-xl border border-divider animate-pulse" />
      </div>
    );
  }

  if (!app) {
    return (
      <div className="bg-white rounded-xl border border-divider p-8 text-center">
        <p className="text-[13px] text-red-600">Application not found</p>
        <Link href="/employer/applications" className="text-[12px] text-accent hover:text-accent-dark mt-2 inline-block">
          Back to Applications
        </Link>
      </div>
    );
  }

  const skills = parseJSON(app.user.cvData?.skills);
  const experience = parseJSON(app.user.cvData?.experience);
  const education = parseJSON(app.user.cvData?.education);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/employer/applications" className="p-2 text-muted hover:text-ink hover:bg-ink/[0.04] rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-heading font-bold text-ink">{app.user.name}</h1>
            <p className="text-[13px] text-muted mt-0.5">
              Applied for <span className="text-ink font-medium">{app.listing.title}</span>
            </p>
          </div>
        </div>
        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-medium border ${STATUS_COLORS[app.status] || STATUS_COLORS.SUBMITTED}`}>
          {app.status}
        </span>
      </div>

      {/* Status Actions */}
      <div className="bg-white rounded-xl border border-divider p-4">
        <h3 className="text-[12px] font-semibold text-ink uppercase tracking-wide mb-3">Update Status</h3>
        <div className="flex flex-wrap gap-2">
          {STATUSES.map((status) => (
            <button
              key={status}
              onClick={() => updateStatus(status)}
              disabled={updating || status === app.status}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-medium transition-all ${
                status === app.status
                  ? "bg-accent-bg text-accent border border-accent/30 ring-1 ring-accent/20"
                  : "bg-white text-muted hover:text-ink border border-divider hover:border-accent/30"
              } disabled:opacity-50`}
            >
              {status === app.status && <CheckCircle2 className="w-3 h-3" />}
              {status.charAt(0) + status.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
        {updating && (
          <div className="flex items-center gap-1.5 text-[11px] text-muted mt-2">
            <Loader2 className="w-3 h-3 animate-spin" /> Updating...
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: Candidate Info */}
        <div className="space-y-4">
          {/* Contact */}
          <div className="bg-white rounded-xl border border-divider p-4 space-y-3">
            <h3 className="text-[12px] font-semibold text-ink uppercase tracking-wide">Contact</h3>
            <div className="space-y-2">
              <a href={`mailto:${app.user.email}`} className="flex items-center gap-2 text-[13px] text-muted hover:text-accent transition-colors">
                <Mail className="w-4 h-4" />
                {app.user.email}
              </a>
              {app.user.phone && (
                <a href={`tel:${app.user.phone}`} className="flex items-center gap-2 text-[13px] text-muted hover:text-accent transition-colors">
                  <Phone className="w-4 h-4" />
                  {app.user.phone}
                </a>
              )}
              {app.user.county && (
                <div className="flex items-center gap-2 text-[13px] text-muted">
                  <MapPin className="w-4 h-4" />
                  {app.user.county}
                </div>
              )}
              <div className="flex items-center gap-2 text-[13px] text-muted">
                <Calendar className="w-4 h-4" />
                Applied {new Date(app.appliedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              </div>
            </div>
          </div>

          {/* CV Link */}
          {(app.cvUrl || app.user.cvUrl) && (
            <div className="bg-white rounded-xl border border-divider p-4">
              <h3 className="text-[12px] font-semibold text-ink uppercase tracking-wide mb-2">Resume / CV</h3>
              <a
                href={app.cvUrl || app.user.cvUrl || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[13px] text-accent hover:text-accent-dark font-medium transition-colors"
              >
                <Download className="w-4 h-4" />
                View / Download CV
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}

          {/* CV Match Score */}
          {app.cvMatchScores.length > 0 && (
            <div className="bg-white rounded-xl border border-divider p-4">
              <h3 className="text-[12px] font-semibold text-ink uppercase tracking-wide mb-2">CV Match Score</h3>
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${
                  app.cvMatchScores[0].score >= 80 ? "bg-emerald-50 text-emerald-700" :
                  app.cvMatchScores[0].score >= 60 ? "bg-amber-50 text-amber-700" :
                  "bg-red-50 text-red-700"
                }`}>
                  {app.cvMatchScores[0].score}%
                </div>
                <div>
                  <p className="text-[12px] text-ink font-medium">Match Score</p>
                  <p className="text-[10px] text-muted">
                    {app.cvMatchScores[0].score >= 80 ? "Excellent fit" :
                     app.cvMatchScores[0].score >= 60 ? "Good fit" : "Low match"}
                  </p>
                </div>
              </div>
              {app.cvMatchScores[0].aiAnalysis && (
                <p className="text-[11px] text-muted leading-relaxed">{app.cvMatchScores[0].aiAnalysis}</p>
              )}
            </div>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <div className="bg-white rounded-xl border border-divider p-4">
              <h3 className="text-[12px] font-semibold text-ink uppercase tracking-wide mb-2">Skills</h3>
              <div className="flex flex-wrap gap-1.5">
                {skills.map((skill: string, i: number) => (
                  <span key={i} className="px-2 py-0.5 rounded bg-accent-bg text-accent text-[10px] font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Cover Letter + Details */}
        <div className="lg:col-span-2 space-y-4">
          {/* Cover Letter */}
          {app.coverLetter && (
            <div className="bg-white rounded-xl border border-divider p-5">
              <h3 className="text-[12px] font-semibold text-ink uppercase tracking-wide mb-3">Cover Letter</h3>
              <div className="text-[13px] text-ink leading-relaxed whitespace-pre-wrap">{app.coverLetter}</div>
            </div>
          )}

          {/* Bio / Summary */}
          {app.user.bio && (
            <div className="bg-white rounded-xl border border-divider p-5">
              <h3 className="text-[12px] font-semibold text-ink uppercase tracking-wide mb-3">Professional Summary</h3>
              <p className="text-[13px] text-ink leading-relaxed">{app.user.bio}</p>
            </div>
          )}

          {/* CV Data Summary */}
          {app.user.cvData?.summary && (
            <div className="bg-white rounded-xl border border-divider p-5">
              <h3 className="text-[12px] font-semibold text-ink uppercase tracking-wide mb-3">CV Summary</h3>
              <p className="text-[13px] text-ink leading-relaxed">{app.user.cvData.summary}</p>
            </div>
          )}

          {/* Experience */}
          {experience.length > 0 && (
            <div className="bg-white rounded-xl border border-divider p-5">
              <h3 className="text-[12px] font-semibold text-ink uppercase tracking-wide mb-3">Experience</h3>
              <div className="space-y-3">
                {experience.map((exp: { title?: string; company?: string; duration?: string; description?: string }, i: number) => (
                  <div key={i} className="border-l-2 border-accent/30 pl-3">
                    <p className="text-[13px] font-medium text-ink">{exp.title || "Role"}</p>
                    {(exp.company || exp.duration) && (
                      <p className="text-[11px] text-muted">{[exp.company, exp.duration].filter(Boolean).join(" · ")}</p>
                    )}
                    {exp.description && <p className="text-[12px] text-muted mt-1">{exp.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {education.length > 0 && (
            <div className="bg-white rounded-xl border border-divider p-5">
              <h3 className="text-[12px] font-semibold text-ink uppercase tracking-wide mb-3">Education</h3>
              <div className="space-y-2">
                {education.map((edu: { institution?: string; degree?: string; field?: string; year?: string }, i: number) => (
                  <div key={i}>
                    <p className="text-[13px] font-medium text-ink">{[edu.degree, edu.field].filter(Boolean).join(" in ")}</p>
                    {(edu.institution || edu.year) && (
                      <p className="text-[11px] text-muted">{[edu.institution, edu.year].filter(Boolean).join(" · ")}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {!app.coverLetter && !app.user.bio && !app.user.cvData?.summary && experience.length === 0 && education.length === 0 && (
            <div className="bg-white rounded-xl border border-divider p-8 text-center">
              <FileText className="w-8 h-8 text-muted/30 mx-auto mb-2" />
              <p className="text-[12px] text-muted">No additional details provided by the candidate</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
