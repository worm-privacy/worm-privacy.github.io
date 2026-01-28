'use client';

import ErrorComponent from '@/components/tools/error-component';
import LoadingComponent from '@/components/tools/loading';
import { AirdropShareModel, UseAirdropSharesResult } from '@/hooks/use-airdrop-shares';
import { DistributionContract } from '@/lib/core/contracts/distribution';
import { roundEther } from '@/lib/core/utils/round-ether';
import { useState } from 'react';
import { formatEther } from 'viem';
import { useClient, useWriteContract } from 'wagmi';

export default function AirdropShareInfo(props: {
  result: UseAirdropSharesResult;
  refresh: () => Promise<void>;
}) {
  const result = props.result;
  const { mutateAsync } = useWriteContract();
  const client = useClient();
  const [actionState, setActionState] = useState<'idle' | 'loading' | 'error' | 'done'>('idle');

  if (result.status === 'not_connected') {
    return (
      <div className="flex grow flex-col text-white">
        <div className="text-[24px] font-bold">Airdrop</div>
        <div className="mt-4 text-[16px] opacity-70">
          Connect your wallet to view and claim your airdrop shares
        </div>
      </div>
    );
  }

  if (result.status === 'loading') {
    return <div className="flex grow items-center justify-center text-white">Loading...</div>;
  }

  if (result.status === 'error') {
    console.error(result.error);
    return <div className="grow text-red-500">Error loading data</div>;
  }

  if (result.shares.length === 0) {
    return (
      <div className="flex grow flex-col text-white">
        <div className="text-[24px] font-bold">Airdrop</div>
        <div className="mt-4 text-[16px] opacity-70">No airdrop shares available for your wallet</div>
      </div>
    );
  }

  const selectedShare = result.shares.find((s) => s.shareData.id === result.selectedShareId);

  if (!selectedShare) {
    return (
      <div className="flex grow flex-col text-white">
        <div className="text-[24px] font-bold">Airdrop</div>
        <div className="mt-4 text-[16px] opacity-70">Select a share to view details</div>
      </div>
    );
  }

  const onRevealClick = async () => {
    if (!client) return;
    try {
      setActionState('loading');
      await DistributionContract.reveal(mutateAsync, client, selectedShare.shareData);
      setActionState('done');
      await props.refresh();
    } catch (e) {
      setActionState('error');
      console.error(e);
    }
  };

  const onClaimClick = async () => {
    if (!client) return;
    try {
      setActionState('loading');
      await DistributionContract.trigger(mutateAsync, client, BigInt(selectedShare.shareData.id));
      setActionState('done');
      await props.refresh();
    } catch (e) {
      setActionState('error');
      console.error(e);
    }
  };

  const resetState = () => setActionState('idle');

  return (
    <div className="flex grow flex-col gap-2">
      {actionState === 'idle' && (
        <ShareDetails
          share={selectedShare}
          onRevealClick={onRevealClick}
          onClaimClick={onClaimClick}
        />
      )}
      {actionState === 'loading' && <LoadingComponent />}
      {actionState === 'error' && (
        <div className="flex flex-col">
          <ErrorComponent title="Error performing action" hFull={false} />
          <button
            onClick={resetState}
            className="mt-4 w-full rounded-lg bg-[#64748B30] px-4 py-3 text-white"
          >
            Try Again
          </button>
        </div>
      )}
      {actionState === 'done' && (
        <div className="flex flex-col text-white">
          <div className="text-[24px] font-bold text-brand">Success!</div>
          <div className="mt-2 text-[16px]">Transaction completed successfully</div>
          <button
            onClick={resetState}
            className="mt-4 w-full rounded-lg bg-brand px-4 py-3 text-black"
          >
            Continue
          </button>
        </div>
      )}
    </div>
  );
}

function ShareDetails(props: {
  share: AirdropShareModel;
  onRevealClick: () => void;
  onClaimClick: () => void;
}) {
  const { share, onRevealClick, onClaimClick } = props;
  const shareData = share.shareData;

  const tge = roundEther(BigInt(shareData.tge), 4);
  const initialAmount = roundEther(BigInt(shareData.initialAmount), 4);
  const totalCap = roundEther(BigInt(shareData.totalCap), 4);
  // Format amount per second properly to avoid scientific notation
  const amountPerDayRaw = formatEther(BigInt(shareData.amountPerSecond * 3600 * 24));
  const startTime = new Date(Number(shareData.startTime) * 1000).toLocaleString();

  // Format claimable amounts for revealed shares
  const claimable = share.claimable ? roundEther(share.claimable, 4) : '0';
  const claimed = share.claimed ? roundEther(share.claimed, 4) : '0';
  const availableToClaim = share.availableToClaim ? formatEther(BigInt(share.availableToClaim)) : '0';

  return (
    <div className="flex h-full flex-col text-white">
      <div className="text-[24px] font-bold">
        Share <span className="font-orbitron">#{shareData.id}</span>
      </div>

      <div className="mt-5 flex flex-col gap-3">
        <div className="flex flex-row justify-between">
          <span className="opacity-70">Status</span>
          {share.isRevealed ? (
            <span className="text-[#96FAD1]">Revealed</span>
          ) : (
            <span className="text-[#FFD080]">Not Revealed</span>
          )}
        </div>
        
        <div className="my-2 h-px bg-white/20" />

        <div className="flex flex-row justify-between">
          <span className="opacity-70">TGE Amount</span>
          <span>
            {tge} <span className="text-brand">WORM</span>
          </span>
        </div>

        <div className="flex flex-row justify-between">
          <span className="opacity-70">Cliff Time</span>
          <span>{startTime}</span>
        </div>

        <div className="flex flex-row justify-between">
          <span className="opacity-70">Released After Cliff</span>
          <span>
            {initialAmount} <span className="text-brand">WORM</span>
          </span>
        </div>

        <div className="flex flex-row justify-between">
          <span className="opacity-70">Vested Per Day</span>
          <span>
            {amountPerDayRaw} <span className="text-brand">WORM</span>
          </span>
        </div>

        <div className="flex flex-row justify-between">
          <span className="opacity-70">Total Cap</span>
          <span>
            {totalCap} <span className="text-brand">WORM</span>
          </span>
        </div>

        {share.isRevealed && (
          <>
            <div className="my-2 h-px bg-white/20" />
            <div className="flex flex-row justify-between">
              <span className="opacity-70">Total Claimable</span>
              <span>
                {claimable} <span className="text-brand">WORM</span>
              </span>
            </div>
            <div className="flex flex-row justify-between">
              <span className="opacity-70">Already Claimed</span>
              <span>
                {claimed} <span className="text-brand">WORM</span>
              </span>
            </div>
            <div className="flex flex-row justify-between">
              <span className="text-[#96FAD1]">Available to Claim</span>
              <span className="font-bold text-[#96FAD1]">
                {availableToClaim} <span className="text-brand">WORM</span>
              </span>
            </div>
          </>
        )}
      </div>

      <div className="grow" />

      {!share.isRevealed ? (
        <button onClick={onRevealClick} className="w-full rounded-lg bg-brand px-4 py-3 text-black">
          Reveal Share
        </button>
      ) : (
        <button onClick={onClaimClick} className="w-full rounded-lg bg-brand px-4 py-3 text-black">
          Claim WORM
        </button>
      )}
    </div>
  );
}
