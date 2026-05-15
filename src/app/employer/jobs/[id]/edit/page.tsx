"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Loader2,
  Save,
  X,
  Plus,
  Trash2,
} from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  subcategories: { id: string; name: string; slug: string }[];
}

interface JobData {
  id: string;
  title: string;
  description: string;
  listingType: string;
  categoryId: string | null;
  subcategoryId: string | null;
  town: string;
  county: string;
  employmentType: string;
  experienceLevel: string;
  workMode: string;
  salaryMin: number | null;
  salaryMax: number | null;
  salaryPeriod: string | null;
  applicationUrl: string | null;
  applyEmail: string | null;
  deadline: string | null;
  featured: boolean;
  status: string;
  governmentLevel: string | null;
  opportunityType: string | null;
  tags: { tag: { name: string } }[];
}

export default function EditJobPage() {
  const router = useRouter();
  const params = useParams();
  const jobId = params.id as string;
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<{ id: string; name: string }[]>([]);
  const [originalStatus, setOriginalStatus] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    listingType: "JOB",
    categoryId: "",
    subcategoryId: "",
    town: "",
    county: "",
    employmentType: "Full-time",
    experienceLevel: "Mid-level",
    workMode: "ONSITE",
    salaryMin: "",
    salaryMax: "",
    salaryPeriod: "MONTHLY",
    applicationUrl: "",
    applyEmail: "",
    deadline: "",
    featured: false,
    status: "ACTIVE",
    tags: [] as string[],
    governmentLevel: "",
    opportunityType: "",
  });

  const update = (field: string, value: string | boolean | string[]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (field === "categoryId") {
      setForm((prev) => ({ ...prev, subcategoryId: "" }));
      const cat = categories.find((c) => c.id === value);
      setSubcategories(cat?.subcategories || []);
    }
  };

  useEffect(() => {
    async function loadJob() {
      setLoading(true);
      try {
        const [jobRes, catRes] = await Promise.all([
          fetch(`/api/employer/jobs/${jobId}`),
          fetch("/api/categories"),
        ]);

        if (catRes.ok) {
          const catData = await catRes.json();
          setCategories(catData.categories || []);
        }

        if (jobRes.ok) {
          const job: JobData = await jobRes.json();
          const subs = categories.find((c) => c.id === job.categoryId)?.subcategories || [];
          setSubcategories(subs);
          setOriginalStatus(job.status);

          setForm({
            title: job.title,
            description: job.description,
            listingType: job.listingType,
            categoryId: job.categoryId || "",
            subcategoryId: job.subcategoryId || "",
            town: job.town,
            county: job.county,
            employmentType: job.employmentType,
            experienceLevel: job.experienceLevel,
            workMode: job.workMode,
            salaryMin: job.salaryMin?.toString() || "",
            salaryMax: job.salaryMax?.toString() || "",
            salaryPeriod: job.salaryPeriod || "MONTHLY",
            applicationUrl: job.applicationUrl || "",
            applyEmail: job.applyEmail || "",
            deadline: job.deadline ? new Date(job.deadline).toISOString().split("T")[0] : "",
            featured: job.featured,
            status: job.status,
            tags: job.tags.map((t) => t.tag.name),
            governmentLevel: job.governmentLevel || "",
            opportunityType: job.opportunityType || "",
          });
        } else {
          setError("Job not found");
        }
      } catch {
        setError("Failed to load job");
      } finally {
        setLoading(false);
      }
    }
    loadJob();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId]);

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !form.tags.includes(tag)) {
      update("tags", [...form.tags, tag]);
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => update("tags", form.tags.filter((t) => t !== tag));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const res = await fetch(`/api/employer/jobs/${jobId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          salaryMin: form.salaryMin ? parseInt(form.salaryMin) : null,
          salaryMax: form.salaryMax ? parseInt(form.salaryMax) : null,
          categoryId: form.categoryId || null,
          subcategoryId: form.subcategoryId || null,
          deadline: form.deadline || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to update job");
        return;
      }

      router.push("/employer/jobs");
    } catch {
      setError("Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this job? This cannot be undone.")) return;
    try {
      const res = await fetch(`/api/employer/jobs/${jobId}`, { method: "DELETE" });
      if (res.ok) router.push("/employer/jobs");
    } catch {
      // silent
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 bg-ink/[0.04] rounded-lg animate-pulse" />
        <div className="h-96 bg-white rounded-xl border border-divider animate-pulse" />
      </div>
    );
  }

  if (error && !form.title) {
    return (
      <div className="bg-white rounded-xl border border-divider p-8 text-center">
        <p className="text-[13px] text-red-600">{error}</p>
        <Link href="/employer/jobs" className="text-[12px] text-accent hover:text-accent-dark font-medium mt-2 inline-block">
          Back to Jobs
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/employer/jobs" className="p-2 text-muted hover:text-ink hover:bg-ink/[0.04] rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-heading font-bold text-ink">Edit Job</h1>
            <p className="text-[13px] text-muted mt-0.5">{form.title}</p>
          </div>
        </div>
        <button
          onClick={handleDelete}
          className="flex items-center gap-2 text-[12px] text-red-500 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          Delete
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-100 text-red-700 text-[12px] rounded-lg px-3 py-2">{error}</div>
        )}

        {/* Status */}
        <div className="bg-white rounded-xl border border-divider p-5 space-y-4">
          <h2 className="text-[14px] font-heading font-semibold text-ink">Status</h2>
          <select
            value={form.status}
            onChange={(e) => update("status", e.target.value)}
            className="w-full max-w-xs px-3 py-2.5 rounded-lg border border-divider text-[13px] text-ink focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors bg-white"
          >
            <option value="ACTIVE">Active</option>
            <option value="DRAFT">Draft</option>
            <option value="CLOSED">Closed</option>
            <option value="PAUSED">Paused</option>
            <option value="FILLED">Filled</option>
          </select>
        </div>

        {/* Job Details */}
        <div className="bg-white rounded-xl border border-divider p-5 space-y-4">
          <h2 className="text-[14px] font-heading font-semibold text-ink">Job Details</h2>
          <div>
            <label className="block text-[12px] font-medium text-ink mb-1">Job Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-divider text-[13px] text-ink focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors"
              required
            />
          </div>
          <div>
            <label className="block text-[12px] font-medium text-ink mb-1">Description *</label>
            <textarea
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              rows={8}
              className="w-full px-3 py-2.5 rounded-lg border border-divider text-[13px] text-ink focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors resize-y"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-medium text-ink mb-1">Job Type</label>
              <select
                value={form.listingType}
                onChange={(e) => update("listingType", e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-divider text-[13px] text-ink bg-white focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
              >
                <option value="JOB">Job</option>
                <option value="GOVERNMENT">Government</option>
                <option value="CASUAL">Casual</option>
                <option value="OPPORTUNITY">Opportunity</option>
              </select>
            </div>
            <div>
              <label className="block text-[12px] font-medium text-ink mb-1">Category</label>
              <select
                value={form.categoryId}
                onChange={(e) => update("categoryId", e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-divider text-[13px] text-ink bg-white focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          {subcategories.length > 0 && (
            <div>
              <label className="block text-[12px] font-medium text-ink mb-1">Subcategory</label>
              <select
                value={form.subcategoryId}
                onChange={(e) => update("subcategoryId", e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-divider text-[13px] text-ink bg-white focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
              >
                <option value="">Select subcategory</option>
                {subcategories.map((sub) => (
                  <option key={sub.id} value={sub.id}>{sub.name}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Location & Type */}
        <div className="bg-white rounded-xl border border-divider p-5 space-y-4">
          <h2 className="text-[14px] font-heading font-semibold text-ink">Location & Type</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-medium text-ink mb-1">Town / City</label>
              <input
                type="text"
                value={form.town}
                onChange={(e) => update("town", e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-divider text-[13px] text-ink focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
              />
            </div>
            <div>
              <label className="block text-[12px] font-medium text-ink mb-1">County</label>
              <input
                type="text"
                value={form.county}
                onChange={(e) => update("county", e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-divider text-[13px] text-ink focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-[12px] font-medium text-ink mb-1">Employment Type</label>
              <select value={form.employmentType} onChange={(e) => update("employmentType", e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-divider text-[13px] text-ink bg-white focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent">
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
                <option value="Temporary">Temporary</option>
                <option value="Volunteer">Volunteer</option>
              </select>
            </div>
            <div>
              <label className="block text-[12px] font-medium text-ink mb-1">Experience Level</label>
              <select value={form.experienceLevel} onChange={(e) => update("experienceLevel", e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-divider text-[13px] text-ink bg-white focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent">
                <option value="Entry-level">Entry-level</option>
                <option value="Mid-level">Mid-level</option>
                <option value="Senior">Senior</option>
                <option value="Manager">Manager</option>
                <option value="Executive">Executive</option>
              </select>
            </div>
            <div>
              <label className="block text-[12px] font-medium text-ink mb-1">Work Mode</label>
              <select value={form.workMode} onChange={(e) => update("workMode", e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-divider text-[13px] text-ink bg-white focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent">
                <option value="ONSITE">On-site</option>
                <option value="REMOTE">Remote</option>
                <option value="HYBRID">Hybrid</option>
              </select>
            </div>
          </div>
        </div>

        {/* Salary */}
        <div className="bg-white rounded-xl border border-divider p-5 space-y-4">
          <h2 className="text-[14px] font-heading font-semibold text-ink">Compensation</h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-[12px] font-medium text-ink mb-1">Min Salary (KES)</label>
              <input type="number" value={form.salaryMin} onChange={(e) => update("salaryMin", e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-divider text-[13px] text-ink focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent" />
            </div>
            <div>
              <label className="block text-[12px] font-medium text-ink mb-1">Max Salary (KES)</label>
              <input type="number" value={form.salaryMax} onChange={(e) => update("salaryMax", e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-divider text-[13px] text-ink focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent" />
            </div>
            <div>
              <label className="block text-[12px] font-medium text-ink mb-1">Period</label>
              <select value={form.salaryPeriod} onChange={(e) => update("salaryPeriod", e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-divider text-[13px] text-ink bg-white focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent">
                <option value="MONTHLY">Monthly</option>
                <option value="ANNUALLY">Annually</option>
                <option value="WEEKLY">Weekly</option>
                <option value="DAILY">Daily</option>
                <option value="HOURLY">Hourly</option>
              </select>
            </div>
          </div>
        </div>

        {/* Application Settings */}
        <div className="bg-white rounded-xl border border-divider p-5 space-y-4">
          <h2 className="text-[14px] font-heading font-semibold text-ink">Application Settings</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-medium text-ink mb-1">Application URL</label>
              <input type="url" value={form.applicationUrl} onChange={(e) => update("applicationUrl", e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-divider text-[13px] text-ink focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent" />
            </div>
            <div>
              <label className="block text-[12px] font-medium text-ink mb-1">Application Email</label>
              <input type="email" value={form.applyEmail} onChange={(e) => update("applyEmail", e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-divider text-[13px] text-ink focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent" />
            </div>
          </div>
          <div>
            <label className="block text-[12px] font-medium text-ink mb-1">Deadline</label>
            <input type="date" value={form.deadline} onChange={(e) => update("deadline", e.target.value)} className="w-full max-w-xs px-3 py-2.5 rounded-lg border border-divider text-[13px] text-ink focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent" />
          </div>
        </div>

        {/* Tags */}
        <div className="bg-white rounded-xl border border-divider p-5 space-y-3">
          <h2 className="text-[14px] font-heading font-semibold text-ink">Tags</h2>
          <div className="flex gap-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
              placeholder="Add a tag..."
              className="flex-1 px-3 py-2.5 rounded-lg border border-divider text-[13px] text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
            />
            <button type="button" onClick={addTag} className="px-3 py-2.5 bg-ink/[0.04] hover:bg-ink/[0.08] rounded-lg transition-colors">
              <Plus className="w-4 h-4 text-ink" />
            </button>
          </div>
          {form.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {form.tags.map((tag) => (
                <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-accent-bg text-accent text-[11px] font-medium">
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)} className="hover:text-accent-dark"><X className="w-3 h-3" /></button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-accent hover:bg-accent-dark text-white text-[13px] font-medium px-6 py-3 rounded-lg transition-colors disabled:opacity-50"
          >
            {saving ? <><Loader2 className="w-4 h-4 animate-spin" />Saving...</> : <><Save className="w-4 h-4" />Save Changes</>}
          </button>
          <Link href="/employer/jobs" className="text-[13px] text-muted hover:text-ink font-medium px-4 py-3">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
