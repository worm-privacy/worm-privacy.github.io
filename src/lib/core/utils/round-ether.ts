import { formatUnits } from 'ethers';

export const roundEther = (amount: bigint, precision?: number): string => {
  const f = parseFloat(formatUnits(amount, 18));
  return f < 1 ? f.toPrecision(1) : f.toFixed(precision ?? 4);
};

export const roundEtherF = (f: number, precision?: number): string => {
  return f < 1 ? f.toPrecision(1) : f.toFixed(precision ?? 4);
};
