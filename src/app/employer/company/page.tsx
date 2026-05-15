"use client";

import { useEffect, useState } from "react";
import {
  Building2,
  Globe,
  MapPin,
  Briefcase,
  Save,
  Loader2,
  ExternalLink,
  CheckCircle2,
} from "lucide-react";

interface CompanyData {
  id: string;
  slug: string;
  name: string;
  logo: string | null;
  verified: boolean;
  orgType: string;
  industry: string | null;
  description: string | null;
  website: string | null;
  location: string | null;
  county: string | null;
  country: string;
  createdAt: string;
  _count: { listings: number; users: number };
}

export default function EmployerCompanyPage() {
  const [company, setCompany] = useState<CompanyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    description: "",
    website: "",
    location: "",
    county: "",
    industry: "",
    orgType: "",
  });

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/employer/company");
        if (res.ok) {
          const data = await res.json();
          setCompany(data);
          setForm({
            name: data.name,
            description: data.description || "",
            website: data.website || "",
            location: data.location || "",
            county: data.county || "",
            industry: data.industry || "",
            orgType: data.orgType,
          });
        }
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const update = (field: string, value: string) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    setSaved(false);

    try {
      const res = await fetch("/api/employer/company", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to update");
        return;
      }

      const data = await res.json();
      setCompany(data);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError("Something went wrong");
    } finally {
      setSaving(false);
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-heading font-bold text-ink">Company Profile</h1>
        <p className="text-[13px] text-muted mt-1">
          Manage your company details visible to job seekers
        </p>
      </div>

      {company && (
        <div className="bg-white rounded-xl border border-divider p-5">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-xl bg-accent-bg flex items-center justify-center shrink-0">
              {company.logo ? (
                <img src={company.logo} alt={company.name} className="w-14 h-14 rounded-xl object-cover" />
              ) : (
                <Building2 className="w-7 h-7 text-accent" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-[16px] font-heading font-semibold text-ink">{company.name}</h2>
                {company.verified && (
                  <span className="flex items-center gap-1 text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded font-medium border border-emerald-100">
                    <CheckCircle2 className="w-3 h-3" /> Verified
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 text-[11px] text-muted mt-0.5">
                <span>{company.orgType}</span>
                <span>{company._count.listings} job{company._count.listings !== 1 ? "s" : ""}</span>
                {company.industry && <span>{company.industry}</span>}
              </div>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-100 text-red-700 text-[12px] rounded-lg px-3 py-2">{error}</div>
        )}

        <div className="bg-white rounded-xl border border-divider p-5 space-y-4">
          <h3 className="text-[14px] font-heading font-semibold text-ink">Basic Information</h3>

          <div>
            <label className="block text-[12px] font-medium text-ink mb-1">Company Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-divider text-[13px] text-ink focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
              required
            />
          </div>

          <div>
            <label className="block text-[12px] font-medium text-ink mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              placeholder="Describe your company, mission, and culture..."
              rows={5}
              className="w-full px-3 py-2.5 rounded-lg border border-divider text-[13px] text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent resize-y"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-medium text-ink mb-1">Industry</label>
              <input
                type="text"
                value={form.industry}
                onChange={(e) => update("industry", e.target.value)}
                placeholder="e.g. Technology, Finance"
                className="w-full px-3 py-2.5 rounded-lg border border-divider text-[13px] text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
              />
            </div>
            <div>
              <label className="block text-[12px] font-medium text-ink mb-1">Organization Type</label>
              <select
                value={form.orgType}
                onChange={(e) => update("orgType", e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-divider text-[13px] text-ink bg-white focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
              >
                <option value="PRIVATE">Private</option>
                <option value="PUBLIC">Public</option>
                <option value="NGO">NGO</option>
                <option value="GOVERNMENT">Government</option>
                <option value="STARTUP">Startup</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-divider p-5 space-y-4">
          <h3 className="text-[14px] font-heading font-semibold text-ink">Location & Web</h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-medium text-ink mb-1">Location</label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => update("location", e.target.value)}
                placeholder="e.g. Westlands, Nairobi"
                className="w-full px-3 py-2.5 rounded-lg border border-divider text-[13px] text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
              />
            </div>
            <div>
              <label className="block text-[12px] font-medium text-ink mb-1">County</label>
              <input
                type="text"
                value={form.county}
                onChange={(e) => update("county", e.target.value)}
                placeholder="e.g. Nairobi"
                className="w-full px-3 py-2.5 rounded-lg border border-divider text-[13px] text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
              />
            </div>
          </div>

          <div>
            <label className="block text-[12px] font-medium text-ink mb-1">Website</label>
            <input
              type="url"
              value={form.website}
              onChange={(e) => update("website", e.target.value)}
              placeholder="https://www.company.com"
              className="w-full px-3 py-2.5 rounded-lg border border-divider text-[13px] text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-accent hover:bg-accent-dark text-white text-[13px] font-medium px-6 py-3 rounded-lg transition-colors disabled:opacity-50"
          >
            {saving ? <><Loader2 className="w-4 h-4 animate-spin" />Saving...</> : <><Save className="w-4 h-4" />Save Changes</>}
          </button>
          {saved && (
            <span className="flex items-center gap-1 text-[12px] text-emerald-600">
              <CheckCircle2 className="w-4 h-4" /> Saved successfully
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
