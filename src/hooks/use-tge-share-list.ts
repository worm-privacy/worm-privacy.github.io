import { WORMContract } from '@/lib/core/contracts/worm';
import { rewardOf } from '@/lib/core/utils/reward-of';
import { participationLogsRepo } from '@/lib/data/participation-logs-repo';
import { useCallback, useState } from 'react';
import { readContract } from 'viem/actions';
import { useClient, useConnection } from 'wagmi';

const ICOWORM_ADDRESS = '0xf81e34cc12fcc8c56681777881ee7e37698856ff' as const;
const EXIT_CONTRACT_ADDRESS = '0x88a11fc875e7502959d643ef8bde6d05747a77d4' as const;

const ICOWORM_ABI = [
  {
    type: 'function',
    name: 'balanceOf',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'nullified',
    inputs: [{ name: '', type: 'address' }],
    outputs: [{ name: '', type: 'bool' }],
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

      // Query ICOWORM balance and nullified status
      let icowormBalance = 0n;
      let icowormNullified = false;
      try {
        [icowormBalance, icowormNullified] = await Promise.all([
          readContract(client, {
            address: ICOWORM_ADDRESS,
            abi: ICOWORM_ABI,
            functionName: 'balanceOf',
            args: [address],
          }),
          readContract(client, {
            address: EXIT_CONTRACT_ADDRESS,
            abi: ICOWORM_ABI,
            functionName: 'nullified',
            args: [address],
          }),
        ]);
      } catch (e) {
        console.error('Error fetching ICOWORM data:', e);
      }

      setResult({
        status: 'loaded',
        shares,
        icowormBalance,
        icowormNullified,
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
      icowormNullified: boolean;
    };

export type ShareModel = {
  amount: bigint;
};
