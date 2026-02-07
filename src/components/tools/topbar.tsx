'use client';

import '@rainbow-me/rainbowkit/styles.css';
import Link from 'next/link';
import { Icons } from '../ui/icons';
import { CustomConnectWalletButton } from './custom-connect-wallet-button';

const TopBar = () => {
  return (
    <div className="flex h-[72px] flex-row justify-center rounded-b-3xl border border-[rgba(var(--brand-rgb),0.24)] bg-surface1">
      <div className="flex h-[72px] w-310 flex-row items-center px-5">
        <Link href="/">
          <div className="flex h-10 items-center gap-2">
            <Icons.logo className="h-10" />
            <Icons.typedLogo className="block" />
          </div>
        </Link>

        <div className="grow" />

        <CustomConnectWalletButton />
      </div>
    </div>
  );
};

export default TopBar;
