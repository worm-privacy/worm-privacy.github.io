'use client';

import { useIsMobile } from '@/hooks';
import { cn } from '@/lib';
import Svg from 'react-inlinesvg';

type Roadmap = {
  title: string;
  deadline: string;
  description: string;
  status: 'active' | 'passed' | 'not-yet';
};

const STEPS: Roadmap[] = [
  {
    title: 'Launch zk-SNARK burn circuit & WORM',
    deadline: 'Q1 2026',
    description: 'Core privacy infrastructure and burn receipt system',
    status: 'passed',
  },
  {
    title: 'WORM contract deployment with capped minting',
    deadline: 'Q1 2026',
    description: 'Scarce asset minting with competitive distribution.',
    status: 'passed',
  },
  {
    title: 'Lindwurm Testnet',
    deadline: 'Q1 2026',
    description: 'Very first testnet of WORM, with a working instance of BETH/WORM.',
    status: 'active',
  },
  {
    title: 'Shai-Hulud Testnet',
    deadline: 'Q1 2026',
    description: 'The second testnet involves and refactored circuit and partial spends.',
    status: 'not-yet',
  },
  {
    title: 'Protocol Audit / Trusted Setup',
    deadline: 'Q1 2026',
    description: 'Auditing of ZK circuits and running a Groth16 trusted setup ceremony.',
    status: 'not-yet',
  },
  {
    title: 'Mainnet launch',
    deadline: 'Q1 2026',
    description: 'Launching BETH/WORM tokens on mainnet.',
    status: 'not-yet',
  },
];

function RoadmapSection() {
  const isMobile = useIsMobile();

  return (
    <section className="container mx-auto flex max-w-184 flex-col gap-6 pb-32">
      <h1
        className={cn('orbitron-h2 text-green-400', {
          'orbitron-h3': isMobile,
        })}
      >
        Roadmap
      </h1>

      <ul className="flex flex-col gap-6">
        {STEPS.map((step) => (
          <RoadmapStep key={step.title} {...step} />
        ))}
      </ul>
    </section>
  );
}

function RoadmapStep({ title, status, deadline, description }: Roadmap) {
  const isMobile = useIsMobile();

  return (
    <li
      className={cn('grid w-full grid-rows-2 gap-3 rounded-lg border border-green-400/12 bg-surface1 p-8 md:gap-4', {
        'grid-rows-1': status !== 'active',
      })}
    >
      <div
        className={cn('grid w-full grid-cols-1 gap-6', {
          'grid-cols-[1.25rem_1fr]': status === 'active' || status === 'passed',
        })}
      >
        {status === 'active' ? (
          <Svg src="/assets/icons/check.svg" className="self-center" />
        ) : status === 'passed' ? (
          <Svg src="/assets/icons/checks.svg" className="self-center" />
        ) : (
          <></>
        )}
        <span className="flex w-full flex-col-reverse items-start justify-start gap-1 md:flex-row md:items-center md:justify-between md:gap-6">
          <h4
            className={cn('text-green-400', {
              'text-green-400/36': status === 'passed',
            })}
          >
            {title}
          </h4>
          <span className="text-orange-400">{deadline}</span>
        </span>
      </div>
      {status === 'active' ? (
        <p
          className={cn('satoshi-body1 pl-11 text-gray-400', {
            'satoshi-body2': isMobile,
          })}
        >
          {description}
        </p>
      ) : null}
    </li>
  );
}

export { RoadmapSection };
