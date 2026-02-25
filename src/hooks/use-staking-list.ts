import { StakingContract } from '@/lib/core/contracts/staking';
import { useCallback, useState } from 'react';
import { useClient, useConnection } from 'wagmi';

/// returns [result, refresh]
export function useStakingList(): [UseStakingListResult, () => Promise<void>] {
  const [result, setResult] = useState<UseStakingListResult>({ status: 'loading' });
  const client = useClient();
  const { address } = useConnection();

  let execute = useCallback(async () => {
    if (client == undefined || address == undefined) return;

    setResult({ status: 'loading' });

    try {
      let currentWeek = await StakingContract.currentEpoch(client);

      let stakes: StakingItem[] = (await StakingContract.getAllStakes(client, address)).map((e) => {
        let state: StakingState;
        if (e.released) {
          state = 'Released';
        } else {
          if (currentWeek >= e.releaseEpoch) state = 'Ended';
          else if (currentWeek < e.startingEpoch) state = 'Queued';
          else state = 'Active';
        }
        return {
          stakeNumber: e.index,
          startWeek: e.startingEpoch,
          endWeek: e.releaseEpoch,
          state,
          stakeAmount: e.amount,
        };
      });

      let weeks: StakingWeekItem[] = [];
      for (let stakingLog of stakes) {
        let info = await StakingContract.info(
          client!,
          address,
          BigInt(stakingLog.startWeek),
          BigInt(stakingLog.endWeek - stakingLog.startWeek)
        );
        for (let i = 0; i < info.userLocks.length; i++) {
          const weekNumber = BigInt(i) + stakingLog.startWeek;
          if (info.userLocks[i] === 0n) continue; // this prevents showing weeks with zero rewards to user (already claimed)

          if (weeks.findIndex((e) => e.weekNumber === weekNumber) === -1) {
            // 1 > share > 0
            const share = info.totalLocks[i] === 0n ? 0 : Number(info.userLocks[i]) / Number(info.totalLocks[i]);
            const shareAmount = BigInt(Math.round(Number(info.rewards[i]) * share));
            weeks.push({
              weekNumber,
              totalReward: info.rewards[i],
              yourShare: share * 100,
              yourReward: shareAmount,
            });
          }
        }
      }

      setResult({
        status: 'loaded',
        stakes,
        weeks,
        currentWeek,
      });
    } catch (e) {
      console.error(e);
      setResult({ status: 'error', error: 'Error reading chain data' });
    }
  }, [client, address]);

  return [result, execute];
}

export type UseStakingListResult =
  | {
      status: 'error';
      error: string;
    }
  | {
      status: 'loading';
    }
  | {
      status: 'loaded';
      weeks: StakingWeekItem[];
      stakes: StakingItem[];
      currentWeek: bigint;
    };

export type StakingItem = {
  stakeNumber: bigint;
  startWeek: bigint;
  endWeek: bigint;
  state: StakingState;
  stakeAmount: bigint; // in WORM
};

export type StakingState = 'Active' | 'Ended' | 'Queued' | 'Released';

export type StakingWeekItem = {
  weekNumber: bigint;
  totalReward: bigint; // in BETH
  yourReward: bigint; // in BETH
  yourShare: number; // 0 - 100
};
