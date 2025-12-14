import { Dispatch, SetStateAction } from 'react';

const InputComponent = (props: InputComponentProps) => {
  let inputType = props.inputType ?? 'text';

  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-white">{props.label}</label>
      <div className="flex items-center rounded-lg bg-[rgba(var(--neutral-low-rgb),0.24)] px-3 py-2.5">
        <input
          type={inputType}
          value={props.value}
          onChange={(e) => props.setValue(e.target.value)}
          className="flex-1 bg-transparent text-white placeholder-[#94A3B8] outline-none"
          placeholder={props.hint}
        />
        <span className={`ml-2 ${inputKindColor(props.inputKind)}`}>{props.inputKind ?? ''}</span>
      </div>
    </div>
  );
};

export default InputComponent;
export type InputComponentProps = {
  label: string;
  hint: string;
  value: string;
  inputType?: 'text' | 'number';
  inputKind?: InputKind;
  setValue: Dispatch<SetStateAction<string>>;
};
type InputKind = 'ETH' | 'BETH' | 'Epoch';

const inputKindColor = (inputKind: InputKind | undefined) => {
  switch (inputKind) {
    case 'ETH':
      return 'text-[#6E7AF0]';
    case 'BETH':
      return 'text-[#FF47C0]';
    case 'Epoch':
      return 'text-[#94A3B8]';
    default:
      return 'text-[#94A3B8]';
  }
};
