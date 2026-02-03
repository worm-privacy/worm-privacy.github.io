'use client';

import { Footer } from '@/components/landing';
import TabBar from '@/components/tools/tabbar';
import TopBar from '@/components/tools/topbar';
import { SmoothScroll } from '@/components/ui/smoth-scroll';

export default function BuySellWorm() {
  return (
    <SmoothScroll>
      <div className="flex h-svh grow flex-col">
        <TopBar />
        <TabBar />
        <main className="flex size-full flex-col items-center justify-center gap-2.5 md:pt-22 lg:px-40">
          <div className="text-[30px] text-white">Coming Soon...</div>
        </main>
        <div className="min-h-[105px] grow" />
        <Footer />
      </div>
    </SmoothScroll>
  );
}
