import { Client } from 'viem';
import { readContract, waitForTransactionReceipt } from 'viem/actions';
import { Config } from 'wagmi';
import { WriteContractMutateAsync } from 'wagmi/query';

// TODO: Update this address when deployed
export const DistributionContractAddress = '0x6bc6532404DDfdDcE18aFDc8F0D1A63a98dfB06b';

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
    return readContract(client, {
      address: DistributionContractAddress,
      abi: DistributionContractABI,
      functionName: 'shares',
      args: [shareId],
    }) as Promise<OnChainShare>;
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
    name: 'shareClaimed',
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
    name: 'shares',
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
        type: 'tuple',
        internalType: 'struct Distribution.Share',
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
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'reveal',
    inputs: [
      {
        name: '_share',
        type: 'tuple',
        internalType: 'struct Distribution.Share',
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
] as const;
