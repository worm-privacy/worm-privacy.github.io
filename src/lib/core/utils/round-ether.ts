import { formatUnits } from 'ethers';

export const roundEther = (amount: bigint): string => parseFloat(formatUnits(amount, 18)).toFixed(4);
