import { ListedToken } from '@/lib/core/tokens-config';
import { useState } from 'react';

export function useTokenSelection(initialValue: ListedToken | null): TokenSelectionState {
  const [value, setValue] = useState<ListedToken | null>(initialValue);

  const onSelect = (newValue: ListedToken | null) => {
    setValue(newValue);
  };
  return { value: value, onSelect };
}

export type TokenSelectionState = {
  value: ListedToken | null;
  onSelect: (newValue: ListedToken | null) => void;
};
