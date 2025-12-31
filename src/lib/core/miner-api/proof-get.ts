import { parseEther } from 'ethers';

export const proof_get = async (serverURL: string): Promise<ProofGetResponse> => {
  const response = await fetch(`${serverURL}/proof`);

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error);
  }
  let body = await response.json();
  return {
    min_prover_fee: parseEther(body.min_prover_fee),
    prover_address: body.prover_address,
  };
};

export type ProofGetResponse = {
  min_prover_fee: bigint;
  prover_address: string;
};
