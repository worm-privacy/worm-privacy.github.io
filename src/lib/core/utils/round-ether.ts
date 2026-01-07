import { formatUnits } from 'ethers';

export const roundEther = (amount: bigint, precision?: number): string =>
  parseFloat(formatUnits(amount, 18)).toFixed(precision ?? 4);
