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
      let currentWeek = 0n;
      let notClaimed: StakingItem[] = [];

      let stakes = await StakingContract.getAllStakes(client, address);
      for (let stakingLog of stakes) {
        let info = await StakingContract.info(
          client!,
          address,
          BigInt(stakingLog.startingEpoch),
          BigInt(stakingLog.releaseEpoch - stakingLog.startingEpoch)
        );
        currentWeek = info.currentEpoch;
        for (let i = 0; i < info.userLocks.length; i++) {
          const weekNumber = BigInt(i) + stakingLog.startingEpoch;
          if (info.userLocks[i] !== 0n) {
            if (notClaimed.findIndex((e) => e.weekNumber === weekNumber) === -1) {
              // 1 > share > 0
              const share = info.totalLocks[i] === 0n ? 0 : Number(info.userLocks[i]) / Number(info.totalLocks[i]);
              const shareAmount = BigInt(Math.round(Number(info.rewards[i]) * share));
              notClaimed.push({
                weekNumber,
                totalReward: info.rewards[i],
                shareAmount: shareAmount,
                sharePercentage: share * 100,
              });
            }
          }
        }
      }

      let readyToClaim: StakingItem[] = [];
      let upcoming: StakingItem[] = [];
      for (let claim of notClaimed) {
        if (claim.weekNumber < currentWeek) readyToClaim.push(claim);
        else upcoming.push(claim);
      }
      setResult({ status: 'loaded', readyToClaim, upcoming });
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
      readyToClaim: StakingItem[];
      upcoming: StakingItem[];
    };

export type StakingItem = {
  weekNumber: bigint;
  totalReward: bigint;
  shareAmount: bigint;
  sharePercentage: number;
};
