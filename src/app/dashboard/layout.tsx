import type { Metadata } from "next";
import DashboardShell from "./DashboardShell";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your JobSeeker dashboard",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardShell>{children}</DashboardShell>;
}
