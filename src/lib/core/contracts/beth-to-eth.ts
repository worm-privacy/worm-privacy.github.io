import { encodeAbiParameters, encodeFunctionData, parseAbiParameters } from 'viem';

// mainnet address: 0xbA5A285806c343AaD955a40FE4b6e5e607B752b6
// sepolia address: 0xB41bD692C004672aCaDbD7162c84b4381A58cFeC
export const BETHToETHContractAddress = '0xbA5A285806c343AaD955a40FE4b6e5e607B752b6';

export namespace BETHToETHContract {
  export const createSwapHook = (swapAmount: bigint, recipient: `0x${string}`) => {
    // Prevent error "Amount must be greater than 0" on running hook
    if (swapAmount === 0n) return '0x';

    const calldata = BETHToETHContract.createSwapBethWithEthCalldata(swapAmount, recipient);

    return encodeAbiParameters(parseAbiParameters('address, uint256, bytes'), [
      BETHToETHContractAddress,
      swapAmount,
      calldata,
    ]);
  };

  export const createSwapBethWithEthCalldata = (swapAmount: bigint, recipient: `0x${string}`) => {
    return encodeFunctionData({
      abi: BETHToETHContractABI,
      functionName: 'swapBethWithEth',
      args: [swapAmount, recipient],
    });
  };
}

export const BETHToETHContractABI = [
  {
    inputs: [
      { internalType: 'contract IERC20', name: '_bethContract', type: 'address' },
      { internalType: 'contract IWNativeToken', name: '_wethContract', type: 'address' },
      { internalType: 'contract ISwapRouter', name: '_swapRouterContract', type: 'address' },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  { stateMutability: 'payable', type: 'fallback' },
  {
    inputs: [],
    name: 'bethContract',
    outputs: [{ internalType: 'contract IERC20', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: '_swapAmount', type: 'uint256' },
      { internalType: 'address', name: '_recipient', type: 'address' },
    ],
    name: 'swapBethWithEth',
    outputs: [{ internalType: 'uint256', name: 'amountOut', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'swapRouterContract',
    outputs: [{ internalType: 'contract ISwapRouter', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'wethContract',
    outputs: [{ internalType: 'contract IWNativeToken', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;
