import { InputValidator } from '@/lib/core/utils/validator';
import { Dispatch, SetStateAction, useState } from 'react';

export function useInput(initialValue: string, validator: InputValidator): UserInputState {
  const [value, setValue] = useState<string>(initialValue);
  const [error, setError] = useState<string | undefined>(undefined);

  const update = (newValue: string) => {
    setValue(newValue);
    setError(undefined);
  };

  const validate = (): boolean => {
    let validate = validator(value);
    if (validate) {
      setError(validate);
      return false;
    } else {
      return true;
    }
  };

  return { value: value, update: update, error: error, setError: setError, validate: validate };
}

export type UserInputState = {
  value: string;
  update: (newValue: string) => void;

  error: string | undefined;
  setError: Dispatch<SetStateAction<string | undefined>>;

  // true means it's valid
  validate: () => boolean;
};
