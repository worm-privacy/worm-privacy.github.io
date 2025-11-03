'use client';

import { useEffect, useState } from 'react';
import { useThrottleCallback } from './use-throttle-callback';

export function useResizeObserver(element?: HTMLElement) {
  const [isClient, setIsClient] = useState(false);
  const [currentWidth, setCurrentWidth] = useState<number>(1920);
  const throttleCallback = useThrottleCallback<{ width: number }, unknown>((args) => setCurrentWidth(args!.width), []);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    setCurrentWidth(document.getElementsByTagName('body')[0]?.clientWidth ?? 0);

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.borderBoxSize[0]?.inlineSize;

        throttleCallback({
          width: width || 0,
        });
      }
    });

    if (!element) {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      element = document.getElementsByTagName('body')[0]!;
    }

    resizeObserver.observe(element);

    return () => {
      resizeObserver.disconnect();
    };
  }, [isClient]);

  return {
    currentWidth,
  };
}
