'use client';

import { Footer } from '@/components/landing';
import TabBar from '@/components/tools/tabbar';
import TopBar from '@/components/tools/topbar';
import { SmoothScroll } from '@/components/ui/smoth-scroll';
import { useEffect, useState } from 'react';
import ShareList from './share-list';
import ShareInfo from './share-info';
import { useTgeShareList } from '@/hooks/use-tge-share-list';

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
      <div className="mt-6">
        <div className="m-auto max-w-310 px-5">
          <h1 className="mb-3 text-[24px] font-bold text-white">TGE</h1>
          <div className="rounded-xl border border-[rgba(var(--neutral-low-rgb),0.24)] bg-[#090C15] p-8 shadow-2xl">
            <div className="flex flex-row gap-6">
              <ShareList result={result} refresh={refresh} selection={selection} setSelection={setSelection} />
              <ShareInfo result={result} refresh={refresh} selection={selection} />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </SmoothScroll>
  );
}
