import { WORMContract } from '@/lib/core/contracts/worm';
import { rewardOf } from '@/lib/core/utils/reward-of';
import { participationLogsRepo } from '@/lib/data/participation-logs-repo';
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

      for (let participation of participationLogsRepo.getItems()) {
        let info = await WORMContract.info(
          client!,
          address,
          BigInt(participation.fromEpoch),
          BigInt(participation.numberOfEpochs)
        );
        currentEpoch = info.currentEpoch; // overrides
        let i = 0;
        let epoch = BigInt(participation.fromEpoch);
        for (let userContrb of info.userContribs) {
          if (userContrb !== 0n) {
            if (notClaimed.findIndex((e) => e.epochNum === epoch) === -1) {
              const wormMintAmount = ((await rewardOf(epoch)) * userContrb) / info.totalContribs[i];
              notClaimed.push({ epochNum: epoch, amount: wormMintAmount });
            }
          }
          epoch++;
          i++;
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
