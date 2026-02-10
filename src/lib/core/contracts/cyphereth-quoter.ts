import { Client } from 'viem';
import { simulateContract } from 'viem/actions';
import { BETHContractAddress } from './beth';
import { WETHContractAddress } from './weth';

//TODO change this address
export const CypherETHQuoterContractAddress = '0x02f22D58d161d1C291ABfe88764d84120f20F723'; // mainnet address

export const DEPLOYER = '0x1234'; // TODO

export namespace CypherETHQuoterContract {
  /// returns (uint256 amountOut, uint16 fee)
  export const quoteExactInputSingle = async (
    client: Client,
    tokenA: `0x${string}`,
    tokenB: `0x${string}`,
    deployer: `0x${string}`,
    amountIn: bigint,
    limitSqrtPrice: bigint
  ) => {
    return await simulateContract(client, {
      address: CypherETHQuoterContractAddress,
      abi: CypherETHQuoterContractABI,
      functionName: 'quoteExactInputSingle',
      args: [tokenA, tokenB, deployer, amountIn, limitSqrtPrice],
    });
  };

  export const estimateBethEtherSwap = async (client: Client, amountIn: bigint) => {
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
      { internalType: 'uint256', name: 'amountIn', type: 'uint256' },
    ],
    name: 'quoteExactInput',
    outputs: [
      { internalType: 'uint256', name: 'amountOut', type: 'uint256' },
      { internalType: 'uint16[]', name: 'fees', type: 'uint16[]' },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'tokenIn', type: 'address' },
      { internalType: 'address', name: 'tokenOut', type: 'address' },
      { internalType: 'address', name: 'deployer', type: 'address' },
      { internalType: 'uint256', name: 'amountIn', type: 'uint256' },
      { internalType: 'uint160', name: 'limitSqrtPrice', type: 'uint160' },
    ],
    name: 'quoteExactInputSingle',
    outputs: [
      { internalType: 'uint256', name: 'amountOut', type: 'uint256' },
      { internalType: 'uint16', name: 'fee', type: 'uint16' },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'bytes', name: 'path', type: 'bytes' },
      { internalType: 'uint256', name: 'amountOut', type: 'uint256' },
    ],
    name: 'quoteExactOutput',
    outputs: [
      { internalType: 'uint256', name: 'amountIn', type: 'uint256' },
      { internalType: 'uint16[]', name: 'fees', type: 'uint16[]' },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'tokenIn', type: 'address' },
      { internalType: 'address', name: 'tokenOut', type: 'address' },
      { internalType: 'address', name: 'deployer', type: 'address' },
      { internalType: 'uint256', name: 'amountOut', type: 'uint256' },
      { internalType: 'uint160', name: 'limitSqrtPrice', type: 'uint160' },
    ],
    name: 'quoteExactOutputSingle',
    outputs: [
      { internalType: 'uint256', name: 'amountIn', type: 'uint256' },
      { internalType: 'uint16', name: 'fee', type: 'uint16' },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;
