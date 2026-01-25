import ErrorComponent from '@/components/tools/error-component';
import LoadingComponent from '@/components/tools/loading';
import { UseClaimListResult } from '@/hooks/use-claim-list';
import { WORMContract } from '@/lib/core/contracts/worm';
import { roundEther } from '@/lib/core/utils/round-ether';
import { useState } from 'react';
import { useClient, useWriteContract } from 'wagmi';

export default function TotalClaim(props: { result: UseClaimListResult; refresh: () => Promise<void> }) {
  let result = props.result;

  const { mutateAsync } = useWriteContract();
  const client = useClient();
  const [claimState, setClaimState] = useState<'idle' | 'loading' | 'error' | 'done'>('idle');

  if (result.status == 'loading') return <div className="grow text-white">Loading...</div>;

  if (result.status == 'error') {
    console.error(result.error);
    return <div className="grow text-red-500">Error loading data</div>;
  }

  if (result.readyToClaim.length == 0)
    return (
      <div className="flex h-full grow flex-col text-white">
        <div className="mb-3 text-[24px] font-bold">gWorm!</div>
        <div className="text-[16px] opacity-70">No WORM reward available</div>
      </div>
    );
  const totalClaimAmount = result.readyToClaim.map((e) => e.amount).reduce((a, c) => a + c);

  const onClaimClick = async () => {
    let epochs = result.readyToClaim.map((e) => e.epochNum);
    const start = epochs[0];
    const numberOfEpochs = epochs[epochs.length - 1] - epochs[0] + 1n;

    try {
      setClaimState('loading');
      await WORMContract.claim(mutateAsync, client!, start, numberOfEpochs);
      setClaimState('done');
      await props.refresh();
    } catch (e) {
      setClaimState('error');
      console.log(e);
    }
  };

  return (
    <div className="flex grow flex-col gap-2">
      {claimState == 'idle' && (
        <div className="flex h-full flex-col text-white">
          <div className="text-[24px] font-bold">gWorm!</div>
          <div className="text-[24px] font-bold">Rewards are ready</div>
          <div className="mt-5 text-white opacity-80">Total Claimable reward: </div>
          <div className="flex flex-row items-center gap-2">
            <div className="text-[24px] font-bold text-white">{roundEther(totalClaimAmount, 4)} </div>
            <div className="text-[24px] text-brand">WORM </div>
          </div>
          <div className="grow" />
          <button onClick={onClaimClick} className="w-full rounded-lg bg-brand px-4 py-3 text-black">
            Claim everything
          </button>
        </div>
      )}
      {claimState == 'loading' && <LoadingComponent />}
      {claimState == 'error' && <ErrorComponent title="Error while Claiming reward" hFull={false} />}
      {claimState == 'done' && <div className="w-full px-4 py-3 text-white">Claimed Successfully</div>}

      <div className="grow" />
    </div>
  );
}
