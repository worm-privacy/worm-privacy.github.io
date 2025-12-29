// hooks/usePolling.ts
import { useCallback, useRef } from 'react';

type PollingCallback = () => Promise<void> | void;

export function usePolling(intervalTime: number) {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const callbackRef = useRef<PollingCallback>(() => {});

  // Update callback on every render (always fresh)
  const setCallback = useCallback((callback: PollingCallback) => {
    callbackRef.current = callback;
  }, []);

  const startPolling = useCallback(() => {
    if (intervalRef.current) return; // already polling

    const tick = () => {
      callbackRef.current();
      intervalRef.current = setTimeout(tick, intervalTime);
    };

    intervalRef.current = setTimeout(tick, intervalTime);
  }, []);

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearTimeout(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Cleanup on unmount
  //   useEffect(() => {
  //     return () => stop();
  //   }, [stop]);

  return { startPolling, stopPolling, setCallback };
}
