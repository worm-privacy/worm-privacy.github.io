import { UserInputState } from '@/hooks/use-input';
import { Icons } from '../ui/icons';

const InputComponent = (props: InputComponentProps) => {
  let inputType = props.inputType ?? 'text';

  const disabled = props.disabled ?? false;
  return (
    <div className={disabled ? 'opacity-60' : ''}>
      <div className="flex flex-row items-end">
        <label className="mb-2 block text-[14px] font-medium text-white">{props.label}</label>
        {props.optional && <label className="mb-2 ml-1 block text-[12px] text-[#94A3B8]">Optional</label>}
      </div>
      <div className="flex items-center rounded-lg bg-[rgba(var(--neutral-low-rgb),0.24)] px-3 py-2.5">
        <input
          type={inputType}
          disabled={disabled}
          value={props.state.value}
          onChange={(e) => props.state.update(e.target.value)}
          className="flex-1 bg-transparent text-white placeholder-[#94A3B8] outline-none"
          placeholder={props.hint}
        />
        {props.children}
        <span className={`ml-2 ${inputKindColor(props.inputKind)}`}>{props.inputKind ?? ''}</span>
      </div>
      {props.state.error && (
        <div className="mt-1 ml-1 flex flex-row items-center gap-3">
          <Icons.alert />
          <div className="text-[14px] text-(--err) ">{props.state.error}</div>
        </div>
      )}
    </div>
  );
};

export default InputComponent;
export type InputComponentProps = {
  label: string;
  hint: string;
  state: UserInputState;
  inputType?: 'text' | 'number';
  inputKind?: InputKind;
  optional?: boolean;
  disabled?: boolean;
  children?: React.ReactNode;
};
type InputKind = 'ETH' | 'BETH' | 'Epoch' | 'Weeks' | 'WORM';

const inputKindColor = (inputKind: InputKind | undefined) => {
  switch (inputKind) {
    case 'ETH':
      return 'text-[#6E7AF0]';
    case 'BETH':
      return 'text-[#FF47C0]';
    case 'Epoch':
      return 'text-[#94A3B8]';
    case 'WORM':
      return 'text-brand';
    default:
      return 'text-[#94A3B8]';
  }
};
