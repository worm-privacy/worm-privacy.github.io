'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { useState } from 'react';
import { Icons } from '../ui/icons';
import RainbowKitRoot from './rainbowkit-root';

const TopBar = () => {
  let isConnect = useState(false);
  const walletAddress = '0xf3a123456789abcdef0123456789abcdef51d';

  const truncateAddress = (addr: string) => {
    return addr ? `${addr.slice(0, 5)}...${addr.slice(-3)}` : '';
  };

  return (
    <RainbowKitRoot>
      <div className="pl flex items-center justify-between rounded-b-3xl bg-surface1 px-[255px] py-4">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <Icons.logo className="h-16" />
          <Icons.typedLogo className="block" />
        </div>
        {isConnect ? (
          // <button className="flex items-center rounded-lg  bg-brand px-4 py-3 font-satoshi text-sm text-[14px] font-medium text-black transition-colors duration-200">
          //   Connect Wallet
          // </button>
          <ConnectButton />
        ) : (
          <button className="flex items-center rounded-lg border border-emerald-400 bg-gray-800 px-3 py-3 font-mono text-sm text-emerald-400 transition-colors duration-200 hover:bg-emerald-400 hover:text-gray-900">
            {truncateAddress(walletAddress)}
          </button>
        )}
      </div>
    </RainbowKitRoot>
  );
};

export default TopBar;
