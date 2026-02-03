import { Client } from 'viem';
import { readContract, waitForTransactionReceipt } from 'viem/actions';
import { Config } from 'wagmi';
import { WriteContractMutateAsync } from 'wagmi/query';

// TODO: Update this address when deployed
export const DistributionContractAddress = '0xc98331493088676B4644fA43500d2C22CEf9202b';

export type ShareData = {
  id: string;
  owner: string;
  tge: string;
  startTime: string;
  initialAmount: string;
  amountPerSecond: string;
  totalCap: string;
  sig: string;
  note: string;
};

export type OnChainShare = {
  id: bigint;
  owner: `0x${string}`;
  tge: bigint;
  startTime: bigint;
  initialAmount: bigint;
  amountPerSecond: bigint;
  totalCap: bigint;
};

export namespace DistributionContract {
  export const getShare = async (client: Client, shareId: bigint): Promise<OnChainShare> => {
    const tuple = await readContract(client, {
      address: DistributionContractAddress,
      abi: DistributionContractABI,
      functionName: 'shares',
      args: [shareId],
    });

    return {
      id: tuple[0],
      owner: tuple[1],
      tge: tuple[2],
      startTime: tuple[3],
      initialAmount: tuple[4],
      amountPerSecond: tuple[5],
      totalCap: tuple[6],
    };
  };

  export const calculateClaimable = async (client: Client, shareId: bigint): Promise<bigint> => {
    const result = await readContract(client, {
      address: DistributionContractAddress,
      abi: DistributionContractABI,
      functionName: 'calculateClaimable',
      args: [shareId],
    });
    return result as bigint;
  };

  export const getShareClaimed = async (client: Client, shareId: bigint): Promise<bigint> => {
    const result = await readContract(client, {
      address: DistributionContractAddress,
      abi: DistributionContractABI,
      functionName: 'shareClaimed',
      args: [shareId],
    });
    return result as bigint;
  };

  export const reveal = async (
    mutateAsync: WriteContractMutateAsync<Config, unknown>,
    client: Client,
    share: ShareData
  ) => {
    console.log(`calling reveal for share ${share.id}`);
    const shareStruct = {
      id: BigInt(share.id),
      owner: share.owner as `0x${string}`,
      tge: BigInt(share.tge),
      startTime: BigInt(share.startTime),
      initialAmount: BigInt(share.initialAmount),
      amountPerSecond: BigInt(share.amountPerSecond),
      totalCap: BigInt(share.totalCap),
    };
    const trxHash = await mutateAsync({
      address: DistributionContractAddress,
      abi: DistributionContractABI,
      functionName: 'reveal',
      args: [shareStruct, share.sig as `0x${string}`],
    });
    console.log('waiting for receipt');
    const r = await waitForTransactionReceipt(client, { hash: trxHash });
    if (r.status == 'reverted') throw 'reveal reverted';
    console.log('reveal successful');
  };

  export const trigger = async (
    mutateAsync: WriteContractMutateAsync<Config, unknown>,
    client: Client,
    shareId: bigint
  ) => {
    console.log(`calling trigger for share ${shareId}`);
    const trxHash = await mutateAsync({
      address: DistributionContractAddress,
      abi: DistributionContractABI,
      functionName: 'trigger',
      args: [shareId],
    });
    console.log('waiting for receipt');
    const r = await waitForTransactionReceipt(client, { hash: trxHash });
    if (r.status == 'reverted') throw 'trigger reverted';
    console.log('trigger successful');
  };
}

export const DistributionContractABI = [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_token',
        type: 'address',
        internalType: 'contract IERC20',
      },
      {
        name: '_deadlineTimestamp',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: '_master',
        type: 'address',
        internalType: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'calculateClaimable',
    inputs: [
      {
        name: '_shareId',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'changeOwner',
    inputs: [
      {
        name: '_shareId',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: '_newOwner',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'deadlineTimestamp',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'master',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'address',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'reveal',
    inputs: [
      {
        name: '_share',
        type: 'tuple',
        internalType: 'struct Distributor.Share',
        components: [
          {
            name: 'id',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'owner',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'tge',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'startTime',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'initialAmount',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'amountPerSecond',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'totalCap',
            type: 'uint256',
            internalType: 'uint256',
          },
        ],
      },
      {
        name: '_signature',
        type: 'bytes',
        internalType: 'bytes',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'shareClaimed',
    inputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'shares',
    inputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [
      {
        name: 'id',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'owner',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'tge',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'startTime',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'initialAmount',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'amountPerSecond',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'totalCap',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'token',
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
    name: 'trigger',
    inputs: [
      {
        name: '_shareId',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    name: 'OwnerChanged',
    inputs: [
      {
        name: 'shareId',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'oldOwner',
        type: 'address',
        indexed: false,
        internalType: 'address',
      },
      {
        name: 'newOwner',
        type: 'address',
        indexed: false,
        internalType: 'address',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'ShareRevealed',
    inputs: [
      {
        name: 'share',
        type: 'tuple',
        indexed: false,
        internalType: 'struct Distributor.Share',
        components: [
          {
            name: 'id',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'owner',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'tge',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'startTime',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'initialAmount',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'amountPerSecond',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'totalCap',
            type: 'uint256',
            internalType: 'uint256',
          },
        ],
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'Triggered',
    inputs: [
      {
        name: 'shareId',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'amountReleased',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'error',
    name: 'ECDSAInvalidSignature',
    inputs: [],
  },
  {
    type: 'error',
    name: 'ECDSAInvalidSignatureLength',
    inputs: [
      {
        name: 'length',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
  },
  {
    type: 'error',
    name: 'ECDSAInvalidSignatureS',
    inputs: [
      {
        name: 's',
        type: 'bytes32',
        internalType: 'bytes32',
      },
    ],
  },
  {
    type: 'error',
    name: 'ReentrancyGuardReentrantCall',
    inputs: [],
  },
  {
    type: 'error',
    name: 'SafeERC20FailedOperation',
    inputs: [
      {
        name: 'token',
        type: 'address',
        internalType: 'address',
      },
    ],
  },
] as const;
