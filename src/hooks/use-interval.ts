import { useEffect, useRef } from 'react';

export function useInterval(
  callback: () => void,
  delay: number
): {
  start: () => void;
  stop: () => void;
} {
  const savedCallback = useRef<() => void>(callback);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Update callback if it changes (avoids stale closures)
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  const start = () => {
    if (intervalRef.current !== null) return; // already running

    intervalRef.current = setInterval(() => {
      savedCallback.current();
    }, delay);
  };

  const stop = () => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  return { start, stop };
}
