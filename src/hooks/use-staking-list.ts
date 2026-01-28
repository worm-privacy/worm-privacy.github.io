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

    //TODO remove this, this is only for testing UI
    await new Promise((resolve) => setTimeout(resolve, 1000));
    try {
      setResult({
        status: 'loaded',
        readyToClaim: [
          { weekNumber: 5n, totalReward: parseEther('1.1'), shareAmount: parseEther('0.01'), sharePercentage: 0.1 },
          { weekNumber: 6n, totalReward: parseEther('50.1'), shareAmount: parseEther('1'), sharePercentage: 50 },
        ],
        upcoming: [
          { weekNumber: 5n, totalReward: parseEther('1.1'), shareAmount: parseEther('0.01'), sharePercentage: 0.1 },
          { weekNumber: 6n, totalReward: parseEther('50.1'), shareAmount: parseEther('1'), sharePercentage: 50 },
        ],
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
      readyToClaim: StakingItem[];
      upcoming: StakingItem[];
    };

export type StakingItem = {
  weekNumber: bigint;
  totalReward: bigint;
  shareAmount: bigint;
  sharePercentage: number;
};
