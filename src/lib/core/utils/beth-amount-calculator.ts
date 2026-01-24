import { parseEther } from 'ethers';
import { roundEther } from './round-ether';

/// this 0.5% goes to stakers
const POOL_SHARE_INV = 200n as const; // 0.5%

/// returns amount of BETH user will get
export const calculateMintAmountStr = (
  burnAmount: string,
  swapAmount: string,
  proverFee: string,
  broadcasterFee: string
): string => {
  try {
    let bethAmount = calculateMintAmount(
      parseEther(burnAmount),
      parseEther(swapAmount),
      parseEther(proverFee),
      parseEther(broadcasterFee)
    );

    return roundEther(bethAmount, 2);
  } catch {
    return 'N/A';
  }
};

/// returns amount of BETH user will get
export const calculateMintAmount = (
  burnAmount: bigint,
  swapAmount: bigint,
  proverFee: bigint,
  broadcasterFee: bigint
): bigint => {
  const poolFee = burnAmount / POOL_SHARE_INV;
  return burnAmount - swapAmount - proverFee - broadcasterFee - poolFee;
};
