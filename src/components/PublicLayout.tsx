"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/jobready/Navbar";
import Footer from "@/components/jobready/Footer";

/**
 * Conditionally renders the public-site Navbar and Footer.
 * On /dashboard/* routes, these are hidden because the
 * DashboardShell component provides its own navigation.
 */
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard");
  const isAuth = pathname.startsWith("/auth");

  if (isDashboard || isAuth) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen">{children}</div>
      <Footer />
    </>
  );
}
