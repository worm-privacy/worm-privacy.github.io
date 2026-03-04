import InputComponent from '@/components/tools/input-text';
import { Icons } from '@/components/ui/icons';
import { useInput } from '@/hooks/use-input';
import { validateAddress, validateAll, validateETHAmount } from '@/lib/core/utils/validator';
import { loadJson } from '@/lib/utils/load-json';
import { RecoverData, recoverDataFromJson } from '@/lib/utils/recover-data';
import { useState } from 'react';
import { parseEther } from 'viem';

export const Inputs = (props: {
  onStart: (burnAmount: bigint, receiverAddress: `0x${string}`) => void;
  onRecover: (backup: RecoverData) => void;
}) => {
  const burnAmount = useInput('', validateETHAmount);
  const receiverAddress = useInput('', validateAddress);

  const [receiveAmount, setReceiveAmount] = useState(0n);

  const estimatedETH: string = '0.1234';

  const onStartClick = () => {
    if (!validateAll(burnAmount, receiverAddress)) return;

    if (receiveAmount < 0n) {
      burnAmount.setError('Burn amount is too low');
      return;
    }
    const burnAmountN = parseEther(burnAmount.value);
    if (burnAmountN > parseEther('10')) {
      burnAmount.setError('You can not burn more then 10 ETH');
      return;
    }
    props.onStart(burnAmountN, receiverAddress.value as `0x${string}`);
  };
  const onRecoverClick = async () => props.onRecover(recoverDataFromJson(await loadJson()));

  return (
    <div className="mx-auto w-[580px] rounded-xl border border-[rgba(var(--neutral-low-rgb),0.24)] bg-[#010204] p-4 shadow-lg">
      <div className="flex flex-col gap-4">
        <InputComponent label="Burn amount" hint="0.0" state={burnAmount} inputType="number" inputKind="ETH" />
        <InputComponent
          label="Receiver address"
          hint="0xf3...fd23"
          state={receiverAddress}
          info="This address will get BETH (make sure you have private key of this address)"
        />

        <div className="space-y-1">
          <div className="flex justify-between text-[16px]">
            <span className="text-[#94A3B8]">Prover fee</span>
            <span className="text-[#94A3B8]">{1} BETH</span>
          </div>
          <div className="flex justify-between text-[16px]">
            <span className="text-[#94A3B8]">Broadcaster fee</span>
            <span className="text-[#94A3B8]">{1} BETH</span>
          </div>
          <div className="flex justify-between text-[16px]">
            <span className="text-[#94A3B8]">Protocol fee</span>
            <span className="text-[#94A3B8]">{1} BETH</span>
          </div>
        </div>

        <div className="text-[16px]">
          {estimatedETH !== '' ? (
            <>
              <span className="mb-1 text-white">You will get</span>
              <span className="text-white"> ~{estimatedETH}</span>
              <span className="text-blue-400"> ETH</span>
            </>
          ) : undefined}
        </div>

        <button onClick={onStartClick} className="w-full rounded-lg bg-brand px-4 py-3 font-semibold text-black">
          Teleport!
        </button>

        <button
          onClick={onRecoverClick}
          className="flex w-full flex-row items-center justify-center py-3 text-sm font-medium text-brand"
        >
          <Icons.recover className="mr-2" />
          Recover
        </button>
      </div>
    </div>
  );
};
