'use client';

import '@rainbow-me/rainbowkit/styles.css';
import { useState } from 'react';
import { Icons } from '../ui/icons';
import { CustomConnectWalletButton } from './custom-connect-wallet-button';

const TopBar = () => {
  let isConnect = useState(false);
  const walletAddress = '0xf3a123456789abcdef0123456789abcdef51d';

  const truncateAddress = (addr: string) => {
    return addr ? `${addr.slice(0, 5)}...${addr.slice(-3)}` : '';
  };

  return (
    <div className="rounded-b-3xl border border-[rgba(var(--brand-rgb),0.24)] bg-surface1 py-4">
      <div className="m-auto flex max-w-310 flex-row items-center px-5">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <Icons.logo className="h-16" />
          <Icons.typedLogo className="block" />
        </div>

        <div className="grow" />
        {isConnect ? (
          <CustomConnectWalletButton />
        ) : (
          <button className="flex items-center rounded-lg border border-emerald-400 bg-gray-800 px-3 py-3 font-mono text-sm text-emerald-400 transition-colors duration-200 hover:bg-emerald-400 hover:text-gray-900">
            {truncateAddress(walletAddress)}
          </button>
        )}
      </div>
    </div>
  );
};

export default TopBar;
