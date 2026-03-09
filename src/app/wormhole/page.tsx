'use client';

import { Footer } from '@/components/landing';
import ErrorComponent from '@/components/tools/error-component';
import LoadingComponent from '@/components/tools/loading';
import StepsComponent, { StepItem } from '@/components/tools/steps';
import TopBar from '@/components/tools/topbar';
import { WalletNotConnectedContainer } from '@/components/tools/wallet-not-connected';
import { SmoothScroll } from '@/components/ui/smoth-scroll';
import { useNetwork, WormNetwork } from '@/hooks/use-network';
import { BurnAddressContent, generateBurnAddress } from '@/lib/core/burn-address/burn-address-generator';
import { calculateNullifier } from '@/lib/core/burn-address/nullifier';
import { calculateRemainingCoinHash } from '@/lib/core/burn-address/remaining_coin';
import { BETHContract } from '@/lib/core/contracts/beth';
import { BETHToETHContract } from '@/lib/core/contracts/beth-to-eth';
import { proof_get } from '@/lib/core/miner-api/proof-get';
import { proof_get_by_nullifier, RapidsnarkOutput } from '@/lib/core/miner-api/proof-get-by-nullifier';
import { createProofPostRequest, proof_post } from '@/lib/core/miner-api/proof-post';
import { relay_post } from '@/lib/core/miner-api/relay_post';
import { calculateMintAmount } from '@/lib/core/utils/beth-amount-calculator';
import { transferETH } from '@/lib/core/utils/transfer-eth';
import { newSavableRecoverData, RecoverData } from '@/lib/utils/recover-data';
import { saveJson } from '@/lib/utils/save-json';
import { Dispatch, SetStateAction, useState } from 'react';
import { Client, formatEther, hexToBytes, toHex } from 'viem';
import { waitForTransactionReceipt } from 'viem/actions';
import { useClient, usePublicClient, useSendTransaction } from 'wagmi';
import { DEFAULT_ENDPOINT, GET_PROOF_RESULT_POLLING_INTERVAL } from '../tools/burn-eth/mint-beth';
import { Inputs } from './inputs';

export default function Wormhole() {
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState<string | null>(null); // null means no error state

  const { mutateAsync } = useSendTransaction();
  const client = useClient();
  const publicClient = usePublicClient();
  const network = useNetwork();

  const onStart = async (
    burnAmount: bigint,
    receiverAddress: `0x${string}`,
    proverAddress: `0x${string}`,
    proverFee: bigint,
    broadcasterFee: bigint
  ) => {
    try {
      // `swapAmount` sets 0n because we want to swap all of it anyway
      const mintAmount = calculateMintAmount(burnAmount, 0n, proverFee, broadcasterFee);
      console.log('onStart', formatEther(burnAmount), formatEther(mintAmount), receiverAddress);
      setCurrentStep(1);

      const swapCalldata = hexToBytes(BETHToETHContract.createSwapHook(mintAmount, receiverAddress as `0x${string}`));
      const burnAddress = await generateBurnAddress(
        receiverAddress,
        proverFee,
        broadcasterFee,
        burnAmount,
        swapCalldata
      );

      saveJson(newSavableRecoverData(burnAddress), `burn_${burnAddress.burnAddress}_backup.json`);

      setCurrentStep(2);

      await transferETH(mutateAsync, client!, burnAddress.revealAmount, burnAddress.burnAddress);

      await generateAndSubmit(client!, burnAddress, setCurrentStep, publicClient, burnAmount, network, proverAddress);
    } catch (e) {
      console.error('onStart', e);
      setError('Error happened');
    }
  };

  const onRecover = async (recoverData: RecoverData) => {
    console.log('onRecover', recoverData);
    try {
      await generateAndSubmit(
        client!,
        recoverData.burn,
        setCurrentStep,
        publicClient,
        recoverData.burn.revealAmount,
        network,
        undefined
      );
    } catch (e) {
      console.error('onRecover', e);
      setError('Error happened');
    }
  };

  return (
    <SmoothScroll>
      <div className="flex h-svh grow flex-col overflow-y-scroll">
        <TopBar />
        <WalletNotConnectedContainer>
          <div>
            <div className="m-auto max-w-310">
              <div className="mt-6 mb-3 text-[24px] font-bold text-white">Wormhole</div>
              <div className="rounded-xl border border-[rgba(var(--neutral-low-rgb),0.24)] bg-[#090C15] p-8 shadow-2xl">
                <div className="flex flex-row gap-6">
                  <StepsComponent steps={WORMHOLE_STEPS} selected={currentStep} />
                  {error ? (
                    <ErrorComponent title={error} />
                  ) : currentStep == 0 ? (
                    <Inputs onStart={onStart} onRecover={onRecover} setError={setError} />
                  ) : (
                    <LoadingComponent />
                  )}
                </div>
              </div>
            </div>
          </div>
        </WalletNotConnectedContainer>
        <div className="min-h-12 grow" />
        <Footer />
      </div>
    </SmoothScroll>
  );
}

const WORMHOLE_STEPS: StepItem[] = [
  {
    title: 'Inputs',
    description: 'Waiting for user to enter inputs',
  },
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

const generateAndSubmit = async (
  client: Client,
  burnAddress: BurnAddressContent,
  setCurrentStep: Dispatch<SetStateAction<number>>,
  publicClient: any, // pass whatever usePublicClient() returns
  burnAmount: bigint,
  network: WormNetwork,
  proverAddress?: `0x${string}`
) => {
  setCurrentStep(3);
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

  setCurrentStep(4);

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
    reveal_amount: burnAmount,
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
  setCurrentStep(0);
};
