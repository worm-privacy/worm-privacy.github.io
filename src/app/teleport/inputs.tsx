import InputComponent from '@/components/tools/input-text';
import { Icons } from '@/components/ui/icons';
import { useDebounceEffect } from '@/hooks/use-debounce-effect';
import { useInput } from '@/hooks/use-input';
import { CypherETHQuoterContract } from '@/lib/core/contracts/cyphereth-quoter';
import { proof_get } from '@/lib/core/miner-api/proof-get';
import { relay_get } from '@/lib/core/miner-api/relay-get';
import { calculateMintAmount } from '@/lib/core/utils/beth-amount-calculator';
import { roundEther } from '@/lib/core/utils/round-ether';
import { validateAddress, validateAll, validateETHAmount } from '@/lib/core/utils/validator';
import { loadJson } from '@/lib/utils/load-json';
import { RecoverData, recoverDataFromJson } from '@/lib/utils/recover-data';
import { useEffect, useState } from 'react';
import { parseEther } from 'viem';
import { useClient } from 'wagmi';
import { DEFAULT_ENDPOINT } from '../tools/burn-eth/mint-beth';

export const Inputs = (props: {
  onStart: (burnAmount: bigint, receiverAddress: `0x${string}`) => void;
  onRecover: (backup: RecoverData) => void;
}) => {
  const client = useClient();

  // inputs
  const burnAmount = useInput('', validateETHAmount);
  const receiverAddress = useInput('', validateAddress);

  // fees
  const [proverFee, setProverFee] = useState<bigint | null>(null); // null means not loaded yet
  const [broadcasterFee, setBroadcasterFee] = useState<bigint | null>(null); // null means not loaded yet

  // calculate/estimate
  const [mintAmount, setMintAmount] = useState(0n); // this is BETH
  const [receiveAmount, setReceiveAmount] = useState(0n); // this is ETH

  useEffect(() => {
    // TODO call these two in parallel
    relay_get(DEFAULT_ENDPOINT.url)
      .then((response) => {
        setBroadcasterFee(response.min_broadcaster_fee);
      })
      .catch((e) => {
        // TODO handle error
      });
    proof_get(DEFAULT_ENDPOINT.url)
      .then((response) => {
        setProverFee(response.min_prover_fee);
      })
      .catch((e) => {
        // TODO handle error
      });
  }, []);

  useEffect(() => {
    if (proverFee == null || broadcasterFee == null) return;
    // Swap amount sets 0 because we want to swap all of it anyway
    setMintAmount(calculateMintAmount(parseEther(burnAmount.value), 0n, proverFee, broadcasterFee));
  }, [burnAmount, proverFee, broadcasterFee]);

  useDebounceEffect(
    () => {
      CypherETHQuoterContract.estimateBethEtherSwap(client!, mintAmount)
        .then((estimatedAmount) => {
          console.log('estimatedAmount:', estimatedAmount);
          setReceiveAmount(estimatedAmount);
        })
        .catch((e) => {
          console.error(e);
          //TODO handle error
        });
    },
    1000,
    [mintAmount]
  );

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
          {roundEther(receiveAmount) !== '' ? (
            <>
              <span className="mb-1 text-white">You will get</span>
              <span className="text-white"> ~{receiveAmount}</span>
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
