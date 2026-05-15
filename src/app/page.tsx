import Hero from '@/components/jobready/Hero';
import TrustedBy from '@/components/jobready/TrustedBy';
import JobUpdates from '@/components/jobready/JobUpdates';
import ClosingSoon from '@/components/jobready/ClosingSoon';
import Featured from '@/components/jobready/Featured';
import TrendingMarquee from '@/components/jobready/TrendingMarquee';
import Categories from '@/components/jobready/Categories';
import OpportunitiesHub from '@/components/jobready/OpportunitiesHub';
import OpportunitiesTabs from '@/components/jobready/OpportunitiesTabs';
import ByLocation from '@/components/jobready/ByLocation';
import Government from '@/components/jobready/Government';
import CVBanner from '@/components/jobready/CVBanner';
import CasualJobs from '@/components/jobready/CasualJobs';
import CareerResources from '@/components/jobready/CareerResources';
import Newsletter from '@/components/jobready/Newsletter';
import StickyNewsletter from '@/components/jobready/StickyNewsletter';
import AdSlot from '@/components/jobready/AdSlot';
import { WebSiteJsonLd, BreadcrumbJsonLd, FAQJsonLd } from '@/components/jobready/JsonLd';
import type { Job } from '@/types';
import type { Category, County, JobUpdate } from '@prisma/client';
import type { Metadata } from 'next';
import { SITE_URL } from "@/lib/config";
import prisma from "@/lib/prisma";

function relativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / (1000 * 60));
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);
  if (diffMin < 60) return "Just now";
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return `${Math.floor(diffDay / 7)}w ago`;
}
import {
  getFeaturedJobs,
  getJustPosted,
  getClosingSoon,
  getGovernmentJobs,
  getCasualJobs,
  getOpportunities,
  getCategories,
  getCounties,
} from '@/lib/data';

export const revalidate = 300; // ISR: revalidate every 5 minutes

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "JobReady — Jobs for Kenyans — Real Jobs from Verified Employers",
    description:
      "Kenya's most trusted job board. Browse verified jobs across Nairobi, Mombasa, Kisumu & all 47 counties. Government, private sector & internships.",
    alternates: { canonical: `${SITE_URL}/` },
    openGraph: {
      title: "JobReady — Jobs for Kenyans",
      description:
        "Kenya's most trusted job board. Real jobs from verified employers.",
      url: `${SITE_URL}/`,
      siteName: "JobReady",
      type: "website",
      images: [{ url: `${SITE_URL}/opengraph-image.png`, width: 1200, height: 630, alt: "JobReady — Jobs for Kenyans" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "JobReady — Jobs for Kenyans",
      description:
        "Kenya's most trusted job board. Real jobs from verified employers.",
      images: [`${SITE_URL}/opengraph-image.png`],
    },
  };
}

export default async function Home() {
  // Fetch all homepage data in parallel — wrapped with error fallbacks
  // so a single DB connection failure doesn't crash the whole page
  const [
    featuredJobs,
    justPosted,
    closingSoonJobs,
    governmentJobs,
    casualJobs,
    opportunities,
    categories,
    counties,
    recentUpdates,
  ] = await Promise.all([
    getFeaturedJobs().catch(() => [] as Job[]),
    getJustPosted().catch(() => [] as Job[]),
    getClosingSoon().catch(() => [] as Job[]),
    getGovernmentJobs().catch(() => ({ national: [] as Job[], county: [] as Job[] })),
    getCasualJobs().catch(() => [] as Job[]),
    getOpportunities().catch(() => ({
      internships: [] as Job[],
      scholarships: [] as Job[],
      entryLevel: [] as Job[],
      internshipCount: 0,
      scholarshipCount: 0,
      entryLevelCount: 0,
    })),
    getCategories().catch(() => [] as (Category & { _count: { listings: number } })[]),
    getCounties().catch(() => [] as (County & { _count: { listings: number } })[]),
    prisma.jobUpdate.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { createdAt: "desc" },
      take: 5,
    }).catch(() => [] as JobUpdate[]),
  ]);

  // Map prisma JobUpdate objects to the shape expected by JobUpdates component
  const updates = recentUpdates.map((u) => ({
    id: u.id,
    slug: u.slug,
    title: u.title,
    body: u.body,
    source: u.source,
    updateType: u.updateType,
    pdfUrl: u.pdfUrl,
    imageUrl: u.imageUrl,
    listingSlug: u.listingSlug,
    postedBy: u.postedBy,
    date: relativeTime(u.createdAt),
    createdAt: u.createdAt.toISOString(),
  }));

  return (
    <main>
      <WebSiteJsonLd />
      <BreadcrumbJsonLd items={[{ name: 'Home', url: `${SITE_URL}/` }]} />
      <Hero jobs={justPosted} />
      <div className="max-w-4xl mx-auto px-5 mt-6">
        <AdSlot format="auto" style={{ display: 'block', minHeight: '90px' }} />
      </div>
      <TrustedBy />
      <JobUpdates initialUpdates={updates} />
      <ClosingSoon jobs={closingSoonJobs} />
      <Featured jobs={featuredJobs} />
      <TrendingMarquee />
      <Categories categories={categories} />
      {/* Ad slot between sections */}
      <div className="max-w-4xl mx-auto px-5">
        <AdSlot format="auto" style={{ display: 'block', minHeight: '90px' }} />
      </div>
      <OpportunitiesHub opportunities={opportunities} />
      <OpportunitiesTabs opportunities={opportunities} />
      <ByLocation counties={counties} />
      <Government nationalJobs={governmentJobs.national} countyJobs={governmentJobs.county} />
      <CVBanner variant="light" />
      <CasualJobs jobs={casualJobs} />
      {/* Ad slot before resources */}
      <div className="max-w-4xl mx-auto px-5">
        <AdSlot format="auto" style={{ display: 'block', minHeight: '90px' }} />
      </div>
      <CareerResources />
      <CVBanner variant="dark" />
      <Newsletter />
      <StickyNewsletter />
      {/* Footer ad slot */}
      <div className="max-w-4xl mx-auto px-5 pb-8">
        <AdSlot format="auto" style={{ display: 'block', minHeight: '90px' }} />
      </div>
      <FAQJsonLd faqs={[
        {
          question: "How do I find a job on JobReady?",
          answer: "Browse thousands of verified job listings on JobReady by category, location, or keyword. Use the search bar to find specific roles, filter by employment type (full-time, part-time, internship), and apply directly through employer links."
        },
        {
          question: "Is JobReady free for job seekers?",
          answer: "Yes, JobReady is completely free for job seekers. You can browse, search, and apply for jobs without any charges. We never ask job seekers to pay for job applications."
        },
        {
          question: "What types of jobs are listed on JobReady?",
          answer: "JobReady lists government jobs, private sector positions, casual and part-time work, internships, scholarships, fellowships, grants, and entry-level roles. Jobs are available across all 47 counties in Kenya including Nairobi, Mombasa, Kisumu, and Nakuru."
        },
        {
          question: "How often are new jobs posted on JobReady?",
          answer: "New jobs are posted daily on JobReady from verified employers across Kenya. We aggregate listings from government bodies, private companies, NGOs, and international organizations operating in Kenya."
        },
      ]} />
    </main>
  );
}
