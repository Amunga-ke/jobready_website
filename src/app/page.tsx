import Navbar from '@/components/fursa/Navbar';
import Hero from '@/components/fursa/Hero';
import TrustedBy from '@/components/fursa/TrustedBy';
import JobUpdates from '@/components/fursa/JobUpdates';
import ClosingSoon from '@/components/fursa/ClosingSoon';
import Featured from '@/components/fursa/Featured';
import TrendingMarquee from '@/components/fursa/TrendingMarquee';
import Categories from '@/components/fursa/Categories';
import OpportunitiesHub from '@/components/fursa/OpportunitiesHub';
import OpportunitiesTabs from '@/components/fursa/OpportunitiesTabs';
import ByLocation from '@/components/fursa/ByLocation';
import Government from '@/components/fursa/Government';
import CVBanner from '@/components/fursa/CVBanner';
import CasualJobs from '@/components/fursa/CasualJobs';
import CareerResources from '@/components/fursa/CareerResources';
import Newsletter from '@/components/fursa/Newsletter';
import Footer from '@/components/fursa/Footer';
import StickyNewsletter from '@/components/fursa/StickyNewsletter';
import type { Job } from '@/types';
import type { Category, County } from '@prisma/client';
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
      <Navbar />
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
      <Footer />
      <StickyNewsletter />
    </>
  );
}
