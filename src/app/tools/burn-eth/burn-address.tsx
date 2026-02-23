import InputComponent from '@/components/tools/input-text';
import { Icons } from '@/components/ui/icons';
import { useDebounceEffect } from '@/hooks/use-debounce-effect';
import { useInput, UserInputState } from '@/hooks/use-input';
import { BurnAddressContent, generateBurnAddress } from '@/lib/core/burn-address/burn-address-generator';
import { BETHToETHContract } from '@/lib/core/contracts/beth-to-eth';
import { CypherETHQuoterContract } from '@/lib/core/contracts/cyphereth-quoter';
import { calculateMintAmountStr, calculateProtocolFee } from '@/lib/core/utils/beth-amount-calculator';
import { validateAddress, validateAll, validateETHAmount } from '@/lib/core/utils/validator';
import { loadJson } from '@/lib/utils/load-json';
import { RecoverData, recoverDataFromJson } from '@/lib/utils/recover-data';
import { parseEther } from 'ethers';
import { Dispatch, SetStateAction, useState } from 'react';
import { formatUnits, hexToBytes } from 'viem';
import { useClient } from 'wagmi';

export const BurnAddressGeneratorLayout = (props: {
  onBurnAddressGenerated: (burnAddress: BurnAddressContent, mintAmount: string) => void;
  onRecover: (data: RecoverData) => void;
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
  const proverFee = useInput('0.0001', validateETHAmount);
  const broadcasterFee = useInput('0', validateETHAmount);
  const swapAmount = useInput('0.0005', validateETHAmount);

  const [estimatedETH, setEstimatedETH] = useState('N/A');
  useDebounceEffect(
    () => {
      CypherETHQuoterContract.estimateBethEtherSwap(client!, parseEther(swapAmount.value))
        .then((estimatedAmount) => {
          console.log('estimatedAmount:', estimatedAmount);
          setEstimatedETH(parseFloat(formatUnits(estimatedAmount, 18)).toPrecision(3));
        })
        .catch((e) => {
          console.error(e);
          setEstimatedETH('N/A');
        });
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

    if (parseFloat(calculatedMintAmount) < 0) {
      burnAmount.setError('You should burn more than the minting fees!');
      return;
    }

    if (parseEther(burnAmount.value) > BigInt('10000000000000000000')) {
      burnAmount.setError('You can not burn more then 10 ETH');
      return;
    }

    if (props.isLoading) return;
    props.setIsLoading(true);
    try {
      let swapCalldata = BETHToETHContract.createSwapHook(
        parseEther(swapAmount.value),
        receiverAddress.value as `0x${string}`
      );
      let burnAddress = await generateBurnAddress(
        receiverAddress.value,
        parseEther(proverFee.value),
        parseEther(broadcasterFee.value),
        parseEther(burnAmount.value),
        hexToBytes(swapCalldata)
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

  const onRecoverClicked = async () => props.onRecover(recoverDataFromJson(await loadJson()));

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
          swapAmount={swapAmount.value}
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
  swapAmount: string;
  estimatedETH: string;
  setIsAdvancedOpen: Dispatch<SetStateAction<boolean>>;
  onGenerateBurnAddressClicked: () => void;
  onRecoverClicked: () => void;
}) => {
  const protocolFee = calculateProtocolFee(props.burnAmount.value);

  return (
    <div className="flex h-full flex-col">
      <div className="mb-4">
        <InputComponent label="Burn amount" hint="0.0" state={props.burnAmount} inputType="number" inputKind="ETH" />
      </div>
      <div className="mb-4">
        <InputComponent
          label="Receiver address"
          hint="0xf3...fd23"
          state={props.receiverAddress}
          info="This address will get BETH (make sure you have private key of this address)"
        />
      </div>

      {/* Fees Section */}
      <div className="mb-4 space-y-1">
        <div className="flex justify-between text-[16px]">
          <span className="text-[#94A3B8]">Prover fee</span>
          <span className="text-[#94A3B8]">{props.proverFee} BETH</span>
        </div>
        <div className="flex justify-between text-[16px]">
          <span className="text-[#94A3B8]">Broadcaster fee</span>
          <span className="text-[#94A3B8]">{props.broadcasterFee} BETH</span>
        </div>
        <div className="flex justify-between text-[16px]">
          <span className="text-[#94A3B8]">Protocol fee</span>
          <span className="text-[#94A3B8]">{protocolFee} BETH</span>
        </div>
        <div className="flex justify-between text-[16px]">
          <span className="text-[#94A3B8]">Swap to ETH</span>
          <span className="text-[#94A3B8]">{props.swapAmount} BETH</span>
        </div>
      </div>

      {/* You Get Section */}
      <div className="text-[16px]">
        {props.calculatedBeth !== 'N/A' ? (
          <>
            <div className="mb-1 text-white">You get</div>
            <div>
              <span className="text-white">{props.calculatedBeth} </span>
              <span className="text-pink-400">BETH</span>
              <span className="text-white"> + </span>
              <span className="text-white">~{props.estimatedETH}</span>
              <span className="text-blue-400"> ETH</span>
            </div>
          </>
        ) : undefined}
      </div>

      {/* Advanced Options */}
      <button
        onClick={() => props.setIsAdvancedOpen(true)}
        className="my-2 flex items-center justify-center py-2 text-sm font-medium text-white"
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

      <div className="grow" />
      {/* Action Buttons */}
      <div>
        <button
          onClick={props.onGenerateBurnAddressClicked}
          className="w-full rounded-lg bg-brand px-4 py-3 font-semibold text-black"
        >
          Generate burn address
        </button>

        <button
          onClick={props.onRecoverClicked}
          className="mt-2 flex w-full flex-row items-center justify-center py-3 text-sm font-medium text-brand"
        >
          <Icons.recover className="mr-2" />
          Recover
        </button>

        <div className="mt-3 text-[14px]">
          <div className="text-white italic">
            <span className="font-bold text-yellow-300">Disclaimer:</span> The WORM project’s mainnet is expected to
            roll out in phases. The ETH/BETH market pair may be extremely volatile during this period, so please use it
            at your own risk.
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
    <div className="flex h-full flex-col gap-4">
      <div className="text-[18px] text-white">Advanced</div>
      <InputComponent label="Prover fee" hint="0.2" state={props.proverFee} inputKind="BETH" inputType="number" />
      <InputComponent
        label="Broadcaster fee"
        hint="0.2"
        state={props.broadcasterFee}
        inputKind="BETH"
        inputType="number"
        disabled={false}
      />
      <InputComponent
        label="Sell BETH for ETH "
        hint="0.2"
        state={props.swapAmount}
        inputKind="BETH"
        inputType="number"
        disabled={false}
      />
      <div className="flex flex-row">
        <div className="mr-1 text-[#94A3B8]">You will get: ~{props.estimatedETH} </div>
        <div className="text-[#6E7AF0]"> ETH </div>
      </div>

      <div className="grow" />
      <button
        onClick={() => props.onApplyClicked()}
        className="mt-10 w-full rounded-lg bg-[rgba(var(--neutral-low-rgb),0.24)] px-4 py-3 font-semibold text-white"
      >
        Apply
      </button>
    </div>
  );
};
