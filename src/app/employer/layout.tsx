import type { Metadata } from "next";
import EmployerShell from "./EmployerShell";

export const metadata: Metadata = {
  title: "Employer Dashboard — JobReady",
  description: "Manage your job postings and applications on JobReady",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function EmployerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <EmployerShell>{children}</EmployerShell>;
}
