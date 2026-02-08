import { WORMContract } from '@/lib/core/contracts/worm';
import { rewardOf } from '@/lib/core/utils/reward-of';
import { useCallback, useState } from 'react';
import { useClient, useConnection } from 'wagmi';

/// returns [result, refresh]
export function useClaimList(): [UseClaimListResult, () => Promise<void>] {
  const [result, setResult] = useState<UseClaimListResult>({ status: 'loading' });
  const client = useClient();
  const { address } = useConnection();

  let execute = useCallback(async () => {
    if (client == undefined || address == undefined) return;

    setResult({ status: 'loading' });

    try {
      let currentEpoch = 0n;
      let notClaimed: ClaimModel[] = [];

      let [_, nonZeros] = await WORMContract.epochsWithNonZeroRewards(client, 0n, 5000n, address, 50n);

      let ranges = findRanges(nonZeros);

      for (let range of ranges) {
        const info = await WORMContract.info(client, address, range.from, range.size);
        currentEpoch = info.currentEpoch; // overrides

        for (let i = 0; i < info.totalContribs.length; i++) {
          const epoch = BigInt(i) + range.from;
          const wormMintAmount = ((await rewardOf(epoch)) * info.userContribs[i]) / info.totalContribs[i];
          notClaimed.push({ epochNum: epoch, amount: wormMintAmount });
        }
      }

      let readyToClaim: ClaimModel[] = [];
      let upcoming: ClaimModel[] = [];
      for (let claim of notClaimed) {
        if (claim.epochNum < currentEpoch) readyToClaim.push(claim);
        else upcoming.push(claim);
      }

      setResult({
        status: 'loaded',
        readyToClaim,
        upcoming,
      });
    } catch (e) {
      console.error(e);
      setResult({ status: 'error', error: 'Error reading chain data' });
    }
  }, [client, address]);

  return [result, execute];
}

export type UseClaimListResult =
  | {
      status: 'error';
      error: string;
    }
  | {
      status: 'loading';
    }
  | {
      status: 'loaded';
      readyToClaim: ClaimModel[];
      upcoming: ClaimModel[];
    };

export type ClaimModel = {
  epochNum: bigint;
  amount: bigint;
};

const findRanges = (epochs: readonly bigint[]): { from: bigint; size: bigint }[] => {
  if (epochs.length === 0) {
    return [];
  }

  const ranges: { from: bigint; size: bigint }[] = [];
  let rangeStart = epochs[0];
  let count = 1n;

  for (let i = 1; i < epochs.length; i++) {
    if (epochs[i] === epochs[i - 1] + 1n) {
      count++;
    } else {
      ranges.push({ from: rangeStart, size: count });
      rangeStart = epochs[i];
      count = 1n;
    }
  }

  // Add the last range
  ranges.push({ from: rangeStart, size: count });

  return ranges;
};
