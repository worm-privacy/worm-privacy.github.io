'use client';

import { UseAirdropSharesResult } from '@/hooks/use-airdrop-shares';
import { roundEther } from '@/lib/core/utils/round-ether';

const CARD_STYLE =
  'mx-auto flex w-[580px] min-h-[580px] flex-col gap-1 rounded-xl border border-[rgba(var(--neutral-low-rgb),0.24)] bg-[#010204] p-4 shadow-lg' as const;

export default function AirdropShareList(props: {
  result: UseAirdropSharesResult;
  selectShare: (shareId: string | null) => void;
}) {
  const result = props.result;

  if (result.status === 'not_connected') {
    return (
      <div className={CARD_STYLE}>
        <div className="flex h-full flex-col items-center justify-center text-center">
          <div className="mb-2 text-[18px] font-medium text-white">Wallet Not Connected</div>
          <div className="text-[14px] text-gray-400">
            Please connect your wallet to view your airdrop shares
          </div>
        </div>
      </div>
    );
  }

  if (result.status === 'loading') {
    return (
      <div className={CARD_STYLE}>
        <div className="flex h-full items-center justify-center text-white">Loading...</div>
      </div>
    );
  }

  if (result.status === 'error') {
    console.error(result.error);
    return (
      <div className={CARD_STYLE}>
        <div className="flex h-full items-center justify-center text-red-500">Error loading data</div>
      </div>
    );
  }

  if (result.shares.length === 0) {
    return (
      <div className={CARD_STYLE}>
        <div className="flex h-full flex-col items-center justify-center text-center">
          <div className="mb-2 text-[18px] font-medium text-white">No Airdrop Shares</div>
          <div className="text-[14px] text-gray-400">
            Your connected wallet does not have any airdrop shares
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={CARD_STYLE}>
      <div className="mb-3 text-[14px] font-medium text-gray-400">Your Shares</div>
      {result.shares.map((share) => {
        const isSelected = result.selectedShareId === share.shareData.id;
        const totalCapFormatted = roundEther(BigInt(share.shareData.totalCap), 4);

        return (
          <button
            key={share.shareData.id}
            onClick={() => props.selectShare(share.shareData.id)}
            className={`m-1 flex flex-row items-center gap-2 rounded-[12px] p-3 text-[16px] text-white transition-all ${
              isSelected
                ? 'bg-[rgba(var(--brand-rgb),0.12)] ring-1 ring-brand'
                : 'bg-[#64748B1F] hover:bg-[#64748B30]'
            }`}
          >
            <div>
              Share <span className="font-orbitron text-[12px]">#{share.shareData.id}</span>
            </div>
            {share.isRevealed ? (
              <div className="rounded-4xl bg-[rgba(var(--brand-rgb),0.12)] px-3 py-1 text-[12px] text-[#96FAD1]">
                Revealed
              </div>
            ) : (
              <div className="rounded-4xl bg-[rgba(255,200,100,0.12)] px-3 py-1 text-[12px] text-[#FFD080]">
                Not Revealed
              </div>
            )}
            <div className="grow" />
            <div className="text-[14px]">Total Cap:</div>
            <div className="font-orbitron">{totalCapFormatted}</div>
            <div className="text-[14px] text-brand">WORM</div>
          </button>
        );
      })}
    </div>
  );
}
