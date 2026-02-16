import { Client } from 'viem';
import { simulateContract } from 'viem/actions';
import { BETHContractAddress } from './beth';
import { WETHContractAddress } from './weth';

//TODO change this address
// mainnet address 0xeae871C4a8dD267146558C362c86805FB7e3Fd2F
// testnet address 0xadD719B41f49E59C9af69021a4F74C4ff1f7B3b0
export const CypherETHQuoterContractAddress = '0xeae871C4a8dD267146558C362c86805FB7e3Fd2F';

export const DEPLOYER = '0x0000000000000000000000000000000000000000';

export namespace CypherETHQuoterContract {
  /// returns (uint256 amountOut, uint16 fee)
  export const quoteExactInputSingle = async (
    client: Client,
    tokenIn: `0x${string}`,
    tokenOut: `0x${string}`,
    deployer: `0x${string}`,
    amountIn: bigint,
    limitSqrtPrice: bigint
  ) => {
    return await simulateContract(client, {
      address: CypherETHQuoterContractAddress,
      abi: CypherETHQuoterContractABI,
      functionName: 'quoteExactInputSingle',
      args: [{ tokenIn, tokenOut, deployer, amountIn, limitSqrtPrice }],
    });
  };

  export const estimateBethEtherSwap = async (client: Client, amountIn: bigint) => {
    if (amountIn === 0n) return 0n;

    return (
      await CypherETHQuoterContract.quoteExactInputSingle(
        client,
        BETHContractAddress,
        WETHContractAddress,
        DEPLOYER,
        amountIn,
        0n
      )
    ).result[0]; // extract amountOut
  };
}

// copied from https://etherscan.io/address/0x02f22D58d161d1C291ABfe88764d84120f20F723#code
export const CypherETHQuoterContractABI = [
  {
    inputs: [
      { internalType: 'address', name: '_factory', type: 'address' },
      { internalType: 'address', name: '_WNativeToken', type: 'address' },
      { internalType: 'address', name: '_poolDeployer', type: 'address' },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [],
    name: 'WNativeToken',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'int256', name: 'amount0Delta', type: 'int256' },
      { internalType: 'int256', name: 'amount1Delta', type: 'int256' },
      { internalType: 'bytes', name: 'path', type: 'bytes' },
    ],
    name: 'algebraSwapCallback',
    outputs: [],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'factory',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'poolDeployer',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'bytes', name: 'path', type: 'bytes' },
      { internalType: 'uint256', name: 'amountInRequired', type: 'uint256' },
    ],
    name: 'quoteExactInput',
    outputs: [
      { internalType: 'uint256[]', name: 'amountOutList', type: 'uint256[]' },
      { internalType: 'uint256[]', name: 'amountInList', type: 'uint256[]' },
      { internalType: 'uint160[]', name: 'sqrtPriceX96AfterList', type: 'uint160[]' },
      { internalType: 'uint32[]', name: 'initializedTicksCrossedList', type: 'uint32[]' },
      { internalType: 'uint256', name: 'gasEstimate', type: 'uint256' },
      { internalType: 'uint16[]', name: 'feeList', type: 'uint16[]' },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { internalType: 'address', name: 'tokenIn', type: 'address' },
          { internalType: 'address', name: 'tokenOut', type: 'address' },
          { internalType: 'address', name: 'deployer', type: 'address' },
          { internalType: 'uint256', name: 'amountIn', type: 'uint256' },
          { internalType: 'uint160', name: 'limitSqrtPrice', type: 'uint160' },
        ],
        internalType: 'struct IQuoterV2.QuoteExactInputSingleParams',
        name: 'params',
        type: 'tuple',
      },
    ],
    name: 'quoteExactInputSingle',
    outputs: [
      { internalType: 'uint256', name: 'amountOut', type: 'uint256' },
      { internalType: 'uint256', name: 'amountIn', type: 'uint256' },
      { internalType: 'uint160', name: 'sqrtPriceX96After', type: 'uint160' },
      { internalType: 'uint32', name: 'initializedTicksCrossed', type: 'uint32' },
      { internalType: 'uint256', name: 'gasEstimate', type: 'uint256' },
      { internalType: 'uint16', name: 'fee', type: 'uint16' },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'bytes', name: 'path', type: 'bytes' },
      { internalType: 'uint256', name: 'amountOutRequired', type: 'uint256' },
    ],
    name: 'quoteExactOutput',
    outputs: [
      { internalType: 'uint256[]', name: 'amountOutList', type: 'uint256[]' },
      { internalType: 'uint256[]', name: 'amountInList', type: 'uint256[]' },
      { internalType: 'uint160[]', name: 'sqrtPriceX96AfterList', type: 'uint160[]' },
      { internalType: 'uint32[]', name: 'initializedTicksCrossedList', type: 'uint32[]' },
      { internalType: 'uint256', name: 'gasEstimate', type: 'uint256' },
      { internalType: 'uint16[]', name: 'feeList', type: 'uint16[]' },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { internalType: 'address', name: 'tokenIn', type: 'address' },
          { internalType: 'address', name: 'tokenOut', type: 'address' },
          { internalType: 'address', name: 'deployer', type: 'address' },
          { internalType: 'uint256', name: 'amount', type: 'uint256' },
          { internalType: 'uint160', name: 'limitSqrtPrice', type: 'uint160' },
        ],
        internalType: 'struct IQuoterV2.QuoteExactOutputSingleParams',
        name: 'params',
        type: 'tuple',
      },
    ],
    name: 'quoteExactOutputSingle',
    outputs: [
      { internalType: 'uint256', name: 'amountOut', type: 'uint256' },
      { internalType: 'uint256', name: 'amountIn', type: 'uint256' },
      { internalType: 'uint160', name: 'sqrtPriceX96After', type: 'uint160' },
      { internalType: 'uint32', name: 'initializedTicksCrossed', type: 'uint32' },
      { internalType: 'uint256', name: 'gasEstimate', type: 'uint256' },
      { internalType: 'uint16', name: 'fee', type: 'uint16' },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;
