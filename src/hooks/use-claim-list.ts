import { WORMcontractABI, WORMcontractAddress } from '@/lib/core/contracts/worm';
import { useCallback, useState } from 'react';
import { getContractEvents, readContract } from 'viem/actions';
import { useClient, useConnection } from 'wagmi';
import { REWARD_DECAY_DENOMINATOR, REWARD_DECAY_NUMERATOR } from './use-epoch-list';

/// returns [result, refresh]
export function useClaimList(): [UseClaimListResult, () => Promise<void>] {
  const [result, setResult] = useState<UseClaimListResult>({ status: 'loading' });
  const client = useClient();
  const { address } = useConnection();

  let execute = useCallback(async () => {
    if (client == undefined || address == undefined) return;

    setResult({ status: 'loading' });

    try {
      let currentEpoch = await readContract(client, {
        address: WORMcontractAddress,
        abi: WORMcontractABI,
        functionName: 'currentEpoch',
        args: [],
      });

      let participates = (
        await getContractEvents(client, {
          address: WORMcontractAddress,
          abi: WORMcontractABI,
          eventName: 'Participated',
          args: { participant: address },
        })
      ).map((p) => p.args);

      let claims = (
        await getContractEvents(client, {
          address: WORMcontractAddress,
          abi: WORMcontractABI,
          eventName: 'Claimed',
          args: { claimant: address },
        })
      ).map((c) => c.args);

      let alreadyClaimedEpochs = new Set<bigint>();
      for (let claim of claims) {
        for (let i = 0n; i < claim.numEpochs!; i++) {
          alreadyClaimedEpochs.add(claim.fromEpoch! + i);
        }
      }

      let notClaimed: ClaimModel[] = [];
      for (let participate of participates) {
        const amount = participate.amountPerEpoch!;
        for (let i = 0n; i < participate.numEpochs!; i++) {
          const epochNum = participate.fromEpoch! + i;
          if (alreadyClaimedEpochs.has(epochNum)) continue; // already claimed
          const epoch = notClaimed.find((e) => e.epochNum == epochNum);
          if (epoch) epoch.amount += amount;
          else notClaimed.push({ epochNum, amount: amount });
        }
      }
      // notClaimed `amount` values are in BETH
      // We need to calculate worm mint amount
      for (let e of notClaimed) {
        const totalBeth = await readContract(client, {
          address: WORMcontractAddress,
          abi: WORMcontractABI,
          functionName: 'epochTotal',
          args: [e.epochNum],
        });
        const userBeth = e.amount;
        const wormMintAmount = ((await rewardOf(e.epochNum)) * userBeth) / totalBeth;
        e.amount = wormMintAmount; // So .amount is now converted to Worm
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

/// returns mint amount of epoch reward (WORM amount)
const rewardOf = async (epoch: bigint): Promise<bigint> => {
  let reward = 50000000000000000000n;
  for (let i = 0n; i < epoch; i++) {
    reward = (reward * REWARD_DECAY_NUMERATOR) / REWARD_DECAY_DENOMINATOR;
    // giving up on CPU a lil bit to prevent lag
    if (i % 10000n === 0n) await new Promise((resolve) => setTimeout(resolve, 0));
  }
  return reward;
};
