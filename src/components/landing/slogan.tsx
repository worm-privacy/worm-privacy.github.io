'use client';

import { useIsMobile } from '@/hooks';
import { cn } from '@/lib';

export function SloganSection() {
  const isMobile = useIsMobile();

  return (
    <section className="container mx-auto flex max-w-232.5 flex-col items-center justify-center gap-4 px-4 py-12 md:gap-6 md:pb-32">
      <div className="flex w-full items-center justify-center rounded-2xl border border-gray-400/24 py-12">
        <h1
          className={cn('orbitron-h2  flex flex-col items-center gap-1 text-blue-400 md:flex-row md:gap-0', {
            'orbitron-h4': isMobile,
          })}
        >
          <span>ETH dies,</span> <span className="text-green-400">WORM lives</span>
        </h1>
      </div>

      <div className="grid w-full grid-cols-2 gap-6">
        <div className="orbitron-h5 corner-only flex h-45.5 flex-col items-center justify-center rounded-base border-2 border-blue-500 text-gray-400">
          <span>Private</span>
          <h3 className="orbitron-h3 text-green-400">Proof of Burn</h3>
          <span>mining</span>
        </div>
        <div className="orbitron-h5 corner-only flex h-45.5 flex-col items-center justify-center rounded-base border-2 border-blue-500 text-gray-400">
          <span>Powered by</span>
          <h3 className="orbitron-h3 text-green-400">zkSNARKs</h3>
        </div>
      </div>
    </section>
  );
}
