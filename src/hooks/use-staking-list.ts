import { useCallback, useState } from 'react';
import { parseEther } from 'viem';
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
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const stakes: StakingItem[] = [
        { stakeNumber: 1n, startWeek: 80n, endWeek: 90n, stakeAmount: parseEther('111.12342345'), state: 'Ended' },
        { stakeNumber: 2n, startWeek: 100n, endWeek: 110n, stakeAmount: parseEther('200.12342345'), state: 'Active' },
        { stakeNumber: 3n, startWeek: 105n, endWeek: 106n, stakeAmount: parseEther('2.12342345'), state: 'Queued' },
        { stakeNumber: 3n, startWeek: 105n, endWeek: 106n, stakeAmount: parseEther('2.12342345'), state: 'Released' },
        { stakeNumber: 3n, startWeek: 105n, endWeek: 106n, stakeAmount: parseEther('2.12342345'), state: 'Released' },
        { stakeNumber: 3n, startWeek: 105n, endWeek: 106n, stakeAmount: parseEther('2.12342345'), state: 'Released' },
        { stakeNumber: 3n, startWeek: 105n, endWeek: 106n, stakeAmount: parseEther('2.12342345'), state: 'Released' },
      ];
      const claimable: StakingWeekItem[] = [
        {
          weekNumber: 81n,
          totalReward: parseEther('101.11123443'),
          yourReward: parseEther('33.245'),
          yourShare: 33.22345,
        },
        {
          weekNumber: 82n,
          totalReward: parseEther('101.123443'),
          yourReward: parseEther('33.988731'),
          yourShare: 33.22345,
        },
        {
          weekNumber: 83n,
          totalReward: parseEther('101.123443'),
          yourReward: parseEther('33.988731'),
          yourShare: 33.22345,
        },
        {
          weekNumber: 84n,
          totalReward: parseEther('101.123443'),
          yourReward: parseEther('33.988731'),
          yourShare: 33.22345,
        },
        {
          weekNumber: 85n,
          totalReward: parseEther('101.123443'),
          yourReward: parseEther('33.988731'),
          yourShare: 33.22345,
        },
        {
          weekNumber: 86n,
          totalReward: parseEther('101.123443'),
          yourReward: parseEther('33.988731'),
          yourShare: 33.22345,
        },
      ];
      setResult({
        status: 'loaded',
        stakes: stakes,
        weeks: claimable,
        currentWeek: 81n,
      });
      // let currentWeek = 0n;
      // let notClaimed: StakingItem[] = [];

      // let stakes = await StakingContract.getAllStakes(client, address);
      // for (let stakingLog of stakes) {
      //   let info = await StakingContract.info(
      //     client!,
      //     address,
      //     BigInt(stakingLog.startingEpoch),
      //     BigInt(stakingLog.releaseEpoch - stakingLog.startingEpoch)
      //   );
      //   currentWeek = info.currentEpoch;
      //   for (let i = 0; i < info.userLocks.length; i++) {
      //     const weekNumber = BigInt(i) + stakingLog.startingEpoch;
      //     if (info.userLocks[i] !== 0n) {
      //       if (notClaimed.findIndex((e) => e.weekNumber === weekNumber) === -1) {
      //         // 1 > share > 0
      //         const share = info.totalLocks[i] === 0n ? 0 : Number(info.userLocks[i]) / Number(info.totalLocks[i]);
      //         const shareAmount = BigInt(Math.round(Number(info.rewards[i]) * share));
      //         notClaimed.push({
      //           weekNumber,
      //           totalReward: info.rewards[i],
      //           shareAmount: shareAmount,
      //           sharePercentage: share * 100,
      //         });
      //       }
      //     }
      //   }
      // }

      // let readyToClaim: StakingItem[] = [];
      // let upcoming: StakingItem[] = [];
      // for (let claim of notClaimed) {
      //   if (claim.weekNumber < currentWeek) readyToClaim.push(claim);
      //   else upcoming.push(claim);
      // }
      // setResult({ status: 'loaded', readyToClaim, stakes: upcoming });
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
  state: 'Active' | 'Ended' | 'Queued' | 'Released';
  stakeAmount: bigint; // in WORM
};

export type StakingWeekItem = {
  weekNumber: bigint;
  totalReward: bigint; // in BETH
  yourReward: bigint; // in BETH
  yourShare: number; // 0 - 100
};
