import { useDebounceEffect } from '@/hooks/use-debounce-effect';
import { UniswapV3Quoter } from '@/lib/core/contracts/uniswap/v3qouter';
import { getListedTokenConfig, USDT } from '@/lib/core/tokens-config';
import { useState } from 'react';
import { formatUnits, parseUnits } from 'viem';
import { useClient } from 'wagmi';
import { InputComponentProps, SelectTokenDialog } from './token-selection-dialog';

export const AmountTokenSelector = (props: InputComponentProps) => {
  const [dollarValue, setDollarValue] = useState('0');
  const client = useClient();

  useDebounceEffect(
    async () => {
      try {
        console.log(
          `estimate type: ${props.typeName}, amount: ${props.amountState.value}, token: ${props.tokenSelectionState.value}`
        );
        if (props.amountState.value === '') throw 'empty input';
        setDollarValue('...');
        const path = props.tokenSelectionState.value!.pathToTether;
        if (path.length === 0) return setDollarValue(props.amountState.value); // tokens is dollar stablecoin
        const estimatedAmount = await UniswapV3Quoter.quoteExactInput(
          client!,
          path,
          parseUnits(props.amountState.value, props.tokenSelectionState.value!.decimals)
        );
        setDollarValue(formatUnits(estimatedAmount, getListedTokenConfig(USDT)!.decimals));
      } catch (e) {
        console.error(e);
        setDollarValue('?');
      }
    },
    1000,
    [props.amountState, props.tokenSelectionState]
  );

  return (
    <div className="flex h-25 flex-row items-center rounded-lg bg-[rgba(var(--neutral-low-rgb),0.12)] px-3 hover:bg-[rgba(var(--neutral-low-rgb),0.24)]">
      <div className="flex flex-col gap-1 pl-3">
        <div className="text-[14px] font-medium text-white">{'You ' + props.typeName}</div>
        <input
          type="number"
          disabled={props.disabled}
          onWheel={(e) => (e.target as any).blur()}
          value={props.amountState.value}
          onChange={(e) => props.amountState.update(e.target.value)}
          className="w-45 flex-1 bg-transparent text-white placeholder-[#94A3B8] outline-none"
          placeholder="0.0"
        />
        <div className="text-[14px] font-medium text-[#94A3B8]">~ {dollarValue}$</div>
      </div>
      <div className="flex-1" />
      <SelectTokenDialog inner={props} />
    </div>
  );
};
