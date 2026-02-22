import { WORMContract } from '@/lib/core/contracts/worm';
import { rewardOf } from '@/lib/core/utils/reward-of';
import { participationLogsRepo } from '@/lib/data/participation-logs-repo';
import { useCallback, useState } from 'react';
import { readContract } from 'viem/actions';
import { useClient, useConnection } from 'wagmi';

const ICOWORM_ADDRESS = '0xf81e34cc12fcc8c56681777881ee7e37698856ff' as const;

const ICOWORM_ABI = [
  {
    type: 'function',
    name: 'balanceOf',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
] as const;

/// returns [result, refresh]
export function useTgeShareList(): [UseShareListResult, () => Promise<void>] {
  const [result, setResult] = useState<UseShareListResult>({ status: 'loading' });
  const client = useClient();
  const { address } = useConnection();

  let execute = useCallback(async () => {
    if (client == undefined || address == undefined) return;

    setResult({ status: 'loading' });

    try {
      let currentEpoch = 0n;
      let notClaimed: ShareModel[] = [];

      let shares: ShareModel[] = [];

      // Query ICOWORM balance
      let icowormBalance = 0n;
      try {
        icowormBalance = await readContract(client, {
          address: ICOWORM_ADDRESS,
          abi: ICOWORM_ABI,
          functionName: 'balanceOf',
          args: [address],
        });
      } catch (e) {
        console.error('Error fetching ICOWORM balance:', e);
      }

      setResult({
        status: 'loaded',
        shares,
        icowormBalance,
      });
    } catch (e) {
      console.error(e);
      setResult({ status: 'error', error: 'Error reading chain data' });
    }
  }, [client, address]);

  return [result, execute];
}

export type UseShareListResult =
  | {
      status: 'error';
      error: string;
    }
  | {
      status: 'loading';
    }
  | {
      status: 'loaded';
      shares: ShareModel[];
      icowormBalance: bigint;
    };

export type ShareModel = {
  amount: bigint;
};
