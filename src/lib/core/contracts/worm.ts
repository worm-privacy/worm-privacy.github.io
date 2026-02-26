import { participationLogsRepo } from '@/lib/data/participation-logs-repo';
import { type Account, type Chain, type WalletClient, Address, Client, parseEventLogs } from 'viem';
import { getContractEvents, readContract, waitForTransactionReceipt } from 'viem/actions';
import { Config, Transport } from 'wagmi';
import { WriteContractMutateAsync } from 'wagmi/query';
import { StakingContractAddress } from './staking';

//TODO change this address
// sepolia 0x0d2e09d2abf22ed938fadaa306ccd48329e09774
export const WORMcontractAddress = '0xfC9d98CdB3529F32cD7fb02d175547641e145B29';

export namespace WORMContract {

  type args = {
    approve: [Address, bigint];
    participate: [bigint, bigint];
    claim: [bigint, bigint];
    multiClaim: [{ startingEpoch: bigint; numEpochs: bigint }[]];
  }

  export type Action = {
    to: Address;
    abi: typeof WORMcontractABI;
    functionName: 'approve' | 'participate' | 'claim' | 'multiClaim';
    args: args[keyof args];
  };

  export const buildApproveAction = (amount: bigint): Action => ({
    to: WORMcontractAddress,
    abi: WORMcontractABI,
    functionName: 'approve',
    args: [StakingContractAddress, amount],
  } as const);

  export const buildParticipateAction = (amountPerEpoch: bigint, numberOfEpochs: bigint): Action => ({
    to: WORMcontractAddress,
    abi: WORMcontractABI,
    functionName: 'participate',
    args: [amountPerEpoch, numberOfEpochs],
  } as const);

  export const buildClaimAction = (start: bigint, numberOfEpochs: bigint): Action => ({
    to: WORMcontractAddress,
    abi: WORMcontractABI,
    functionName: 'claim',
    args: [start, numberOfEpochs],
  } as const);

  export const buildMultiClaimAction = (
    epochRanges: { startingEpoch: bigint; numEpochs: bigint }[]
  ): Action => ({
    to: WORMcontractAddress,
    abi: WORMcontractABI,
    functionName: 'multiClaim',
    args: [epochRanges],
  });

  export const executeActionsWithSendCalls = async<
    transport extends Transport = Transport,
    chain extends Chain | undefined = Chain | undefined,
    account extends Account | undefined = Account | undefined
  >(
    walletClient: WalletClient<transport, chain, account>,
    actions: Action[],
    options?: {
      account?: Account | Address | null;
      chain?: Chain;
      id?: string;
      forceAtomic?: boolean;
      experimentalFallback?: boolean;
    }
  ) => {
    return walletClient.sendCallsSync({
      account: options?.account ?? null,
      chain: options?.chain,
      id: options?.id,
      forceAtomic: options?.forceAtomic,
      experimental_fallback: options?.experimentalFallback ?? true,
      calls: actions,
    });
  };

  export const currentEpoch = async (client: Client): Promise<bigint> => {
    return await readContract(client, {
      address: WORMcontractAddress,
      abi: WORMcontractABI,
      functionName: 'currentEpoch',
      args: [],
    });
  };

  export const info = async (client: Client, user: `0x${string}`, since: bigint, count: bigint) => {
    return await readContract(client, {
      address: WORMcontractAddress,
      abi: WORMcontractABI,
      functionName: 'info',
      args: [user, since, count],
    });
  };

  export const discoverRewards = async (
    client: Client,
    fromEpoch: bigint,
    numEpochs: bigint,
    user: Address,
    maxFound: bigint
  ) => {
    return await readContract(client, {
      address: WORMcontractAddress,
      abi: WORMcontractABI,
      functionName: 'discoverRewards',
      args: [fromEpoch, numEpochs, user, maxFound],
    });
  };

  export const epochTotal = async (client: Client, epochNum: bigint) => {
    return await readContract(client, {
      address: WORMcontractAddress,
      abi: WORMcontractABI,
      functionName: 'epochTotal',
      args: [epochNum],
    });
  };

  export const ParticipatedEvent = async (client: Client, address: `0x${string}`) => {
    return await getContractEvents(client, {
      address: WORMcontractAddress,
      abi: WORMcontractABI,
      eventName: 'Participated',
      args: { participant: address },
      fromBlock: 0n,
      toBlock: 'latest',
    });
  };

  export const ClaimedEvent = async (client: Client, address: `0x${string}`) => {
    return await getContractEvents(client, {
      address: WORMcontractAddress,
      abi: WORMcontractABI,
      eventName: 'Claimed',
      args: { claimant: address },
      fromBlock: 0n,
      toBlock: 'latest',
    });
  };

  export const participate = async (
    mutateAsync: WriteContractMutateAsync<Config, unknown>,
    client: Client,
    amountPerEpoch: bigint,
    numberOfEpochs: bigint
  ) => {
    console.log(`calling participate(${amountPerEpoch}, ${numberOfEpochs})`);
    const trxHash = await mutateAsync({
      address: WORMcontractAddress,
      abi: WORMcontractABI,
      functionName: 'participate',
      args: [amountPerEpoch, numberOfEpochs],
    });
    console.log('waiting for receipt');
    const r = await waitForTransactionReceipt(client, { hash: trxHash });
    if (r.status == 'reverted') throw 'participate reverted';
    let event = parseEventLogs({ abi: WORMcontractABI, logs: r.logs }).filter((e) => e.eventName == 'Participated')[0];
    participationLogsRepo.addItem({ fromEpoch: Number(event.args.fromEpoch), numberOfEpochs: Number(numberOfEpochs) });
    console.log('got approve receipt');
  };

  export const claim = async (
    mutateAsync: WriteContractMutateAsync<Config, unknown>,
    client: Client,
    start: bigint,
    numberOfEpochs: bigint
  ) => {
    console.log(`calling claim(${start}, ${numberOfEpochs})`);
    const trxHash = await mutateAsync({
      address: WORMcontractAddress,
      abi: WORMcontractABI,
      functionName: 'claim',
      args: [start, numberOfEpochs],
    });
    console.log('waiting for receipt');
    const r = await waitForTransactionReceipt(client, { hash: trxHash });
    if (r.status == 'reverted') throw 'claim reverted';
    console.log('got approve receipt');
  };

  export const approve = async (
    mutateAsync: WriteContractMutateAsync<Config, unknown>,
    client: Client,
    amount: bigint
  ) => {
    console.log(`calling approve(${StakingContractAddress}, ${amount})`);
    const trxHash = await mutateAsync({
      address: WORMcontractAddress,
      abi: WORMcontractABI,
      functionName: 'approve',
      args: [StakingContractAddress, amount],
    });
    console.log('waiting for receipt');
    let r = await waitForTransactionReceipt(client!, { hash: trxHash });
    if (r.status == 'reverted') throw 'allowance reverted';
    console.log('got approve receipt');
  };
}

export const WORMcontractABI = [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_bethContract',
        type: 'address',
        internalType: 'contract IERC20',
      },
      {
        name: '_premineAddress',
        type: 'address',
        internalType: 'address',
      },
      {
        name: '_premineAmount',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: '_startingTimestamp',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: '_endingTimestamp',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'DOMAIN_SEPARATOR',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'bytes32',
        internalType: 'bytes32',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'allowance',
    inputs: [
      {
        name: 'owner',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'spender',
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
    name: 'approve',
    inputs: [
      {
        name: 'spender',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'value',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'bool',
        internalType: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'approximate',
    inputs: [
      {
        name: '_amountPerEpoch',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: '_numEpochs',
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
    name: 'balanceOf',
    inputs: [
      {
        name: 'account',
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
    name: 'cacheRewards',
    inputs: [
      {
        name: 'epoch',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'cachedReward',
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
    name: 'cachedRewardEpoch',
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
    name: 'cachedRewardsAccumulatedSum',
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
    name: 'calculateMintAmount',
    inputs: [
      {
        name: '_startingEpoch',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: '_numEpochs',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: '_user',
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
    name: 'claim',
    inputs: [
      {
        name: '_startingEpoch',
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
    name: 'currentReward',
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
    name: 'decimals',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint8',
        internalType: 'uint8',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'discoverRewards',
    inputs: [
      {
        name: '_fromEpoch',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: '_numEpochs',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: '_user',
        type: 'address',
        internalType: 'address',
      },
      {
        name: '_maxFound',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [
      {
        name: 'nextEpochToSearch',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'epochs',
        type: 'uint256[]',
        internalType: 'uint256[]',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'eip712Domain',
    inputs: [],
    outputs: [
      {
        name: 'fields',
        type: 'bytes1',
        internalType: 'bytes1',
      },
      {
        name: 'name',
        type: 'string',
        internalType: 'string',
      },
      {
        name: 'version',
        type: 'string',
        internalType: 'string',
      },
      {
        name: 'chainId',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'verifyingContract',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'salt',
        type: 'bytes32',
        internalType: 'bytes32',
      },
      {
        name: 'extensions',
        type: 'uint256[]',
        internalType: 'uint256[]',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'endingTimestamp',
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
    name: 'epochTotal',
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
    name: 'epochUser',
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
        internalType: 'struct WORM.Info',
        components: [
          {
            name: 'totalWorm',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'totalBeth',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'currentEpoch',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'currentEpochReward',
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
            name: 'userContribs',
            type: 'uint256[]',
            internalType: 'uint256[]',
          },
          {
            name: 'totalContribs',
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
    name: 'multiApproximate',
    inputs: [
      {
        name: '_epochRanges',
        type: 'tuple[]',
        internalType: 'struct WORM.EpochRange[]',
        components: [
          {
            name: 'startingEpoch',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'numEpochs',
            type: 'uint256',
            internalType: 'uint256',
          },
        ],
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
    name: 'multiClaim',
    inputs: [
      {
        name: '_epochRanges',
        type: 'tuple[]',
        internalType: 'struct WORM.EpochRange[]',
        components: [
          {
            name: 'startingEpoch',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'numEpochs',
            type: 'uint256',
            internalType: 'uint256',
          },
        ],
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'name',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'string',
        internalType: 'string',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'nonces',
    inputs: [
      {
        name: 'owner',
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
    name: 'participate',
    inputs: [
      {
        name: '_amountPerEpoch',
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
    name: 'permit',
    inputs: [
      {
        name: 'owner',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'spender',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'value',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'deadline',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'v',
        type: 'uint8',
        internalType: 'uint8',
      },
      {
        name: 'r',
        type: 'bytes32',
        internalType: 'bytes32',
      },
      {
        name: 's',
        type: 'bytes32',
        internalType: 'bytes32',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'rewardOf',
    inputs: [
      {
        name: 'epoch',
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
    type: 'function',
    name: 'symbol',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'string',
        internalType: 'string',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'totalSupply',
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
    name: 'transfer',
    inputs: [
      {
        name: 'to',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'value',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'bool',
        internalType: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'transferFrom',
    inputs: [
      {
        name: 'from',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'to',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'value',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'bool',
        internalType: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    name: 'Approval',
    inputs: [
      {
        name: 'owner',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'spender',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'value',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'Claimed',
    inputs: [
      {
        name: 'claimant',
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
        name: 'numEpochs',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'totalClaimed',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'EIP712DomainChanged',
    inputs: [],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'Participated',
    inputs: [
      {
        name: 'participant',
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
        name: 'numEpochs',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'amountPerEpoch',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'Transfer',
    inputs: [
      {
        name: 'from',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'to',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'value',
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
    name: 'ERC20InsufficientAllowance',
    inputs: [
      {
        name: 'spender',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'allowance',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'needed',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
  },
  {
    type: 'error',
    name: 'ERC20InsufficientBalance',
    inputs: [
      {
        name: 'sender',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'balance',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'needed',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
  },
  {
    type: 'error',
    name: 'ERC20InvalidApprover',
    inputs: [
      {
        name: 'approver',
        type: 'address',
        internalType: 'address',
      },
    ],
  },
  {
    type: 'error',
    name: 'ERC20InvalidReceiver',
    inputs: [
      {
        name: 'receiver',
        type: 'address',
        internalType: 'address',
      },
    ],
  },
  {
    type: 'error',
    name: 'ERC20InvalidSender',
    inputs: [
      {
        name: 'sender',
        type: 'address',
        internalType: 'address',
      },
    ],
  },
  {
    type: 'error',
    name: 'ERC20InvalidSpender',
    inputs: [
      {
        name: 'spender',
        type: 'address',
        internalType: 'address',
      },
    ],
  },
  {
    type: 'error',
    name: 'ERC2612ExpiredSignature',
    inputs: [
      {
        name: 'deadline',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
  },
  {
    type: 'error',
    name: 'ERC2612InvalidSigner',
    inputs: [
      {
        name: 'signer',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'owner',
        type: 'address',
        internalType: 'address',
      },
    ],
  },
  {
    type: 'error',
    name: 'InvalidAccountNonce',
    inputs: [
      {
        name: 'account',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'currentNonce',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
  },
  {
    type: 'error',
    name: 'InvalidShortString',
    inputs: [],
  },
  {
    type: 'error',
    name: 'StringTooLong',
    inputs: [
      {
        name: 'str',
        type: 'string',
        internalType: 'string',
      },
    ],
  },
] as const;
