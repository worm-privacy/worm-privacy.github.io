import { PERMIT2_ADDRESS } from '@uniswap/permit2-sdk';
import { Address, erc20Abi, maxUint256, PublicClient, WalletClient } from 'viem';

// Function to perform the one-time approval for Permit2
export const approveTokenForPermit2 = async (
  walletClient: WalletClient,
  publicClient: PublicClient,
  tokenAddress: Address
) => {
  // check current allowance to skip unnecessary approve call
  const allowance = await publicClient.readContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: 'allowance',
    args: [walletClient.account!.address, PERMIT2_ADDRESS],
  });
  if (allowance > maxUint256 / 2n) return;

  const approvalTxHash = await walletClient.writeContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: 'approve',
    args: [PERMIT2_ADDRESS, maxUint256], // Grant max allowance to Permit2
    account: walletClient.account!,
    chain: walletClient.chain,
  });

  // Wait for the transaction to be mined
  await publicClient.waitForTransactionReceipt({ hash: approvalTxHash });
  console.log('Permit2 approval confirmed');
};
