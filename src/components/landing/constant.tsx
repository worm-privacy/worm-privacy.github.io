import Link from 'next/link';
import { buttonVariants } from '../ui';
import { Icons } from '../ui/icons';
import { HowItWorksContent, Roadmap, SocialMedia, TeamMemberInfo, TokenomicsContent } from './type';

export const TEAM: TeamMemberInfo[] = [
  {
    id: 1,
    fullName: 'Keyvan Kambakhsh',
    positions: ['Founder', 'Protocol Architect'],
    avatar: {
      src: '/assets/img/keyvan.png',
      size: 43,
      position: {
        left: 22.5,
        top: 44.75,
      },
    },
    socials: [
      { link: 'https://x.com/KiviGelase', logo: Icons.x, label: '' },
      { link: 'https://github.com/keyvank', logo: Icons.github, label: 'GitHub' },
    ],
  },
  {
    id: 2,
    fullName: 'Artem Svietlieishyi',
    positions: ['Community Lead'],
    avatar: {
      src: '/assets/img/artem.png',
      size: 47.75,
      position: {
        left: 43.5,
        top: 0,
      },
    },
    socials: [
      { link: 'https://x.com/Artem82581916', logo: Icons.x, label: '' },
      { link: 'https://github.com/LightFromHeaven007', logo: Icons.github, label: 'GitHub' },
    ],
  },
  {
    id: 3,
    fullName: 'Ali Ghahremani',
    positions: ['Developer'],
    avatar: {
      src: '/assets/img/ali77gh.jpg',
      size: 38.25,
      position: {
        top: 10,
        left: 4,
      },
    },
    socials: [
      { link: 'https://x.com/Ali98developer', logo: Icons.x, label: '' },
      { link: 'https://github.com/ali77gh', logo: Icons.github, label: 'GitHub' },
    ],
  },
  {
    id: 4,
    fullName: 'Sage Tega',
    positions: ['Growth Lead'],
    avatar: {
      src: '/assets/img/sage.png',
      size: 28.75,
      position: {
        top: 58.5,
        left: 86.25,
      },
    },
    socials: [
      { link: 'https://x.com/Sage_Tega', logo: Icons.x, label: '' },
      { link: 'https://github.com', logo: Icons.github, label: 'GitHub' },
    ],
  },
  {
    id: 5,
    fullName: 'Ali Zeynali',
    positions: ['Product Designer'],
    avatar: {
      src: '/assets/img/aliz.png',
      size: 21.5,
      position: {
        left: 0,
        top: 47.75,
      },
    },
    socials: [
      { link: 'https://x.com/ThisIsGandalff', logo: Icons.x, label: '' },
      { link: 'https://github.com', logo: Icons.github, label: 'GitHub' },
    ],
  },
  {
    id: 6,
    fullName: 'Arman Omidi',
    positions: ['Frontend Developer'],
    avatar: {
      src: '/assets/img/arman.png',
      size: 21.5,
      position: {
        top: 48.75,
        left: 66,
      },
    },
    socials: [
      { link: 'https://x.com', logo: Icons.x, label: '' },
      { link: 'https://github.com/arman94', logo: Icons.github, label: 'GitHub' },
    ],
  },
];

export const HOW_IT_WORKS: HowItWorksContent[] = [
  {
    order: 1,
    title: 'Burn ETH',
    description: 'ETH is sent to normal looking addresses, no one can claim you were using WORM!',
    color: 'blue',
  },
  {
    order: 2,
    title: 'Mint BETH',
    description: 'You prove your burn through zkSNARKs, the protocol gives you BETH in exchange!',
    color: 'magenta',
  },
  {
    order: 3,
    title: 'Mine WORM',
    description: 'Consume your BETH across WORM epochs, and earn WORM!',
    color: 'green',
    action: (
      <Link className={buttonVariants({ variant: 'primary', className: 'w-full' })} href="/app/mine">
        Get WORM
      </Link>
    ),
  },
];

export const ROADMAP: Roadmap[] = [
  {
    order: 1,
    title: 'Launch zk-SNARK burn circuit & WORM',
    deadline: 'Q3 2025',
    description: 'Core privacy infrastructure and burn receipt system',
    status: 'passed',
  },
  {
    order: 2,
    title: 'WORM contract deployment with capped minting',
    deadline: 'Q3 2025',
    description: 'Scarce asset minting with competitive distribution.',
    status: 'passed',
  },
  {
    order: 3,
    title: 'Lindwurm Testnet',
    deadline: 'Q3 2025',
    description: 'Very first testnet of WORM, with a working instance of BETH/WORM.',
    status: 'passed',
  },
  {
    order: 4,
    title: 'Shai-Hulud Testnet',
    deadline: 'Q4 2025',
    description: 'The second testnet involves refactored circuit and partial spends.',
    status: 'passed',
  },
  {
    order: 5,
    title: 'Protocol Audit',
    deadline: 'Q4 2025',
    description: 'Auditing of ZK circuits.',
    status: 'passed',
  },
  {
    order: 6,
    title: 'Burrow Testnet',
    deadline: 'Q4 2025',
    description: 'The third testnet involves BETH/ETH market and staking.',
    status: 'active',
  },
  {
    order: 7,
    title: 'Trusted Setup',
    deadline: 'Q1 2026',
    description: 'Trusted Setup of our Groth16 circuits.',
    status: 'not-yet',
  },
  {
    order: 8,
    title: 'Mainnet launch',
    deadline: 'Q1 2026',
    description: 'Launching BETH/WORM tokens on mainnet.',
    status: 'not-yet',
  },
];

export const SOCIALS: SocialMedia[] = [
  { link: 'https://t.me/WormPrivacy', logo: Icons.telegram },
  { link: 'https://x.com/EIP7503', logo: Icons.x },
  { link: 'https://discord.gg/EIP7503', logo: Icons.discord },
  { link: 'https://github.com/worm-privacy', logo: Icons.github },
];

export const TOKENOMICS: TokenomicsContent[] = [
  {
    title: 'Mine-able',
    stats: [{ share: '100%', label: 'Mine-able through Private-Proof-of-Burn mining' }],
  },
  {
    title: 'Premine',
    stats: [
      { label: 'Uniswap CCA', share: '30%' },
      { label: 'Core Team', share: '29%' },
      { label: 'Advisors', share: '1%' },
      { label: 'Private investors', share: '10%' },
      { label: 'Foundation Treasury', share: '15%' },
      { label: 'Donors (Juicebox)', share: '9%' },
      { label: 'Testnet Participants', share: '5.5%' },
      { label: 'Community Activities / Airdrops', share: '0.5%' },
    ],
  },
];
