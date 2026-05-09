"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import {
  LayoutDashboard,
  Bookmark,
  FileText,
  User,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Saved Jobs", href: "/dashboard/saved-jobs", icon: Bookmark },
  { label: "Applications", href: "/dashboard/applications", icon: FileText },
  { label: "Profile", href: "/dashboard/profile", icon: User },
  { label: "Alerts", href: "/dashboard/alerts", icon: Bell },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login?callbackUrl=" + encodeURIComponent(pathname));
    }
  }, [status, pathname, router]);

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  const initials = session?.user?.name
    ? session.user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-[13px] text-muted">Loading...</div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-screen bg-surface">
      {/* Mobile header */}
      <div className="lg:hidden sticky top-0 z-30 bg-white border-b border-divider px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 -ml-1.5 text-ink hover:bg-ink/[0.04] rounded-lg transition-colors"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-heading font-bold text-sm tracking-tight">
            JOB<span className="text-accent">READY</span>
          </span>
        </div>
        <Link href="/" className="text-[12px] text-accent hover:text-accent-dark font-medium transition-colors">
          View Jobs
        </Link>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-[272px] max-w-[80vw] bg-white shadow-2xl flex flex-col animate-in slide-in-from-left duration-300">
            {/* Sidebar header */}
            <div className="flex items-center justify-between px-4 pt-5 pb-4 border-b border-divider">
              <Link href="/" className="font-heading font-bold text-base tracking-tight" onClick={() => setSidebarOpen(false)}>
                JOB<span className="text-accent">READY</span>
              </Link>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1 -mr-1 text-ink hover:bg-ink/[0.04] rounded-lg transition-colors"
                aria-label="Close sidebar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* User info */}
            <div className="px-4 py-4 border-b border-divider">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-ink/[0.06] flex items-center justify-center text-[12px] font-semibold text-ink shrink-0">
                  {initials}
                </div>
                <div className="min-w-0">
                  <p className="text-[13px] font-medium text-ink truncate">
                    {session.user?.name || "User"}
                  </p>
                  <p className="text-[11px] text-muted truncate">
                    {session.user?.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Nav items */}
            <nav className="flex-1 overflow-y-auto px-2 py-3">
              <div className="space-y-0.5">
                {NAV_ITEMS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-colors ${
                      isActive(item.href)
                        ? "bg-ink/[0.06] text-ink"
                        : "text-muted hover:text-ink hover:bg-ink/[0.03]"
                    }`}
                  >
                    <item.icon className="w-4 h-4 shrink-0" />
                    {item.label}
                    {isActive(item.href) && (
                      <ChevronRight className="w-3.5 h-3.5 ml-auto text-muted" />
                    )}
                  </Link>
                ))}
              </div>
            </nav>

            {/* Footer */}
            <div className="px-2 py-3 border-t border-divider">
              <button
                onClick={() => {
                  setSidebarOpen(false);
                  handleSignOut();
                }}
                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-[13px] font-medium text-red-500 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4 shrink-0" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex">
        {/* Desktop sidebar */}
        <aside className="hidden lg:flex flex-col w-60 shrink-0 bg-white border-r border-divider min-h-screen sticky top-0">
          {/* Logo */}
          <div className="px-5 pt-5 pb-4 border-b border-divider">
            <Link href="/" className="font-heading font-bold text-base tracking-tight">
              JOB<span className="text-accent">READY</span>
            </Link>
          </div>

          {/* User info */}
          <div className="px-4 py-4 border-b border-divider">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-ink/[0.06] flex items-center justify-center text-[12px] font-semibold text-ink shrink-0">
                {initials}
              </div>
              <div className="min-w-0">
                <p className="text-[13px] font-medium text-ink truncate">
                  {session.user?.name || "User"}
                </p>
                <p className="text-[11px] text-muted truncate">
                  {session.user?.email}
                </p>
              </div>
            </div>
          </div>

          {/* Nav items */}
          <nav className="flex-1 px-2 py-3">
            <div className="space-y-0.5">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-colors ${
                    isActive(item.href)
                      ? "bg-ink/[0.06] text-ink"
                      : "text-muted hover:text-ink hover:bg-ink/[0.03]"
                  }`}
                >
                  <item.icon className="w-4 h-4 shrink-0" />
                  {item.label}
                  {isActive(item.href) && (
                    <ChevronRight className="w-3.5 h-3.5 ml-auto text-muted" />
                  )}
                </Link>
              ))}
            </div>
          </nav>

          {/* Footer */}
          <div className="px-2 py-3 border-t border-divider">
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-[13px] font-medium text-red-500 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              Sign Out
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0">
          <div className="max-w-4xl mx-auto px-5 py-6 lg:px-8 lg:py-8">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile bottom nav */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-divider">
        <div className="flex items-center justify-around py-2 px-1">
          {NAV_ITEMS.slice(0, 5).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg text-[10px] font-medium transition-colors min-w-0 ${
                isActive(item.href) ? "text-accent" : "text-muted"
              }`}
            >
              <item.icon className="w-4 h-4" />
              <span className="truncate max-w-[56px]">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
