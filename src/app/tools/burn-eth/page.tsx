'use client';

import { Footer } from '@/components/landing';
import LoadingComponent from '@/components/tools/loading';
import StepsComponent, { StepItem } from '@/components/tools/steps';
import TabBar from '@/components/tools/tabbar';
import TopBar from '@/components/tools/topbar';
import { SmoothScroll } from '@/components/ui/smoth-scroll';
import { useState } from 'react';
import { BurnAddressGeneratorLayout } from './burn-address';
import { BurnETHLayout } from './burn-ether';
import { MintBETHLayout } from './mint-beth';

export default function BurnETHRoot() {
  // Layout switching states
  const [currentStep, setCurrentStep] = useState(0);
  const [burnAddress, setBurnAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const onAddressBurnGenerated = (address: string) => {
    console.log(`burn address: ${address}`);
    setCurrentStep(1); // move to next step (transfer to burn address)
    setBurnAddress(address);
  };

  const LayoutMapping = (props: { index: number }) => {
    switch (props.index) {
      case 0:
        return (
          <BurnAddressGeneratorLayout
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            onBurnAddressGenerated={onAddressBurnGenerated}
          />
        );
      case 1:
        return <BurnETHLayout burnAddress={burnAddress} />;
      case 2:
        return <MintBETHLayout />;

      default:
        throw 'unreachable';
    }
  };

  return (
    <SmoothScroll>
      <TopBar />
      <TabBar />
      <div className="mt-6">
        <div className="mx-auto px-[255px]">
          <h1 className="mb-3 text-[24px] font-bold text-white">Burning ETHs and get BETH</h1>
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
    description: 'Generate address by the amount of ETH you want to burn',
  },
  {
    title: 'Burn ETH',
    description: 'Send your ETH to provided address',
  },
  {
    title: 'Mint BETH',
    description: 'Exchange your ETH with BETH',
  },
  {
    title: 'Mine WORM',
    description: 'Participate in WORM Epochs',
  },
  {
    title: 'Claim WORM',
    description: 'Get rewarded WORMs',
  },
];
