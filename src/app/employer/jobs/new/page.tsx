"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Loader2,
  Save,
  X,
  Plus,
} from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  subcategories: { id: string; name: string; slug: string }[];
}

interface County {
  id: string;
  name: string;
}

export default function NewJobPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [counties, setCounties] = useState<County[]>([]);
  const [subcategories, setSubcategories] = useState<{ id: string; name: string }[]>([]);

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
    Promise.all([
      fetch("/api/categories").then((r) => (r.ok ? r.json() : { categories: [] })),
      fetch("/api/locations").then((r) => (r.ok ? r.json() : { locations: [] })),
    ]).then(([cats, cts]) => {
      setCategories(cats.categories || []);
      setCounties((cts.locations || []).map((c: { id: string; name: string }) => ({ id: c.id, name: c.name })));
    });
  }, []);

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !form.tags.includes(tag)) {
      update("tags", [...form.tags, tag]);
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    update("tags", form.tags.filter((t) => t !== tag));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload = {
        ...form,
        salaryMin: form.salaryMin ? parseInt(form.salaryMin) : null,
        salaryMax: form.salaryMax ? parseInt(form.salaryMax) : null,
        categoryId: form.categoryId || null,
        subcategoryId: form.subcategoryId || null,
        deadline: form.deadline || null,
      };

      const res = await fetch("/api/employer/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to create job");
        return;
      }

      router.push("/employer/jobs");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/employer/jobs"
          className="p-2 text-muted hover:text-ink hover:bg-ink/[0.04] rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-xl font-heading font-bold text-ink">Post a New Job</h1>
          <p className="text-[13px] text-muted mt-0.5">Fill in the details to publish your job listing</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-100 text-red-700 text-[12px] rounded-lg px-3 py-2">{error}</div>
        )}

        {/* Job Details */}
        <div className="bg-white rounded-xl border border-divider p-5 space-y-4">
          <h2 className="text-[14px] font-heading font-semibold text-ink">Job Details</h2>

          <div>
            <label className="block text-[12px] font-medium text-ink mb-1">Job Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
              placeholder="e.g. Senior Software Engineer"
              className="w-full px-3 py-2.5 rounded-lg border border-divider text-[13px] text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-[12px] font-medium text-ink mb-1">Description *</label>
            <textarea
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              placeholder="Describe the role, responsibilities, and requirements..."
              rows={8}
              className="w-full px-3 py-2.5 rounded-lg border border-divider text-[13px] text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors resize-y"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-medium text-ink mb-1">Job Type</label>
              <select
                value={form.listingType}
                onChange={(e) => update("listingType", e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-divider text-[13px] text-ink focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors bg-white"
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
                className="w-full px-3 py-2.5 rounded-lg border border-divider text-[13px] text-ink focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors bg-white"
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
                className="w-full px-3 py-2.5 rounded-lg border border-divider text-[13px] text-ink focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors bg-white"
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
                placeholder="e.g. Nairobi"
                className="w-full px-3 py-2.5 rounded-lg border border-divider text-[13px] text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors"
              />
            </div>
            <div>
              <label className="block text-[12px] font-medium text-ink mb-1">County</label>
              <input
                type="text"
                value={form.county}
                onChange={(e) => update("county", e.target.value)}
                placeholder="e.g. Nairobi"
                className="w-full px-3 py-2.5 rounded-lg border border-divider text-[13px] text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-[12px] font-medium text-ink mb-1">Employment Type</label>
              <select
                value={form.employmentType}
                onChange={(e) => update("employmentType", e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-divider text-[13px] text-ink focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors bg-white"
              >
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
              <select
                value={form.experienceLevel}
                onChange={(e) => update("experienceLevel", e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-divider text-[13px] text-ink focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors bg-white"
              >
                <option value="Entry-level">Entry-level</option>
                <option value="Mid-level">Mid-level</option>
                <option value="Senior">Senior</option>
                <option value="Manager">Manager</option>
                <option value="Executive">Executive</option>
              </select>
            </div>
            <div>
              <label className="block text-[12px] font-medium text-ink mb-1">Work Mode</label>
              <select
                value={form.workMode}
                onChange={(e) => update("workMode", e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-divider text-[13px] text-ink focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors bg-white"
              >
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
              <input
                type="number"
                value={form.salaryMin}
                onChange={(e) => update("salaryMin", e.target.value)}
                placeholder="e.g. 50000"
                className="w-full px-3 py-2.5 rounded-lg border border-divider text-[13px] text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors"
              />
            </div>
            <div>
              <label className="block text-[12px] font-medium text-ink mb-1">Max Salary (KES)</label>
              <input
                type="number"
                value={form.salaryMax}
                onChange={(e) => update("salaryMax", e.target.value)}
                placeholder="e.g. 120000"
                className="w-full px-3 py-2.5 rounded-lg border border-divider text-[13px] text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors"
              />
            </div>
            <div>
              <label className="block text-[12px] font-medium text-ink mb-1">Salary Period</label>
              <select
                value={form.salaryPeriod}
                onChange={(e) => update("salaryPeriod", e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-divider text-[13px] text-ink focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors bg-white"
              >
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

          <div>
            <label className="block text-[12px] font-medium text-ink mb-1">Application URL</label>
            <input
              type="url"
              value={form.applicationUrl}
              onChange={(e) => update("applicationUrl", e.target.value)}
              placeholder="https://..."
              className="w-full px-3 py-2.5 rounded-lg border border-divider text-[13px] text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors"
            />
            <p className="text-[11px] text-muted mt-1">Leave empty to receive applications through JobReady</p>
          </div>

          <div>
            <label className="block text-[12px] font-medium text-ink mb-1">Application Email</label>
            <input
              type="email"
              value={form.applyEmail}
              onChange={(e) => update("applyEmail", e.target.value)}
              placeholder="hr@company.com"
              className="w-full px-3 py-2.5 rounded-lg border border-divider text-[13px] text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors"
            />
          </div>

          <div>
            <label className="block text-[12px] font-medium text-ink mb-1">Application Deadline</label>
            <input
              type="date"
              value={form.deadline}
              onChange={(e) => update("deadline", e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-divider text-[13px] text-ink focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors"
            />
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
              className="flex-1 px-3 py-2.5 rounded-lg border border-divider text-[13px] text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors"
            />
            <button
              type="button"
              onClick={addTag}
              className="px-3 py-2.5 bg-ink/[0.04] hover:bg-ink/[0.08] text-ink rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          {form.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {form.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-accent-bg text-accent text-[11px] font-medium"
                >
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)} className="hover:text-accent-dark">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-accent hover:bg-accent-dark text-white text-[13px] font-medium px-6 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Publishing...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Publish Job
              </>
            )}
          </button>
          <Link
            href="/employer/jobs"
            className="text-[13px] text-muted hover:text-ink font-medium transition-colors px-4 py-3"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
