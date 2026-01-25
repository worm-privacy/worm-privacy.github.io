import { Client, hexToBigInt } from 'viem';
import { waitForTransactionReceipt } from 'viem/actions';
import { Config } from 'wagmi';
import { WriteContractMutateAsync } from 'wagmi/query';
import { RapidsnarkOutput } from '../miner-api/proof-get-by-nullifier';
import { WORMcontractAddress } from './worm';

//TODO change this address
export const BETHContractAddress = '0x0AF06bBE75a98B0062E67D4f49442cf73fA17586';

export namespace BETHContract {
  export const approve = async (
    mutateAsync: WriteContractMutateAsync<Config, unknown>,
    client: Client,
    amount: bigint
  ) => {
    console.log(`calling approve(${WORMcontractAddress}, ${amount})`);
    const approveTXHash = await mutateAsync({
      address: BETHContractAddress,
      abi: BETHContractABI,
      functionName: 'approve',
      args: [WORMcontractAddress, amount],
    });
    console.log('waiting for receipt');
    let r = await waitForTransactionReceipt(client!, { hash: approveTXHash });
    if (r.status == 'reverted') throw 'allowance reverted';
    console.log('got approve receipt');
  };

  export const mintCoin = async (
    mutateAsync: WriteContractMutateAsync<Config, unknown>,
    client: Client,
    proof: RapidsnarkOutput,
    nullifier: bigint,
    remaining_coin_hash: bigint,
    broadcaster_fee: bigint,
    spend: bigint,
    receiver: `0x${string}`,
    prover_fee: bigint,
    prover: `0x${string}`
  ) => {
    const trxHash = await mutateAsync({
      address: BETHContractAddress,
      abi: BETHContractABI,
      functionName: 'mintCoin',
      args: [
        {
          pA: [hexToBigInt(proof.proof.pi_a[0] as `0x${string}`), hexToBigInt(proof.proof.pi_a[1] as `0x${string}`)],
          pB: [
            [
              hexToBigInt(proof.proof.pi_b[0][1] as `0x${string}`),
              hexToBigInt(proof.proof.pi_b[0][0] as `0x${string}`),
            ],
            [
              hexToBigInt(proof.proof.pi_b[1][1] as `0x${string}`),
              hexToBigInt(proof.proof.pi_b[1][0] as `0x${string}`),
            ],
          ],
          pC: [hexToBigInt(proof.proof.pi_c[0] as `0x${string}`), hexToBigInt(proof.proof.pi_c[1] as `0x${string}`)],
          blockNumber: hexToBigInt(proof.target_block as `0x${string}`),
          nullifier,
          remainingCoin: remaining_coin_hash,
          broadcasterFee: broadcaster_fee,
          revealedAmount: spend,
          revealedAmountReceiver: receiver,
          proverFee: prover_fee,
          prover,
          receiverPostMintHook: '0x',
          broadcasterFeePostMintHook: '0x',
          proverFeePostMintHook: '0x',
        },
      ],
    });
    console.log('waiting for receipt');
    let r = await waitForTransactionReceipt(client!, { hash: trxHash });
    if (r.status == 'reverted') throw 'mintCoin reverted';
    console.log('got receipt');
  };
}

export const BETHContractABI = [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_proofOfBurnVerifier',
        type: 'address',
        internalType: 'contract IVerifier',
      },
      {
        name: '_spendVerifier',
        type: 'address',
        internalType: 'contract IVerifier',
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
    name: 'MINT_CAP',
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
    name: 'POOL_SHARE_INV',
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
    name: 'coinOwner',
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
        type: 'address',
        internalType: 'address',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'coinRevealed',
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
    name: 'coinSource',
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
    name: 'initRewardPool',
    inputs: [
      {
        name: '_rewardPool',
        type: 'address',
        internalType: 'contract IRewardPool',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'mintCoin',
    inputs: [
      {
        name: '_mintParams',
        type: 'tuple',
        internalType: 'struct BETH.MintParams',
        components: [
          {
            name: 'pA',
            type: 'uint256[2]',
            internalType: 'uint256[2]',
          },
          {
            name: 'pB',
            type: 'uint256[2][2]',
            internalType: 'uint256[2][2]',
          },
          {
            name: 'pC',
            type: 'uint256[2]',
            internalType: 'uint256[2]',
          },
          {
            name: 'blockNumber',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'nullifier',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'remainingCoin',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'broadcasterFee',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'broadcasterFeePostMintHook',
            type: 'bytes',
            internalType: 'bytes',
          },
          {
            name: 'proverFee',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'prover',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'proverFeePostMintHook',
            type: 'bytes',
            internalType: 'bytes',
          },
          {
            name: 'revealedAmount',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'revealedAmountReceiver',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'receiverPostMintHook',
            type: 'bytes',
            internalType: 'bytes',
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
    name: 'nullifiers',
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
        type: 'bool',
        internalType: 'bool',
      },
    ],
    stateMutability: 'view',
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
    name: 'proofOfBurnVerifier',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'contract IVerifier',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'rewardPool',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'contract IRewardPool',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'spendCoin',
    inputs: [
      {
        name: '_spendParams',
        type: 'tuple',
        internalType: 'struct BETH.SpendParams',
        components: [
          {
            name: 'pA',
            type: 'uint256[2]',
            internalType: 'uint256[2]',
          },
          {
            name: 'pB',
            type: 'uint256[2][2]',
            internalType: 'uint256[2][2]',
          },
          {
            name: 'pC',
            type: 'uint256[2]',
            internalType: 'uint256[2]',
          },
          {
            name: 'coin',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'revealedAmount',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'remainingCoin',
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
    name: 'spendVerifier',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'contract IVerifier',
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
    name: 'EIP712DomainChanged',
    inputs: [],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'HookFailure',
    inputs: [
      {
        name: 'returnData',
        type: 'bytes',
        indexed: false,
        internalType: 'bytes',
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
    name: 'ReentrancyGuardReentrantCall',
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
