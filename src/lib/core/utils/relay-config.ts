export type RelayConfig = {
  proverFeeShareInv: bigint;
  minProverFee: bigint;
  broadcasterFee: bigint;
  proverAddress: `0x${string}`;
};

export const bigIntMax = (a: bigint, b: bigint) => (a > b ? a : b);

export const calculateProverFee = (burnAmount: bigint, minProverFee: bigint, proverFeeShareInv: bigint) =>
  bigIntMax(minProverFee, burnAmount / proverFeeShareInv);
