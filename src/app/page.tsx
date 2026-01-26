'use client';

import {
  Footer,
  HeroSection,
  HowItWorks,
  RoadmapSection,
  SloganSection,
  TeamSection,
  TokenomicsSection,
  WormVSBethSection,
} from '@/components/landing';
import { Preloader } from '@/components/ui';
import { SmoothScroll } from '@/components/ui/smoth-scroll';
import { useEffect, useState } from 'react';

export default function Home() {
  const [loaded, setLoaded] = useState(false);

  function onContentLoaded() {
    setLoaded(true);
  }

  useEffect(() => {
    window.addEventListener('DOMContentLoaded', onContentLoaded);

    return () => {
      window.removeEventListener('DOMContentLoaded', onContentLoaded);
    };
  }, []);

  return !loaded ? (
    <Preloader setLoaded={setLoaded} />
  ) : (
    <SmoothScroll>
      <main className="flex size-full flex-col items-center justify-center gap-2.5 md:pt-22 lg:px-40">
        <HeroSection />
        <SloganSection />
        <HowItWorks />
        <WormVSBethSection />
        {/* <NetworkStats /> */}
        <TokenomicsSection />
        <RoadmapSection />
        <TeamSection />
      </main>
      <Footer />
    </SmoothScroll>
  );
}
