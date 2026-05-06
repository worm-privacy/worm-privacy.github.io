import { encodeAbiParameters, encodeFunctionData, parseAbiParameters } from 'viem';

const BETHToERC20ContractAddress = ''; // TODO set this after deploy

export namespace BETHToERC20Contract {
  export const createSwapHook = (bethAmountIn: bigint, path: `0x${string}`, recipient: `0x${string}`) => {
    // Prevent error "Amount must be greater than 0" on running hook
    if (bethAmountIn === 0n) return '0x';

    const calldata = encodeFunctionData({
      abi: BETHToERC20ContractABI,
      functionName: 'swapBethWithERC20',
      args: [bethAmountIn, path, recipient],
    });

    return encodeAbiParameters(parseAbiParameters('address, uint256, bytes'), [
      BETHToERC20ContractAddress,
      bethAmountIn,
      calldata,
    ]);
  };
}

const BETHToERC20ContractABI = [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_bethContract',
        type: 'address',
        internalType: 'contract IERC20',
      },
      {
        name: '_wethContract',
        type: 'address',
        internalType: 'contract IWNativeToken',
      },
      {
        name: '_cypherETHRouter',
        type: 'address',
        internalType: 'contract ISwapRouter',
      },
      {
        name: '_uniswapRouter',
        type: 'address',
        internalType: 'contract IV3SwapRouter',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'bethContract',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'contract IERC20',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'cypherETHRouter',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'contract ISwapRouter',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'swapBethWithERC20',
    inputs: [
      {
        name: '_bethAmountIn',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: '_path',
        type: 'bytes',
        internalType: 'bytes',
      },
      {
        name: '_recipient',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'uniswapRouter',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'contract IV3SwapRouter',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'wethContract',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'contract IWNativeToken',
      },
    ],
    stateMutability: 'view',
  },
] as const;
