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
    description: '',
    status: 'passed',
  },
  {
    title: 'WORM contract deployment with capped minting',
    deadline: 'Q1 2026',
    description: '',
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
    description: '',
    status: 'not-yet',
  },
  {
    title: 'Protocol Audit / Trusted Setup',
    deadline: 'Q1 2026',
    description: '',
    status: 'not-yet',
  },
  {
    title: 'Mainnet launch',
    deadline: 'Q1 2026',
    description: '',
    status: 'not-yet',
  },
];

function RoadmapSection() {
  return (
    <section className="container mx-auto flex max-w-184 flex-col gap-6 pb-32">
      <h1 className="orbitron-h2 text-green-400">Roadmap</h1>

      <ul className="flex flex-col gap-6">
        {STEPS.map((step) => (
          <RoadmapStep key={step.title} {...step} />
        ))}
      </ul>
    </section>
  );
}

function RoadmapStep({ title, status, deadline, description }: Roadmap) {
  return (
    <li className="flex w-full items-center justify-between rounded-lg border border-green-400/12 bg-surface-1 p-8">
      <span className="flex items-center justify-start gap-6">
        {status === 'active' ? (
          <Svg src="/assets/icons/check.svg" />
        ) : status === 'passed' ? (
          <Svg src="/assets/icons/checks.svg" />
        ) : null}
        <h4
          className={cn('text-green-400', {
            'text-green-400/36': status === 'passed',
          })}
        >
          {title}
        </h4>
      </span>
      <span className="text-orange-400">{deadline}</span>
    </li>
  );
}

export { RoadmapSection };
