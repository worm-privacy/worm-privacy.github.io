'use client';

import { Footer } from '@/components/landing';
import InputComponent from '@/components/tools/input-text';
import StepsComponent, { StepItem } from '@/components/tools/steps';
import TabBar from '@/components/tools/tabbar';
import TopBar from '@/components/tools/topbar';
import { Icons } from '@/components/ui/icons';
import { SmoothScroll } from '@/components/ui/smoth-scroll';
import { useState } from 'react';

export default function BurnETH() {
  let [currentStep, setCurrentStep] = useState(0);
  const [burnAmount, setBurnAmount] = useState('');
  const [receiverAddress, setReceiverAddress] = useState('');
  const [proverFee, setProverFee] = useState('0.2');
  const [broadcasterFee, setBroadcasterFee] = useState('0.1');
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  // Calculate estimated output based on burn amount
  const calculateOutput = (amount: any) => {
    const parsedAmount = parseFloat(amount) || 0;
    const bethOutput = parsedAmount * 0.65; // 65% of burned ETH becomes BETH
    const ethOutput = parsedAmount * 0.05; // 5% of burned ETH is returned as ETH

    return {
      beth: bethOutput.toFixed(2),
      eth: ethOutput.toFixed(2),
    };
  };

  const output = calculateOutput(burnAmount);

  const handleGenerateBurnAddress = () => {
    // In a real app, this would trigger API call or generate actual address
    alert(`Generating burn address for ${burnAmount} ETH...`);
  };

  const handleRecover = () => {
    // In a real app, this would handle recovery logic
    alert('Recovery process initiated...');
  };

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
              <div className="rounded-lg p-6 lg:w-2/3">
                <div className="space-y-4">
                  <InputComponent
                    label="Burn amount"
                    hint="0.0"
                    value={burnAmount}
                    setValue={setBurnAmount}
                    inputType="number"
                    inputKind="ETH"
                  />
                  <InputComponent
                    label="Receiver address"
                    hint="0xf3...fd23"
                    value={receiverAddress}
                    setValue={setReceiverAddress}
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
                      onClick={() => setIsAdvancedOpen(true)}
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
                      onClick={handleGenerateBurnAddress}
                      className="w-full rounded-lg bg-brand px-4 py-3 font-semibold text-black "
                    >
                      Generate burn address
                    </button>

                    <div className="flex justify-center">
                      <button onClick={handleRecover} className="flex items-center text-sm font-medium text-brand">
                        <Icons.recover className="mr-2" />
                        Recover
                      </button>
                    </div>
                  </div>
                </div>
              </div>
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
