import ErrorComponent from '@/components/tools/error-component';
import InputComponent from '@/components/tools/input-text';
import LoadingComponent from '@/components/tools/loading';
import { useInput } from '@/hooks/use-input';
import { UseStakingListResult } from '@/hooks/use-staking-list';
import { StakingContract } from '@/lib/core/contracts/staking';
import { WORMContract, WORMcontractABI, WORMcontractAddress } from '@/lib/core/contracts/worm';
import { validateAll, validateETHAmount, validatePositiveInteger } from '@/lib/core/utils/validator';
import { useState } from 'react';
import { formatEther, parseEther } from 'viem';
import { useClient, useConnection, useReadContract, useWriteContract } from 'wagmi';

export default function StakingInputs(props: { result: UseStakingListResult; refresh: () => Promise<void> }) {
  const [isStakeError, setIsStakeError] = useState(false);
  const wormAmount = useInput('', validateETHAmount);
  const numberOfWeeks = useInput('', validatePositiveInteger);
  const [stakeLoading, setStakeLoading] = useState(false);
  const client = useClient();
  const { mutateAsync } = useWriteContract();
  const { address, isConnected } = useConnection();

  const {
    data: wormBalance,
    isError: balanceIsError,
    isLoading: balanceOfLoading,
    error: balanceReadError,
    refetch: refetchBalance,
  } = useReadContract({
    address: WORMcontractAddress,
    abi: WORMcontractABI,
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

  if (isStakeError) {
    return (
      <>
        <ErrorComponent title="Stake operation failed" details="error happens while doing stake operation" />;
      </>
    );
  }

  if (balanceOfLoading) return <LoadingComponent />;
  if (stakeLoading) return <LoadingComponent />;

  const wormBalanceStr = wormBalance !== undefined ? formatEther(wormBalance) : 'loading';

  const onMaxClick = () => wormAmount.update(wormBalanceStr);

  const onStakeClick = async () => {
    if (!validateAll(wormAmount, numberOfWeeks)) return;
    let worm = parseEther(wormAmount.value);
    const weeks = BigInt(parseInt(numberOfWeeks.value));

    worm = wormBalance! > worm ? worm : wormBalance!; // min

    if (worm == 0n) {
      wormAmount.setError("can't be zero");
      return;
    }
    if (weeks == 0n) {
      numberOfWeeks.setError("can't be zero");
      return;
    }

    setStakeLoading(true);
    setIsStakeError(false);
    try {
      await WORMContract.approve(mutateAsync, client!, worm);
      await StakingContract.lock(mutateAsync, client!, worm, weeks);
      props.refresh();
      refetchBalance();
      wormAmount.update('');
      numberOfWeeks.update('');
    } catch (e) {
      console.error(e);
      setIsStakeError(true);
    } finally {
      setStakeLoading(false);
    }
  };

  return (
    <div className="flex grow flex-col gap-2">
      <div className="text-[14px] text-white">WORM balance</div>
      <div className="mb-3 flex flex-row gap-1 text-[16px]">
        <div className="font-bold text-white">{wormBalanceStr}</div>
        <div className="text-brand">WORM</div>
      </div>

      <InputComponent
        label="WORM amount to stake"
        hint="e.g. 0.1"
        state={wormAmount}
        inputKind="WORM"
        inputType="number"
        optional={false}
      >
        <button onClick={onMaxClick} className="mr-2 text-white">
          MAX
        </button>
      </InputComponent>

      <InputComponent
        label="Staking "
        hint="e.g. 3"
        state={numberOfWeeks}
        inputKind="Weeks"
        inputType="number"
        optional={false}
      />

      <div className="text-white opacity-60">Your delegation start from next week</div>

      <div className="grow" />

      <button onClick={onStakeClick} className="w-full rounded-lg bg-brand px-4 py-3 text-black">
        Stake
      </button>
    </div>
  );
}
