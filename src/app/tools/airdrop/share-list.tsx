import { Button, DialogTrigger } from '@/components/ui';
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog/dialog';
import { Icons } from '@/components/ui/icons';
import { UseShareListResult } from '@/hooks/use-tge-share-list';
import { roundEther } from '@/lib/core/utils/round-ether';
import { useState } from 'react';
import { useClient, useWriteContract } from 'wagmi';
import { TgeSelection } from './page';

const CARD_STYLE =
  'mx-auto flex w-[580px] min-h-[580px] flex-col gap-1 rounded-xl border border-[rgba(var(--neutral-low-rgb),0.24)] bg-[#010204] p-4 shadow-lg' as const;

export default function ShareList(props: {
  result: UseShareListResult;
  refresh: () => Promise<void>;
  selection: TgeSelection;
  setSelection: (s: TgeSelection) => void;
}) {
  const result = props.result;
  if (result.status == 'loading')
    return (
      <div className={CARD_STYLE}>
        <div className="text-white">Loading...</div>
      </div>
    );

  if (result.status == 'error') {
    console.error(result.error);
    return (
      <div className={CARD_STYLE}>
        <div className="text-red-500">Error loading data</div>
      </div>
    );
  }

  const hasIcoworm = result.icowormBalance > 0n || result.icowormNullified;

  if (!hasIcoworm && result.shares.length === 0) {
    return (
      <div className={CARD_STYLE}>
        <div className="text-white">Nothing to claim</div>
      </div>
    );
  }

  return (
    <div className={CARD_STYLE}>
      {hasIcoworm && (
        <button
          type="button"
          onClick={() => props.setSelection('icoworm')}
          className={`m-1 flex flex-row items-center gap-2 rounded-[12px] p-3 text-[16px] text-white transition-colors ${
            props.selection === 'icoworm'
              ? 'bg-[rgba(var(--brand-rgb),0.15)] border border-brand/40'
              : 'bg-[#64748B1F] border border-transparent'
          }`}
        >
          <div className="font-bold">ICO tokens</div>
          {result.icowormNullified ? (
            <div className="rounded-4xl bg-white/10 px-3 py-1 text-[12px] text-white/50">
              Claimed
            </div>
          ) : (
            <div className="rounded-4xl bg-[rgba(var(--brand-rgb),0.12)] px-3 py-1 text-[12px] text-[#96FAD1]">
              Claimable
            </div>
          )}
          <div className="grow" />
          <div className="text-[14px]">Amount:</div>
          <div className="font-orbitron">{roundEther(result.icowormBalance, 4)}</div>
          <div className="text-[14px] text-brand">WORM</div>
        </button>
      )}
    </div>
  );
}
