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
import type { Category, County } from '@prisma/client';
import type { Metadata } from 'next';
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

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "JobReady — Jobs for Kenyans | Real Jobs from Verified Employers",
    description:
      "Kenya's most trusted job board. Browse thousands of jobs from verified employers across Nairobi, Mombasa, Kisumu and all 47 counties. Government, private sector, internships and more.",
    alternates: { canonical: "https://jobreadyke.co.ke/" },
    openGraph: {
      title: "JobReady — Jobs for Kenyans",
      description:
        "Kenya's most trusted job board. Real jobs from verified employers.",
      url: "https://jobreadyke.co.ke/",
      siteName: "JobReady",
      type: "website",
      images: [{ url: "https://jobreadyke.co.ke/opengraph-image.png", width: 1200, height: 630, alt: "JobReady — Jobs for Kenyans" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "JobReady — Jobs for Kenyans",
      description:
        "Kenya's most trusted job board. Real jobs from verified employers.",
      images: ["https://jobreadyke.co.ke/opengraph-image.png"],
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
    getCategories().catch(() => [] as Category[]),
    getCounties().catch(() => [] as County[]),
  ]);

  return (
    <main>
      <WebSiteJsonLd />
      <BreadcrumbJsonLd items={[{ name: 'Home', url: 'https://jobreadyke.co.ke/' }]} />
      <Hero jobs={justPosted} />
      <div className="max-w-4xl mx-auto px-5 mt-6">
        <AdSlot format="auto" style={{ display: 'block', minHeight: '90px' }} />
      </div>
      <TrustedBy />
      <JobUpdates />
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
