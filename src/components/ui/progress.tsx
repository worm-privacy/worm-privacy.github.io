'use client';

import * as ProgressPrimitive from '@radix-ui/react-progress';
import * as React from 'react';

import { cn } from '@/lib/utils/index';

function Progress({
  className,
  value,
  label,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root> & {
  label?: string;
}) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn('relative h-6 w-full overflow-hidden rounded-full bg-green-900', className)}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className="h-full w-full flex-1 rounded-full bg-green-500 transition-all"
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
      {label ? (
        <span className="satoshi-caption-1 absolute top-1/2 right-4 -translate-y-1/2 transform text-white">
          {label}
        </span>
      ) : null}
    </ProgressPrimitive.Root>
  );
}

export { Progress };
