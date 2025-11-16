'use client';

import { useIsMobile } from '@/hooks';
import { cn } from '@/lib';
import { ExpandableCard } from '@/ui';
import { HOW_IT_WORKS } from './constant';

export function HowItWorks() {
  const isMobile = useIsMobile();

  return (
    <section className="container mx-auto flex max-w-185 flex-col gap-6 py-12 md:pb-32">
      <h2
        className={cn('orbitron-h2 px-4 text-green-400', {
          'orbitron-h3': isMobile,
        })}
      >
        How It Works
      </h2>
      <p className="satoshi-h3 px-4 text-gray-400">
        “Zero-knowledge proofs ensure unlinkability”, “Hard emission caps”
      </p>

      <ExpandableCard className="" contents={HOW_IT_WORKS} />
    </section>
  );
}
