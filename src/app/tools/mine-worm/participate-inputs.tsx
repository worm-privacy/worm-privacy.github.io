import ErrorComponent from '@/components/tools/error-component';
import InputComponent from '@/components/tools/input-text';
import LoadingComponent from '@/components/tools/loading';
import { useInput } from '@/hooks/use-input';
import { BETHContractABI, BETHContractAddress } from '@/lib/core/contracts/beth';
import { WORMcontractABI, WORMcontractAddress } from '@/lib/core/contracts/worm';
import { validateAll, validateETHAmount, validatePositiveInteger } from '@/lib/core/utils/validator';
import { useState } from 'react';
import { formatUnits, parseEther } from 'viem';
import { waitForTransactionReceipt } from 'viem/actions';
import { useClient, useConnection, useReadContract, useWriteContract } from 'wagmi';

export default function ParticipateInputs() {
  const bethAmount = useInput('', validateETHAmount);
  const numberOfEpochs = useInput('', validatePositiveInteger);
  const [participateLoading, setParticipateLoading] = useState(false);
  const client = useClient();

  const { mutateAsync } = useWriteContract();

  const { address, isConnected } = useConnection();
  //TODO handle if wallet is not connected
  const {
    data,
    isError,
    isLoading: balanceOfLoading,
    error,
  } = useReadContract({
    address: BETHContractAddress,
    abi: BETHContractABI,
    functionName: 'balanceOf',
    args: [address!],
  });
  if (isError) {
    console.log('error:', error);
    return <ErrorComponent title="Participate failed" details="error happens while doing participate" />;
  }

  if (balanceOfLoading) return <LoadingComponent />;
  if (participateLoading) return <LoadingComponent />;

  const bethBalance = data !== undefined ? parseFloat(formatUnits(data, Number(18))).toFixed(6) : 'loading';

  const onMaxClick = () => bethAmount.update(bethBalance);

  const onParticipateClick = async () => {
    if (!validateAll(bethAmount, numberOfEpochs)) return;
    const beth = parseEther(bethAmount.value);
    const epochs = BigInt(parseInt(numberOfEpochs.value));
    const bethPerEpoch = beth / epochs;
    if (beth == 0n) {
      bethAmount.setError("can't be zero");
      return;
    }

    setParticipateLoading(true);
    try {
      console.log('calling approve');
      const approveTXHash = await mutateAsync({
        address: BETHContractAddress,
        abi: BETHContractABI,
        functionName: 'approve',
        args: [WORMcontractAddress, beth],
      });

      console.log('waiting for receipt');
      let r = await waitForTransactionReceipt(client!, { hash: approveTXHash });
      if (r.status == 'reverted') throw 'allowance reverted';

      console.log('got approve receipt');

      console.log('calling participate');
      const participateTXHash = await mutateAsync({
        address: WORMcontractAddress,
        abi: WORMcontractABI,
        functionName: 'participate',
        args: [bethPerEpoch, epochs],
      });

      console.log('waiting for receipt');
      r = await waitForTransactionReceipt(client!, { hash: participateTXHash });
      if (r.status == 'reverted') throw 'participate reverted';

      console.log('got approve receipt');
    } catch (e) {
      // TODO show error to user
      console.error(e);
    } finally {
      setParticipateLoading(false);
    }
  };

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

      <button onClick={onParticipateClick} className="w-full rounded-lg bg-brand px-4 py-3 text-black">
        Participate
      </button>
    </div>
  );
}
