import { Epoch } from '@/app/tools/mine-worm/epoch-viewer';
import { WORMcontractABI, WORMcontractAddress } from '@/lib/core/contracts/worm';
import { useCallback, useEffect, useState } from 'react';
import { readContract } from 'viem/actions';
import { useClient, useConnection } from 'wagmi';

/// returns [epochs, currentEpochNumber, error, loading]
export function useEpochList(): UseEpochListResult {
  const [result, setResult] = useState<UseEpochListResult>({ status: 'loading' });
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
      let since = currentEpoch < 2 ? 0n : currentEpoch - 2n;

      let info = await readContract(client, {
        address: WORMcontractAddress,
        abi: WORMcontractABI,
        functionName: 'info',
        args: [address, since, 5n],
      });

      let epochs: Epoch[] = [];
      for (let i = 0; i < 5; i++) {
        const share = info.totalContribs[i] === 0n ? 0 : Number((info.userContribs[i] / info.totalContribs[i]) * 100n);
        const reward = rewardOf(since + BigInt(i), info.currentEpoch, info.currentEpochReward);
        epochs.push({
          num: since + BigInt(i),
          bethAmount: info.totalContribs[i],
          wormAmount: reward,
          share: share,
          shareAmount: (BigInt(share) / 100n) * reward,
        });
      }

      setResult({
        status: 'loaded',
        currentEpoch: currentEpoch,
        epochs: epochs,
        epochPassedTime: info.epochRemainingTime,
      });
    } catch (e) {
      console.error(e);
      setResult({ status: 'error', error: 'Error reading chain data' });
    }
  }, [client, address]);

  useEffect(() => {
    execute();
  }, [execute]);

  return result;
}

export type UseEpochListResult =
  | {
      status: 'error';
      error: string;
    }
  | {
      status: 'loading';
    }
  | {
      status: 'loaded';
      epochs: Epoch[];
      currentEpoch: bigint;
      epochPassedTime: bigint; // seconds
    };

const REWARD_DECAY_NUMERATOR = 9999966993045875n;
const REWARD_DECAY_DENOMINATOR = 10000000000000000n;
const rewardOf = (epoch: bigint, sampleEpoch: bigint, sampleEpochReward: bigint): bigint => {
  if (epoch == sampleEpoch) return sampleEpochReward;

  let i = sampleEpoch;
  let reward = sampleEpochReward;
  if (epoch > sampleEpoch) {
    while (i !== epoch) {
      reward = (reward * REWARD_DECAY_NUMERATOR) / REWARD_DECAY_DENOMINATOR;
      i++;
    }
  } else {
    while (i !== epoch) {
      reward = (reward * REWARD_DECAY_DENOMINATOR) / REWARD_DECAY_NUMERATOR;
      i--;
    }
  }

  return reward;
};
