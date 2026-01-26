'use client';

import { Footer } from '@/components/landing';
import LoadingComponent from '@/components/tools/loading';
import StepsComponent, { StepItem } from '@/components/tools/steps';
import TabBar from '@/components/tools/tabbar';
import TopBar from '@/components/tools/topbar';
import { SmoothScroll } from '@/components/ui/smoth-scroll';
import { BurnAddressContent } from '@/lib/core/burn-address/burn-address-generator';
import { RapidsnarkOutput } from '@/lib/core/miner-api/proof-get-by-nullifier';
import { RecoverData } from '@/lib/utils/recover-data';
import { useState } from 'react';
import { BurnAddressGeneratorLayout } from './burn-address';
import { BurnETHLayout } from './burn-ether';
import { MintBETHLayout } from './mint-beth';

export default function BurnETHRoot() {
  // Layout switching states
  const [currentStep, setCurrentStep] = useState(0);
  const [burnAddress, setBurnAddress] = useState<BurnAddressContent | undefined>(undefined);
  const [proof, setProof] = useState<RapidsnarkOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mintAmount, setMintAmount] = useState('N/A');

  const onAddressBurnGenerated = (address: BurnAddressContent, mintAmount: string) => {
    console.log(`burn address: ${address}`);
    setBurnAddress(address);
    setCurrentStep(1); // move to next step
    setMintAmount(mintAmount);
  };

  const onBurnComplete = () => {
    setCurrentStep(2);
  };

  const onRecover = (data: RecoverData) => {
    switch (data.type) {
      case 'burn':
        setBurnAddress(data.burn);
        break;
      case 'proof':
        setBurnAddress(data.burn);
        setProof(data.proof);
        break;
    }
    setCurrentStep(2);
  };

  const LayoutMapping = (props: { index: number }) => {
    switch (props.index) {
      case 0:
        return (
          <BurnAddressGeneratorLayout
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            onBurnAddressGenerated={onAddressBurnGenerated}
            onRecover={onRecover}
          />
        );
      case 1:
        return <BurnETHLayout burnAddress={burnAddress!} onBurnComplete={onBurnComplete} />;
      case 2:
        return <MintBETHLayout mintAmount={mintAmount} burnAddress={burnAddress!} proof={proof} setProof={setProof} />;

      default:
        throw 'unreachable';
    }
  };

  return (
    <SmoothScroll>
      <TopBar />
      <TabBar />
      <div className="mt-6">
        <div className="m-auto max-w-310 px-5">
          <h1 className="mb-3 text-[24px] font-bold text-white">Burn ETH and get BETH</h1>
          <div className="rounded-xl border border-[rgba(var(--neutral-low-rgb),0.24)] bg-[#090C15] p-8 shadow-2xl">
            <div className="flex flex-row gap-6">
              <StepsComponent steps={BURN_ETH_STEPS} selected={currentStep} />
              {isLoading ? <LoadingComponent /> : <LayoutMapping index={currentStep} />}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </SmoothScroll>
  );
}

const BURN_ETH_STEPS: StepItem[] = [
  {
    title: 'Generate Burn Address',
    description: 'Generate a burn address',
  },
  {
    title: 'Burn ETH',
    description: 'Send your ETH to the burn address',
  },
  {
    title: 'Mint BETH',
    description: 'Prove burn of ETH and get BETH',
  },
  {
    title: 'Mine WORM',
    description: 'Participate in WORM epochs',
  },
  {
    title: 'Claim WORM',
    description: 'Get WORM rewards',
  },
];
