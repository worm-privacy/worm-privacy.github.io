'use client';

import { Footer } from '@/components/landing';
import TabBar from '@/components/tools/tabbar';
import TopBar from '@/components/tools/topbar';
import { SmoothScroll } from '@/components/ui/smoth-scroll';
import { useClaimList } from '@/hooks/use-claim-list';
import { useEffect } from 'react';
import ClaimList from './claim-list';
import TotalClaim from './total-claim';

export default function ClaimWorm() {
  let [result, refresh] = useClaimList();
  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <SmoothScroll>
      <TopBar />
      <TabBar />
      <div className="mt-6">
        <div className="mx-auto px-[255px]">
          <h1 className="mb-3 text-[24px] font-bold text-white">Participating in WORM epoch</h1>
          <div className="rounded-xl border border-[rgba(var(--neutral-low-rgb),0.24)] bg-[#090C15] p-8 shadow-2xl">
            <div className="flex flex-row gap-6">
              <ClaimList result={result} />
              <TotalClaim result={result} />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </SmoothScroll>
  );
}
