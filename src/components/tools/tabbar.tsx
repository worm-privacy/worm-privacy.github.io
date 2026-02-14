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
                } ${tab.disabled ? '!cursor-not-allowed opacity-50' : ''}`}
                disabled={tab.disabled}
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
  { path: '/tools/burn-eth', label: 'Burn ETH', disabled: false },
  { path: 'https://app.cyphereth.com/', label: 'Trade BETH', disabled: false },
  { path: '/tools/mine-worm', label: 'Mine TWORM', disabled: false },
  { path: '/tools/claim-worm', label: 'Claim TWORM', disabled: false },
  { path: '/tools/stake-worm', label: 'Stake WORM', disabled: true },
  { path: '/tools/airdrop', label: 'TGE', disabled: true },
];
