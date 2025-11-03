import Svg from 'react-inlinesvg';

import { cn } from '@/lib';
import { Button, ScrollArea } from '@/ui';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog/dialog';

type Tokenomics = {
  title: string;
  stats: {
    share: number;
    label: string;
  }[];
};

const TOKENOMICS: Tokenomics[] = [
  {
    title: 'Mine-able',
    stats: [{ share: 1, label: 'Mine-able through Private-Proof-of-Burn mining' }],
  },
  {
    title: 'Premine',
    stats: [
      { label: 'Private investors', share: 0.15 },
      { label: 'Team / Founders', share: 0.2 },
      { label: 'Advisors', share: 0.05 },
      { label: 'Community / Ecosystem Rewards', share: 0.25 },
      { label: 'Foundation / Treasury', share: 0.2 },
      { label: 'Public Sale', share: 0.15 },
    ],
  },
];

export function TokenomicsSection() {
  return (
    <section className="container mx-auto flex max-w-184 flex-col gap-10 pb-32">
      <h1 className="orbitron-h2 text-green-400">Tokenomics</h1>

      <div className="grid w-full grid-cols-[18.125rem_1fr] gap-6">
        <div className="size-full bg-white"></div>
        <div className="flex w-full flex-col gap-6">
          <div className="relative flex size-full min-h-32.5 w-full flex-col gap-2 pl-8">
            <p
              className={cn(
                'orbitron-h4 absolute top-1/2 -left-3.5 size-max origin-center -translate-x-1/2 -translate-y-1/2 -rotate-90 transform text-green-300'
              )}
            >
              {TOKENOMICS[0].title}
            </p>
            {TOKENOMICS[0].stats.map((s) => (
              <TokenomicsDialog key={s.label} {...s} color="green" />
            ))}
          </div>

          <div className="relative flex size-full w-full flex-col gap-2 pl-8 [&>button]:h-max!">
            <p className="orbitron-h4 absolute top-1/2 -left-3.5 size-max origin-center -translate-x-1/2 -translate-y-1/2 -rotate-90 transform text-blue-300">
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

function TokenomicsDialog({ label, share, color }: Tokenomics['stats'][number] & { color: 'green' | 'blue' }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            'satoshi-body-1 relative ml-auto h-full w-full items-baseline justify-start gap-4 bg-gray-400/12 px-4 py-3 pl-5.25 text-left whitespace-break-spaces text-white',
            `after:absolute after:top-0 after:bottom-0 after:-left-7.25 after:h-full after:w-5.75 after:rounded-sm after:bg-${color}-400 after:content-[""]`
          )}
        >
          <span className={`text-${color}-300`}>{`${share * 100}%`}</span>
          {label}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-150">
        <DialogClose asChild>
          <Button variant="ghost" className="absolute top-6 right-8 z-10 w-max">
            <Svg src="/assets/icons/close.svg" />
          </Button>
        </DialogClose>
        <DialogHeader>
          <DialogTitle>20% of Premine</DialogTitle>
          <DialogDescription>Team/ Founders</DialogDescription>
        </DialogHeader>
        <div className="satoshi-body-2 max-h-61.5 px-8 pt-2 pb-6 text-white">
          <ScrollArea className="h-full">
            <div className="grid grid-cols-2 gap-6 pb-4">
              <p>
                Vesting: <span className="orbitron-body-2">16</span> <span className="text-gray-400">Month</span>
              </p>
              <p>
                Cliff time: <span className="orbitron-body-2">6</span>
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
