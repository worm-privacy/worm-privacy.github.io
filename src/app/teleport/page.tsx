'use client';

import { Footer } from '@/components/landing';
import StepsComponent, { StepItem } from '@/components/tools/steps';
import TopBar from '@/components/tools/topbar';
import { WalletNotConnectedContainer } from '@/components/tools/wallet-not-connected';
import { SmoothScroll } from '@/components/ui/smoth-scroll';
import { generateBurnAddress } from '@/lib/core/burn-address/burn-address-generator';
import { BETHToETHContract } from '@/lib/core/contracts/beth-to-eth';
import { newSavableRecoverData, RecoverData } from '@/lib/utils/recover-data';
import { saveJson } from '@/lib/utils/save-json';
import { useState } from 'react';
import { hexToBytes } from 'viem';
import { Inputs } from './inputs';

export default function Teleport() {
  const [currentStep, setCurrentStep] = useState(-1); // -1 means user input state

  const onStart = async (
    burnAmount: bigint,
    receiverAddress: `0x${string}`,
    proverFee: bigint,
    broadcasterFee: bigint
  ) => {
    setCurrentStep(0);

    const swapCalldata = BETHToETHContract.createSwapHook(burnAmount, receiverAddress as `0x${string}`);
    const burnAddress = await generateBurnAddress(
      receiverAddress,
      proverFee,
      broadcasterFee,
      burnAmount,
      hexToBytes(swapCalldata)
    );

    saveJson(newSavableRecoverData(burnAddress), `burn_${burnAddress.burnAddress}_backup.json`);

    setCurrentStep(1);

    console.log('onStart', burnAmount, receiverAddress);
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
