import { Icons } from '@/components/ui/icons';
import { UserInputState } from '@/hooks/use-input';
import { TokenSelectionState } from '@/hooks/use-token-selection';
import { useState } from 'react';

export const AmountTokenSelector = (props: InputComponentProps) => {
  const receiveToken = props.tokenSelectionState.value;

  // TODO estimate dollar on input change (with debounce)
  const [dollarValue, setDollarValue] = useState(0n);

  return (
    <div className="flex h-25 flex-row items-center rounded-lg bg-[rgba(var(--neutral-low-rgb),0.12)] px-3 hover:bg-[rgba(var(--neutral-low-rgb),0.24)]">
      <div className="flex flex-col gap-1 pl-3">
        <div className="text-[14px] font-medium text-white">{props.label}</div>
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
      <div
        className={
          'flex flex-row items-center gap-3 rounded-lg px-4 py-2 ' +
          (receiveToken !== null
            ? 'bg-[rgba(var(--neutral-low-rgb),0.24)] hover:bg-[rgba(var(--neutral-low-rgb),0.36)]'
            : 'bg-[rgba(var(--brand-rgb),0.12)] hover:bg-[rgba(var(--brand-rgb),0.24)]')
        }
      >
        <div className={'font-bold ' + (receiveToken !== null ? 'text-white' : 'text-brand')}>
          {receiveToken == null ? 'Select receive token' : receiveToken.symbol}
        </div>
        <Icons.halfArrow className="rotate-90" fill={receiveToken != null ? 'white' : 'rgba(var(--brand-rgb),1)'} />
      </div>
    </div>
  );
};

export type InputComponentProps = {
  label: string;
  amountState: UserInputState;
  tokenSelectionState: TokenSelectionState;
  disabled?: boolean;
};
