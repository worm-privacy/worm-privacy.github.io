'use client';

import { Icons } from '@/components/ui/icons';
import { useNetwork, WormNetwork } from '@/hooks/use-network';
import { BurnAddressContent } from '@/lib/core/burn-address/burn-address-generator';
import { calculateNullifier } from '@/lib/core/burn-address/nullifier';
import { calculateRemainingCoinHash } from '@/lib/core/burn-address/remaining_coin';
import { BETHContract } from '@/lib/core/contracts/beth';
import { burnAnyERC20ExactOut } from '@/lib/core/contracts/uniswap/burn-any-erc20';
import { proof_get } from '@/lib/core/miner-api/proof-get';
import { proof_get_by_nullifier, RapidsnarkOutput } from '@/lib/core/miner-api/proof-get-by-nullifier';
import { createProofPostRequest, proof_post } from '@/lib/core/miner-api/proof-post';
import { relay_post } from '@/lib/core/miner-api/relay_post';
import { EtherscanLink, etherscanLinkFromAddress, etherscanLinkFromTX } from '@/lib/core/utils/etherscan-link';
import { transferETH } from '@/lib/core/utils/transfer-eth';
import { loadJson } from '@/lib/utils/load-json';
import { recoverDataFromJson } from '@/lib/utils/recover-data';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { PublicClient, toHex, WalletClient } from 'viem';
import { waitForTransactionReceipt } from 'viem/actions';
import { Config, usePublicClient, useSendTransaction, useWalletClient } from 'wagmi';
import { SendTransactionMutateAsync } from 'wagmi/query';
import { DEFAULT_ENDPOINT, GET_PROOF_RESULT_POLLING_INTERVAL } from '../tools/burn-eth/mint-beth';
import { WormholeError, WormholeErrors } from './error';
import { WormholeRestComponentResult } from './rest';

export default function WormholeLoadingComponent(props: {
  data: WormholeRestComponentResult | 'recover-mode';
  onError: (error: WormholeError) => void;
  onFinished: (burnTxHash: EtherscanLink, mintTrxHash: EtherscanLink) => void;
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const hasExecuted = useRef(false);

  const { mutateAsync } = useSendTransaction();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const network = useNetwork();

  useEffect(() => {
    if (walletClient === undefined || publicClient === undefined) return;
    (async () => {
      try {
        console.log('walletClient', walletClient);
        if (hasExecuted.current) return;
        hasExecuted.current = true;

        if (props.data === 'recover-mode') {
          setCurrentStep(1); // skipping transfer step
          const recoverData = recoverDataFromJson(await loadJson());

          const balance = await publicClient.getBalance({
            address: recoverData.burn.burnAddress as `0x${string}`,
          });
          if (balance === 0n) return props.onError(WormholeErrors.RECOVER_BURN_ADDRESS_BALANCE);

          if (await BETHContract.checkNullifier(publicClient, calculateNullifier(recoverData.burn.burnKey)))
            return props.onError(WormholeErrors.RECOVER_BURN_ADDRESS_BALANCE);

          const mintTrxHash = await generateAndSubmit(publicClient!, recoverData.burn, network, setCurrentStep);
          props.onFinished(
            etherscanLinkFromAddress(recoverData.burn.burnAddress as `0x${string}`),
            etherscanLinkFromTX(mintTrxHash)
          ); // we can no know transaction hash
        } else {
          let burnTxHash;
          try {
            // this extra inner try catch is for better error detection (TRANSFER_FAILED or PROOF_FAILED)
            burnTxHash = await transferToBurnAddress(props.data, mutateAsync, walletClient, publicClient);
          } catch (e) {
            return props.onError(WormholeErrors.PROCESS_TRANSFER_FAILED);
          }
          const mintTrxHash = await generateAndSubmit(
            publicClient!,
            props.data.burnAddress,
            network,
            setCurrentStep,
            props.data.relayConfig.proverAddress
          );
          props.onFinished(etherscanLinkFromTX(burnTxHash), etherscanLinkFromTX(mintTrxHash));
        }
      } catch (e) {
        console.error('StartOperation', e);
        props.onError(WormholeErrors.PROCESS_PROOF_FAILED);
      }
    })();
  }, [walletClient, publicClient]);

  return (
    <div className="flex flex-col" style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif' }}>
      <div className="mb-5 flex items-center gap-3">
        <Icons.spiral fill="white" />
        <h2 className="text-lg font-semibold tracking-wide text-white">Worming the hole, Just a few moments</h2>
      </div>

      <p className="mb-8 text-sm leading-relaxed text-gray-400">
        Please don&apos;t close the tab until the process completed.
      </p>
      <div className="space-y-5">
        {STATUS_STEPS.map((step, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className="shrink-0">
              {index < currentStep && <Icons.checkboxChecked fill="white" />}
              {index === currentStep && <Icons.spinner fill="white" className="animate-spin" />}
              {index > currentStep && <Icons.checkbox fill="white" />}
            </div>

            <span
              className={`text-sm transition-colors duration-300 ${
                index > currentStep
                  ? 'text-gray-500'
                  : index == currentStep
                    ? 'font-medium text-emerald-400'
                    : 'text-gray-300'
              }`}
            >
              {step}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// returns burn transaction hash
const transferToBurnAddress = async (
  restResult: WormholeRestComponentResult,
  mutateAsync: SendTransactionMutateAsync<Config, unknown>,
  walletClient: WalletClient,
  publicClient: PublicClient
): Promise<`0x${string}`> => {
  switch (restResult.burnToken.type) {
    case 'native':
      return await transferETH(
        mutateAsync,
        publicClient!,
        restResult.burnAddress.revealAmount,
        restResult.burnAddress.burnAddress
      );
    case 'erc20':
      return await burnAnyERC20ExactOut(
        walletClient!,
        publicClient!,
        restResult.burnToken,
        restResult.burnAddress.revealAmount,
        restResult.burnAmountERC20,
        restResult.burnAddress.burnAddress as `0x${string}`
      );
  }
};

const generateAndSubmit = async (
  client: PublicClient,
  burnAddress: BurnAddressContent,
  network: WormNetwork,
  setCurrentStep: Dispatch<SetStateAction<number>>,
  proverAddress?: `0x${string}` // undefined means it will call DEFAULT_ENDPOINT and get it
) => {
  setCurrentStep(1); // start generating  proof

  let blockNumber = (await client!.getBlock()).number;
  let accountProof = await client.getProof({
    address: burnAddress.burnAddress as `0x${string}`,
    storageKeys: [],
    blockNumber: blockNumber,
  });

  await proof_post(
    DEFAULT_ENDPOINT.url,
    createProofPostRequest(
      blockNumber,
      network,
      burnAddress.burnKey,
      burnAddress.receiverAddr,
      burnAddress.broadcasterFee,
      burnAddress.proverFee,
      burnAddress.revealAmount,
      toHex(burnAddress.receiverHook),
      accountProof!
    )
  );

  const nullifier = calculateNullifier(burnAddress.burnKey);
  let rapidsnarkProof: RapidsnarkOutput | null = null;
  while (rapidsnarkProof === null) {
    const result = await proof_get_by_nullifier(DEFAULT_ENDPOINT.url, nullifier.toString());
    if (result.status == 'done') rapidsnarkProof = result.proof;
    await new Promise((resolve) => setTimeout(resolve, GET_PROOF_RESULT_POLLING_INTERVAL));
  }
  console.log('rapidsnarkProof:', rapidsnarkProof);

  setCurrentStep(2); // start submitting proof

  const remainingCoin = calculateRemainingCoinHash(
    burnAddress.burnKey,
    burnAddress.revealAmount,
    burnAddress.revealAmount
  );

  const trxHash = await relay_post(DEFAULT_ENDPOINT.url, {
    network: network,
    proof: rapidsnarkProof!,
    nullifier,
    remaining_coin: remainingCoin,
    broadcaster_fee: burnAddress.broadcasterFee,
    reveal_amount: burnAddress.revealAmount,
    receiver: burnAddress.receiverAddr,
    prover_fee: burnAddress.proverFee,
    prover_address: proverAddress ?? (await proof_get(DEFAULT_ENDPOINT.url)).prover_address,
    swap_calldata: burnAddress.receiverHook,
  });

  console.log('waiting fot receipt trx_hash:', trxHash);
  try {
    let receipt = await waitForTransactionReceipt(client!, { hash: trxHash });
    if (receipt.status === 'reverted') throw 'mintCoin reverted';
    console.log('got receipt:', trxHash);
  } catch (e) {
    console.error(e);
    console.log('Plan B: checking for nullifier on contract');
    // plan B: check if nullifier exists on contract
    await new Promise((resolve) => setTimeout(resolve, 15000)); // wait for one block time
    const exists = await BETHContract.checkNullifier(client!, nullifier);
    if (!exists) throw 'nullifier is not on contract';
  }
  return trxHash;
};

const STATUS_STEPS = ['Sending to burn address', 'Generating proof', 'Submitting proof'];
