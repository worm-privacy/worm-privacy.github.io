'use client';

import { useIsMobile } from '@/hooks';
import { cn } from '@/lib';
import { Button, ExpandableCard } from '@/ui';

export function HowItWorks() {
  const contents = [
    {
      order: 1,
      title: 'ETH burns',
      description: 'ETH is sent to normal looking addresses, no one can claim you were using WORM!',
      color: 'blue',
    },

    {
      order: 2,
      title: 'Get BETH',
      description: 'You prove your burn through zkSNARKs, the protocol gives you BETH in exchange!',
      color: 'magenta',
    },
    {
      order: 3,
      title: 'Mint WORM',
      description: 'Consume your BETH across WORM epochs, and earn WORM!',
      color: 'green',
      action: <Button>Get Now!</Button>,
    },
  ];

  const isMobile = useIsMobile();

  return (
    <section className="container mx-auto flex max-w-184 flex-col gap-6 py-12 md:pb-32">
      <h1
        className={cn('orbitron-h2 px-4 text-green-400', {
          'orbitron-h3': isMobile,
        })}
      >
        How It Works
      </h1>
      <p className="satoshi-h3 px-4 text-gray-400">
        “Zero-knowledge proofs ensure unlinkability”, “Hard emission caps”
      </p>

      <ExpandableCard className="" contents={contents} />
    </section>
  );
}
