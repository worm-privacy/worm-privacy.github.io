import { Button, DialogTrigger } from '@/components/ui';
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog/dialog';
import { Icons } from '@/components/ui/icons';
import { StakingItem, UseStakingListResult } from '@/hooks/use-staking-list';
import { StakingContract } from '@/lib/core/contracts/staking';
import { roundEther } from '@/lib/core/utils/round-ether';
import { useState } from 'react';
import { useClient, useWriteContract } from 'wagmi';

const CARD_STYLE =
  'mx-auto flex w-[600px] min-h-[580px] flex-col gap-1 rounded-xl border border-[rgba(var(--neutral-low-rgb),0.24)] bg-[#010204] p-4 shadow-lg' as const;

export default function StakingClaimList(props: { result: UseStakingListResult; refresh: () => Promise<void> }) {
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
        return <ReadyToClaimItem key={c.weekNumber} staking={c} refresh={props.refresh} />;
      })}
      <Divider />
      {result.upcoming.map((c) => {
        return <UpComingEpochItem key={c.weekNumber} staking={c} />;
      })}
    </div>
  );
}

const ReadyToClaimItem = (props: { staking: StakingItem; refresh: () => Promise<void> }) => {
  const staking = props.staking;
  const { mutateAsync } = useWriteContract();
  const client = useClient();
  const [claimState, setClaimState] = useState<'idle' | 'loading' | 'error' | 'done'>('idle');

  const onClaimClicked = async () => {
    try {
      setClaimState('loading');
      await StakingContract.claimReward(mutateAsync, client!, staking.weekNumber, 1n);
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
          <div className="flex flex-col items-start">
            <div className="flex flex-row items-center">
              <span className="text-[#727E8F]">
                Day <span className="font-orbitron text-[16px]">{staking.weekNumber} </span>
              </span>
              <div className="ml-2 rounded-4xl bg-[rgba(var(--brand-rgb),0.12)] px-3 py-1 text-[12px] text-[#96FAD1] ">
                Ready to claim
              </div>
            </div>

            <div className="mt-1">
              <span className="text-[#727E8F]">Total reward </span>
              <span className="ml-2 font-orbitron">{roundEther(staking.totalReward)}</span>
              <span className="ml-2 text-[#FF47C0]">BETH</span>
            </div>
          </div>
          <div className="grow" />
          <div className="flex w-2/5 flex-col items-start">
            <div className="text-[#727E8F]">Your share</div>
            <div>
              <span className="font-orbitron">{staking.sharePercentage.toFixed(2)} </span>
              <span className="text-[#727E8F]">% </span>
              <span className="ml-1">(~{roundEther(staking.shareAmount)}</span>
              <span className="ml-1 text-[#FF47C0]">BETH</span>)
            </div>
          </div>
        </div>
      </DialogTrigger>

      <DialogContent className="max-w-150">
        <DialogClose asChild>
          <Button variant="ghost" className="absolute top-6 right-8 z-10 w-max">
            <Icons.close />
          </Button>
        </DialogClose>
        <DialogHeader>
          <DialogTitle>Claim staking reward</DialogTitle>
        </DialogHeader>
        <div className="satoshi-body2 max-h-61.5 px-8 pt-2 pb-6 text-white">
          {claimState == 'idle' && (
            <div className="flex flex-col">
              <div className="mb-5 opacity-70">Day number {staking.weekNumber}</div>
              <div className="mb-1">Your reward share: </div>
              <div className="flex flex-row">
                <div className="mr-2 text-[24px] font-bold text-white">{roundEther(staking.shareAmount, 4)}</div>
                <div className="text-[#FF47C0]">BETH</div>
              </div>
              <div className="mt-5 mb-1">Total reward share: </div>
              <div className="flex flex-row">
                <div className="mr-2 text-[24px] font-bold text-white">{roundEther(staking.totalReward, 4)}</div>
                <div className="text-[#FF47C0]">BETH</div>
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

const UpComingEpochItem = (props: { staking: StakingItem }) => {
  const staking = props.staking;
  return (
    <div className="m-1 flex flex-row items-center gap-2 rounded-[12px] p-3 text-[16px] text-white opacity-75">
      <div className="flex flex-col items-start">
        <div className="flex flex-row items-center">
          <span className="text-[#727E8F]">
            Day <span className="font-orbitron text-[16px]">{staking.weekNumber} </span>
          </span>
        </div>

        <div className="mt-1">
          <span className="text-[#727E8F]">Total reward </span>
          <span className="ml-2 font-orbitron">{roundEther(staking.totalReward)}</span>
          <span className="ml-2 text-[#FF47C0]">BETH</span>
        </div>
      </div>
      <div className="grow" />
      <div className="flex w-2/5 flex-col items-start">
        <div className="text-[#727E8F]">Your share</div>
        <div>
          <span className="font-orbitron">{staking.sharePercentage.toFixed(2)} </span>
          <span className="text-[#727E8F]">% </span>
          <span className="ml-1">(~{roundEther(staking.shareAmount)}</span>
          <span className="ml-1 text-[#FF47C0]">BETH</span>)
        </div>
      </div>
    </div>
  );
};

const Divider = () => {
  return (
    <div className="m-1 flex flex-row">
      <div className="text-[#94A3B8]">Upcoming weeks</div>
      <div className="mx-2 my-auto  h-px grow bg-[#94A3B830]" />
    </div>
  );
};
