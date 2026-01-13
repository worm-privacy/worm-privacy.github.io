import { UseClaimListResult } from '@/hooks/use-claim-list';
import { WORMcontractABI, WORMcontractAddress } from '@/lib/core/contracts/worm';
import { roundEther } from '@/lib/core/utils/round-ether';
import { useState } from 'react';
import { waitForTransactionReceipt } from 'viem/actions';
import { useClient, useWriteContract } from 'wagmi';

export default function TotalClaim(props: { result: UseClaimListResult }) {
  let result = props.result;

  const { mutateAsync } = useWriteContract();
  const client = useClient();
  const [claimState, setClaimState] = useState<'idle' | 'loading' | 'error' | 'done'>('idle');

  if (result.status == 'loading') return <div className="grow text-white">Loading...</div>;

  if (result.status == 'error') {
    console.error(result.error);
    return <div className="grow text-red-500">Error loading data</div>;
  }

  if (result.readyToClaim.length == 0) return <div className="grow text-white">Nothing to claim</div>;

  const totalClaimAmount = result.readyToClaim.map((e) => e.amount).reduce((a, c) => a + c);

  const onClaimClick = async () => {
    let epochs = result.readyToClaim.map((e) => e.epochNum);
    const start = epochs[0];
    const numberOfEpochs = epochs[epochs.length - 1] - epochs[0] + 1n;

    try {
      setClaimState('loading');
      console.log(`calling claim(${start}, ${numberOfEpochs})`);
      const approveTXHash = await mutateAsync({
        address: WORMcontractAddress,
        abi: WORMcontractABI,
        functionName: 'claim',
        args: [start, numberOfEpochs],
      });

      console.log('waiting for claim receipt');
      let r = await waitForTransactionReceipt(client!, { hash: approveTXHash });
      if (r.status == 'reverted') throw 'claim reverted';
      setClaimState('done');
    } catch (e) {
      setClaimState('error');
      console.log(e);
    }
  };

  return (
    <div className="flex grow flex-col gap-2">
      <div className="text-white">Total Claim: {roundEther(totalClaimAmount, 4)} WORM</div>

      {claimState == 'idle' && (
        <button onClick={onClaimClick} className="w-full rounded-lg bg-brand px-4 py-3 text-black">
          Claim everything
        </button>
      )}
      {claimState == 'loading' && <div className="w-full px-4 py-3 text-white">Hold on a sec...</div>}
      {claimState == 'error' && <div className="w-full px-4 py-3 text-red-500">Error</div>}
      {claimState == 'done' && <div className="w-full px-4 py-3 text-white">Claimed Successfully</div>}

      <div className="grow" />
    </div>
  );
}
