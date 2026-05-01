import { JobModalProvider } from '@/components/fursa/JobModalContext';
import JobDetailSheet from '@/components/fursa/JobDetailSheet';
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

export default function Home() {
  return (
    <JobModalProvider>
      <Navbar />
      <main>
        <Hero />
        <TrustedBy />
        <JobUpdates />
        <ClosingSoon />
        <Featured />
        <TrendingMarquee />
        <Categories />
        <OpportunitiesHub />
        <OpportunitiesTabs />
        <ByLocation />
        <Government />
        <CVBanner variant="light" />
        <CasualJobs />
        <CareerResources />
        <CVBanner variant="dark" />
        <Newsletter />
      </main>
      <Footer />
      <StickyNewsletter />
      <JobDetailSheet />
    </JobModalProvider>
  );
}
