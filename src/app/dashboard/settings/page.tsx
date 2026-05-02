"use client";

import { useState, useEffect } from "react";
import {
  Bell,
  Mail,
  Eye,
  EyeOff,
  Shield,
} from "lucide-react";

interface NotificationSettings {
  newMatchingJobs: boolean;
  applicationUpdates: boolean;
  alertDigest: boolean;
  marketing: boolean;
}

interface PrivacySettings {
  profileVisible: boolean;
}

export default function SettingsPage() {
  const [notifications, setNotifications] = useState<NotificationSettings>({
    newMatchingJobs: true,
    applicationUpdates: true,
    alertDigest: true,
    marketing: false,
  });

  const [privacy, setPrivacy] = useState<PrivacySettings>({
    profileVisible: true,
  });

  const [saved, setSaved] = useState(false);

  // Load from localStorage
  useEffect(() => {
    try {
      const notifStr = localStorage.getItem("jr-notifications");
      if (notifStr) setNotifications(JSON.parse(notifStr));

      const privacyStr = localStorage.getItem("jr-privacy");
      if (privacyStr) setPrivacy(JSON.parse(privacyStr));
    } catch {
      // use defaults
    }
  }, []);

  const handleSaveNotifications = () => {
    localStorage.setItem("jr-notifications", JSON.stringify(notifications));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleSavePrivacy = () => {
    localStorage.setItem("jr-privacy", JSON.stringify(privacy));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-heading font-bold text-ink">Settings</h1>
        <p className="text-[13px] text-muted mt-1">Manage your notification and privacy preferences.</p>
      </div>

      {saved && (
        <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 text-[12px] rounded-lg px-4 py-2.5 font-medium">
          Settings saved successfully.
        </div>
      )}

      {/* Notification Preferences */}
      <div className="bg-white rounded-xl border border-divider p-6">
        <div className="flex items-center gap-2 mb-4">
          <Mail className="w-4 h-4 text-muted" />
          <h2 className="text-[14px] font-heading font-semibold text-ink">Email Notifications</h2>
        </div>

        <div className="space-y-4">
          <ToggleSetting
            label="New matching jobs"
            description="Get notified when new jobs match your profile and preferences"
            checked={notifications.newMatchingJobs}
            onChange={(v) => setNotifications({ ...notifications, newMatchingJobs: v })}
            icon={Bell}
          />
          <ToggleSetting
            label="Application updates"
            description="Receive updates when your application status changes"
            checked={notifications.applicationUpdates}
            onChange={(v) => setNotifications({ ...notifications, applicationUpdates: v })}
            icon={Mail}
          />
          <ToggleSetting
            label="Job alert digest"
            description="Periodic digest of your job alert results"
            checked={notifications.alertDigest}
            onChange={(v) => setNotifications({ ...notifications, alertDigest: v })}
            icon={Bell}
          />
          <ToggleSetting
            label="Marketing emails"
            description="Product updates, tips, and promotional content"
            checked={notifications.marketing}
            onChange={(v) => setNotifications({ ...notifications, marketing: v })}
            icon={Mail}
          />
        </div>

        <button
          onClick={handleSaveNotifications}
          className="mt-4 bg-ink text-white text-[12px] font-medium px-4 py-2 rounded-lg hover:bg-ink/90 transition-colors"
        >
          Save Notifications
        </button>
      </div>

      {/* Privacy */}
      <div className="bg-white rounded-xl border border-divider p-6">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-4 h-4 text-muted" />
          <h2 className="text-[14px] font-heading font-semibold text-ink">Privacy</h2>
        </div>

        <div className="space-y-4">
          <ToggleSetting
            label="Show profile to employers"
            description="Allow employers to view your profile when you apply"
            checked={privacy.profileVisible}
            onChange={(v) => setPrivacy({ ...privacy, profileVisible: v })}
            icon={privacy.profileVisible ? Eye : EyeOff}
          />
        </div>

        <button
          onClick={handleSavePrivacy}
          className="mt-4 bg-ink text-white text-[12px] font-medium px-4 py-2 rounded-lg hover:bg-ink/90 transition-colors"
        >
          Save Privacy Settings
        </button>
      </div>
    </div>
  );
}

function ToggleSetting({
  label,
  description,
  checked,
  onChange,
  icon: Icon,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex items-start gap-3 min-w-0">
        <div className="w-8 h-8 rounded-lg bg-ink/[0.04] flex items-center justify-center shrink-0 mt-0.5">
          <Icon className="w-4 h-4 text-muted" />
        </div>
        <div>
          <p className="text-[13px] font-medium text-ink">{label}</p>
          <p className="text-[11px] text-muted mt-0.5">{description}</p>
        </div>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors mt-0.5 ${
          checked ? "bg-accent" : "bg-ink/[0.15]"
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
            checked ? "translate-x-4" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}
