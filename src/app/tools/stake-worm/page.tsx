'use client';

import { Footer } from '@/components/landing';
import TabBar from '@/components/tools/tabbar';
import TopBar from '@/components/tools/topbar';
import { WalletNotConnectedContainer } from '@/components/tools/wallet-not-connected';
import { SmoothScroll } from '@/components/ui/smoth-scroll';
import { useStakingList } from '@/hooks/use-staking-list';
import { useEffect } from 'react';
import StakingClaimList from './claim-list';
import StakingInputs from './staking-inputs';

export default function StakeWorm() {
  const [result, refresh] = useStakingList();

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <SmoothScroll>
      <div className="flex h-svh grow flex-col overflow-y-scroll">
        <TopBar />
        <TabBar />
        <WalletNotConnectedContainer>
          <div>
            <div className="m-auto max-w-310">
              <div className="mt-6 mb-3 text-[24px] font-bold text-white">Stake WORM, get BETH</div>
              <div className="rounded-xl border border-[rgba(var(--neutral-low-rgb),0.24)] bg-[#090C15] p-8 shadow-2xl">
                <div className="flex flex-row gap-6">
                  <StakingClaimList result={result} refresh={refresh} />
                  <StakingInputs result={result} refresh={refresh} />
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
