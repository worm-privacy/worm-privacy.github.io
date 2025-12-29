import { WormNetwork } from '@/hooks/use-network';
import { formatEther, GetProofReturnType, toHex } from 'viem';

// POST /proof
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
  target_block: number;

  // same as alloy::EIP1186AccountProofResponse
  account_proof: {
    address: string;
    balance: string; // hex
    codeHash: string;
    nonce: string; // hex
    storageHash: string;
    accountProof: string[];
    storageProof: any[];
  };

  network: WormNetwork;
  burn_key: string;
  receiver_address: string;

  broadcaster_fee: string;
  prover_fee: string;
  spend: string;

  receiver_hook: string;
};

export const createProofPostRequest = (
  blockNumber: bigint,
  network: WormNetwork,
  burnKey: bigint,
  receiver_address: string,
  broadcaster_fee: bigint,
  prover_fee: bigint,
  spend: bigint,
  receiver_hook: string,
  proof: GetProofReturnType
): ProofPostRequest => {
  return {
    target_block: Number(blockNumber),
    network: network,
    burn_key: toHex(burnKey),
    receiver_address: receiver_address,
    broadcaster_fee: formatEther(broadcaster_fee),
    prover_fee: formatEther(prover_fee),
    spend: formatEther(spend),
    receiver_hook: receiver_hook,
    account_proof: {
      address: proof.address,
      balance: toHex(proof.balance),
      codeHash: proof.codeHash,
      nonce: toHex(proof.nonce),
      storageHash: proof.storageHash,
      accountProof: proof.accountProof,
      storageProof: proof.storageProof,
    },
  };
};

// GET /proof/{nullifier}
export const proof_get_by_nullifier = async (
  serverURL: string,
  nullifier: string
): Promise<RapidsnarkOutput | 'waiting'> => {
  const response = await fetch(`${serverURL}/proof/${nullifier}`);

  switch (response.status) {
    case 200:
      // proof is ready
      return await response.json();
    case 404:
      // proof is running or waiting in queue
      return 'waiting';
    default:
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error);
  }
};

type RapidsnarkProof = {
  pi_a: string[3];
  pi_b: string[2][3];
  pi_c: string[3];
  protocol: string;
};

export type RapidsnarkOutput = {
  proof: RapidsnarkProof;
  public: string[];
};
