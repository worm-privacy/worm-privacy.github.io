import ErrorComponent from '@/components/tools/error-component';
import InputComponent from '@/components/tools/input-text';
import LoadingComponent from '@/components/tools/loading';
import { UseEpochListResult } from '@/hooks/use-epoch-list';
import { useInput } from '@/hooks/use-input';
import { BETHContract, BETHContractABI, BETHContractAddress } from '@/lib/core/contracts/beth';
import { WORMContract } from '@/lib/core/contracts/worm';
import { validateAll, validateETHAmount, validatePositiveInteger } from '@/lib/core/utils/validator';
import { useState } from 'react';
import { formatEther, parseEther } from 'viem';
import { useClient, useConnection, useReadContract, useWriteContract } from 'wagmi';
import Participated from './participated';

export default function ParticipateInputs(props: { result: UseEpochListResult; refresh: () => Promise<void> }) {
  const [participated, setParticipated] = useState(false);
  const [isParticipateError, setIsParticipateError] = useState(false);
  const bethAmount = useInput('', validateETHAmount);
  const numberOfEpochs = useInput('', validatePositiveInteger);
  const [participateLoading, setParticipateLoading] = useState(false);
  const client = useClient();

  const { mutateAsync } = useWriteContract();

  const { address, isConnected } = useConnection();
  const {
    data: bethBalance,
    isError: balanceIsError,
    isLoading: balanceOfLoading,
    error: balanceReadError,
  } = useReadContract({
    address: BETHContractAddress,
    abi: BETHContractABI,
    functionName: 'balanceOf',
    args: [address!],
  });

  if (balanceIsError) {
    console.log('error:', balanceReadError);
    return <ErrorComponent title="Balance Error" details="error happens while getting your balance" />;
  }

  if (!isConnected) {
    return (
      <>
        <ErrorComponent title="Wallet not connected" details="Plz connect your wallet to continue" />
      </>
    );
  }

  if (isParticipateError) {
    return (
      <>
        <ErrorComponent title="Participate failed" details="error happens while doing participate" />;
      </>
    );
  }

  if (participated) return <Participated amount={bethAmount.value} numberOfEpochs={numberOfEpochs.value} />;
  if (balanceOfLoading) return <LoadingComponent />;
  if (participateLoading) return <LoadingComponent />;

  const bethBalanceStr = bethBalance !== undefined ? formatEther(bethBalance) : 'loading';

  const onMaxClick = () => bethAmount.update(bethBalanceStr);

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
    setIsParticipateError(false);
    try {
      await BETHContract.approve(mutateAsync, client!, beth);
      await WORMContract.participate(mutateAsync, client!, bethPerEpoch, epochs);
      props.refresh();
      setParticipated(true);
    } catch (e) {
      console.error(e);
      setIsParticipateError(true);
    } finally {
      setParticipateLoading(false);
    }
  };

  return (
    <div className="flex grow flex-col gap-2">
      <div className="text-[14px] text-white">BETH balance</div>
      <div className="mb-3 flex flex-row gap-1 text-[16px]">
        <div className="font-bold text-white">{bethBalanceStr}</div>
        <div className="text-[#FF47C0]">BETH</div>
      </div>

      <InputComponent
        label="BETH amount to participate"
        hint="e.g. 0.1"
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
