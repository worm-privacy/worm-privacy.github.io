import { Client } from 'viem';
import { CypherETHQuoterContract } from '../core/contracts/cyphereth-quoter';
import { UniswapV3Quoter } from '../core/contracts/uniswap/v3qouter';
import { ListedToken } from '../core/tokens-config';
import { calculateMintAmount } from '../core/utils/beth-amount-calculator';

/// 1. ERC20-in to ETH (uniswap)
/// 2. ETH to BETH (fees)
/// 3. BETH to ETH (cypher-eth)
/// 4. ETH to ERC20-out (uniswap)
export const estimatePrivateSwap = async (
  client: Client,
  tokenIn: ListedToken,
  tokenOut: ListedToken,
  amountIn: bigint,
  proverFee: bigint,
  broadcasterFee: bigint
) => {
  let burnAmount: bigint;
  switch (tokenIn.type) {
    case 'native':
      burnAmount = amountIn; // ETH to ETH is 1:1
      break;
    case 'erc20':
      burnAmount = await UniswapV3Quoter.quoteExactInput(client, tokenIn.pathToWETH, amountIn);
      break;
  }

  const mintAmount = calculateMintAmount(burnAmount, 0n, proverFee, broadcasterFee);
  if (mintAmount <= 0) throw INPUT_AMOUNT_NOT_ENOUGH;

  const ethReceiveAmount = await CypherETHQuoterContract.estimateBethEtherSwap(client, mintAmount);

  let tokenOutReceiveAmount: bigint;
  switch (tokenOut.type) {
    case 'native':
      tokenOutReceiveAmount = ethReceiveAmount; // when tokenOut is ETH this is 1:1
      break;
    case 'erc20':
      tokenOutReceiveAmount = await UniswapV3Quoter.quoteExactInput(
        client,
        tokenOut.pathToWETH.toReversed(),
        ethReceiveAmount
      );
      break;
  }

  return { tokenOut: tokenOutReceiveAmount, burnAmountETH: burnAmount };
};

export const INPUT_AMOUNT_NOT_ENOUGH = 'Input amount not enough' as const;
