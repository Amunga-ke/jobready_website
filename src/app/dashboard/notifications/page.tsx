"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  Bell,
  Mail,
  MessageSquare,
  CheckCircle2,
  Crown,
  Zap,
  ArrowRight,
  ExternalLink,
  AlertCircle,
} from "lucide-react";

type PlanType = "FREE" | "PREMIUM_SMS" | "PREMIUM_ALL";

interface Subscription {
  plan: PlanType;
  status: string;
  startDate: string;
  endDate: string;
  paymentMethod: string;
}

interface NotificationHistory {
  id: string;
  type: "SMS" | "EMAIL" | "WHATSAPP";
  message: string;
  status: "SENT" | "FAILED" | "PENDING";
  createdAt: string;
}

const PLAN_INFO: Record<
  PlanType,
  { label: string; price: string; features: string[]; color: string; bg: string; border: string }
> = {
  FREE: {
    label: "Free",
    price: "KES 0",
    features: ["Email job alerts only", "Up to 3 job alerts", "Daily frequency only"],
    color: "text-gray-700",
    bg: "bg-gray-50",
    border: "border-gray-200",
  },
  PREMIUM_SMS: {
    label: "Premium SMS",
    price: "KES 500/month",
    features: [
      "Email + SMS job alerts",
      "Up to 10 job alerts",
      "All frequency options",
      "Priority matching",
    ],
    color: "text-emerald-700",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
  },
  PREMIUM_ALL: {
    label: "Premium All",
    price: "KES 1,000/month",
    features: [
      "Email + SMS + WhatsApp alerts",
      "Unlimited job alerts",
      "All frequency options",
      "Priority matching",
      "Instant notifications",
    ],
    color: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
  },
};

export default function NotificationsPage() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<NotificationHistory[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [smsEnabled, setSmsEnabled] = useState(false);
  const [whatsappEnabled, setWhatsappEnabled] = useState(false);
  const [subscribing, setSubscribing] = useState<PlanType | null>(null);

  const loadSubscription = useCallback(async () => {
    try {
      const res = await fetch("/api/notifications/subscribe");
      if (res.ok) {
        const data = await res.json();
        setSubscription(data.subscription || null);
        if (data.subscription?.plan === "PREMIUM_ALL") {
          setWhatsappEnabled(true);
          setSmsEnabled(true);
        } else if (data.subscription?.plan === "PREMIUM_SMS") {
          setSmsEnabled(true);
        }
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  const loadHistory = useCallback(async () => {
    try {
      const res = await fetch("/api/notifications/history");
      if (res.ok) {
        setHistory(await res.json());
      }
    } catch {
      // silently fail
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSubscription();
    loadHistory();
  }, [loadSubscription, loadHistory]);

  const handleSubscribe = async (plan: PlanType) => {
    setSubscribing(plan);
    try {
      const res = await fetch("/api/notifications/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, paymentMethod: "MPESA" }),
      });
      if (res.ok) {
        await loadSubscription();
      }
    } catch {
      // silently fail
    } finally {
      setSubscribing(null);
    }
  };

  const currentPlan = subscription?.plan || "FREE";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-heading font-bold text-ink">Notifications & Alerts</h1>
        <p className="text-[13px] text-muted mt-1">
          Manage your subscription, alert settings, and notification history.
        </p>
      </div>

      {/* Subscription Management */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <Crown className="w-4 h-4 text-muted" />
          <h2 className="text-[14px] font-heading font-semibold text-ink">
            Subscription Plan
          </h2>
        </div>

        {loading ? (
          <div className="h-32 bg-white rounded-xl border border-divider animate-pulse" />
        ) : (
          <>
            {/* Current Plan Card */}
            <div
              className={`rounded-xl border p-5 mb-4 ${
                currentPlan === "FREE"
                  ? "bg-gray-50 border-gray-200"
                  : currentPlan === "PREMIUM_SMS"
                  ? "bg-emerald-50 border-emerald-200"
                  : "bg-amber-50 border-amber-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[14px] font-heading font-semibold ${
                        PLAN_INFO[currentPlan].color
                      }`}
                    >
                      {PLAN_INFO[currentPlan].label}
                    </span>
                    {currentPlan !== "FREE" && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-green-100 text-green-700">
                        <CheckCircle2 className="w-3 h-3" />
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-[12px] text-muted mt-1">
                    {currentPlan === "FREE"
                      ? "Upgrade to unlock SMS and WhatsApp job alerts"
                      : `Renews on ${subscription?.endDate ? new Date(subscription.endDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "N/A"}`}
                  </p>
                </div>
                {currentPlan === "FREE" && (
                  <Link
                    href="/pricing"
                    className="inline-flex items-center gap-1.5 bg-ink text-white text-[12px] font-medium px-4 py-2 rounded-lg hover:bg-ink/90 transition-colors"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    Upgrade
                  </Link>
                )}
              </div>
              {subscription && currentPlan !== "FREE" && (
                <div className="mt-3 pt-3 border-t border-black/10">
                  <ul className="space-y-1">
                    {PLAN_INFO[currentPlan].features.map((f) => (
                      <li
                        key={f}
                        className="text-[11px] text-muted flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3 h-3 text-green-500 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Plan Comparison Table */}
            <div className="bg-white rounded-xl border border-divider overflow-hidden">
              <div className="p-4 border-b border-divider">
                <h3 className="text-[13px] font-medium text-ink">Plan Comparison</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-[12px]">
                  <thead>
                    <tr className="border-b border-divider bg-gray-50/50">
                      <th className="text-left px-4 py-3 font-medium text-muted">
                        Feature
                      </th>
                      <th className="text-center px-4 py-3 font-medium text-muted">
                        Free
                      </th>
                      <th className="text-center px-4 py-3 font-medium text-emerald-700">
                        Premium SMS
                      </th>
                      <th className="text-center px-4 py-3 font-medium text-amber-700">
                        Premium All
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { feature: "Email Alerts", free: true, sms: true, all: true },
                      { feature: "SMS Alerts", free: false, sms: true, all: true },
                      { feature: "WhatsApp Alerts", free: false, sms: false, all: true },
                      { feature: "Max Alerts", free: "3", sms: "10", all: "Unlimited" },
                      { feature: "Frequency Options", free: "Daily", sms: "All", all: "All" },
                      { feature: "Priority Matching", free: false, sms: true, all: true },
                      { feature: "Instant Notifications", free: false, sms: false, all: true },
                    ].map((row) => (
                      <tr key={row.feature} className="border-b border-divider last:border-0">
                        <td className="px-4 py-2.5 text-ink">{row.feature}</td>
                        <td className="text-center px-4 py-2.5 text-muted">
                          {typeof row.free === "boolean" ? (
                            row.free ? (
                              <CheckCircle2 className="w-4 h-4 text-green-500 mx-auto" />
                            ) : (
                              <span className="text-muted/40">&mdash;</span>
                            )
                          ) : (
                            row.free
                          )}
                        </td>
                        <td className="text-center px-4 py-2.5">
                          {typeof row.sms === "boolean" ? (
                            row.sms ? (
                              <CheckCircle2 className="w-4 h-4 text-green-500 mx-auto" />
                            ) : (
                              <span className="text-muted/40">&mdash;</span>
                            )
                          ) : (
                            <span className="text-emerald-700 font-medium">{row.sms}</span>
                          )}
                        </td>
                        <td className="text-center px-4 py-2.5">
                          {typeof row.all === "boolean" ? (
                            row.all ? (
                              <CheckCircle2 className="w-4 h-4 text-green-500 mx-auto" />
                            ) : (
                              <span className="text-muted/40">&mdash;</span>
                            )
                          ) : (
                            <span className="text-amber-700 font-medium">{row.all}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                    <tr>
                      <td className="px-4 py-3 text-ink font-medium">Price</td>
                      <td className="text-center px-4 py-3 text-muted">Free</td>
                      <td className="text-center px-4 py-3">
                        <div className="space-y-1">
                          <span className="text-[11px] font-semibold text-emerald-700">
                            KES 500/month
                          </span>
                          <br />
                          {currentPlan !== "PREMIUM_SMS" && (
                            <button
                              onClick={() => handleSubscribe("PREMIUM_SMS")}
                              disabled={subscribing !== null}
                              className="text-[10px] font-medium text-emerald-600 hover:text-emerald-800 underline disabled:opacity-50"
                            >
                              {subscribing === "PREMIUM_SMS" ? "Processing..." : "Subscribe"}
                            </button>
                          )}
                          {currentPlan === "PREMIUM_SMS" && (
                            <span className="text-[10px] text-green-600 font-medium">
                              Current Plan
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="text-center px-4 py-3">
                        <div className="space-y-1">
                          <span className="text-[11px] font-semibold text-amber-700">
                            KES 1,000/month
                          </span>
                          <br />
                          {currentPlan !== "PREMIUM_ALL" && (
                            <button
                              onClick={() => handleSubscribe("PREMIUM_ALL")}
                              disabled={subscribing !== null}
                              className="text-[10px] font-medium text-amber-600 hover:text-amber-800 underline disabled:opacity-50"
                            >
                              {subscribing === "PREMIUM_ALL"
                                ? "Processing..."
                                : "Subscribe"}
                            </button>
                          )}
                          {currentPlan === "PREMIUM_ALL" && (
                            <span className="text-[10px] text-green-600 font-medium">
                              Current Plan
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </section>

      {/* Job Alert Settings */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <Bell className="w-4 h-4 text-muted" />
          <h2 className="text-[14px] font-heading font-semibold text-ink">
            Alert Settings
          </h2>
        </div>

        <div className="bg-white rounded-xl border border-divider p-5 space-y-4">
          {/* Manage Alerts Link */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[13px] font-medium text-ink">Job Alert Queries</p>
              <p className="text-[11px] text-muted mt-0.5">
                Manage your job search alerts and criteria
              </p>
            </div>
            <Link
              href="/dashboard/alerts"
              className="inline-flex items-center gap-1 text-[12px] font-medium text-accent hover:text-accent-dark transition-colors"
            >
              Manage Alerts
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="border-t border-divider" />

          {/* SMS Alerts Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-start gap-3 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-ink/[0.04] flex items-center justify-center shrink-0 mt-0.5">
                <MessageSquare className="w-4 h-4 text-muted" />
              </div>
              <div>
                <p className="text-[13px] font-medium text-ink">SMS Alerts</p>
                <p className="text-[11px] text-muted mt-0.5">
                  {currentPlan === "FREE"
                    ? "Upgrade to Premium SMS to enable"
                    : "Receive job alerts via SMS"}
                </p>
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={smsEnabled}
              disabled={currentPlan === "FREE"}
              onClick={() => setSmsEnabled(!smsEnabled)}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors mt-0.5 disabled:opacity-40 disabled:cursor-not-allowed ${
                smsEnabled ? "bg-accent" : "bg-ink/[0.15]"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
                  smsEnabled ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* WhatsApp Alerts Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-start gap-3 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-ink/[0.04] flex items-center justify-center shrink-0 mt-0.5">
                <Zap className="w-4 h-4 text-muted" />
              </div>
              <div>
                <p className="text-[13px] font-medium text-ink">WhatsApp Alerts</p>
                <p className="text-[11px] text-muted mt-0.5">
                  {currentPlan !== "PREMIUM_ALL"
                    ? "Upgrade to Premium All to enable"
                    : "Receive job alerts via WhatsApp"}
                </p>
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={whatsappEnabled}
              disabled={currentPlan !== "PREMIUM_ALL"}
              onClick={() => setWhatsappEnabled(!whatsappEnabled)}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors mt-0.5 disabled:opacity-40 disabled:cursor-not-allowed ${
                whatsappEnabled ? "bg-accent" : "bg-ink/[0.15]"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
                  whatsappEnabled ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Alert Frequency */}
          <div className="border-t border-divider pt-4">
            <div>
              <p className="text-[13px] font-medium text-ink">Preferred Frequency</p>
              <p className="text-[11px] text-muted mt-0.5 mb-2">
                How often you&apos;d like to receive alert notifications
              </p>
              <div className="flex gap-2">
                {(["DAILY", "WEEKLY", "INSTANT"] as const).map((f) => (
                  <button
                    key={f}
                    type="button"
                    className={`px-3 py-1.5 rounded-lg border text-[11px] font-medium transition-colors ${
                      f === "DAILY"
                        ? "border-accent bg-accent-bg text-accent"
                        : "border-divider text-muted hover:text-ink"
                    }`}
                  >
                    {f === "DAILY" ? "Daily" : f === "WEEKLY" ? "Weekly" : "Instant"}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Notifications History */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <Mail className="w-4 h-4 text-muted" />
          <h2 className="text-[14px] font-heading font-semibold text-ink">
            Recent Notifications
          </h2>
        </div>

        {historyLoading ? (
          <div className="space-y-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-16 bg-white rounded-xl border border-divider animate-pulse" />
            ))}
          </div>
        ) : history.length === 0 ? (
          <div className="bg-white rounded-xl border border-divider p-10 text-center">
            <Bell className="w-10 h-10 text-muted/30 mx-auto mb-3" />
            <h3 className="text-[14px] font-heading font-semibold text-ink mb-1">
              No notifications yet
            </h3>
            <p className="text-[12px] text-muted">
              Your notification history will appear here once alerts are sent.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-divider overflow-hidden">
            {/* Desktop table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-[12px]">
                <thead>
                  <tr className="border-b border-divider bg-gray-50/50">
                    <th className="text-left px-4 py-3 font-medium text-muted">Type</th>
                    <th className="text-left px-4 py-3 font-medium text-muted">Message</th>
                    <th className="text-left px-4 py-3 font-medium text-muted">Status</th>
                    <th className="text-left px-4 py-3 font-medium text-muted">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((item) => (
                    <tr key={item.id} className="border-b border-divider last:border-0 hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium ${
                            item.type === "SMS"
                              ? "bg-blue-50 text-blue-700"
                              : item.type === "WHATSAPP"
                              ? "bg-green-50 text-green-700"
                              : "bg-purple-50 text-purple-700"
                          }`}
                        >
                          {item.type === "SMS" ? (
                            <MessageSquare className="w-3 h-3" />
                          ) : item.type === "WHATSAPP" ? (
                            <Zap className="w-3 h-3" />
                          ) : (
                            <Mail className="w-3 h-3" />
                          )}
                          {item.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-ink max-w-[200px] truncate">
                        {item.message}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium ${
                            item.status === "SENT"
                              ? "bg-emerald-50 text-emerald-700"
                              : item.status === "FAILED"
                              ? "bg-red-50 text-red-700"
                              : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          {item.status === "SENT" ? (
                            <CheckCircle2 className="w-3 h-3" />
                          ) : item.status === "FAILED" ? (
                            <AlertCircle className="w-3 h-3" />
                          ) : (
                            <ExternalLink className="w-3 h-3" />
                          )}
                          {item.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted whitespace-nowrap">
                        {new Date(item.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="sm:hidden divide-y divide-divider">
              {history.map((item) => (
                <div key={item.id} className="px-4 py-3">
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium ${
                        item.type === "SMS"
                          ? "bg-blue-50 text-blue-700"
                          : item.type === "WHATSAPP"
                          ? "bg-green-50 text-green-700"
                          : "bg-purple-50 text-purple-700"
                      }`}
                    >
                      {item.type === "SMS" ? (
                        <MessageSquare className="w-3 h-3" />
                      ) : item.type === "WHATSAPP" ? (
                        <Zap className="w-3 h-3" />
                      ) : (
                        <Mail className="w-3 h-3" />
                      )}
                      {item.type}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium ${
                        item.status === "SENT"
                          ? "bg-emerald-50 text-emerald-700"
                          : item.status === "FAILED"
                          ? "bg-red-50 text-red-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                  <p className="text-[12px] text-ink line-clamp-2">{item.message}</p>
                  <p className="text-[10px] text-muted mt-1">
                    {new Date(item.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
