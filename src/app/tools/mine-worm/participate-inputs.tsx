import InputComponent from '@/components/tools/input-text';
import LoadingComponent from '@/components/tools/loading';
import { useInput } from '@/hooks/use-input';
import { BETHContractABI, BETHContractAddress } from '@/lib/core/contracts/beth';
import { validateETHAmount, validatePositiveInteger } from '@/lib/core/utils/validator';
import { formatUnits } from 'viem';
import { useConnection, useReadContract } from 'wagmi';

export default function ParticipateInputs() {
  const bethAmount = useInput('', validateETHAmount);
  const numberOfEpochs = useInput('', validatePositiveInteger);

  const { address, isConnected } = useConnection();
  const { data, isError, isLoading, error } = useReadContract({
    address: BETHContractAddress,
    abi: BETHContractABI,
    functionName: 'balanceOf',
    args: [address!],
  });
  if (isError) console.log('error:', error); // TODO error component

  if (isLoading) return <LoadingComponent />;

  const bethBalance = data !== undefined ? parseFloat(formatUnits(data, Number(18))).toFixed(6) : 'loading';

  const onMaxClick = () => bethAmount.update(bethBalance);

  return (
    <div className="flex grow flex-col gap-2">
      <div className="text-[14px] text-white">BETH balance</div>
      <div className="mb-3 flex flex-row gap-1 text-[16px]">
        <div className="font-bold text-white">{bethBalance}</div>
        <div className="text-[#FF47C0]">BETH</div>
      </div>

      <InputComponent
        label="BETH amount to participate"
        hint="for example 2"
        state={bethAmount}
        inputKind="BETH"
        inputType="number"
        optional={false}
      >
        <button onClick={onMaxClick} className="mr-2 text-white">
          MAX
        </button>
      </InputComponent>

      <InputComponent
        label="Number of epochs"
        hint="Minimum 1"
        state={numberOfEpochs}
        inputKind="Epoch"
        inputType="number"
        optional={false}
      />

      <div className="grow" />

      <button className="w-full rounded-lg bg-brand px-4 py-3 text-black">Participate</button>
    </div>
  );
}
