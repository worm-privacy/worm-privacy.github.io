'use client';

import { Footer } from '@/components/landing';
import TabBar from '@/components/tools/tabbar';
import TopBar from '@/components/tools/topbar';
import { WalletNotConnectedContainer } from '@/components/tools/wallet-not-connected';
import { SmoothScroll } from '@/components/ui/smoth-scroll';
import { useEpochList } from '@/hooks/use-epoch-list';
import { useEffect } from 'react';
import EpochViewer from './epoch-viewer';
import ParticipateInputs from './participate-inputs';

export default function MineWorm() {
  const [result, refresh] = useEpochList();

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
              <h1 className="mb-3 text-[24px] font-bold text-white">Participating in WORM epoch</h1>
              <div className="rounded-xl border border-[rgba(var(--neutral-low-rgb),0.24)] bg-[#090C15] p-8 shadow-2xl">
                <div className="flex flex-row gap-6">
                  <EpochViewer result={result} refresh={refresh} />
                  <ParticipateInputs result={result} refresh={refresh} />
                </div>
              </div>
            </div>
          </div>
        </WalletNotConnectedContainer>
        <div className="grow" />
        <Footer />
      </div>
    </SmoothScroll>
  );
}
