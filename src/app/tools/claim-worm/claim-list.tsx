import { Button, DialogTrigger } from '@/components/ui';
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog/dialog';
import { Icons } from '@/components/ui/icons';
import { UseClaimListResult } from '@/hooks/use-claim-list';
import { WORMContract } from '@/lib/core/contracts/worm';
import { roundEther } from '@/lib/core/utils/round-ether';
import { useState } from 'react';
import { useClient, useWriteContract } from 'wagmi';

const CARD_STYLE =
  'mx-auto flex w-[580px] min-h-[580px] flex-col gap-1 rounded-xl border border-[rgba(var(--neutral-low-rgb),0.24)] bg-[#010204] p-4 shadow-lg' as const;

export default function ClaimList(props: { result: UseClaimListResult; refresh: () => Promise<void> }) {
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
        return <ReadyToClaimItem key={c.epochNum} epochNumber={c.epochNum} share={c.amount} refresh={props.refresh} />;
      })}
      <Divider />
      {result.upcoming.map((c) => {
        return <UpComingEpochItem key={c.epochNum} epochNumber={c.epochNum} share={c.amount} />;
      })}
    </div>
  );
}

const ReadyToClaimItem = (props: { epochNumber: bigint; share: bigint; refresh: () => Promise<void> }) => {
  const { mutateAsync } = useWriteContract();
  const client = useClient();
  const [claimState, setClaimState] = useState<'idle' | 'loading' | 'error' | 'done'>('idle');

  const onClaimClicked = async () => {
    try {
      setClaimState('loading');
      await WORMContract.claim(mutateAsync, client!, props.epochNumber, 1n);
      setClaimState('done');
      await props.refresh();
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
          <div className="font-orbitron">{roundEther(props.share, 4)}</div>
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
          <DialogTitle>Claim WORM</DialogTitle>
        </DialogHeader>
        <div className="satoshi-body2 max-h-61.5 px-8 pt-2 pb-6 text-white">
          {claimState == 'idle' && (
            <div className="flex flex-col">
              <div className="mb-5 opacity-70">Epoch number {props.epochNumber}</div>
              <div className="mb-1">Your reward share: </div>
              <div className="flex flex-row">
                <div className="mr-2 font-bold text-white">{roundEther(props.share, 4)}</div>
                <div className="font-bold text-brand">WORM</div>
              </div>
              <button
                onClick={onClaimClicked}
                className="mt-5 w-full rounded-lg bg-brand px-4 py-3 font-bold text-black"
              >
                Claim reward
              </button>
            </div>
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
