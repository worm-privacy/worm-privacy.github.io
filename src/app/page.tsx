'use client';

import { ScrollerMotion } from 'scroller-motion';

import {
  HeroSection,
  HowItWorks,
  NetworkStats,
  RoadmapSection,
  SloganSection,
  TeamSection, WormVSBethSection
} from '@/components/landing';
import { Footer } from '@/components/landing/footer';

export default function Home() {
  return (
    <>
      <ScrollerMotion className="w-full!">
        <main className="flex size-full flex-col items-center justify-center gap-2.5 md:pt-22 lg:px-40">
          <HeroSection />
          <SloganSection />
          <HowItWorks />
          <WormVSBethSection />
          <NetworkStats />
          {/* <TokenomicsSection /> */}
          <RoadmapSection />
          <TeamSection />
        </main>
        <Footer />
      </ScrollerMotion>
    </>
  );
}
