import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils/index';

const buttonVariants = cva(
  'relative inline-flex items-center justify-center gap-1 whitespace-nowrap transition-all disabled:pointer-events-none  [&_svg]:pointer-events-none shrink-0 [&_svg]:shrink-0 outline-none rounded-base',
  {
    variants: {
      variant: {
        primary:
          'text-black bg-green-400 aria-invalid:border-destructive focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20',
        'primary-link': 'text-black bg-green-400',
        'primary-outline': 'text-green-400 border border-green-400/24 bg-surface1',
        outline:
          'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50',
        // secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-gray-400/24 cursor-pointer ',
        link: 'text-white before:pointer-events-none before:absolute before:left-0 before:bottom-2 before:bg-green-500/24 before:h-[0.05em] before:w-full before:content-[""] before:origin-right before:scale-x-0 before:transition-transform before:duration-300 before:ease-[cubic-bezier(0.4,0,0.2,1)] before:origin-center hover:before:scale-x-100 hover:text-gray-300 px-0!',
        icon: '[&>svg]:size-5! before:pointer-events-none before:absolute before:left-0 before:w-full before:bg-white before:content-[""] before:origin-right before:scale-x-0 before:transition-all before:duration-300 before:ease-[cubic-bezier(0.4,0,0.2,1)] before:origin-center md:before:bottom-0 before:z-1 px-2 before:h-0 before:scale-x-100 before:mix-blend-difference hover:before:h-full before:rounded-base',
      },
      size: {
        default: 'px-3 py-2.5 [&>svg]:size-3.5 satoshi-btn3 gap-2',
        lg: 'px-3 py-3.5 [&>svg]:size-4',
        xl: 'p-4 [&>svg]:size-5',
        icon: 'size-12',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : 'button';

  return <Comp data-slot="button" className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}

export { Button, buttonVariants };
