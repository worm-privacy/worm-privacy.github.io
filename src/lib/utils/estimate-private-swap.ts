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
  console.log('amountIn', amountIn);

  const burnAmount = await UniswapV3Quoter.quoteExactInput(client, tokenIn.pathToWETH, amountIn);
  console.log('burnAmount', burnAmount);

  const mintAmount = calculateMintAmount(burnAmount, 0n, proverFee, broadcasterFee);
  console.log('mintAmount', mintAmount);
  if (mintAmount <= 0) throw 'INPUT_AMOUNT_NOT_ENOUGH';

  const ethReceiveAmount = await CypherETHQuoterContract.estimateBethEtherSwap(client, mintAmount);
  console.log('ethReceiveAmount', ethReceiveAmount);

  const pathFromWETH = tokenOut.pathToWETH.toReversed();
  console.log('tokenOut.pathToWETH', tokenOut.pathToWETH);
  console.log('pathFromWETH', pathFromWETH);

  const tokenOutReceiveAmount = await UniswapV3Quoter.quoteExactInput(client, pathFromWETH, ethReceiveAmount);
  console.log('tokenOutReceiveAmount ', tokenOutReceiveAmount);

  return { tokenOut: tokenOutReceiveAmount, burnAmountETH: burnAmount };
};

export const INPUT_AMOUNT_NOT_ENOUGH = 'Input amount not enough';
