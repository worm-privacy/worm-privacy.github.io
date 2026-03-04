'use client';

import { Footer } from '@/components/landing';
import StepsComponent, { StepItem } from '@/components/tools/steps';
import TopBar from '@/components/tools/topbar';
import { WalletNotConnectedContainer } from '@/components/tools/wallet-not-connected';
import { SmoothScroll } from '@/components/ui/smoth-scroll';
import { RecoverData } from '@/lib/utils/recover-data';
import { useState } from 'react';
import { Inputs } from './inputs';

export default function Teleport() {
  const [currentStep, setCurrentStep] = useState(-1); // -1 means user input state

  const onStart = (burnAmount: bigint, receiverAddress: `0x${string}`) => {
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
