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
    },
    twitter: {
      card: "summary_large_image",
      title: "JobReady — Jobs for Kenyans",
      description:
        "Kenya's most trusted job board. Real jobs from verified employers.",
    },
  };
}

export default async function Home() {
  // Fetch all homepage data in parallel
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
    getFeaturedJobs(),
    getJustPosted(),
    getClosingSoon(),
    getGovernmentJobs(),
    getCasualJobs(),
    getOpportunities(),
    getCategories(),
    getCounties(),
  ]);

  return (
    <>
      <Hero jobs={justPosted} />
      <TrustedBy />
      <JobUpdates />
      <ClosingSoon jobs={closingSoonJobs} />
      <Featured jobs={featuredJobs} />
      <TrendingMarquee />
      <Categories categories={categories} />
      <OpportunitiesHub opportunities={opportunities} />
      <OpportunitiesTabs opportunities={opportunities} />
      <ByLocation counties={counties} />
      <Government nationalJobs={governmentJobs.national} countyJobs={governmentJobs.county} />
      <CVBanner variant="light" />
      <CasualJobs jobs={casualJobs} />
      <CareerResources />
      <CVBanner variant="dark" />
      <Newsletter />
      <StickyNewsletter />
    </>
  );
}
