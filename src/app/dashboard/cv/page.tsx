"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  Upload,
  FileUp,
  Trash2,
  Check,
  AlertCircle,
  Loader2,
  ChevronDown,
  ChevronUp,
  Eye,
  Code2,
  Clock,
  Info,
  Phone,
  Mail,
  MapPin,
  Linkedin,
  Globe,
  Award,
  Briefcase,
  GraduationCap,
  FolderGit2,
  BookOpen,
  BadgeCheck,
  Trophy,
  FlaskConical,
  HeartHandshake,
  Languages,
  Star,
  Sparkles,
  X,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

// ─── Types ───

interface CVData {
  id: string;
  rawText: string | null;
  phone: string | null;
  email: string | null;
  location: string | null;
  linkedin: string | null;
  portfolio: string | null;
  summary: string | null;
  skills: string[];
  strengths: { area: string; description: string }[];
  experience: { title: string; company: string; location: string; duration: string; description: string }[];
  projects: { name: string; role: string; year: string; technologies: string; description: string; achievements: string }[];
  education: { degree: string; field: string; institution: string; year: string }[];
  certifications: { name: string; issuer: string; year: string }[];
  awards: { title: string; issuer: string; year: string }[];
  research: { title: string; publisher: string; year: string; description: string }[];
  volunteering: { organization: string; role: string; duration: string; responsibilities: string }[];
  languages: { language: string; proficiency: string }[];
  interests: string[];
  createdAt: string;
  updatedAt: string;
}

interface Profile {
  cvUrl: string | null;
  name: string;
}

// ─── Component ───

export default function CVPage() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [cvData, setCvData] = useState<CVData | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [activeTab, setActiveTab] = useState<"preview" | "parsed">("preview");
  const [showRawText, setShowRawText] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadData = useCallback(async () => {
    try {
      const [profileRes, cvRes] = await Promise.all([
        fetch("/api/dashboard/profile"),
        fetch("/api/dashboard/profile/cv-data"),
      ]);

      if (profileRes.ok) {
        const pData = await profileRes.json();
        setProfile({ cvUrl: pData.cvUrl, name: pData.name });
      }

      if (cvRes.ok) {
        const cv = await cvRes.json();
        setCvData(cv);
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const showMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  const handleUpload = async (file: File) => {
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!["pdf", "doc", "docx"].includes(ext || "")) {
      showMessage("error", "Only PDF, DOC, and DOCX files are allowed");
      return;
    }
    if (file.size < 1024) {
      showMessage("error", "File is too small — may be empty or corrupt");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showMessage("error", "File size must be under 5MB");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("cv", file);

      const res = await fetch("/api/dashboard/profile/cv", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        showMessage("success", `CV parsed successfully — ${Object.keys(data.sectionCounts).length} sections extracted${data.autoFilled.length > 0 ? `. Auto-filled: ${data.autoFilled.join(", ")}` : ""}`);
        setProfile(prev => prev ? { ...prev, cvUrl: "parsed" } : prev);
        // Reload CV data
        const cvRes = await fetch("/api/dashboard/profile/cv-data");
        if (cvRes.ok) setCvData(await cvRes.json());
      } else {
        const data = await res.json();
        showMessage("error", data.error || "Failed to process CV");
      }
    } catch {
      showMessage("error", "Failed to upload CV");
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleUpload(file);
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch("/api/dashboard/profile/cv-data", { method: "DELETE" });
      if (res.ok) {
        setCvData(null);
        setProfile(prev => prev ? { ...prev, cvUrl: null } : prev);
        showMessage("success", "CV deleted successfully");
      } else {
        showMessage("error", "Failed to delete CV");
      }
    } catch {
      showMessage("error", "Failed to delete CV");
    } finally {
      setDeleting(false);
      setDeleteModalOpen(false);
    }
  };

  const initials = session?.user?.name
    ? session.user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  // ─── Stats ───
  const sectionStats = cvData
    ? [
        { label: "Skills", count: cvData.skills.length },
        { label: "Experience", count: cvData.experience.length },
        { label: "Projects", count: cvData.projects.length },
        { label: "Education", count: cvData.education.length },
        { label: "Certifications", count: cvData.certifications.length },
        { label: "Awards", count: cvData.awards.length },
        { label: "Languages", count: cvData.languages.length },
      ].filter(s => s.count > 0)
    : [];

  if (loading) {
    return (
      <div className="space-y-5">
        <div className="h-8 w-48 bg-ink/[0.04] rounded-lg animate-pulse" />
        <div className="h-48 bg-white rounded-xl border border-divider animate-pulse" />
        <div className="h-96 bg-white rounded-xl border border-divider animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24 lg:pb-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-heading font-bold text-ink">My CV</h1>
        <p className="text-[13px] text-muted mt-1">Upload and manage your CV / Resume.</p>
      </div>

      {message && (
        <div className={`rounded-lg border px-4 py-3 text-[12px] font-medium flex items-center gap-2 ${
          message.type === "success"
            ? "bg-emerald-50 border-emerald-100 text-emerald-700"
            : "bg-red-50 border-red-100 text-red-700"
        }`}>
          {message.type === "success" ? <Check className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
          {message.text}
        </div>
      )}

      {/* Upload Section */}
      <div className="bg-white rounded-xl border border-divider p-6">
        {cvData ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                  <Check className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-[13px] font-medium text-ink">CV Uploaded & Parsed</p>
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-emerald-50 text-emerald-700 border-emerald-100">
                      <Sparkles className="w-3 h-3 mr-0.5" />
                      Parsed
                    </Badge>
                  </div>
                  <p className="text-[11px] text-muted flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3" />
                    Last uploaded {cvData.updatedAt ? new Date(cvData.updatedAt).toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "unknown"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <label className="cursor-pointer">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium text-ink border border-divider hover:bg-ink/[0.04] transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    Replace
                  </span>
                  <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} className="hidden" ref={fileInputRef} />
                </label>
                <button
                  onClick={() => setDeleteModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium text-red-600 border border-red-200 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl py-10 transition-all ${
              dragOver
                ? "border-accent bg-accent-bg/30"
                : "border-divider hover:border-accent/40 hover:bg-accent-bg/10"
            }`}
          >
            {uploading ? (
              <>
                <Loader2 className="w-10 h-10 text-accent animate-spin mb-3" />
                <p className="text-[13px] text-ink font-medium">Parsing your CV...</p>
                <p className="text-[11px] text-muted mt-1">Extracting sections and details</p>
              </>
            ) : (
              <>
                <div className="w-12 h-12 rounded-xl bg-ink/[0.04] flex items-center justify-center mb-3">
                  <FileUp className="w-6 h-6 text-muted/60" />
                </div>
                <p className="text-[13px] text-ink font-medium">Drag & drop your CV here</p>
                <p className="text-[11px] text-muted mt-1 mb-3">or click to browse</p>
                <label className="cursor-pointer">
                  <span className="inline-flex items-center gap-1.5 bg-ink text-white text-[12px] font-medium px-4 py-2 rounded-lg hover:bg-ink/90 transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    Upload CV
                  </span>
                  <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} className="hidden" ref={fileInputRef} />
                </label>
                <p className="text-[10px] text-muted mt-3">PDF, DOC, DOCX — max 5MB</p>
                <div className="flex items-start gap-1.5 mt-3 px-4">
                  <Info className="w-3.5 h-3.5 text-muted/60 mt-0.5 shrink-0" />
                  <p className="text-[10px] text-muted text-center">
                    Your CV will be automatically parsed to extract contact info, skills, experience, education, and more.
                  </p>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Tabs & Content */}
      {cvData && (
        <>
          {/* Tab bar */}
          <div className="flex items-center gap-1 bg-ink/[0.04] rounded-lg p-1">
            <button
              onClick={() => setActiveTab("preview")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-[12px] font-medium transition-colors ${
                activeTab === "preview" ? "bg-white text-ink shadow-sm" : "text-muted hover:text-ink"
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              CV Preview
            </button>
            <button
              onClick={() => setActiveTab("parsed")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-[12px] font-medium transition-colors ${
                activeTab === "parsed" ? "bg-white text-ink shadow-sm" : "text-muted hover:text-ink"
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              Parsed Data
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === "preview" ? (
            <CVPreview cvData={cvData} name={profile?.name || session?.user?.name || "Candidate"} initials={initials} />
          ) : (
            <ParsedDataTab cvData={cvData} showRawText={showRawText} toggleRawText={() => setShowRawText(!showRawText)} />
          )}
        </>
      )}

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete CV</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete your CV? All parsed data including skills, experience, and education will be permanently removed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <button
              onClick={() => setDeleteModalOpen(false)}
              className="px-4 py-2 rounded-lg text-[12px] font-medium text-ink border border-divider hover:bg-ink/[0.04] transition-colors"
              disabled={deleting}
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-[12px] font-medium text-white bg-red-600 hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {deleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {deleting ? "Deleting..." : "Delete CV"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── CV Preview Tab ───

function CVPreview({ cvData, name, initials }: { cvData: CVData; name: string; initials: string }) {
  return (
    <div className="bg-white rounded-xl border border-divider overflow-hidden">
      {/* Dark header */}
      <div className="bg-ink text-white px-6 py-8">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center text-lg font-semibold shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <h2 className="text-xl font-heading font-bold">{name}</h2>
            {cvData.summary && (
              <p className="text-white/70 text-[12px] mt-1 line-clamp-2">{cvData.summary}</p>
            )}
            {/* Contact row */}
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3">
              {cvData.phone && (
                <span className="flex items-center gap-1 text-[11px] text-white/60">
                  <Phone className="w-3 h-3" /> {cvData.phone}
                </span>
              )}
              {cvData.email && (
                <span className="flex items-center gap-1 text-[11px] text-white/60">
                  <Mail className="w-3 h-3" /> {cvData.email}
                </span>
              )}
              {cvData.location && (
                <span className="flex items-center gap-1 text-[11px] text-white/60">
                  <MapPin className="w-3 h-3" /> {cvData.location}
                </span>
              )}
              {cvData.linkedin && (
                <span className="flex items-center gap-1 text-[11px] text-white/60">
                  <Linkedin className="w-3 h-3" /> LinkedIn
                </span>
              )}
              {cvData.portfolio && (
                <span className="flex items-center gap-1 text-[11px] text-white/60">
                  <Globe className="w-3 h-3" /> Portfolio
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="px-6 py-6 space-y-6">
        {/* Professional Summary */}
        {cvData.summary && (
          <Section title="Professional Summary">
            <p className="text-[12px] text-ink/80 leading-relaxed">{cvData.summary}</p>
          </Section>
        )}

        {/* Core Skills */}
        {cvData.skills.length > 0 && (
          <Section title="Core Skills" icon={<Star className="w-4 h-4" />}>
            <div className="flex flex-wrap gap-1.5">
              {cvData.skills.map((skill, i) => (
                <span key={i} className="inline-block px-2.5 py-1 rounded-md bg-ink/[0.04] text-[11px] font-medium text-ink border border-divider">
                  {skill}
                </span>
              ))}
            </div>
          </Section>
        )}

        {/* Career Strengths */}
        {cvData.strengths.length > 0 && (
          <Section title="Career Strengths" icon={<Trophy className="w-4 h-4" />}>
            <div className="space-y-2">
              {cvData.strengths.map((s, i) => (
                <div key={i} className="flex gap-3">
                  <span className="text-[12px] font-medium text-ink shrink-0 min-w-[140px]">{s.area}</span>
                  {s.description && <span className="text-[12px] text-muted">— {s.description}</span>}
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Professional Experience */}
        {cvData.experience.length > 0 && (
          <Section title="Professional Experience" icon={<Briefcase className="w-4 h-4" />}>
            <div className="space-y-4">
              {cvData.experience.map((exp, i) => (
                <div key={i} className="relative pl-4 border-l-2 border-ink/10">
                  <div className="absolute left-[-5px] top-1 w-2 h-2 rounded-full bg-ink/30" />
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1">
                    <div>
                      <h4 className="text-[13px] font-semibold text-ink">{exp.title}</h4>
                      <p className="text-[12px] text-muted">{exp.company}{exp.location ? ` · ${exp.location}` : ""}</p>
                    </div>
                    {exp.duration && (
                      <span className="text-[11px] text-muted shrink-0">{exp.duration}</span>
                    )}
                  </div>
                  {exp.description && (
                    <div className="mt-2">
                      {exp.description.split("\n").filter(Boolean).map((line, j) => (
                        <p key={j} className="text-[12px] text-ink/70 leading-relaxed pl-2 relative before:content-['•'] before:absolute before:left-0 before:text-muted">
                          {line.replace(/^[-•*·]\s*/, "")}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Projects */}
        {cvData.projects.length > 0 && (
          <Section title="Projects / Portfolio" icon={<FolderGit2 className="w-4 h-4" />}>
            <div className="space-y-4">
              {cvData.projects.map((proj, i) => (
                <div key={i}>
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1">
                    <h4 className="text-[13px] font-semibold text-ink">{proj.name}</h4>
                    <div className="flex items-center gap-2 text-[11px] text-muted">
                      {proj.role && <span>{proj.role}</span>}
                      {proj.year && <span>· {proj.year}</span>}
                    </div>
                  </div>
                  {proj.technologies && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {proj.technologies.split(/[,;|]/).map((tech, j) => (
                        <span key={j} className="text-[10px] px-1.5 py-0.5 rounded bg-ink/[0.04] text-muted">{tech.trim()}</span>
                      ))}
                    </div>
                  )}
                  {proj.description && <p className="text-[12px] text-ink/70 mt-1">{proj.description}</p>}
                  {proj.achievements && (
                    <p className="text-[11px] text-emerald-700 mt-1">✓ {proj.achievements}</p>
                  )}
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Education */}
        {cvData.education.length > 0 && (
          <Section title="Education" icon={<GraduationCap className="w-4 h-4" />}>
            <div className="space-y-3">
              {cvData.education.map((edu, i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1">
                  <div>
                    <h4 className="text-[13px] font-semibold text-ink">
                      {edu.degree}{edu.field ? ` in ${edu.field}` : ""}
                    </h4>
                    <p className="text-[12px] text-muted">{edu.institution}</p>
                  </div>
                  {edu.year && <span className="text-[11px] text-muted shrink-0">{edu.year}</span>}
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Certifications */}
        {cvData.certifications.length > 0 && (
          <Section title="Certifications & Training" icon={<BadgeCheck className="w-4 h-4" />}>
            <div className="space-y-2">
              {cvData.certifications.map((cert, i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1">
                  <div>
                    <p className="text-[12px] font-medium text-ink">{cert.name}</p>
                    {cert.issuer && <p className="text-[11px] text-muted">{cert.issuer}</p>}
                  </div>
                  {cert.year && <span className="text-[11px] text-muted shrink-0">{cert.year}</span>}
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Awards */}
        {cvData.awards.length > 0 && (
          <Section title="Honours / Awards" icon={<Award className="w-4 h-4" />}>
            <div className="space-y-2">
              {cvData.awards.map((award, i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1">
                  <div>
                    <p className="text-[12px] font-medium text-ink">{award.title}</p>
                    {award.issuer && <p className="text-[11px] text-muted">{award.issuer}</p>}
                  </div>
                  {award.year && <span className="text-[11px] text-muted shrink-0">{award.year}</span>}
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Research */}
        {cvData.research.length > 0 && (
          <Section title="Research / Publications" icon={<FlaskConical className="w-4 h-4" />}>
            <div className="space-y-3">
              {cvData.research.map((r, i) => (
                <div key={i}>
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1">
                    <h4 className="text-[12px] font-medium text-ink">{r.title}</h4>
                    {r.year && <span className="text-[11px] text-muted shrink-0">{r.year}</span>}
                  </div>
                  {r.publisher && <p className="text-[11px] text-muted">{r.publisher}</p>}
                  {r.description && <p className="text-[11px] text-ink/70 mt-1">{r.description}</p>}
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Volunteering */}
        {cvData.volunteering.length > 0 && (
          <Section title="Volunteering / Leadership" icon={<HeartHandshake className="w-4 h-4" />}>
            <div className="space-y-3">
              {cvData.volunteering.map((v, i) => (
                <div key={i}>
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1">
                    <div>
                      <h4 className="text-[12px] font-medium text-ink">{v.organization}</h4>
                      <p className="text-[11px] text-muted">{v.role}{v.duration ? ` · ${v.duration}` : ""}</p>
                    </div>
                  </div>
                  {v.responsibilities && (
                    <p className="text-[11px] text-ink/70 mt-1">{v.responsibilities}</p>
                  )}
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Languages */}
        {cvData.languages.length > 0 && (
          <Section title="Languages" icon={<Languages className="w-4 h-4" />}>
            <div className="flex flex-wrap gap-3">
              {cvData.languages.map((lang, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <span className="text-[12px] font-medium text-ink">{lang.language}</span>
                  {lang.proficiency && (
                    <span className="text-[11px] text-muted">— {lang.proficiency}</span>
                  )}
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Interests */}
        {cvData.interests.length > 0 && (
          <Section title="Interests / Hobbies" icon={<BookOpen className="w-4 h-4" />}>
            <p className="text-[12px] text-ink/80">{cvData.interests.join(" · ")}</p>
          </Section>
        )}
      </div>
    </div>
  );
}

function Section({ title, icon, children }: { title: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        {icon && <span className="text-ink/40">{icon}</span>}
        <h3 className="text-[11px] font-bold tracking-wider text-ink/60 uppercase">{title}</h3>
      </div>
      <div className="border-t border-divider pt-3">
        {children}
      </div>
    </div>
  );
}

// ─── Parsed Data Tab ───

function ParsedDataTab({ cvData, showRawText, toggleRawText }: { cvData: CVData; showRawText: boolean; toggleRawText: () => void }) {
  const sectionStats = [
    { label: "Summary", count: cvData.summary ? 1 : 0, icon: <BookOpen className="w-4 h-4" /> },
    { label: "Skills", count: cvData.skills.length, icon: <Star className="w-4 h-4" /> },
    { label: "Strengths", count: cvData.strengths.length, icon: <Trophy className="w-4 h-4" /> },
    { label: "Experience", count: cvData.experience.length, icon: <Briefcase className="w-4 h-4" /> },
    { label: "Projects", count: cvData.projects.length, icon: <FolderGit2 className="w-4 h-4" /> },
    { label: "Education", count: cvData.education.length, icon: <GraduationCap className="w-4 h-4" /> },
    { label: "Certifications", count: cvData.certifications.length, icon: <BadgeCheck className="w-4 h-4" /> },
    { label: "Awards", count: cvData.awards.length, icon: <Award className="w-4 h-4" /> },
    { label: "Research", count: cvData.research.length, icon: <FlaskConical className="w-4 h-4" /> },
    { label: "Volunteering", count: cvData.volunteering.length, icon: <HeartHandshake className="w-4 h-4" /> },
    { label: "Languages", count: cvData.languages.length, icon: <Languages className="w-4 h-4" /> },
    { label: "Interests", count: cvData.interests.length, icon: <BookOpen className="w-4 h-4" /> },
  ].filter(s => s.count > 0);

  return (
    <div className="space-y-4">
      {/* Stats bar */}
      <div className="bg-white rounded-xl border border-divider p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[12px] font-medium text-ink">Extraction Summary</p>
          <p className="text-[11px] text-muted">{sectionStats.length} sections with data</p>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {sectionStats.map(stat => (
            <div key={stat.label} className="text-center p-2 rounded-lg bg-ink/[0.02]">
              <div className="flex justify-center text-ink/30 mb-1">{stat.icon}</div>
              <p className="text-lg font-bold text-ink">{stat.count}</p>
              <p className="text-[10px] text-muted">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Raw text toggle */}
      <div className="bg-white rounded-xl border border-divider">
        <button
          onClick={toggleRawText}
          className="flex items-center justify-between w-full px-4 py-3 text-left"
        >
          <span className="text-[12px] font-medium text-ink flex items-center gap-2">
            <Code2 className="w-3.5 h-3.5" />
            Raw Extracted Text
          </span>
          {showRawText ? <ChevronUp className="w-4 h-4 text-muted" /> : <ChevronDown className="w-4 h-4 text-muted" />}
        </button>
        {showRawText && cvData.rawText && (
          <div className="px-4 pb-4">
            <pre className="text-[11px] text-ink/70 bg-surface rounded-lg p-4 max-h-64 overflow-y-auto whitespace-pre-wrap font-mono leading-relaxed">
              {cvData.rawText.substring(0, 5000)}
              {cvData.rawText.length > 5000 && "\n\n... (truncated)"}
            </pre>
          </div>
        )}
      </div>

      {/* Section Cards */}
      <div className="space-y-3">
        {/* Contact Card */}
        {(cvData.phone || cvData.email || cvData.location || cvData.linkedin || cvData.portfolio) && (
          <DataCard title="Contact Information" icon={<Phone className="w-4 h-4" />}>
            <div className="grid sm:grid-cols-2 gap-3">
              {cvData.email && <Field label="Email" value={cvData.email} />}
              {cvData.phone && <Field label="Phone" value={cvData.phone} />}
              {cvData.location && <Field label="Location" value={cvData.location} />}
              {cvData.linkedin && <Field label="LinkedIn" value={cvData.linkedin} />}
              {cvData.portfolio && <Field label="Portfolio" value={cvData.portfolio} />}
            </div>
          </DataCard>
        )}

        {cvData.summary && (
          <DataCard title="Summary" icon={<BookOpen className="w-4 h-4" />}>
            <p className="text-[12px] text-ink/80 leading-relaxed">{cvData.summary}</p>
          </DataCard>
        )}

        {cvData.skills.length > 0 && (
          <DataCard title={`Skills (${cvData.skills.length})`} icon={<Star className="w-4 h-4" />}>
            <div className="flex flex-wrap gap-1.5">
              {cvData.skills.map((skill, i) => (
                <span key={i} className="inline-block px-2 py-0.5 rounded bg-ink/[0.04] text-[11px] text-ink border border-divider">
                  {skill}
                </span>
              ))}
            </div>
          </DataCard>
        )}

        {cvData.strengths.length > 0 && (
          <DataCard title={`Strengths (${cvData.strengths.length})`} icon={<Trophy className="w-4 h-4" />}>
            <div className="space-y-2">
              {cvData.strengths.map((s, i) => (
                <div key={i}>
                  <p className="text-[12px] font-medium text-ink">{s.area}</p>
                  {s.description && <p className="text-[11px] text-muted">{s.description}</p>}
                </div>
              ))}
            </div>
          </DataCard>
        )}

        {cvData.experience.length > 0 && (
          <DataCard title={`Experience (${cvData.experience.length})`} icon={<Briefcase className="w-4 h-4" />}>
            <div className="space-y-3">
              {cvData.experience.map((exp, i) => (
                <div key={i} className="p-3 rounded-lg bg-surface space-y-1">
                  <p className="text-[12px] font-semibold text-ink">{exp.title}</p>
                  <p className="text-[11px] text-muted">{exp.company}{exp.location ? ` · ${exp.location}` : ""}</p>
                  {exp.duration && <p className="text-[10px] text-muted">{exp.duration}</p>}
                  {exp.description && <p className="text-[11px] text-ink/70 mt-1 line-clamp-3">{exp.description}</p>}
                </div>
              ))}
            </div>
          </DataCard>
        )}

        {cvData.projects.length > 0 && (
          <DataCard title={`Projects (${cvData.projects.length})`} icon={<FolderGit2 className="w-4 h-4" />}>
            <div className="space-y-3">
              {cvData.projects.map((proj, i) => (
                <div key={i} className="p-3 rounded-lg bg-surface space-y-1">
                  <p className="text-[12px] font-semibold text-ink">{proj.name}</p>
                  <p className="text-[11px] text-muted">{proj.role}{proj.year ? ` · ${proj.year}` : ""}</p>
                  {proj.technologies && <p className="text-[10px] text-muted">Tech: {proj.technologies}</p>}
                  {proj.description && <p className="text-[11px] text-ink/70 mt-1">{proj.description}</p>}
                </div>
              ))}
            </div>
          </DataCard>
        )}

        {cvData.education.length > 0 && (
          <DataCard title={`Education (${cvData.education.length})`} icon={<GraduationCap className="w-4 h-4" />}>
            <div className="space-y-2">
              {cvData.education.map((edu, i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1">
                  <div>
                    <p className="text-[12px] font-medium text-ink">{edu.degree}{edu.field ? ` in ${edu.field}` : ""}</p>
                    <p className="text-[11px] text-muted">{edu.institution}</p>
                  </div>
                  {edu.year && <span className="text-[11px] text-muted shrink-0">{edu.year}</span>}
                </div>
              ))}
            </div>
          </DataCard>
        )}

        {cvData.certifications.length > 0 && (
          <DataCard title={`Certifications (${cvData.certifications.length})`} icon={<BadgeCheck className="w-4 h-4" />}>
            <div className="space-y-2">
              {cvData.certifications.map((cert, i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1">
                  <div>
                    <p className="text-[12px] font-medium text-ink">{cert.name}</p>
                    {cert.issuer && <p className="text-[11px] text-muted">{cert.issuer}</p>}
                  </div>
                  {cert.year && <span className="text-[11px] text-muted shrink-0">{cert.year}</span>}
                </div>
              ))}
            </div>
          </DataCard>
        )}

        {cvData.awards.length > 0 && (
          <DataCard title={`Awards (${cvData.awards.length})`} icon={<Award className="w-4 h-4" />}>
            <div className="space-y-2">
              {cvData.awards.map((award, i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1">
                  <div>
                    <p className="text-[12px] font-medium text-ink">{award.title}</p>
                    {award.issuer && <p className="text-[11px] text-muted">{award.issuer}</p>}
                  </div>
                  {award.year && <span className="text-[11px] text-muted shrink-0">{award.year}</span>}
                </div>
              ))}
            </div>
          </DataCard>
        )}

        {cvData.research.length > 0 && (
          <DataCard title={`Research (${cvData.research.length})`} icon={<FlaskConical className="w-4 h-4" />}>
            <div className="space-y-3">
              {cvData.research.map((r, i) => (
                <div key={i} className="p-3 rounded-lg bg-surface space-y-1">
                  <p className="text-[12px] font-medium text-ink">{r.title}</p>
                  {r.publisher && <p className="text-[11px] text-muted">{r.publisher}</p>}
                  {r.year && <p className="text-[10px] text-muted">{r.year}</p>}
                  {r.description && <p className="text-[11px] text-ink/70 mt-1">{r.description}</p>}
                </div>
              ))}
            </div>
          </DataCard>
        )}

        {cvData.volunteering.length > 0 && (
          <DataCard title={`Volunteering (${cvData.volunteering.length})`} icon={<HeartHandshake className="w-4 h-4" />}>
            <div className="space-y-3">
              {cvData.volunteering.map((v, i) => (
                <div key={i} className="p-3 rounded-lg bg-surface space-y-1">
                  <p className="text-[12px] font-medium text-ink">{v.organization}</p>
                  <p className="text-[11px] text-muted">{v.role}{v.duration ? ` · ${v.duration}` : ""}</p>
                  {v.responsibilities && <p className="text-[11px] text-ink/70 mt-1">{v.responsibilities}</p>}
                </div>
              ))}
            </div>
          </DataCard>
        )}

        {cvData.languages.length > 0 && (
          <DataCard title={`Languages (${cvData.languages.length})`} icon={<Languages className="w-4 h-4" />}>
            <div className="space-y-1.5">
              {cvData.languages.map((lang, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-[12px] font-medium text-ink">{lang.language}</span>
                  {lang.proficiency && <span className="text-[11px] text-muted">— {lang.proficiency}</span>}
                </div>
              ))}
            </div>
          </DataCard>
        )}

        {cvData.interests.length > 0 && (
          <DataCard title={`Interests (${cvData.interests.length})`} icon={<BookOpen className="w-4 h-4" />}>
            <div className="flex flex-wrap gap-1.5">
              {cvData.interests.map((interest, i) => (
                <span key={i} className="inline-block px-2 py-0.5 rounded bg-ink/[0.04] text-[11px] text-ink border border-divider">
                  {interest}
                </span>
              ))}
            </div>
          </DataCard>
        )}
      </div>
    </div>
  );
}

function DataCard({ title, icon, children }: { title: string; icon?: React.ReactNode; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="bg-white rounded-xl border border-divider overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full px-4 py-3 text-left hover:bg-ink/[0.02] transition-colors"
      >
        <span className="text-[12px] font-medium text-ink flex items-center gap-2">
          {icon && <span className="text-ink/40">{icon}</span>}
          {title}
        </span>
        {open ? <ChevronUp className="w-4 h-4 text-muted" /> : <ChevronDown className="w-4 h-4 text-muted" />}
      </button>
      {open && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] text-muted uppercase tracking-wider mb-0.5">{label}</p>
      <p className="text-[12px] text-ink break-all">{value}</p>
    </div>
  );
}
