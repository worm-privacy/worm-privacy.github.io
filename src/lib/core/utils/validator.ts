import { UserInputState } from '@/hooks/use-input';
import { parseEther } from 'ethers';

// undefined means OK, returned string is error message
export type InputValidator = (value: string) => string | undefined;

export const validateETHAmount: InputValidator = (value: string): string | undefined => {
  value = value.trim();
  if (value == '') return 'Empty';
  try {
    parseEther(value);
    return undefined; // OK
  } catch (e) {
    return 'Invalid amount';
  }
};

export const validateAddress: InputValidator = (value: string): string | undefined => {
  value = value.trim();
  if (value == '') return 'Empty';
  if (!/^0x[0-9a-fA-F]{40}$/.test(value)) return 'Invalid address';

  return undefined; //OK
};

export const validateNothing: InputValidator = (value: string): string | undefined => {
  return undefined;
};

export const validatePositiveInteger: InputValidator = (value: string): string | undefined => {
  value = value.trim();
  if (value == '') return 'Empty';
  try {
    if (parseInt(value) < 1) throw 'Should be positive';
    return undefined; // OK
  } catch (e) {
    return 'Invalid amount';
  }
};

export const validateAll = (...states: UserInputState[]): boolean => {
  let isValid = true;
  for (let state of states) if (!state.validate()) isValid = false;
  return isValid;
};
