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
        <div
          className={cn(
            'orbitron-h5 relative flex h-45.5 flex-col items-center justify-center rounded-base text-gray-400',
            'before:absolute before:top-0 before:right-0 before:size-5 before:rounded-tr-base before:border-t-2 before:border-r-2 before:border-blue-500 before:content-[""]',
            'after:absolute after:bottom-0 after:left-0 after:size-5 after:rounded-bl-base after:border-b-2 after:border-l-2 after:border-blue-500 after:content-[""]',
            {
              'orbitron-body2': isMobile,
            }
          )}
        >
          <span>Private</span>
          <h3
            className={cn('orbitron-h3 text-green-400', {
              'orbitron-h5': isMobile,
            })}
            style={{
              textShadow:
                '0 0 0px rgba(150,250,209,0.5), 0 0 5px rgba(150,250,209,0.5), 0 0 10px rgba(150,250,209,0.5)',
            }}
          >
            Proof of Burn
          </h3>
          <span>mining</span>
        </div>
        <div
          className={cn(
            'orbitron-h5 relative flex h-45.5 flex-col items-center justify-center text-gray-400',
            'before:absolute before:top-0 before:right-0 before:size-5 before:rounded-tr-base before:border-t-2 before:border-r-2 before:border-blue-500 before:content-[""]',
            'after:absolute after:bottom-0 after:left-0 after:size-5 after:rounded-bl-base after:border-b-2 after:border-l-2 after:border-blue-500 after:content-[""]',
            {
              'orbitron-body2': isMobile,
            }
          )}
        >
          <span>Powered by</span>
          <h3
            className={cn('orbitron-h3 text-green-400', {
              'orbitron-h5': isMobile,
            })}
            style={{
              textShadow:
                '0 0 0px rgba(150,250,209,0.5), 0 0 5px rgba(150,250,209,0.5), 0 0 10px rgba(150,250,209,0.5)',
            }}
          >
            zkSNARKs
          </h3>
        </div>
      </div>
    </section>
  );
}
