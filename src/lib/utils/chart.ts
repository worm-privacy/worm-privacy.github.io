import type { RectReadOnly } from 'react-use-measure';

const defaultValue = { top: 0, right: 0, bottom: 0, left: 0, width: 0, height: 0, x: 0, y: 0 };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const callAccessor = (accessor: (...args: any) => any, d: any, i: any) =>
  typeof accessor === 'function' ? accessor(d, i) : accessor;

export const combineChartDimensions = (dimensions: Partial<RectReadOnly>): RectReadOnly => {
  const parsedDimensions: RectReadOnly = {
    ...defaultValue,
    ...dimensions,
  };

  return {
    ...parsedDimensions,
    height: Math.max(parsedDimensions.height - parsedDimensions.top - parsedDimensions.bottom, 0),
    width: Math.max(parsedDimensions.width - parsedDimensions.left - parsedDimensions.right, 0),
  };
};
