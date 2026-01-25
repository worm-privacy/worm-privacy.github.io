import { Client } from 'viem';
import { getContractEvents, readContract, waitForTransactionReceipt } from 'viem/actions';
import { Config } from 'wagmi';
import { WriteContractMutateAsync } from 'wagmi/query';

//TODO change this address
export const StakingContractAddress = '0x0AF06bBE75a98B0062E67D4f49442cf73fA17586';

export namespace StakingContract {
  export const currentEpoch = async (client: Client): Promise<bigint> => {
    return await readContract(client, {
      address: StakingContractAddress,
      abi: StakingContractABI,
      functionName: 'currentEpoch',
      args: [],
    });
  };

  export const info = async (client: Client, address: `0x${string}`, since: bigint, count: bigint) => {
    return await readContract(client, {
      address: StakingContractAddress,
      abi: StakingContractABI,
      functionName: 'info',
      args: [address, since, count],
    });
  };

  export const RewardDepositedEvent = async (client: Client, address: `0x${string}`) => {
    return await getContractEvents(client, {
      address: StakingContractAddress,
      abi: StakingContractABI,
      eventName: 'RewardDeposited',
      args: { depositor: address },
      fromBlock: 0n,
      toBlock: 'latest',
    });
  };

  export const StakedEvent = async (client: Client, address: `0x${string}`) => {
    return await getContractEvents(client, {
      address: StakingContractAddress,
      abi: StakingContractABI,
      eventName: 'Staked',
      args: { user: address },
      fromBlock: 0n,
      toBlock: 'latest',
    });
  };

  export const ReleasedEvent = async (client: Client, address: `0x${string}`) => {
    return await getContractEvents(client, {
      address: StakingContractAddress,
      abi: StakingContractABI,
      eventName: 'Released',
      args: { user: address },
      fromBlock: 0n,
      toBlock: 'latest',
    });
  };

  export const RewardClaimedEvent = async (client: Client, address: `0x${string}`) => {
    return await getContractEvents(client, {
      address: StakingContractAddress,
      abi: StakingContractABI,
      eventName: 'RewardClaimed',
      args: { user: address },
      fromBlock: 0n,
      toBlock: 'latest',
    });
  };

  export const lock = async (
    mutateAsync: WriteContractMutateAsync<Config, unknown>,
    client: Client,
    amountPerEpoch: bigint,
    numberOfEpochs: bigint
  ) => {
    console.log(`calling lock(${amountPerEpoch}, ${numberOfEpochs})`);
    const trxHash = await mutateAsync({
      address: StakingContractAddress,
      abi: StakingContractABI,
      functionName: 'lock',
      args: [amountPerEpoch, numberOfEpochs],
    });
    console.log('waiting for receipt');
    const r = await waitForTransactionReceipt(client, { hash: trxHash });
    if (r.status == 'reverted') throw 'lock reverted';
    console.log('got approve receipt');
  };

  export const release = async (
    mutateAsync: WriteContractMutateAsync<Config, unknown>,
    client: Client,
    stakeId: bigint
  ) => {
    console.log(`calling lock(${stakeId})`);
    const trxHash = await mutateAsync({
      address: StakingContractAddress,
      abi: StakingContractABI,
      functionName: 'release',
      args: [stakeId],
    });
    console.log('waiting for receipt');
    const r = await waitForTransactionReceipt(client, { hash: trxHash });
    if (r.status == 'reverted') throw 'lock reverted';
    console.log('got approve receipt');
  };

  export const claimReward = async (
    mutateAsync: WriteContractMutateAsync<Config, unknown>,
    client: Client,
    fromEpoch: bigint,
    count: bigint
  ) => {
    console.log(`calling claim(${fromEpoch}, ${count})`);
    const trxHash = await mutateAsync({
      address: StakingContractAddress,
      abi: StakingContractABI,
      functionName: 'claimReward',
      args: [fromEpoch, count],
    });
    console.log('waiting for receipt');
    const r = await waitForTransactionReceipt(client, { hash: trxHash });
    if (r.status == 'reverted') throw 'lock reverted';
    console.log('got approve receipt');
  };
}

export const StakingContractABI = [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_stakingToken',
        type: 'address',
        internalType: 'contract IERC20',
      },
      {
        name: '_rewardToken',
        type: 'address',
        internalType: 'contract IERC20',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'claimReward',
    inputs: [
      {
        name: '_fromEpoch',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: '_count',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'currentEpoch',
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
    name: 'depositReward',
    inputs: [
      {
        name: '_amount',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'epochReward',
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
    name: 'epochTotalLocked',
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
    name: 'epochUserLocked',
    inputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: '',
        type: 'address',
        internalType: 'address',
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
    name: 'info',
    inputs: [
      {
        name: 'user',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'since',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'count',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'tuple',
        internalType: 'struct Staking.EpochStats',
        components: [
          {
            name: 'currentEpoch',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'epochRemainingTime',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'since',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'userLocks',
            type: 'uint256[]',
            internalType: 'uint256[]',
          },
          {
            name: 'totalLocks',
            type: 'uint256[]',
            internalType: 'uint256[]',
          },
          {
            name: 'rewards',
            type: 'uint256[]',
            internalType: 'uint256[]',
          },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'lock',
    inputs: [
      {
        name: '_amount',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: '_numEpochs',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'release',
    inputs: [
      {
        name: '_stakeId',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'rewardToken',
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
    name: 'stakes',
    inputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [
      {
        name: 'owner',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'amount',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'startingEpoch',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'releaseEpoch',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'released',
        type: 'bool',
        internalType: 'bool',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'stakingToken',
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
    name: 'startingTimestamp',
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
    type: 'event',
    name: 'Released',
    inputs: [
      {
        name: 'user',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'stakeId',
        type: 'uint256',
        indexed: true,
        internalType: 'uint256',
      },
      {
        name: 'amount',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'RewardClaimed',
    inputs: [
      {
        name: 'user',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'fromEpoch',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'count',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'totalReward',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'RewardDeposited',
    inputs: [
      {
        name: 'depositor',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'epoch',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'amount',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'Staked',
    inputs: [
      {
        name: 'user',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'stakeId',
        type: 'uint256',
        indexed: true,
        internalType: 'uint256',
      },
      {
        name: 'amount',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'startingEpoch',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'releaseEpoch',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'numEpochs',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
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
