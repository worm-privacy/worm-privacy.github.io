import { Epoch } from '@/app/tools/mine-worm/epoch-viewer';
import { WORMContract } from '@/lib/core/contracts/worm';
import { rewardOfWithSample } from '@/lib/core/utils/reward-of';
import { useCallback, useState } from 'react';
import { useClient, useConnection } from 'wagmi';

/// returns [result, refresh]
export function useEpochList(): [UseEpochListResult, () => Promise<void>] {
  const [result, setResult] = useState<UseEpochListResult>({ status: 'loading' });
  const client = useClient();
  const { address } = useConnection();

  let execute = useCallback(async () => {
    if (client == undefined || address == undefined) return;

    setResult({ status: 'loading' });

    try {
      const currentEpoch = await WORMContract.currentEpoch(client);
      const since = currentEpoch < 2 ? 0n : currentEpoch - 2n;
      const info = await WORMContract.info(client, address, since, 5n);

      let epochs: Epoch[] = [];
      for (let i = 0; i < 5; i++) {
        const share = info.totalContribs[i] === 0n ? 0 : Number((info.userContribs[i] / info.totalContribs[i]) * 100n);
        const reward = rewardOfWithSample(since + BigInt(i), info.currentEpoch, info.currentEpochReward);
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

  return [result, execute];
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
