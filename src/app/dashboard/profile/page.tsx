"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import {
  User,
  Upload,
  Loader2,
  Eye,
  EyeOff,
  Check,
  Trash2,
} from "lucide-react";
import { KE_COUNTIES } from "@/lib/constants";

interface Profile {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  county: string | null;
  bio: string | null;
  cvUrl: string | null;
  avatarUrl: string | null;
  role: string;
  createdAt: string;
}

export default function ProfilePage() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form state
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [county, setCounty] = useState("");
  const [bio, setBio] = useState("");

  // Change password
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);

  const loadProfile = useCallback(async () => {
    try {
      const res = await fetch("/api/dashboard/profile");
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
        setName(data.name || "");
        setPhone(data.phone || "");
        setCounty(data.county || "");
        setBio(data.bio || "");
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const showMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/dashboard/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, county, bio }),
      });
      if (res.ok) {
        const data = await res.json();
        setProfile((prev) => prev ? { ...prev, ...data } : prev);
        showMessage("success", "Profile updated successfully");
      } else {
        const data = await res.json();
        showMessage("error", data.error || "Failed to update profile");
      }
    } catch {
      showMessage("error", "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const handleUploadCV = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

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
        setProfile((prev) => prev ? { ...prev, cvUrl: data.cvUrl } : prev);
        showMessage("success", "CV uploaded successfully");
      } else {
        const data = await res.json();
        showMessage("error", data.error || "Failed to upload CV");
      }
    } catch {
      showMessage("error", "Failed to upload CV");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm("Are you sure you want to delete your account? This action cannot be undone.")) return;
    if (!confirm("All your saved jobs, applications, and alerts will be permanently deleted. Continue?")) return;
    showMessage("error", "Account deletion is not yet available. Contact support.");
  };

  const initials = session?.user?.name
    ? session.user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  const profileCompletion = (() => {
    if (!profile) return 0;
    let fields = 0;
    const total = 5;
    if (profile.name?.trim()) fields++;
    if (profile.phone?.trim()) fields++;
    if (profile.county?.trim()) fields++;
    if (profile.bio?.trim()) fields++;
    if (profile.cvUrl?.trim()) fields++;
    return Math.round((fields / total) * 100);
  })();

  if (loading) {
    return (
      <div className="space-y-5">
        <div className="h-8 w-48 bg-ink/[0.04] rounded-lg animate-pulse" />
        <div className="h-96 bg-white rounded-xl border border-divider animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-heading font-bold text-ink">Profile</h1>
        <p className="text-[13px] text-muted mt-1">Manage your personal information and CV.</p>
      </div>

      {/* Completion bar */}
      <div className="bg-white rounded-xl border border-divider p-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[12px] font-medium text-ink">Profile Completion</p>
          <p className="text-[11px] text-muted">{profileCompletion}%</p>
        </div>
        <div className="w-full h-1.5 bg-ink/[0.06] rounded-full overflow-hidden">
          <div
            className="h-full bg-accent rounded-full transition-all duration-500"
            style={{ width: `${profileCompletion}%` }}
          />
        </div>
      </div>

      {message && (
        <div className={`rounded-lg border px-4 py-3 text-[12px] font-medium ${
          message.type === "success"
            ? "bg-emerald-50 border-emerald-100 text-emerald-700"
            : "bg-red-50 border-red-100 text-red-700"
        }`}>
          {message.text}
        </div>
      )}

      {/* Avatar + Name */}
      <div className="bg-white rounded-xl border border-divider p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-ink/[0.06] flex items-center justify-center text-lg font-semibold text-ink">
            {initials}
          </div>
          <div>
            <h2 className="text-[15px] font-heading font-semibold text-ink">
              {profile?.name || "User"}
            </h2>
            <p className="text-[12px] text-muted">{profile?.email}</p>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-accent-bg text-accent border border-accent/20 mt-1">
              {profile?.role || "SEEKER"}
            </span>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="profile-name" className="block text-[12px] font-medium text-ink mb-1.5">
                Full Name
              </label>
              <input
                id="profile-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-divider bg-surface text-[13px] text-ink focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors"
              />
            </div>
            <div>
              <label className="block text-[12px] font-medium text-ink mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={profile?.email || ""}
                readOnly
                className="w-full px-3 py-2 rounded-lg border border-divider bg-ink/[0.02] text-[13px] text-muted cursor-not-allowed"
              />
              <p className="text-[10px] text-muted mt-1">Email cannot be changed</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="profile-phone" className="block text-[12px] font-medium text-ink mb-1.5">
                Phone <span className="text-muted font-normal">(optional)</span>
              </label>
              <input
                id="profile-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+254 7XX XXX XXX"
                className="w-full px-3 py-2 rounded-lg border border-divider bg-surface text-[13px] text-ink placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors"
              />
            </div>
            <div>
              <label htmlFor="profile-county" className="block text-[12px] font-medium text-ink mb-1.5">
                County <span className="text-muted font-normal">(optional)</span>
              </label>
              <select
                id="profile-county"
                value={county}
                onChange={(e) => setCounty(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-divider bg-surface text-[13px] text-ink focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors"
              >
                <option value="">Select county</option>
                {KE_COUNTIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="profile-bio" className="block text-[12px] font-medium text-ink mb-1.5">
              Bio <span className="text-muted font-normal">(optional)</span>
            </label>
            <textarea
              id="profile-bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell employers a bit about yourself..."
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-divider bg-surface text-[13px] text-ink placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-ink text-white text-[13px] font-medium px-5 py-2 rounded-lg hover:bg-ink/90 transition-colors disabled:opacity-50"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>

      {/* CV Upload */}
      <div className="bg-white rounded-xl border border-divider p-6">
        <h2 className="text-[14px] font-heading font-semibold text-ink mb-1">CV / Resume</h2>
        <p className="text-[12px] text-muted mb-4">Upload your CV to apply for jobs faster.</p>

        {profile?.cvUrl ? (
          <div className="flex items-center justify-between bg-emerald-50 border border-emerald-100 rounded-lg px-4 py-3">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span className="text-[12px] text-emerald-700 font-medium">CV uploaded</span>
            </div>
            <label className="cursor-pointer">
              <span className="text-[11px] text-emerald-600 hover:text-emerald-800 font-medium transition-colors">
                Replace
              </span>
              <input type="file" accept=".pdf,.doc,.docx" onChange={handleUploadCV} className="hidden" />
            </label>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center border-2 border-dashed border-divider rounded-lg py-8 cursor-pointer hover:border-accent/40 hover:bg-accent-bg/20 transition-all">
            {uploading ? (
              <Loader2 className="w-8 h-8 text-accent animate-spin mb-2" />
            ) : (
              <Upload className="w-8 h-8 text-muted/50 mb-2" />
            )}
            <p className="text-[12px] text-ink font-medium">
              {uploading ? "Uploading..." : "Click to upload CV"}
            </p>
            <p className="text-[11px] text-muted mt-0.5">PDF, DOC, DOCX — max 5MB</p>
            <input type="file" accept=".pdf,.doc,.docx" onChange={handleUploadCV} className="hidden" />
          </label>
        )}
      </div>

      {/* Change Password */}
      <div className="bg-white rounded-xl border border-divider p-6">
        <button
          type="button"
          onClick={() => setShowPasswordSection(!showPasswordSection)}
          className="flex items-center justify-between w-full text-left"
        >
          <div>
            <h2 className="text-[14px] font-heading font-semibold text-ink">Change Password</h2>
            <p className="text-[12px] text-muted mt-0.5">Update your account password</p>
          </div>
          <Eye className="w-4 h-4 text-muted" />
        </button>

        {showPasswordSection && (
          <div className="mt-4 pt-4 border-t border-divider space-y-4">
            <div>
              <label htmlFor="new-password" className="block text-[12px] font-medium text-ink mb-1.5">
                New Password
              </label>
              <div className="relative">
                <input
                  id="new-password"
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  className="w-full px-3 py-2 pr-10 rounded-lg border border-divider bg-surface text-[13px] text-ink placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted hover:text-ink"
                  tabIndex={-1}
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label htmlFor="confirm-new-password" className="block text-[12px] font-medium text-ink mb-1.5">
                Confirm New Password
              </label>
              <input
                id="confirm-new-password"
                type="password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                placeholder="Confirm new password"
                className="w-full px-3 py-2 rounded-lg border border-divider bg-surface text-[13px] text-ink placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
              />
            </div>
            <p className="text-[11px] text-muted">
              Password change coming soon. Contact support for immediate changes.
            </p>
          </div>
        )}
      </div>

      {/* Danger zone */}
      <div className="bg-white rounded-xl border border-red-100 p-6">
        <h2 className="text-[14px] font-heading font-semibold text-red-600 mb-1">Danger Zone</h2>
        <p className="text-[12px] text-muted mb-4">Permanently delete your account and all associated data.</p>
        <button
          onClick={handleDeleteAccount}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-red-200 text-[12px] font-medium text-red-600 hover:bg-red-50 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Delete Account
        </button>
      </div>
    </div>
  );
}
