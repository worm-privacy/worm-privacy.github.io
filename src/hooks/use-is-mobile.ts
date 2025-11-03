'use client';

import { useMemo } from 'react';

import { useResizeObserver } from './use-resize-observer';

export function useIsMobile() {
  const { currentWidth } = useResizeObserver();
  const isMobile = useMemo(() => currentWidth <= 768, [currentWidth]);

  return isMobile;
}
