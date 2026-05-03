'use client';

import InputComponent from '@/components/tools/input-text';
import LoadingComponent from '@/components/tools/loading';
import { Icons } from '@/components/ui/icons';
import { useDebounceEffect } from '@/hooks/use-debounce-effect';
import { useInput } from '@/hooks/use-input';
import { useTokenSelection } from '@/hooks/use-token-selection';
import { BurnAddressContent, generateBurnAddress } from '@/lib/core/burn-address/burn-address-generator';
import { BETHToETHContract } from '@/lib/core/contracts/beth-to-eth';
import { proof_get } from '@/lib/core/miner-api/proof-get';
import { relay_get } from '@/lib/core/miner-api/relay-get';
import { LISTED_TOKENS } from '@/lib/core/tokens-config';
import { calculateMintAmount } from '@/lib/core/utils/beth-amount-calculator';
import { validateAddress, validateAll, validateETHAmount } from '@/lib/core/utils/validator';
import { estimatePrivateSwap } from '@/lib/utils/estimate-private-swap';
import { newSavableRecoverData } from '@/lib/utils/recover-data';
import { saveJson } from '@/lib/utils/save-json';
import { useEffect, useState } from 'react';
import { formatEther, formatUnits, hexToBytes, parseEther, parseUnits } from 'viem';
import { useClient } from 'wagmi';
import { DEFAULT_ENDPOINT } from '../tools/burn-eth/mint-beth';
import { AmountTokenSelector } from './amount-token-selector';

export default function WormholeRestComponent(props: {
  onRecoverClick: () => void;
  onStart: (result: WormholeRestComponentResult) => void;
}) {
  const burnAmount = useInput('', validateETHAmount); // TODO handle error state
  const burnToken = useTokenSelection(LISTED_TOKENS[0]);

  const receiverAddress = useInput('', validateAddress); // TODO handle error state
  const receiveToken = useTokenSelection(null);

  const [relayConfig, setRelayConfig] = useState<RelayConfig | null>(null); // null means not loaded yet

  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  //TODO error state

  const client = useClient();

  // calculate/estimate
  const [burnAmountETH, setBurnAmountETH] = useState(0n); // this is in ETH
  const estimatedTokenOut = useInput('', validateETHAmount); // this is in tokenOut ERC-20

  useEffect(() => {
    (async () => {
      try {
        let r = await relay_get(DEFAULT_ENDPOINT.url);
        let p = await proof_get(DEFAULT_ENDPOINT.url);
        setRelayConfig({
          proverFee: p.min_prover_fee,
          broadcasterFee: r.min_broadcaster_fee,
          proverAddress: p.prover_address,
        });
      } catch (e) {
        //TODO handle loading config error
      }
    })();
  }, []);

  useDebounceEffect(
    async () => {
      try {
        estimatedTokenOut.update('');
        setBurnAmountETH(0n);
        const estimatedAmount = await estimatePrivateSwap(
          client!,
          burnToken.value!,
          receiveToken.value!,
          parseUnits(burnAmount.value, burnToken.value!.decimals),
          relayConfig!.proverFee,
          relayConfig!.broadcasterFee
        );
        estimatedTokenOut.update(formatUnits(estimatedAmount.tokenOut, receiveToken.value!.decimals));
        setBurnAmountETH(estimatedAmount.burnAmountETH);
      } catch (e) {
        console.error(e);
        // if (e === INPUT_AMOUNT_NOT_ENOUGH) setError(e); // TODO handle error
        estimatedTokenOut.update('');
        setBurnAmountETH(0n);
      }
    },
    2000,
    [burnAmount.value, burnToken.value?.address, receiveToken.value?.address]
  );

  const onStartClick = async () => {
    // validation
    if (!validateAll(burnAmount, receiverAddress)) return;
    if (receiveToken.value === null) {
      //TODO error "Receive token is not selected"
    }
    if (parseUnits(estimatedTokenOut.value, receiveToken.value!.decimals) < 0n)
      return burnAmount.setError('Burn amount is too low');

    if (burnAmountETH > parseEther('10')) return burnAmount.setError('You can not burn more then 10 ETH');

    if (relayConfig === null) return;

    try {
      // `swapAmount` sets 0n because we want to swap all of it anyway
      const mintAmount = calculateMintAmount(burnAmountETH, 0n, relayConfig.proverFee, relayConfig.broadcasterFee);
      console.log('onStart', formatEther(burnAmountETH), formatEther(mintAmount), receiverAddress);
      setIsCalculating(true);

      // TODO create swap hook to swap BETH to any other ERC-20 or ETH (not only ETH)
      const swapCalldata = hexToBytes(
        BETHToETHContract.createSwapHook(mintAmount, receiverAddress.value as `0x${string}`)
      );

      const _burnAddress = await generateBurnAddress(
        receiverAddress.value,
        relayConfig.proverFee,
        relayConfig.broadcasterFee,
        burnAmountETH,
        swapCalldata
      );

      saveJson(newSavableRecoverData(_burnAddress), `burn_${_burnAddress.burnAddress}_backup.json`);
      props.onStart({ burnAddress: _burnAddress });
    } catch (e) {
      console.error('onStart', e);
      //TODO error state
    }
  };

  if (isCalculating) return <LoadingComponent />;

  return (
    <div className="flex flex-col gap-3 ">
      <AmountTokenSelector typeName="send" amountState={burnAmount} tokenSelectionState={burnToken} />

      {/* arrow */}
      <div className="-mt-7 -mb-7 flex flex-row">
        <div className="grow" />
        <Icons.back className="rotate-270 rounded-lg bg-[#090C15] p-2" width={35} height={35} />
        <div className="grow" />
      </div>

      <AmountTokenSelector
        typeName="receive"
        disabled={true}
        amountState={estimatedTokenOut}
        tokenSelectionState={receiveToken}
      />
      <InputComponent
        label="Receiver address"
        hint="0xf3...fd23"
        state={receiverAddress}
        info="This address will get ETH with no link to the burner! The burner account will perform zero smart-contract interactions!"
      />

      <button onClick={onStartClick} className={`mt-3 w-full rounded-lg bg-brand px-4 py-3 font-semibold text-black`}>
        Start swap
      </button>

      <button
        onClick={props.onRecoverClick}
        className="flex w-full flex-row items-center justify-center py-3 text-sm font-medium text-brand"
      >
        <Icons.recover className="mr-2" />
        Recover
      </button>
    </div>
  );
}

export type WormholeRestComponentResult = {
  burnAddress: BurnAddressContent;
};

export type RelayConfig = {
  proverFee: bigint;
  broadcasterFee: bigint;
  proverAddress: `0x${string}`;
};
