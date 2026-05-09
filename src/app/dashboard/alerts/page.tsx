"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Bell,
  BellOff,
  BellPlus,
  Trash2,
  X,
  Search,
  Calendar,
  Clock,
} from "lucide-react";
import { KE_COUNTIES, JOB_CATEGORIES } from "@/lib/constants";

interface JobAlert {
  id: string;
  name: string;
  query: string;
  frequency: string;
  isActive: boolean;
  createdAt: string;
  lastTriggered: string | null;
}

interface AlertFormData {
  name: string;
  keyword: string;
  category: string;
  county: string;
  frequency: string;
}

const FREQUENCY_LABELS: Record<string, string> = {
  DAILY: "Daily",
  WEEKLY: "Weekly",
  INSTANT: "Instant",
};

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<JobAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [creating, setCreating] = useState(false);

  // Form state
  const [form, setForm] = useState<AlertFormData>({
    name: "",
    keyword: "",
    category: "",
    county: "",
    frequency: "DAILY",
  });

  const loadAlerts = useCallback(async () => {
    try {
      const res = await fetch("/api/dashboard/alerts");
      if (res.ok) {
        setAlerts(await res.json());
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAlerts();
  }, [loadAlerts]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    setCreating(true);
    try {
      const queryObj: Record<string, string> = {};
      if (form.keyword) queryObj.q = form.keyword;
      if (form.category) queryObj.category = form.category;
      if (form.county) queryObj.county = form.county;

      const res = await fetch("/api/dashboard/alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          query: JSON.stringify(queryObj),
          frequency: form.frequency,
        }),
      });

      if (res.ok) {
        setForm({ name: "", keyword: "", category: "", county: "", frequency: "DAILY" });
        setShowForm(false);
        loadAlerts();
      }
    } catch {
      // silently fail
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this alert?")) return;
    try {
      const res = await fetch(`/api/dashboard/alerts?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setAlerts((prev) => prev.filter((a) => a.id !== id));
      }
    } catch {
      // silently fail
    }
  };

  const getQueryDescription = (queryStr: string): string => {
    try {
      const q = JSON.parse(queryStr);
      const parts: string[] = [];
      if (q.q) parts.push(`"${q.q}"`);
      if (q.category) {
        const cat = JOB_CATEGORIES.find((c) => c.slug === q.category);
        parts.push(cat?.label || q.category);
      }
      if (q.county) parts.push(q.county);
      return parts.length > 0 ? parts.join(" · ") : "All jobs";
    } catch {
      return "All jobs";
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-heading font-bold text-ink">Job Alerts</h1>
          <p className="text-[13px] text-muted mt-1">
            Get notified when new jobs match your criteria.
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-1.5 bg-ink text-white text-[12px] font-medium px-3.5 py-2 rounded-lg hover:bg-ink/90 transition-colors"
        >
          <BellPlus className="w-3.5 h-3.5" />
          New Alert
        </button>
      </div>

      {/* Create Alert Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowForm(false)} />
          <div className="relative bg-white rounded-xl border border-divider p-6 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[14px] font-heading font-semibold text-ink">Create Job Alert</h2>
              <button
                onClick={() => setShowForm(false)}
                className="p-1 -mr-1 rounded-lg hover:bg-ink/[0.04] text-muted"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-[12px] font-medium text-ink mb-1.5">Alert Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g., Tech Jobs in Nairobi"
                  required
                  className="w-full px-3 py-2 rounded-lg border border-divider bg-surface text-[13px] text-ink placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-[12px] font-medium text-ink mb-1.5">
                  <Search className="w-3 h-3 inline mr-1" />
                  Keyword <span className="text-muted font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  value={form.keyword}
                  onChange={(e) => setForm({ ...form, keyword: e.target.value })}
                  placeholder="e.g., software engineer"
                  className="w-full px-3 py-2 rounded-lg border border-divider bg-surface text-[13px] text-ink placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-medium text-ink mb-1.5">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-divider bg-surface text-[13px] text-ink focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                  >
                    <option value="">All categories</option>
                    {JOB_CATEGORIES.map((c) => (
                      <option key={c.slug} value={c.slug}>{c.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-ink mb-1.5">County</label>
                  <select
                    value={form.county}
                    onChange={(e) => setForm({ ...form, county: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-divider bg-surface text-[13px] text-ink focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                  >
                    <option value="">All counties</option>
                    {KE_COUNTIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-medium text-ink mb-1.5">Frequency</label>
                <div className="flex gap-2">
                  {(["DAILY", "WEEKLY", "INSTANT"] as const).map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setForm({ ...form, frequency: f })}
                      className={`flex-1 py-2 rounded-lg border text-[11px] font-medium transition-colors ${
                        form.frequency === f
                          ? "border-accent bg-accent-bg text-accent"
                          : "border-divider text-muted hover:text-ink"
                      }`}
                    >
                      {FREQUENCY_LABELS[f]}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={creating || !form.name.trim()}
                className="w-full bg-ink text-white text-[13px] font-medium py-2.5 rounded-lg hover:bg-ink/90 transition-colors disabled:opacity-50"
              >
                {creating ? "Creating..." : "Create Alert"}
              </button>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-20 bg-white rounded-xl border border-divider animate-pulse" />
          ))}
        </div>
      ) : alerts.length === 0 ? (
        <div className="bg-white rounded-xl border border-divider p-10 text-center">
          <Bell className="w-10 h-10 text-muted/30 mx-auto mb-3" />
          <h2 className="text-[14px] font-heading font-semibold text-ink mb-1">No job alerts</h2>
          <p className="text-[12px] text-muted mb-4">
            Create alerts to get notified when matching jobs are posted.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 bg-ink text-white text-[12px] font-medium px-4 py-2 rounded-lg hover:bg-ink/90 transition-colors"
          >
            <BellPlus className="w-3.5 h-3.5" />
            Create Alert
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`bg-white rounded-xl border p-4 transition-colors ${
                alert.isActive ? "border-divider" : "border-divider opacity-60"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-[13px] font-medium text-ink truncate">{alert.name}</h3>
                    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium border ${alert.isActive ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-gray-50 text-gray-600 border-gray-100"}`}>
                      {alert.isActive ? "Active" : "Paused"}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted mt-0.5">
                    {getQueryDescription(alert.query)}
                  </p>
                  <div className="flex items-center gap-3 mt-1.5 text-[10px] text-muted">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {FREQUENCY_LABELS[alert.frequency] || alert.frequency}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Created {new Date(alert.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => {
                      // Toggle active status locally (no API for this yet)
                      setAlerts((prev) =>
                        prev.map((a) =>
                          a.id === alert.id ? { ...a, isActive: !a.isActive } : a
                        )
                      );
                    }}
                    className="p-1.5 rounded-lg hover:bg-ink/[0.04] text-muted hover:text-ink transition-colors"
                    title={alert.isActive ? "Pause alert" : "Activate alert"}
                  >
                    {alert.isActive ? <BellOff className="w-3.5 h-3.5" /> : <Bell className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => handleDelete(alert.id)}
                    className="p-1.5 rounded-lg hover:bg-red-50 text-muted hover:text-red-500 transition-colors"
                    title="Delete alert"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
