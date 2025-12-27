import { WormNetwork } from '@/hooks/use-network';
import { GetProofReturnType } from 'viem';

export const proof_post = async (serverURL: string, payload: ProofPostRequest): Promise<void> => {
  const response = await fetch(`${serverURL}/proof`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error);
  }
};

export type ProofPostRequest = {
  target_block: bigint;

  // same as alloy::EIP1186AccountProofResponse
  account_proof: GetProofReturnType;

  network: WormNetwork;
  burn_key: string;
  receiver_address: string;

  broadcaster_fee: string;
  prover_fee: string;
  spend: string;

  receiver_hook: string;
};
