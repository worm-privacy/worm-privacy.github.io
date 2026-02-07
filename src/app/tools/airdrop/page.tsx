'use client';

import { Footer } from '@/components/landing';
import TabBar from '@/components/tools/tabbar';
import TopBar from '@/components/tools/topbar';
import { WalletNotConnectedContainer } from '@/components/tools/wallet-not-connected';
import { SmoothScroll } from '@/components/ui/smoth-scroll';
import { useAirdropShares } from '@/hooks/use-airdrop-shares';
import { useEffect } from 'react';
import AirdropShareInfo from './share-info';
import AirdropShareList from './share-list';

export default function Airdrop() {
  const [result, refresh, selectShare] = useAirdropShares();

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <SmoothScroll>
      <div className="flex h-svh grow flex-col overflow-y-scroll">
        <TopBar />
        <TabBar />
        <WalletNotConnectedContainer>
          <div className="mt-6">
            <div className="m-auto max-w-310 px-5">
              <h1 className="mb-3 text-[24px] font-bold text-white">Airdrop Claims</h1>
              <div className="rounded-xl border border-[rgba(var(--neutral-low-rgb),0.24)] bg-[#090C15] p-8 shadow-2xl">
                <div className="flex flex-row gap-6">
                  <AirdropShareList result={result} selectShare={selectShare} />
                  <AirdropShareInfo result={result} refresh={refresh} />
                </div>
              </div>
            </div>
          </div>
        </WalletNotConnectedContainer>
        <div className="min-h-12 grow" />
        <Footer />
      </div>
    </SmoothScroll>
  );
}
