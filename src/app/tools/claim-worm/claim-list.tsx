import { Button, DialogTrigger } from '@/components/ui';
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog/dialog';
import { Icons } from '@/components/ui/icons';
import { useClaimList } from '@/hooks/use-claim-list';
import { WORMcontractABI, WORMcontractAddress } from '@/lib/core/contracts/worm';
import { roundEther } from '@/lib/core/utils/round-ether';
import { useEffect, useState } from 'react';
import { waitForTransactionReceipt } from 'viem/actions';
import { useClient, useWriteContract } from 'wagmi';

const CARD_STYLE =
  'mx-auto flex w-[580px] min-h-[580px] flex-col gap-1 rounded-xl border border-[rgba(var(--neutral-low-rgb),0.24)] bg-[#010204] p-4 shadow-lg' as const;

export default function ClaimList() {
  let [result, refresh] = useClaimList();

  useEffect(() => {
    refresh();
  }, [refresh]);

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

  if (result.readyToClaim.length == 0 && result.upcoming.length == 0) {
    return (
      <div className={CARD_STYLE}>
        <div className="text-white">Nothing to claim</div>
      </div>
    );
  }

  return (
    <div className={CARD_STYLE}>
      {result.readyToClaim.map((c) => {
        return <ReadyToClaimItem key={c.epochNum} epochNumber={c.epochNum} share={c.amount} />;
      })}
      <Divider />
      {result.upcoming.map((c) => {
        return <UpComingEpochItem key={c.epochNum} epochNumber={c.epochNum} share={c.amount} />;
      })}
    </div>
  );
}

const ReadyToClaimItem = (props: { epochNumber: bigint; share: bigint }) => {
  const { mutateAsync } = useWriteContract();
  const client = useClient();
  const [claimState, setClaimState] = useState<'idle' | 'loading' | 'error' | 'done'>('idle');

  const onClaimClicked = async () => {
    try {
      setClaimState('loading');
      console.log(`calling claim(${props.epochNumber}, 1)`);
      const approveTXHash = await mutateAsync({
        address: WORMcontractAddress,
        abi: WORMcontractABI,
        functionName: 'claim',
        args: [props.epochNumber, 1n],
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
    <Dialog>
      <DialogTrigger>
        <div className="m-1 flex flex-row items-center gap-2 rounded-[12px] bg-[#64748B1F] p-3 text-[16px] text-white">
          <div>
            Epoch num <span className="font-orbitron text-[12px]">{props.epochNumber} </span>
          </div>
          <div className="rounded-4xl bg-[rgba(var(--brand-rgb),0.12)] px-3 py-1 text-[12px] text-[#96FAD1] ">
            Ready to claim
          </div>
          <div className="grow" />
          <div className="text-[14px]">Your share:</div>
          <div className="font-orbitron">{roundEther(props.share, 1)}</div>
          <div className="text-[14px] text-brand">WORM</div>
        </div>
      </DialogTrigger>

      <DialogContent className="max-w-150">
        <DialogClose asChild>
          <Button variant="ghost" className="absolute top-6 right-8 z-10 w-max">
            <Icons.close />
          </Button>
        </DialogClose>
        <DialogHeader>
          <DialogTitle>Claim an epoch</DialogTitle>
        </DialogHeader>
        <div className="satoshi-body2 max-h-61.5 px-8 pt-2 pb-6 text-white">
          {claimState == 'idle' && (
            <button onClick={onClaimClicked} className="w-full rounded-lg bg-brand px-4 py-3 text-black">
              Claim
            </button>
          )}
          {claimState == 'loading' && <div className="w-full px-4 py-3 text-white">Hold on a sec...</div>}
          {claimState == 'error' && <div className="w-full px-4 py-3 text-red-500">Error</div>}
          {claimState == 'done' && <div className="w-full px-4 py-3 text-white">Claimed Successfully</div>}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const UpComingEpochItem = (props: { epochNumber: bigint; share: bigint }) => {
  return (
    <div className="m-1 flex flex-row items-center gap-2  p-3 text-[16px] text-white opacity-50">
      <div>
        Epoch num <span className="font-orbitron text-[12px]">{props.epochNumber} </span>
      </div>
      <div className="grow" />
      {props.share == 0n ? (
        <div className="text-[14px]">You have no reward on this epoch</div>
      ) : (
        <>
          <div className="text-[14px]">Your share: ~</div>
          <div className="font-orbitron">{roundEther(props.share, 1)}</div>
          <div className=" text-[14px] text-brand">WORM</div>
        </>
      )}
    </div>
  );
};

const Divider = () => {
  return (
    <div className="m-1 flex flex-row">
      <div className="text-[#94A3B8]">Up coming epochs</div>
      <div className="mx-2 my-auto  h-px grow bg-[#94A3B830]" />
    </div>
  );
};
