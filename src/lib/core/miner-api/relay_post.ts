import { WormNetwork } from '@/hooks/use-network';
import { formatEther } from 'ethers';
import { toHex } from 'viem';
import { RapidsnarkOutput } from './proof-get-by-nullifier';

// POST /relay
export const relay_post = async (serverURL: string, payload: RelayPostRequest): Promise<void> => {
  let body: RelayPostRequestAPI = {
    network: payload.network,
    proof: payload.proof,
    nullifier: toHex(payload.nullifier),
    remaining_coin: toHex(payload.remaining_coin),
    broadcaster_fee: formatEther(payload.broadcaster_fee),
    reveal_amount: formatEther(payload.reveal_amount),
    receiver: payload.receiver,
    prover_fee: formatEther(payload.prover_fee),
    swap_calldata: toHex(payload.swap_calldata),
  };

  const response = await fetch(`${serverURL}/relay`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error);
  }
};

export type RelayPostRequest = {
  network: WormNetwork;
  proof: RapidsnarkOutput;
  nullifier: bigint;

  // poseidon3(prefix, burn_key, amount-spend)
  remaining_coin: bigint;

  broadcaster_fee: bigint;
  reveal_amount: bigint;
  receiver: string;
  prover_fee: bigint;

  swap_calldata: Uint8Array;
};

type RelayPostRequestAPI = {
  network: WormNetwork;
  proof: RapidsnarkOutput;
  nullifier: string;

  // poseidon3(prefix, burn_key, amount-spend)
  remaining_coin: string;

  broadcaster_fee: string;
  reveal_amount: string;
  receiver: string;
  prover_fee: string;

  swap_calldata: string;
};
