import { AllowanceTransfer, PERMIT2_ADDRESS, PermitSingle } from '@uniswap/permit2-sdk';
import { CommandType, RoutePlanner } from '@uniswap/universal-router-sdk';
import { Address, encodeFunctionData, encodePacked, parseAbi, PublicClient, WalletClient } from 'viem';
import { waitForTransactionReceipt } from 'viem/actions';
import { WETHContractAddress } from '../weth';
import { approveTokenForPermit2 } from './permit2';

const UNIVERSAL_ROUTER = '0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD' as Address;

export const burnAnyERC20ExactOut = async (
  walletClient: WalletClient,
  publicClient: PublicClient,
  tokenInAddress: `0x${string}`,
  amountOut: bigint,
  amountIn: bigint, // in ERC20 input token
  burnAddress: `0x${string}`
) => {
  if (!walletClient.account) throw new Error('Wallet client has no account');

  await approveTokenForPermit2(walletClient, publicClient, tokenInAddress);

  const userAddress = (await walletClient.getAddresses())[0];
  const amountInMax = amountIn + amountIn / 20n; // 5% safety to prevent transaction failure

  const nonce = (
    await publicClient.readContract({
      address: PERMIT2_ADDRESS,
      abi: PERMIT2_ABI,
      functionName: 'allowance',
      args: [userAddress, tokenInAddress, UNIVERSAL_ROUTER],
    })
  )[2];

  const deadline = Math.floor(Date.now() / 1000) + 1800; // 30 minutes from now

  const permitSingle: PermitSingle = {
    details: {
      token: tokenInAddress,
      amount: amountInMax + amountInMax / 20n,
      expiration: deadline,
      nonce,
    },
    spender: UNIVERSAL_ROUTER,
    sigDeadline: deadline,
  };

  const { domain, types, values } = AllowanceTransfer.getPermitData(
    permitSingle,
    PERMIT2_ADDRESS,
    walletClient.chain!.id
  );

  const signature = await walletClient.signTypedData({
    account: userAddress,
    domain: domain as any,
    types,
    primaryType: 'PermitSingle',
    message: values as any,
  });

  const path = encodePacked(['address', 'uint24', 'address'], [WETHContractAddress, 3000, tokenInAddress]);

  const planner = new RoutePlanner()
    .addCommand(CommandType.PERMIT2_PERMIT, [permitSingle, signature])
    .addCommand(CommandType.V3_SWAP_EXACT_OUT, [UNIVERSAL_ROUTER, amountOut, amountInMax, path, true])
    .addCommand(CommandType.UNWRAP_WETH, [burnAddress, amountOut]);

  const calldata = encodeFunctionData({
    abi: UNIVERSAL_ROUTER_ABI,
    functionName: 'execute',
    args: [planner.commands as `0x${string}`, planner.inputs as `0x${string}`[], BigInt(deadline)],
  });

  // Prevent race condition
  // Sometimes next transaction goes to background because first ones pop-up is not closed yet
  await new Promise((resolve) => setTimeout(resolve, 100));

  const trxHash = await walletClient.sendTransaction({
    to: UNIVERSAL_ROUTER,
    data: calldata,
    value: 0n,
    account: walletClient.account,
    chain: walletClient.chain,
  });
  console.log('trxHash', trxHash);
  let receipt = await waitForTransactionReceipt(publicClient!, { hash: trxHash });
  console.log('got receipt:', receipt);
};

const UNIVERSAL_ROUTER_ABI = parseAbi([
  'function execute(bytes calldata commands, bytes[] calldata inputs, uint256 deadline) external payable',
]);

const PERMIT2_ABI = parseAbi([
  'function allowance(address owner, address token, address spender) view returns (uint160 amount, uint48 expiration, uint48 nonce)',
  'function DOMAIN_SEPARATOR() view returns (bytes32)',
]);
