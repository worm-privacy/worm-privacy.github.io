'use client';

import {
  HeroSection,
  HowItWorks,
  NetworkStats,
  RoadmapSection,
  SloganSection,
  TeamSection,
  WormVSBethSection,
} from '@/components/landing';
import { Footer } from '@/components/landing/footer';
import { Preloader } from '@/components/ui';
import { SmoothScroll } from '@/components/ui/smoth-scroll';
import { useState } from 'react';

export default function Home() {
  const [loaded, setLoaded] = useState(false);

  return !loaded ? (
    <Preloader setLoaded={setLoaded} />
  ) : (
    <SmoothScroll>
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
    </SmoothScroll>
  );
}
