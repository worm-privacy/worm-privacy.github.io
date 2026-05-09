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
import { transferETH } from '@/lib/core/utils/transfer-eth';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { Client, toHex } from 'viem';
import { waitForTransactionReceipt } from 'viem/actions';
import { useClient, usePublicClient, useSendTransaction, useWalletClient } from 'wagmi';
import { DEFAULT_ENDPOINT, GET_PROOF_RESULT_POLLING_INTERVAL } from '../tools/burn-eth/mint-beth';
import { WormholeRestComponentResult } from './rest';

export default function WormholeLoadingComponent(props: {
  restResult: WormholeRestComponentResult;
  onError: () => void;
  setBurnTrx: Dispatch<SetStateAction<`0x${string}` | null>>;
  setMintTrx: Dispatch<SetStateAction<`0x${string}` | null>>;
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const hasExecuted = useRef(false);

  const { mutateAsync } = useSendTransaction();
  const client = useClient();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const network = useNetwork();

  useEffect(() => {
    (async () => {
      try {
        if (hasExecuted.current) return;
        hasExecuted.current = true;
        let burnTxHash: `0x${string}`;
        switch (props.restResult.burnToken.type) {
          case 'native':
            burnTxHash = await transferETH(
              mutateAsync,
              client!,
              props.restResult.burnAddress.revealAmount,
              props.restResult.burnAddress.burnAddress
            );
            break;
          case 'erc20':
            burnTxHash = await burnAnyERC20ExactOut(
              walletClient!,
              publicClient!,
              props.restResult.burnToken,
              props.restResult.burnAddress.revealAmount,
              props.restResult.burnAmountERC20,
              props.restResult.burnAddress.burnAddress as `0x${string}`
            );
            break;
        }

        const mintTrxHash = await generateAndSubmit(
          client!,
          props.restResult.burnAddress,
          publicClient,
          network,
          setCurrentStep,
          props.restResult.relayConfig.proverAddress
        );
        props.setBurnTrx(burnTxHash);
        props.setMintTrx(mintTrxHash);
      } catch (e) {
        console.error('StartOperation', e);
        props.onError();
      }
    })();
  }, []);

  return (
    <div
      className="flex flex-col  bg-[#0d0f17]"
      style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif' }}
    >
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

const generateAndSubmit = async (
  client: Client,
  burnAddress: BurnAddressContent,
  publicClient: any, // pass whatever usePublicClient() returns
  network: WormNetwork,
  setCurrentStep: Dispatch<SetStateAction<number>>,
  proverAddress?: `0x${string}`
) => {
  setCurrentStep(1); // start generating  proof

  let blockNumber = (await publicClient!.getBlock()).number;
  let accountProof = await publicClient?.getProof({
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
