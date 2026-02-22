import ErrorComponent from '@/components/tools/error-component';
import LoadingComponent from '@/components/tools/loading';
import { UseShareListResult } from '@/hooks/use-tge-share-list';
import { roundEther } from '@/lib/core/utils/round-ether';
import { useState } from 'react';
import { useClient, useWriteContract } from 'wagmi';
import { TgeSelection } from './page';

// TODO: Replace with the actual exit contract address
const EXIT_CONTRACT_ADDRESS = '0x88a11fc875e7502959d643ef8bde6d05747a77d4' as const;

const EXIT_CONTRACT_ABI = [
  {
    type: 'function',
    name: 'exit',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const;

export default function ShareInfo(props: {
  result: UseShareListResult;
  refresh: () => Promise<void>;
  selection: TgeSelection;
}) {
  const { result, selection } = props;

  if (result.status === 'loading') return <div className="grow text-white">Loading...</div>;

  if (result.status === 'error') {
    console.error(result.error);
    return <div className="grow text-red-500">Error loading data</div>;
  }

  if (selection === 'icoworm' && result.icowormBalance > 0n) {
    return <IcowormClaimInfo balance={result.icowormBalance} refresh={props.refresh} />;
  }

  return (
    <div className="flex h-full grow flex-col text-white">
      <div className="mb-3 text-[24px] font-bold">TGE</div>
      <div className="text-[16px] opacity-70">Select an item to view details</div>
    </div>
  );
}

function IcowormClaimInfo(props: { balance: bigint; refresh: () => Promise<void> }) {
  const { mutateAsync } = useWriteContract();
  const [claimState, setClaimState] = useState<'idle' | 'loading' | 'error' | 'done'>('idle');

  const onClaimClick = async () => {
    try {
      setClaimState('loading');
      await mutateAsync({
        address: EXIT_CONTRACT_ADDRESS,
        abi: EXIT_CONTRACT_ABI,
        functionName: 'exit',
      });
      setClaimState('done');
      await props.refresh();
    } catch (e) {
      console.error(e);
      setClaimState('error');
    }
  };

  return (
    <div className="flex grow flex-col gap-2">
      {claimState === 'idle' && (
        <div className="flex h-full flex-col text-white">
          <div className="text-[24px] font-bold">ICO tokens</div>
          <div className="mt-2 text-[16px] opacity-70">
            Your can now claim the WORM tokens you bought on the ICO.
          </div>
          <div className="mt-5 text-white opacity-80">Amount claimable:</div>
          <div className="flex flex-row items-center gap-2">
            <div className="text-[24px] font-bold text-white">{roundEther(props.balance, 4)}</div>
            <div className="text-[24px] text-brand">WORM</div>
          </div>
          <div className="grow" />
          <button onClick={onClaimClick} className="w-full rounded-lg bg-brand px-4 py-3 text-black">
            Claim WORM
          </button>
        </div>
      )}
      {claimState === 'loading' && <LoadingComponent />}
      {claimState === 'error' && <ErrorComponent title="Error while claiming WORM" hFull={false} />}
      {claimState === 'done' && <div className="w-full px-4 py-3 text-white">Claimed successfully!</div>}
      <div className="grow" />
    </div>
  );
}
