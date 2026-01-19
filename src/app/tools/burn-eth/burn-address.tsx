import InputComponent from '@/components/tools/input-text';
import { Icons } from '@/components/ui/icons';
import { useDebounceEffect } from '@/hooks/use-debounce-effect';
import { useInput, UserInputState } from '@/hooks/use-input';
import { BurnAddressContent, generateBurnAddress } from '@/lib/core/burn-address/burn-address-generator';
import { UniSwapContract } from '@/lib/core/contracts/uniswap';
import { calculateMintAmountStr } from '@/lib/core/utils/beth-amount-calculator';
import { roundEther } from '@/lib/core/utils/round-ether';
import { validateAddress, validateAll, validateETHAmount } from '@/lib/core/utils/validator';
import { parseEther } from 'ethers';
import { Dispatch, SetStateAction, useState } from 'react';
import { useClient } from 'wagmi';

export const BurnAddressGeneratorLayout = (props: {
  onBurnAddressGenerated: (burnAddress: BurnAddressContent, mintAmount: string) => void;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  isLoading: boolean;
}) => {
  const client = useClient();
  // Switch between main and advanced
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  // Main inputs
  const burnAmount = useInput('', validateETHAmount);
  const receiverAddress = useInput('', validateAddress);

  // Advanced inputs
  const proverFee = useInput('0.001', validateETHAmount);
  const broadcasterFee = useInput('0.001', validateETHAmount);
  const swapAmount = useInput('0.001', validateETHAmount);

  const [estimatedETH, setEstimatedETH] = useState('N/A');

  useDebounceEffect(
    () => {
      try {
        const bethAmount = parseEther(swapAmount.value);
        UniSwapContract.estimateETH(client!, bethAmount).then((estimatedAmount) => {
          setEstimatedETH(roundEther(estimatedAmount, 2));
        });
      } catch {
        setEstimatedETH('N/A');
      }
    },
    1000,
    [swapAmount]
  );

  const calculatedMintAmount = calculateMintAmountStr(
    burnAmount.value,
    swapAmount.value,
    proverFee.value,
    broadcasterFee.value
  );

  const onGenerateAddressClicked = async () => {
    // Validation
    if (!validateAll(burnAmount, receiverAddress)) return;

    if (props.isLoading) return;
    props.setIsLoading(true);
    try {
      let burnAddress = await generateBurnAddress(
        receiverAddress.value,
        parseEther(proverFee.value),
        parseEther(broadcasterFee.value),
        parseEther(burnAmount.value),
        new Uint8Array() // TODO
      );
      props.onBurnAddressGenerated(burnAddress, calculatedMintAmount);
    } catch (e) {
      console.error(e);
    } finally {
      props.setIsLoading(false);
    }
  };

  const onApplyClicked = () => {
    // Don't let user come back from advanced options page without validation
    if (!validateAll(proverFee, broadcasterFee, swapAmount)) return;
    setIsAdvancedOpen(false);
  };

  const onRecoverClicked = () => {
    // TODO load json file
  };

  return (
    <div className="w-full">
      {isAdvancedOpen ? (
        <AdvancedLayout
          estimatedETH={estimatedETH}
          broadcasterFee={broadcasterFee}
          proverFee={proverFee}
          swapAmount={swapAmount}
          onApplyClicked={onApplyClicked}
        />
      ) : (
        <MainLayout
          estimatedETH={estimatedETH}
          burnAmount={burnAmount}
          receiverAddress={receiverAddress}
          proverFee={proverFee.value}
          broadcasterFee={broadcasterFee.value}
          onGenerateBurnAddressClicked={onGenerateAddressClicked}
          onRecoverClicked={onRecoverClicked}
          setIsAdvancedOpen={setIsAdvancedOpen}
          calculatedBeth={calculatedMintAmount}
        />
      )}
    </div>
  );
};

const MainLayout = (props: {
  burnAmount: UserInputState;
  receiverAddress: UserInputState;
  calculatedBeth: string;
  proverFee: string;
  broadcasterFee: string;
  estimatedETH: string;
  setIsAdvancedOpen: Dispatch<SetStateAction<boolean>>;
  onGenerateBurnAddressClicked: () => void;
  onRecoverClicked: () => void;
}) => {
  return (
    <div className="rounded-lg p-6">
      <div className="space-y-4">
        <InputComponent label="Burn amount" hint="0.0" state={props.burnAmount} inputType="number" inputKind="ETH" />
        <InputComponent label="Receiver address" hint="0xf3...fd23" state={props.receiverAddress} />

        {/* Fees Section */}
        <div className="space-y-1">
          <div className="flex justify-between text-[16px]">
            <span className="text-[#94A3B8]">Prover fee</span>
            <span className="text-[#94A3B8]">{props.proverFee} BETH</span>
          </div>
          <div className="flex justify-between text-[16px]">
            <span className="text-[#94A3B8]">Broadcaster fee</span>
            <span className="text-[#94A3B8]">{props.broadcasterFee} BETH</span>
          </div>
        </div>

        {/* You Get Section */}
        <div className="text-[16px]">
          <div className="mb-1 text-white">You get</div>
          <div>
            <span className="text-white">{props.calculatedBeth} </span>
            <span className="text-pink-400">BETH</span>
            <span className="text-white"> + </span>
            <span className="text-white">~{props.estimatedETH}</span>
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
            className="w-full rounded-lg bg-brand px-4 py-3 font-semibold text-black"
          >
            Generate burn address
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
  broadcasterFee: UserInputState;
  proverFee: UserInputState;
  swapAmount: UserInputState;
  estimatedETH: string;
  onApplyClicked: () => void;
}) => {
  return (
    <div className="rounded-lg p-6">
      <div className="space-y-4">
        <div className="text-[18px] text-white">Advanced</div>
        <InputComponent
          label="Broadcaster fee"
          hint="0.2"
          state={props.broadcasterFee}
          inputKind="BETH"
          inputType="number"
        />
        <InputComponent label="Prover fee" hint="0.2" state={props.proverFee} inputKind="BETH" inputType="number" />
        <InputComponent
          label="Sell BETH for ETH "
          hint="0.2"
          state={props.swapAmount}
          inputKind="BETH"
          inputType="number"
        />
        <div className="flex flex-row">
          <div className="mr-1 text-[#94A3B8]">You Will get: {props.estimatedETH} </div>
          <div className="text-[#6E7AF0]"> ETH </div>
        </div>
        <button
          onClick={() => props.onApplyClicked()}
          className="mt-10 w-full rounded-lg bg-[rgba(var(--neutral-low-rgb),0.24)] px-4 py-3 font-semibold text-white"
        >
          Apply
        </button>
      </div>
    </div>
  );
};
