import type { Metadata } from "next";
import Link from "next/link";
import { Briefcase, ShieldCheck, Users, TrendingUp, Globe, Award } from "lucide-react";
import { BreadcrumbJsonLd } from "@/components/jobready/JsonLd";

export const metadata: Metadata = {
  title: "About JobReady — Kenya's Most Trusted Job Board",
  description:
    "Learn about JobReady, Kenya's fastest-growing job board connecting verified employers with talented job seekers across all 47 counties. Our mission, values and team.",
  alternates: { canonical: "https://jobreadyke.co.ke/about" },
  openGraph: {
    title: "About JobReady",
    description: "Kenya's most trusted job board connecting verified employers with talented job seekers.",
    url: "https://jobreadyke.co.ke/about",
    siteName: "JobReady",
    type: "website",
    images: [{ url: "https://jobreadyke.co.ke/opengraph-image.png", width: 1200, height: 630, alt: "JobReady" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "About JobReady",
    description: "Kenya's most trusted job board connecting verified employers with talented job seekers.",
    images: ["https://jobreadyke.co.ke/opengraph-image.png"],
  },
};

const VALUES = [
  {
    icon: ShieldCheck,
    title: "Verified Employers",
    description: "Every employer on JobReady is verified. We manually review companies to ensure job seekers interact with legitimate organizations. No scams, no fake listings.",
  },
  {
    icon: Globe,
    title: "All 47 Counties",
    description: "From Nairobi to Mombasa, Kisumu to Garissa, JobReady covers job opportunities across all 47 counties in Kenya. Find jobs near you or explore opportunities nationwide.",
  },
  {
    icon: TrendingUp,
    title: "Daily Updates",
    description: "New job listings are posted daily from government bodies, private companies, NGOs, and international organizations operating in Kenya. Never miss an opportunity.",
  },
  {
    icon: Users,
    title: "Free for Job Seekers",
    description: "JobReady is completely free for job seekers. Browse, search, and apply for jobs without any charges. We never ask job seekers to pay for job applications.",
  },
  {
    icon: Briefcase,
    title: "All Job Types",
    description: "Full-time, part-time, internships, casual jobs, government positions, scholarships, fellowships, and more. Whatever your career stage, JobReady has something for you.",
  },
  {
    icon: Award,
    title: "Quality Over Quantity",
    description: "We prioritize listing quality over quantity. Each job is checked for completeness and legitimacy before it appears on the platform, ensuring a trustworthy experience.",
  },
];

export default function About_Page() {
  return (
    <main className="bg-surface">
      <BreadcrumbJsonLd items={[
        { name: "Home", url: "https://jobreadyke.co.ke/" },
        { name: "About", url: "https://jobreadyke.co.ke/about" },
      ]} />
      <div className="max-w-3xl mx-auto px-5 py-16 md:py-20">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1.5 text-[12px] text-muted mb-8">
          <Link href="/" className="hover:text-ink transition-colors">Home</Link>
          <span className="text-divider">/</span>
          <span className="text-ink font-medium">About</span>
        </nav>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-heading font-black text-ink mb-4">
            About JobReady
          </h1>
          <p className="text-[15px] text-muted leading-relaxed">
            JobReady is Kenya&apos;s fastest-growing job board, connecting verified employers
            with talented job seekers across all 47 counties. Our mission is to make
            finding and applying for jobs in Kenya simple, transparent, and scam-free.
          </p>
        </div>

        {/* Mission */}
        <div className="mb-12">
          <h2 className="text-lg font-heading font-bold text-ink mb-3">Our Mission</h2>
          <p className="text-[14px] text-ink/80 leading-relaxed mb-4">
            Kenya&apos;s job market is vibrant but fragmented. Job seekers often navigate
            multiple platforms, encounter fake listings, and face opaque application
            processes. Employers struggle to reach qualified candidates efficiently.
            JobReady was built to solve these problems by creating a single, trusted
            platform where real jobs from verified employers meet qualified Kenyan talent.
          </p>
          <p className="text-[14px] text-ink/80 leading-relaxed">
            We aggregate listings from government bodies (national, county, and state
            corporations), private sector companies, NGOs, and international organizations
            operating in Kenya. Every listing is reviewed for legitimacy before it goes
            live on our platform, ensuring a safe and productive experience for all users.
          </p>
        </div>

        {/* What We Offer */}
        <div className="mb-12">
          <h2 className="text-lg font-heading font-bold text-ink mb-3">What We Offer</h2>
          <ul className="space-y-3 text-[14px] text-ink/80 leading-relaxed">
            <li className="flex items-start gap-3">
              <span className="text-accent font-bold mt-0.5">1.</span>
              <span><strong className="text-ink">Government Jobs:</strong> National, county, and state corporation positions sourced from the Kenya Gazette and official portals including TSC, PSC, and KRA.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-accent font-bold mt-0.5">2.</span>
              <span><strong className="text-ink">Private Sector:</strong> Full-time, part-time, and contract positions from verified companies across all industries including tech, finance, healthcare, and manufacturing.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-accent font-bold mt-0.5">3.</span>
              <span><strong className="text-ink">Opportunities:</strong> Scholarships, internships, fellowships, grants, bursaries, and training programs from top organizations and institutions.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-accent font-bold mt-0.5">4.</span>
              <span><strong className="text-ink">Casual Jobs:</strong> Daily-wage, weekend, and flexible casual work for job seekers who need immediate or short-term employment opportunities.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-accent font-bold mt-0.5">5.</span>
              <span><strong className="text-ink">Career Resources:</strong> Expert articles on CV writing, interview preparation, salary negotiation, and career development tailored for the Kenyan job market.</span>
            </li>
          </ul>
        </div>

        {/* Values Grid */}
        <div className="mb-12">
          <h2 className="text-lg font-heading font-bold text-ink mb-6">Our Values</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {VALUES.map((value) => (
              <div key={value.title} className="rounded-xl border border-divider p-5">
                <value.icon className="w-6 h-6 text-accent mb-3" />
                <h3 className="text-[14px] font-semibold text-ink mb-1.5">{value.title}</h3>
                <p className="text-[13px] text-muted leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="mb-12">
          <h2 className="text-lg font-heading font-bold text-ink mb-6">JobReady by the Numbers</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Counties Covered", value: "47" },
              { label: "Verified Employers", value: "800+" },
              { label: "Job Categories", value: "50+" },
              { label: "Daily Listings", value: "100+" },
            ].map((stat) => (
              <div key={stat.label} className="text-center rounded-xl border border-divider p-4">
                <p className="text-2xl font-heading font-black text-ink">{stat.value}</p>
                <p className="text-[11px] text-muted uppercase tracking-wider mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="rounded-xl border border-accent/20 bg-accent-bg/30 p-6 text-center">
          <h2 className="text-lg font-heading font-bold text-ink mb-2">Ready to Find Your Next Job?</h2>
          <p className="text-[14px] text-muted mb-4">
            Browse thousands of verified job listings across Kenya. Your next opportunity is just a search away.
          </p>
          <Link
            href="/jobs"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-ink text-white text-[14px] font-medium hover:bg-ink/90 transition-colors"
          >
            Browse Jobs
          </Link>
        </div>
      </div>
    </main>
  );
}
