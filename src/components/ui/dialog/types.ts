'use client';

import * as DialogPrimitive from '@radix-ui/react-dialog';
import { HTMLMotionProps, Transition } from 'motion/react';
import { ComponentProps } from 'react';

type DialogContextType = {
  isOpen: boolean;
};

type DialogProps = ComponentProps<typeof DialogPrimitive.Root>;

type DialogTriggerProps = ComponentProps<typeof DialogPrimitive.Trigger>;

type DialogPortalProps = ComponentProps<typeof DialogPrimitive.Portal>;

type DialogCloseProps = ComponentProps<typeof DialogPrimitive.Close>;

type DialogOverlayProps = ComponentProps<typeof DialogPrimitive.Overlay>;

type DialogContentProps = ComponentProps<typeof DialogPrimitive.Content> &
  HTMLMotionProps<'div'> & {
    from?: FlipDirection;
    transition?: Transition;
    showCloseButton?: boolean;
  };

type FlipDirection = 'top' | 'bottom' | 'left' | 'right';

type DialogHeaderProps = ComponentProps<'div'>;

type DialogFooterProps = ComponentProps<'div'>;

type DialogTitleProps = ComponentProps<typeof DialogPrimitive.Title>;

type DialogDescriptionProps = ComponentProps<typeof DialogPrimitive.Description>;

export {
  type DialogCloseProps,
  type DialogContentProps,
  type DialogContextType,
  type DialogDescriptionProps,
  type DialogFooterProps,
  type DialogHeaderProps,
  type DialogOverlayProps,
  type DialogPortalProps,
  type DialogProps,
  type DialogTitleProps,
  type DialogTriggerProps,
};
