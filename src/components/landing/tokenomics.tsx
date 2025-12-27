'use client';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog/dialog';
import { useIsMobile } from '@/hooks';
import { cn } from '@/lib';
import { Button, PieChart, ScrollArea } from '@/ui';
import { Icons } from '../ui/icons';
import { TOKENOMICS } from './constant';
import { TokenomicsContent } from './type';

export function TokenomicsSection() {
  const isMobile = useIsMobile();
  return (
    <section className="container mx-auto flex max-w-185 flex-col gap-10 px-4 py-12 md:px-0 md:pt-0 md:pb-32">
      <h2
        className={cn('orbitron-h2 text-green-400', {
          'orbitron-h3': isMobile,
        })}
      >
        Tokenomics
      </h2>

      <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-[18.125rem_1fr]">
        <div className="self-center">
          <PieChart />
        </div>
        <div className="flex w-full flex-col gap-6">
          <div className="relative flex size-full h-25 w-full flex-col gap-2 pl-4 md:min-h-32.5 md:pl-14">
            <p
              className={cn(
                'orbitron-h4 absolute top-1/2 left-1 size-max origin-center -translate-x-1/2 -translate-y-1/2 -rotate-90 transform text-green-300 md:left-3',
                {
                  'orbitron-body2': isMobile,
                }
              )}
            >
              {TOKENOMICS[0].title}
            </p>
            {TOKENOMICS[0].stats.map((s) => (
              <TokenomicsDialog key={s.label} {...s} color="green" />
            ))}
          </div>

          <div className="relative flex size-full w-full flex-col gap-2 pl-4 md:pl-14 [&>button]:h-max!">
            <p
              className={cn(
                'orbitron-h4 absolute top-1/2 left-1 size-max origin-center -translate-x-1/2 -translate-y-1/2 -rotate-90 transform text-blue-300 md:left-3',
                {
                  'orbitron-body2': isMobile,
                }
              )}
            >
              {TOKENOMICS[1].title}
            </p>
            {TOKENOMICS[1].stats.map((s) => (
              <TokenomicsDialog key={s.label} {...s} color="blue" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TokenomicsDialog({ label, share, color }: TokenomicsContent['stats'][number] & { color: 'green' | 'blue' }) {
  return (
    <Dialog>
      <div className="relative size-full pl-7 md:pl-0">
        <span
          className={cn('absolute top-0 bottom-0 left-0 h-full w-5.75 rounded-sm md:-left-7.25', {
            'bg-blue-400': color === 'blue',
            'bg-green-400': color === 'green',
          })}
        />
        {/* <DialogTrigger asChild> */}
        <Button
          variant="ghost"
          hoverScale={1}
          tapScale={1}
          className="satoshi-body1 relative ml-auto h-full w-full items-center justify-baseline gap-4 bg-gray-400/12 px-4 py-3 pl-6 text-left whitespace-break-spaces text-white md:pl-5.25"
        >
          <span className={`orbitron-body2 text-${color}-300 min-w-[4ch]`}>{`${share}`}</span>
          {label}
        </Button>
        {/* </DialogTrigger> */}
      </div>
      <DialogContent className="max-w-150">
        <DialogClose asChild>
          <Button variant="ghost" className="absolute top-6 right-8 z-10 w-max">
            <Icons.close />
          </Button>
        </DialogClose>
        <DialogHeader>
          <DialogTitle>20% of Premine</DialogTitle>
          <DialogDescription>Team/ Founders</DialogDescription>
        </DialogHeader>
        <div className="satoshi-body2 max-h-61.5 px-8 pt-2 pb-6 text-white">
          <ScrollArea className="h-full">
            <div className="grid grid-cols-2 gap-6 pb-4">
              <p>
                Vesting: <span className="orbitron-body2">16</span> <span className="text-gray-400">Month</span>
              </p>
              <p>
                Cliff time: <span className="orbitron-body2">6</span>
                <span className="text-gray-400"> Month</span>
              </p>
            </div>
            <p>
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
              industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and
              scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into
              electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release
              of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software
              like Aldus PageMaker including versions of Lorem Ipsum.
            </p>
            <p>
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
              industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and
              scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into
              electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release
              of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software
              like Aldus PageMaker including versions of Lorem Ipsum.
            </p>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
