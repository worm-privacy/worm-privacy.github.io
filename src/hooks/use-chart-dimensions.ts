'use client';

import { type RefObject, useEffect, useMemo, useState } from 'react';
import type { RectReadOnly } from 'react-use-measure';
import ResizeObserver from 'resize-observer-polyfill';

import { combineChartDimensions } from '@/lib';

export const useDimensions = <T extends SVGElement | HTMLElement | null>(
  ref: RefObject<T>,
  passedSettings: Partial<RectReadOnly> = {
    width: 0,
    height: 0,
  }
): RectReadOnly => {
  const dimensions = useMemo(() => {
    if (typeof ResizeObserver === 'undefined') return null;
    return combineChartDimensions(passedSettings);
  }, [passedSettings]);

  const [size, setSize] = useState({ width: 0, height: 0 });

  // const debouncedSetSize = useDebounceCallback(setSize, 2000);
  useEffect(() => {
    let resizeObserver: ResizeObserver;

    if (ref.current) {
      resizeObserver = new ResizeObserver((entries) => {
        if (!Array.isArray(entries)) return;
        if (!entries.length) return;

        const entry = entries[0];
        if (entry && size.width !== entry.contentRect.width)
          setSize((prev) => ({ ...prev, width: entry.contentRect.width }));
        if (entry && size.height !== entry?.contentRect.height)
          setSize((prev) => ({ ...prev, height: entry.contentRect.height }));
      });

      resizeObserver.observe(ref.current);
    }

    return () => resizeObserver?.disconnect();
  });

  const newSettings = combineChartDimensions({
    ...dimensions,
    width: dimensions?.width || size.width,
    height: dimensions?.height || size.height,
  });

  return newSettings;
};
