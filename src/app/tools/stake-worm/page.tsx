'use client';

import { Footer } from '@/components/landing';
import { SmoothScroll } from '@/components/ui/smoth-scroll';

export default function StakeWorm() {
  return  (
    <SmoothScroll>
      <main className="flex size-full flex-col items-center justify-center gap-2.5 md:pt-22 lg:px-40">
        "Stake Worm"
      </main>
      <Footer />
    </SmoothScroll>
  );
}
