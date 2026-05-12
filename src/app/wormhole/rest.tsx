'use client';

import InputComponent from '@/components/tools/input-text';
import LoadingComponent from '@/components/tools/loading';
import { Icons } from '@/components/ui/icons';
import { useDebounceEffect } from '@/hooks/use-debounce-effect';
import { useInput } from '@/hooks/use-input';
import { useTokenSelection } from '@/hooks/use-token-selection';
import { BurnAddressContent, generateBurnAddress } from '@/lib/core/burn-address/burn-address-generator';
import { BETHToERC20Contract } from '@/lib/core/contracts/beth-to-erc20';
import { BETHToETHContract } from '@/lib/core/contracts/beth-to-eth';
import { proof_get } from '@/lib/core/miner-api/proof-get';
import { relay_get } from '@/lib/core/miner-api/relay-get';
import { LISTED_TOKENS, ListedToken } from '@/lib/core/tokens-config';
import { calculateMintAmount, POOL_SHARE_INV } from '@/lib/core/utils/beth-amount-calculator';
import { roundUnits } from '@/lib/core/utils/round-ether';
import { encodeV3QuoterPath } from '@/lib/core/utils/swap-path-utils';
import { validateAddress, validateAll, validateETHAmount } from '@/lib/core/utils/validator';
import { estimatePrivateSwap, INPUT_AMOUNT_NOT_ENOUGH } from '@/lib/utils/estimate-private-swap';
import { newSavableRecoverData } from '@/lib/utils/recover-data';
import { saveJson } from '@/lib/utils/save-json';
import { useEffect, useState } from 'react';
import { ByteArray, formatEther, hexToBytes, parseEther, parseUnits } from 'viem';
import { useClient } from 'wagmi';
import { DEFAULT_ENDPOINT } from '../tools/burn-eth/mint-beth';
import { AmountTokenSelector } from './amount-token-selector';
import WormholeCostDetailsComponent from './cost-details';

export default function WormholeRestComponent(props: {
  onRecoverClick: () => void;
  onStart: (result: WormholeRestComponentResult) => void;
}) {
  const burnAmountERC20 = useInput('', validateETHAmount);
  const burnToken = useTokenSelection(LISTED_TOKENS[0]);

  const receiverAddress = useInput('', validateAddress);
  const receiveToken = useTokenSelection(null);

  const [relayConfig, setRelayConfig] = useState<RelayConfig | null>(null); // null means not loaded yet

  const [isCalculating, setIsCalculating] = useState<boolean>(false);

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
        console.error('error while loading relay configs', e);
      }
    })();
  }, []);

  useDebounceEffect(
    async () => {
      try {
        estimatedTokenOut.update('...');
        setBurnAmountETH(0n);
        const estimatedAmount = await estimatePrivateSwap(
          client!,
          burnToken.value!,
          receiveToken.value!,
          parseUnits(burnAmountERC20.value, burnToken.value!.decimals),
          relayConfig!.proverFee,
          relayConfig!.broadcasterFee
        );
        estimatedTokenOut.update(roundUnits(estimatedAmount.tokenOut, receiveToken.value!.decimals));
        setBurnAmountETH(estimatedAmount.burnAmountETH);
      } catch (e) {
        console.error(e);
        if (e === INPUT_AMOUNT_NOT_ENOUGH) burnAmountERC20.setError(INPUT_AMOUNT_NOT_ENOUGH);
        estimatedTokenOut.update('?');
        setBurnAmountETH(0n);
      }
    },
    1000,
    [burnAmountERC20.value, burnToken.value?.symbol, receiveToken.value?.symbol]
  );

  const onStartClick = async () => {
    // validation
    if (!validateAll(burnAmountERC20, receiverAddress)) return;
    if (receiveToken.value === null) {
      estimatedTokenOut.setError('Receive token is not selected');
      return;
    }
    if (parseUnits(estimatedTokenOut.value, receiveToken.value!.decimals) < 0n)
      return burnAmountERC20.setError('Burn amount is too low');

    if (burnAmountETH > parseEther('10')) return burnAmountERC20.setError('You can not burn more then 10 ETH');
    if (burnAmountETH < parseEther('0')) return burnAmountERC20.setError('Burn Amount is less then zero');

    if (relayConfig === null) return;

    try {
      // `swapAmount` sets 0n because we want to swap all of it anyway
      const mintAmount = calculateMintAmount(burnAmountETH, 0n, relayConfig.proverFee, relayConfig.broadcasterFee);
      console.log('onStart', formatEther(burnAmountETH), formatEther(mintAmount), receiverAddress);
      setIsCalculating(true);

      let swapCalldata: ByteArray;
      switch (receiveToken.value!.type) {
        case 'native':
          swapCalldata = hexToBytes(
            BETHToETHContract.createSwapHook(mintAmount, receiverAddress.value as `0x${string}`)
          );
          break;
        case 'erc20':
          swapCalldata = hexToBytes(
            BETHToERC20Contract.createSwapHook(
              mintAmount,
              encodeV3QuoterPath(receiveToken.value!.pathToWETH.toReversed()),
              receiverAddress.value as `0x${string}`
            )
          );
          break;
      }

      const _burnAddress = await generateBurnAddress(
        receiverAddress.value,
        relayConfig.proverFee,
        relayConfig.broadcasterFee,
        burnAmountETH,
        swapCalldata
      );

      saveJson(newSavableRecoverData(_burnAddress), `burn_${_burnAddress.burnAddress}_backup.json`);
      props.onStart({
        burnAddress: _burnAddress,
        burnToken: burnToken.value!,
        burnAmountERC20: parseUnits(burnAmountERC20.value, burnToken.value!.decimals),
        receiveToken: receiveToken.value!,
        estimatedReceiveAmount: parseUnits(estimatedTokenOut.value, receiveToken.value!.decimals),
        relayConfig: relayConfig,
      });
    } catch (e) {
      console.error('onStart', e);
      setIsCalculating(false);
    }
  };

  if (isCalculating) return <LoadingComponent />;

  return (
    <div className="flex flex-col gap-3 ">
      <AmountTokenSelector typeName="send" amountState={burnAmountERC20} tokenSelectionState={burnToken} />

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

      {burnAmountERC20.error && (
        <div className="ml-1 flex flex-row items-center gap-3">
          <Icons.alert />
          <div className="text-[14px] text-(--err) ">{burnAmountERC20.error}</div>
        </div>
      )}

      {estimatedTokenOut.error && (
        <div className="ml-1 flex flex-row items-center gap-3">
          <Icons.alert />
          <div className="text-[14px] text-(--err) ">{estimatedTokenOut.error}</div>
        </div>
      )}

      <InputComponent
        label="Receiver address"
        hint="0xf3...fd23"
        state={receiverAddress}
        info="This address will get token with no link to the burner! The burner account will perform zero smart-contract interactions!"
      />

      <div className="my-3 border-t border-gray-800"></div>

      <WormholeCostDetailsComponent
        broadcasterFee={relayConfig?.broadcasterFee}
        proverFee={relayConfig?.proverFee}
        protocolFee={burnAmountETH / POOL_SHARE_INV}
        isExpanded={false}
      />

      <button onClick={onStartClick} className={`mt-3 w-full rounded-lg bg-brand px-4 py-3 text-black`}>
        Start swap
      </button>

      <button
        onClick={props.onRecoverClick}
        className="flex w-full flex-row items-center justify-center py-3 text-sm font-medium text-brand"
      >
        <Icons.recover className="mr-2" fill="var(--brand)" />
        Recover
      </button>
    </div>
  );
}

export type WormholeRestComponentResult = {
  burnAddress: BurnAddressContent;

  burnToken: ListedToken;
  burnAmountERC20: bigint;

  receiveToken: ListedToken;
  estimatedReceiveAmount: bigint;

  relayConfig: RelayConfig;
};

export type RelayConfig = {
  proverFee: bigint;
  broadcasterFee: bigint;
  proverAddress: `0x${string}`;
};
