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
import { ScrollArea } from '@/components/ui';

export default function Home() {
  return (
    // <ScrollerMotion className="w-full!" spring={{ mass: 1.1, stiffness: 500, damping: 50 }}>
    <ScrollArea className="h-screen w-screen max-w-full">
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
    </ScrollArea>
    // </ScrollerMotion>
  );
}
