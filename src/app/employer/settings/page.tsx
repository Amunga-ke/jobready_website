"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  Save,
  Loader2,
  CheckCircle2,
  User,
  Mail,
  Phone,
  Lock,
  Building2,
} from "lucide-react";

export default function EmployerSettingsPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    bio: "",
  });

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch("/api/dashboard/profile");
        if (res.ok) {
          const data = await res.json();
          setForm({
            name: data.name || "",
            email: data.email || session?.user?.email || "",
            phone: data.phone || "",
            bio: data.bio || "",
          });
        }
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, [session]);

  const update = (field: string, value: string) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    setSaved(false);

    try {
      const res = await fetch("/api/dashboard/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to update profile");
        return;
      }

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
        <div className="h-64 bg-white rounded-xl border border-divider animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-heading font-bold text-ink">Account Settings</h1>
        <p className="text-[13px] text-muted mt-1">Manage your employer account details</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-100 text-red-700 text-[12px] rounded-lg px-3 py-2">{error}</div>
        )}

        <div className="bg-white rounded-xl border border-divider p-5 space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-accent-bg flex items-center justify-center text-[14px] font-semibold text-accent">
              {form.name?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "?"}
            </div>
            <div>
              <p className="text-[14px] font-medium text-ink">{form.name || "Your Name"}</p>
              <span className="inline-flex items-center gap-1 text-[10px] bg-accent-bg text-accent px-1.5 py-0.5 rounded font-medium">
                <Building2 className="w-2.5 h-2.5" />
                Employer Account
              </span>
            </div>
          </div>

          <h3 className="text-[14px] font-heading font-semibold text-ink">Personal Information</h3>

          <div>
            <label className="block text-[12px] font-medium text-ink mb-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input
                type="text"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-divider text-[13px] text-ink focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
              />
            </div>
          </div>

          <div>
            <label className="block text-[12px] font-medium text-ink mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input
                type="email"
                value={form.email}
                disabled
                className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-divider text-[13px] text-muted bg-ink/[0.02] cursor-not-allowed"
              />
            </div>
            <p className="text-[10px] text-muted mt-1">Email cannot be changed</p>
          </div>

          <div>
            <label className="block text-[12px] font-medium text-ink mb-1">Phone</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                placeholder="+254 700 000 000"
                className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-divider text-[13px] text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
              />
            </div>
          </div>

          <div>
            <label className="block text-[12px] font-medium text-ink mb-1">Bio</label>
            <textarea
              value={form.bio}
              onChange={(e) => update("bio", e.target.value)}
              placeholder="Tell us about yourself..."
              rows={3}
              className="w-full px-3 py-2.5 rounded-lg border border-divider text-[13px] text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent resize-y"
            />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-divider p-5">
          <h3 className="text-[14px] font-heading font-semibold text-ink mb-3">Security</h3>
          <p className="text-[12px] text-muted mb-3">To change your password, use the forgot password feature or contact support.</p>
          <div className="flex items-center gap-2 text-[12px] text-muted">
            <Lock className="w-4 h-4" />
            Password last changed: Not available
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
