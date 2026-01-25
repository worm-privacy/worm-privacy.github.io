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
  target_block: string;
};
