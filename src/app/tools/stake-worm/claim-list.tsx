import { Button, DialogTrigger } from '@/components/ui';
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog/dialog';
import { Icons } from '@/components/ui/icons';
import { StakingItem, StakingWeekItem, UseStakingListResult } from '@/hooks/use-staking-list';
import { StakingContract } from '@/lib/core/contracts/staking';
import { roundEther, roundEtherF } from '@/lib/core/utils/round-ether';
import { useState } from 'react';
import { formatEther } from 'viem';
import { useClient, useWriteContract } from 'wagmi';

export default function StakingClaimList(props: { result: UseStakingListResult; refresh: () => Promise<void> }) {
  return (
    <div className="flex h-[580px] w-[600px] flex-col gap-1 rounded-xl border border-[rgba(var(--neutral-low-rgb),0.24)] bg-[#010204] px-4 pt-2 shadow-lg">
      {props.result.status === 'loading' && <div className="text-white">Loading...</div>}
      {props.result.status === 'error' && <div className="text-red-500">Error loading data</div>}
      {props.result.status === 'loaded' && (
        <Main
          stakes={props.result.stakes}
          weeks={props.result.weeks}
          currentWeek={props.result.currentWeek}
          refresh={props.refresh}
        />
      )}
    </div>
  );
}

const Main = (props: {
  weeks: StakingWeekItem[];
  stakes: StakingItem[];
  currentWeek: bigint;
  refresh: () => Promise<void>;
}) => {
  const [tab, setTab] = useState<'Staking' | 'Weeks'>('Staking');

  return (
    <div className="flex h-full w-full flex-col">
      {/* tabs */}
      <div className="mb-1 flex flex-row">
        <button
          onClick={() => setTab('Staking')}
          className={`relative px-6 py-2 text-[14px] font-medium ${
            tab === 'Staking'
              ? 'border-b-2 border-[rgba(var(--brand-rgb),0.24)] text-brand'
              : 'text-gray-300 hover:text-white'
          } `}
        >
          Staking
        </button>
        <button
          onClick={() => setTab('Weeks')}
          className={`relative px-6 py-2 text-[14px] font-medium ${
            tab === 'Weeks'
              ? 'border-b-2 border-[rgba(var(--brand-rgb),0.24)] text-brand'
              : 'text-gray-300 hover:text-white'
          } `}
        >
          Weeks
        </button>
      </div>

      {/* lists */}
      {tab === 'Staking' && (
        <>
          {props.stakes.length === 0 && <div className="text-white">Nothing to show</div>}
          <div className="scrollbar-hide flex flex-col overflow-y-scroll">
            {props.stakes.map((e) => (
              <StakingItemComponent staking={e} currentWeek={props.currentWeek} refresh={props.refresh} />
            ))}
          </div>
        </>
      )}
      {tab === 'Weeks' && (
        <>
          {props.weeks.length === 0 && <div className="text-white">Nothing to show</div>}
          <div className="scrollbar-hide flex flex-col overflow-y-scroll">
            {props.weeks.map((e) => (
              <StakingWeekItemComponent week={e} currentWeek={props.currentWeek} refresh={props.refresh} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const StakingItemComponent = (props: { staking: StakingItem; currentWeek: bigint; refresh: () => Promise<void> }) => {
  const staking = props.staking;

  const { mutateAsync } = useWriteContract();
  const client = useClient();
  const [releaseState, setReleaseState] = useState<'idle' | 'loading' | 'error' | 'done'>('idle');

  const onReleaseClicked = async () => {
    try {
      setReleaseState('loading');
      await StakingContract.release(mutateAsync, client!, staking.stakeNumber);
      setReleaseState('done');
      await props.refresh();
    } catch (e) {
      setReleaseState('error');
      console.log(e);
    }
  };

  return (
    <Dialog>
      <DialogTrigger>
        <div className="m-1 flex flex-col items-center gap-2 rounded-[12px] bg-[#64748B1F] p-4 font-satoshi text-[16px] text-white">
          {/* week and arrow */}
          <div className="flex w-full flex-row items-start">
            <span className="text-white">
              Participate <span className="ml-1 font-orbitron text-[#727E8F]"> #{staking.stakeNumber}</span>
            </span>
            <div className={'ml-2 rounded-4xl px-3 py-1 text-[12px] ' + stakingStateStyleDiff(staking.state)}>
              {staking.state}
            </div>
            <div className="grow" />
            <Icons.halfArrow />
          </div>

          <div className="flex w-full grow flex-row">
            <div className="flex w-1/2 grow flex-col items-start">
              <div className="text-[14px] text-[#727E8F]">
                Staking period{' '}
                <span className="text-[12px] font-light text-[#2DDF9F]">Current week #{props.currentWeek}</span>
              </div>
              <div className="text-[14px]">
                <span>Week {staking.startWeek}</span>
                <span className="text-[#727E8F]"> To </span>
                <span>{staking.endWeek}</span>
              </div>
            </div>
            <div className="flex w-1/2 grow flex-col items-start">
              <div className="text-[14px] text-[#727E8F]">Stake amount</div>
              <div>
                <span className="ml-1 font-orbitron text-[12px]">{roundEther(staking.stakeAmount)}</span>
                <span className="ml-1 text-[14px] text-brand">WORM</span>
              </div>
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
          <DialogTitle>Participate #{staking.stakeNumber}</DialogTitle>
        </DialogHeader>
        <div className="satoshi-body2 max-h-61.5 px-8 pb-6 text-white">
          {releaseState == 'idle' && (
            <div className="flex flex-col">
              <div className="mb-2">Staked amount</div>
              <div className="flex flex-row">
                <div className="mr-2 text-[24px] font-bold text-white">{roundEther(staking.stakeAmount, 4)}</div>
                <div className="text-brand">WORM</div>
              </div>
              {props.staking.state === 'Ended' && (
                <button
                  onClick={onReleaseClicked}
                  className="mt-5 w-full rounded-lg bg-brand px-4 py-3 font-bold text-black"
                >
                  Release
                </button>
              )}
              {props.staking.state !== 'Ended' && (
                <button
                  disabled={true}
                  className="mt-5 w-full rounded-lg bg-[#64748B1F] px-4 py-3 font-bold text-[#64748B]"
                >
                  {props.staking.state === 'Released' ? 'Already released' : "Can't release yet"}
                </button>
              )}
            </div>
          )}
          {releaseState == 'loading' && <div className="w-full px-4 py-3 text-white">Hold on a sec...</div>}
          {releaseState == 'error' && <div className="w-full px-4 py-3 text-red-500">Error</div>}
          {releaseState == 'done' && <div className="w-full px-4 py-3 text-white">Released Successfully</div>}
        </div>
      </DialogContent>
    </Dialog>
  );
};
const StakingWeekItemComponent = (props: {
  week: StakingWeekItem;
  currentWeek: bigint;
  refresh: () => Promise<void>;
}) => {
  const week = props.week;

  const { mutateAsync } = useWriteContract();
  const client = useClient();
  const [claimState, setClaimState] = useState<'idle' | 'loading' | 'error' | 'done'>('idle');

  const onClaimClicked = async () => {
    try {
      setClaimState('loading');
      await StakingContract.claimReward(mutateAsync, client!, week.weekNumber, 1n);
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
        <div className="m-1 flex flex-col items-center gap-2 rounded-[12px] bg-[#64748B1F] p-4 font-satoshi text-[16px] text-white">
          {/* week and arrow */}
          <div className="flex w-full flex-row items-start">
            <span className="text-white">
              Week <span className="ml-1 font-orbitron text-[16px] text-[#727E8F]"> #{week.weekNumber}</span>
            </span>
            {props.currentWeek == week.weekNumber && (
              <div className="ml-2 rounded-4xl bg-[#64748B1F] px-3 py-1 text-[12px] text-white ">Current week</div>
            )}
            <div className="grow" />
            <Icons.halfArrow />
          </div>

          <div className="flex w-full grow flex-row">
            <div className="flex w-1/2 grow flex-col items-start">
              <div className="text-[14px] text-[#727E8F]">Total reward</div>
              <div className="text-[12px]">
                <span className="font-orbitron">{roundEther(week.totalReward)}</span>
                <span className="ml-2 text-[#FF47C0]">BETH</span>
              </div>
            </div>
            <div className="flex w-1/2 grow flex-col items-start">
              <div className="text-[14px] text-[#727E8F]">Your share</div>
              <div className="text-[12px]">
                <span className="font-orbitron">{roundEtherF(week.yourShare)}</span>
                <span className="text-[#727E8F]">% </span>
                <span className="ml-1 font-orbitron">{formatEther(week.yourReward)}</span>
                <span className="ml-1 text-[#FF47C0]">BETH</span>
              </div>
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
        <div className="satoshi-body2 max-h-61.5 px-8 pb-6 text-white">
          {claimState == 'idle' && (
            <div className="flex flex-col">
              <div className="mb-5 opacity-70">Week number {week.weekNumber}</div>
              <div className="mb-1">Your reward share: </div>
              <div className="flex flex-row">
                <div className="mr-2 text-[24px] font-bold text-white">{formatEther(week.yourReward)}</div>
                <div className="text-[#FF47C0]">BETH</div>
              </div>
              <div className="mt-5 mb-1">Total reward share: </div>
              <div className="flex flex-row">
                <div className="mr-2 text-[24px] font-bold text-white">{roundEther(week.totalReward, 4)}</div>
                <div className="text-[#FF47C0]">BETH</div>
              </div>
              {props.week.weekNumber > props.currentWeek ? (
                <button
                  onClick={onClaimClicked}
                  className="mt-5 w-full rounded-lg bg-brand px-4 py-3 font-bold text-black"
                >
                  Claim reward
                </button>
              ) : (
                <button className="mt-5 w-full rounded-lg bg-[#64748B1F] px-4 py-3 font-bold text-[#64748B]">
                  Can't claim reward yet
                </button>
              )}
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

const stakingStateStyleDiff = (state: 'Active' | 'Ended' | 'Queued' | 'Released') => {
  switch (state) {
    case 'Active':
      return 'bg-[#00C8711F] text-[#96FAD1]';
    case 'Queued':
      return 'bg-[#64748B1F] text-[#FFFFFF]';
    case 'Ended':
      return 'bg-[#FFB5471F] text-[#FFB547]';
    case 'Released':
      return 'bg-[#64748B1F] text-[#FFFFFF]';
  }
};
