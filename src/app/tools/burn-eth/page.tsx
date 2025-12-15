'use client';

import { Footer } from '@/components/landing';
import InputComponent from '@/components/tools/input-text';
import StepsComponent, { StepItem } from '@/components/tools/steps';
import TabBar from '@/components/tools/tabbar';
import TopBar from '@/components/tools/topbar';
import { Icons } from '@/components/ui/icons';
import { SmoothScroll } from '@/components/ui/smoth-scroll';
import { generateBurnAddress } from '@/lib/core/burn-address/burn-address-generator';
import { parseEther } from 'ethers';
import { Dispatch, SetStateAction, useState } from 'react';

export default function BurnETH() {
  let [currentStep, setCurrentStep] = useState(0);
  const [burnAmount, setBurnAmount] = useState('');
  const [receiverAddress, setReceiverAddress] = useState('');
  const [proverFee, setProverFee] = useState('0.001');
  const [broadcasterFee, setBroadcasterFee] = useState('0.001');
  const [swapAmount, setSwapAmount] = useState('');
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const onGenerateAddressClicked = async () => {
    if (isGenerating) return;
    setIsGenerating(true);
    try {
      let burnAddress = await generateBurnAddress(
        receiverAddress,
        parseEther(proverFee),
        parseEther(broadcasterFee),
        parseEther(burnAmount),
        new Uint8Array()
      );
      console.log(`burnAddress: ${burnAddress}`);
    } catch (e) {
    } finally {
      setIsGenerating(false);
    }
  };

  const onRecoverClicked = () => {};

  return (
    <SmoothScroll>
      <TopBar />
      <TabBar />
      <div className="mt-6">
        <div className="mx-auto px-[255px]">
          <h1 className="mb-3 text-[24px] font-bold text-white">Burning ETHs and get BETH</h1>
          <div className="rounded-xl border border-[rgba(var(--neutral-low-rgb),0.24)] bg-[#090C15] p-8 shadow-2xl">
            <div className="flex flex-col gap-6 lg:flex-row">
              <StepsComponent steps={BURN_ETH_STEPS} selected={currentStep} />
              {isAdvancedOpen ? (
                <AdvancedLayout
                  broadcasterFee={broadcasterFee}
                  setBroadcasterFee={setBroadcasterFee}
                  proverFee={proverFee}
                  setProverFee={setProverFee}
                  swapAmount={swapAmount}
                  setSwapAmount={setSwapAmount}
                  setIsAdvancedOpen={setIsAdvancedOpen}
                />
              ) : (
                <MainLayout
                  burnAmount={burnAmount}
                  setBurnAmount={setBurnAmount}
                  receiverAddress={receiverAddress}
                  setReceiverAddress={setReceiverAddress}
                  onGenerateBurnAddressClicked={onGenerateAddressClicked}
                  onRecoverClicked={onRecoverClicked}
                  setIsAdvancedOpen={setIsAdvancedOpen}
                  isGenerating={isGenerating}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </SmoothScroll>
  );
}

const MainLayout = (props: {
  burnAmount: string;
  setBurnAmount: Dispatch<SetStateAction<string>>;
  receiverAddress: string;
  setReceiverAddress: Dispatch<SetStateAction<string>>;
  setIsAdvancedOpen: Dispatch<SetStateAction<boolean>>;
  onGenerateBurnAddressClicked: () => void;
  onRecoverClicked: () => void;
  isGenerating: boolean;
}) => {
  return (
    <div className="rounded-lg p-6 lg:w-2/3">
      <div className="space-y-4">
        <InputComponent
          label="Burn amount"
          hint="0.0"
          value={props.burnAmount}
          setValue={props.setBurnAmount}
          inputType="number"
          inputKind="ETH"
        />
        <InputComponent
          label="Receiver address"
          hint="0xf3...fd23"
          value={props.receiverAddress}
          setValue={props.setReceiverAddress}
        />

        {/* Fees Section */}
        <div className="space-y-1">
          <div className="flex justify-between text-[16px]">
            <span className="text-[#94A3B8]">Prover fee</span>
            <span className="text-[#94A3B8]">0.2 BETH</span>
          </div>
          <div className="flex justify-between text-[16px]">
            <span className="text-[#94A3B8]">Broadcaster fee</span>
            <span className="text-[#94A3B8]">0.1 BETH</span>
          </div>
        </div>

        {/* You Get Section */}
        <div className="text-[16px]">
          <div className="mb-1 text-white">You get</div>
          <div>
            <span className="text-white">0.65 </span>
            <span className="text-pink-400">BETH</span>
            <span className="text-white"> + </span>
            <span className="text-white">~0.05</span>
            <span className="text-blue-400"> ETH</span>
          </div>
        </div>

        {/* Advanced Options */}
        <div className="flex justify-center pt-2">
          <button
            onClick={() => props.setIsAdvancedOpen(true)}
            className="mb-4 flex items-center text-sm font-medium text-white"
          >
            <span>Advanced</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={'ml-1 h-4 w-4 transition-transform'}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <button
            onClick={props.onGenerateBurnAddressClicked}
            className="w-full rounded-lg bg-brand px-4 py-3 font-semibold text-black "
          >
            {props.isGenerating ? 'Generating...' : 'Generate burn address'}
          </button>

          <div className="flex justify-center">
            <button onClick={props.onRecoverClicked} className="flex items-center text-sm font-medium text-brand">
              <Icons.recover className="mr-2" />
              Recover
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdvancedLayout = (props: {
  broadcasterFee: string;
  setBroadcasterFee: Dispatch<SetStateAction<string>>;
  proverFee: string;
  setProverFee: Dispatch<SetStateAction<string>>;
  swapAmount: string;
  setSwapAmount: Dispatch<SetStateAction<string>>;
  setIsAdvancedOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <div className="rounded-lg p-6 lg:w-2/3">
      <div className="space-y-4">
        <div className="text-[18px] text-white">Advanced</div>
        <InputComponent
          label="Broadcaster fee"
          hint="0.2"
          value={props.broadcasterFee}
          setValue={props.setBroadcasterFee}
          inputKind="BETH"
          inputType="number"
        />
        <InputComponent
          label="Prover fee"
          hint="0.2"
          value={props.proverFee}
          setValue={props.setProverFee}
          inputKind="BETH"
          inputType="number"
        />
        <InputComponent
          label="Sell BETH for ETH "
          hint="0.2"
          value={props.swapAmount}
          setValue={props.setSwapAmount}
          inputKind="BETH"
          inputType="number"
        />
        <div className="flex flex-row">
          <div className="mr-1 text-[#94A3B8]">You Will get: 0.09 </div>
          <div className="text-[#6E7AF0]"> ETH </div>
        </div>
        <button
          onClick={() => props.setIsAdvancedOpen(false)}
          className="mt-10 w-full rounded-lg bg-[rgba(var(--neutral-low-rgb),0.24)] px-4 py-3 font-semibold text-white"
        >
          Apply
        </button>
      </div>
    </div>
  );
};

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
