import { parseEther } from 'ethers';

export const relay_get = async (serverURL: string): Promise<RelayGetResponse> => {
  const response = await fetch(`${serverURL}/relay`);

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error);
  }
  let body = await response.json();
  return {
    min_broadcaster_fee: parseEther(body.min_broadcaster_fee),
  };
};

export type RelayGetResponse = {
  min_broadcaster_fee: bigint;
};
