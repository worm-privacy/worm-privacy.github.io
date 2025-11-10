import { NetworkStats, TeamSection, RoadmapSection, WormVSBethSection, HowItWorks, TokenomicsSection, HeroSection, SloganSection } from '@/components/landing';
import { Footer } from '@/components/landing/footer';

export default function Home() {
  return (
    <>
      <main>
        <HeroSection />
        <SloganSection />
        <HowItWorks />
        <WormVSBethSection />
        <NetworkStats />
        <TokenomicsSection />
        <RoadmapSection />
        <TeamSection />
      </main>
      <Footer />
    </>
  );
}
