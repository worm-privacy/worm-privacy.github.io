'use client';

import { Footer } from '@/components/landing';
import TabBar from '@/components/tools/tabbar';
import TopBar from '@/components/tools/topbar';
import { WalletNotConnectedContainer } from '@/components/tools/wallet-not-connected';
import { SmoothScroll } from '@/components/ui/smoth-scroll';
import { useTgeShareList } from '@/hooks/use-tge-share-list';
import { useEffect, useState } from 'react';
import ShareInfo from './share-info';
import ShareList from './share-list';

export type TgeSelection = 'icoworm' | null;

export default function TGE() {
  let [result, refresh] = useTgeShareList();
  const [selection, setSelection] = useState<TgeSelection>(null);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <SmoothScroll>
      <TopBar />
      <TabBar />
      <WalletNotConnectedContainer>
        <div>
          <div className="m-auto max-w-310">
            <div className="mt-6 mb-3 text-[24px] font-bold text-white">TGE</div>
            <div className="rounded-xl border border-[rgba(var(--neutral-low-rgb),0.24)] bg-[#090C15] p-8 shadow-2xl">
              <div className="flex flex-row gap-6">
                <ShareList result={result} refresh={refresh} selection={selection} setSelection={setSelection} />
                <ShareInfo result={result} refresh={refresh} selection={selection} />
              </div>
            </div>
          </div>
        </div>
      </WalletNotConnectedContainer>
      <div className="min-h-12 grow" />
      <Footer />
    </SmoothScroll>
  );
}
