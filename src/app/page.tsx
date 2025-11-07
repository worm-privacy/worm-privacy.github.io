import { NetworkStats, RoadmapSection, SloganSection, TokenomicsSection } from '@/components/landing';
import { Footer } from '@/components/landing/footer';
import { HowItWorks } from '@/components/landing/how-it-works';

export default function Home() {
  return (
    <>
      <main>
        {/* <HeroSection /> */}
        <SloganSection />
        <HowItWorks />
        {/* <WormVSBethSection /> */}
        <NetworkStats />
        <TokenomicsSection />
        <RoadmapSection />
      </main>
      <Footer />
    </>
  );
}
