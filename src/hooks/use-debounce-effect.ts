import { DependencyList, useEffect, useRef } from 'react';

export function useDebounceEffect(callback: () => void, delay: number, dependencies: DependencyList) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(callback, delay);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [...dependencies, delay, callback]);
}
