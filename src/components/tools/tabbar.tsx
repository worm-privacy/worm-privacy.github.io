import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Icons } from '../ui/icons';

export default function TabBar() {
  let path = usePathname();
  const router = useRouter();

  return (
    <div className="text-white">
      <div className="m-auto max-w-310">
        {/* Back Button */}
        <Link href="/" className="my-6 flex items-center space-x-2 text-white transition-colors">
          <Icons.back className="block size-5 fill-white" />
          <span className="px-1.5 text-2xl">Back</span>
        </Link>

        {/* Tab Selection */}
        <div>
          <nav className="flex flex-row space-x-8">
            {TABS.map((tab) => (
              <button
                key={tab.path}
                onClick={() => router.push(tab.path)}
                className={`relative grow px-2 py-3 text-[16px] font-medium transition-all duration-200 ${
                  path === tab.path
                    ? 'border-b-2 border-[rgba(var(--brand-rgb),0.24)] text-brand'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}

const TABS = [
  { path: '/tools/burn-eth', label: 'Burn ETH' },
  { path: '/tools/mine-worm', label: 'Mine WORM' },
  { path: '/tools/claim-worm', label: 'Claim WORM' },
  { path: '/tools/buy-sell-worm', label: 'Buy/Sell WORM' },
  { path: '/tools/stake-worm', label: 'Stake WORM' },
  { path: '/tools/airdrop', label: 'TGE' },
];
