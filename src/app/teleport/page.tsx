'use client';

import { Footer } from '@/components/landing';
import StepsComponent, { StepItem } from '@/components/tools/steps';
import TopBar from '@/components/tools/topbar';
import { WalletNotConnectedContainer } from '@/components/tools/wallet-not-connected';
import { SmoothScroll } from '@/components/ui/smoth-scroll';
import { generateBurnAddress } from '@/lib/core/burn-address/burn-address-generator';
import { calculateNullifier } from '@/lib/core/burn-address/nullifier';
import { calculateRemainingCoinHash } from '@/lib/core/burn-address/remaining_coin';
import { BETHToETHContract } from '@/lib/core/contracts/beth-to-eth';
import { proof_get_by_nullifier, RapidsnarkOutput } from '@/lib/core/miner-api/proof-get-by-nullifier';
import { createProofPostRequest, proof_post } from '@/lib/core/miner-api/proof-post';
import { relay_post } from '@/lib/core/miner-api/relay_post';
import { transferETH } from '@/lib/core/utils/transfer-eth';
import { newSavableRecoverData, RecoverData } from '@/lib/utils/recover-data';
import { saveJson } from '@/lib/utils/save-json';
import { useState } from 'react';
import { hexToBytes, toHex } from 'viem';
import { waitForTransactionReceipt } from 'viem/actions';
import { useClient, usePublicClient, useSendTransaction } from 'wagmi';
import { DEFAULT_ENDPOINT, GET_PROOF_RESULT_POLLING_INTERVAL } from '../tools/burn-eth/mint-beth';
import { Inputs } from './inputs';

export default function Teleport() {
  const [currentStep, setCurrentStep] = useState(-1); // -1 means user input state

  const { mutateAsync } = useSendTransaction();
  const client = useClient();
  const publicClient = usePublicClient();

  // TODO error handling
  const onStart = async (
    burnAmount: bigint,
    receiverAddress: `0x${string}`,
    proverAddress: `0x${string}`,
    proverFee: bigint,
    broadcasterFee: bigint
  ) => {
    console.log('onStart', burnAmount, receiverAddress);
    setCurrentStep(0);

    const swapCalldata = hexToBytes(BETHToETHContract.createSwapHook(burnAmount, receiverAddress as `0x${string}`));
    const burnAddress = await generateBurnAddress(receiverAddress, proverFee, broadcasterFee, burnAmount, swapCalldata);

    saveJson(newSavableRecoverData(burnAddress), `burn_${burnAddress.burnAddress}_backup.json`);

    setCurrentStep(1);

    await transferETH(mutateAsync, client!, burnAddress.revealAmount, burnAddress.burnAddress);

    setCurrentStep(2);

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
        'mainnet',
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
    while (accountProof === null) {
      const result = await proof_get_by_nullifier(DEFAULT_ENDPOINT.url, toHex(nullifier));
      if (result.status == 'done') rapidsnarkProof = result.proof;
      await new Promise((resolve) => setTimeout(resolve, GET_PROOF_RESULT_POLLING_INTERVAL));
    }
    console.log('rapidsnarkProof:', rapidsnarkProof);

    setCurrentStep(3);

    const remainingCoin = calculateRemainingCoinHash(
      burnAddress.burnKey,
      burnAddress.revealAmount,
      burnAddress.revealAmount
    );

    const trxHash = await relay_post(DEFAULT_ENDPOINT.url, {
      network: 'mainnet',
      proof: rapidsnarkProof!,
      nullifier,
      remaining_coin: remainingCoin,
      broadcaster_fee: burnAddress.broadcasterFee,
      reveal_amount: burnAmount,
      receiver: burnAddress.receiverAddr,
      prover_fee: burnAddress.proverFee,
      prover_address: proverAddress,
      swap_calldata: swapCalldata,
    });

    console.log('waiting fot receipt trx_hash:', trxHash);
    let receipt = await waitForTransactionReceipt(client!, { hash: trxHash });
    if (receipt.status === 'reverted') throw 'mintCoin reverted';
    console.log('got receipt:', trxHash);
  };

  const onRecover = (recoverData: RecoverData) => {
    console.log('onRecover', recoverData);
  };

  return (
    <SmoothScroll>
      <div className="flex h-svh grow flex-col overflow-y-scroll">
        <TopBar />
        <WalletNotConnectedContainer>
          <div>
            <div className="m-auto max-w-310">
              <div className="mt-6 mb-3 text-[24px] font-bold text-white">Teleport</div>
              {currentStep == -1 ? (
                <Inputs onStart={onStart} onRecover={onRecover} />
              ) : (
                <StepsComponent steps={TELEPORT_STEPS} selected={currentStep} />
              )}
            </div>
          </div>
        </WalletNotConnectedContainer>
        <div className="min-h-12 grow" />
        <Footer />
      </div>
    </SmoothScroll>
  );
}

const TELEPORT_STEPS: StepItem[] = [
  {
    title: 'Backup burn data',
    description: 'Just in case if something goes wrong',
  },
  {
    title: 'Burn ETH',
    description: 'Send your ETH to the burn address',
  },
  {
    title: 'Proof Generation',
    description: 'Server generates proof for you',
  },
  {
    title: 'Proof Submission',
    description: 'Get ETH',
  },
];
