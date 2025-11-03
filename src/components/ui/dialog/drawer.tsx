'use client';

import { ComponentProps } from 'react';
import { Drawer as DrawerPrimitive } from 'vaul';

import { cn } from '@/lib';

function Drawer({ ...props }: ComponentProps<typeof DrawerPrimitive.Root>) {
  return <DrawerPrimitive.Root data-slot="drawer" {...props} />;
}

function DrawerTrigger({ ...props }: ComponentProps<typeof DrawerPrimitive.Trigger>) {
  return <DrawerPrimitive.Trigger data-slot="drawer-trigger" {...props} />;
}

function DrawerPortal({ ...props }: ComponentProps<typeof DrawerPrimitive.Portal>) {
  return <DrawerPrimitive.Portal data-slot="drawer-portal" {...props} />;
}

function DrawerClose({ ...props }: ComponentProps<typeof DrawerPrimitive.Close>) {
  return <DrawerPrimitive.Close data-slot="drawer-close" {...props} />;
}

function DrawerOverlay({ className, ...props }: ComponentProps<typeof DrawerPrimitive.Overlay>) {
  return (
    <DrawerPrimitive.Overlay
      data-slot="drawer-overlay"
      className={cn(
        'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50',

        className
      )}
      {...props}
    />
  );
}

function DrawerContent({
  className,
  children,
  showCloseButton = false,
  ...props
}: ComponentProps<typeof DrawerPrimitive.Content> & {
  showCloseButton?: boolean;
}) {
  return (
    <DrawerPortal data-slot="drawer-portal">
      <DrawerOverlay />
      <DrawerPrimitive.Content
        data-slot="drawer-content"
        className={cn(
          'inset-x-0 bottom-0 h-dvh w-dvw rounded-t-lg border bg-white',
          'group/drawer-content fixed z-50 flex flex-col bg-background',

          className
        )}
        {...props}
      >
        {showCloseButton && (
          <DrawerPrimitive.Close
            data-slot="dialog-close"
            className="absolute top-4 right-4 rounded-xs opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
          >
            X<span className="sr-only">Close</span>
          </DrawerPrimitive.Close>
        )}
        {children}
      </DrawerPrimitive.Content>
    </DrawerPortal>
  );
}

function DrawerHeader({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="drawer-header"
      className={cn(
        'group-data-[vaul-drawer-direction=bottom]/drawer-content:text-center group-data-[vaul-drawer-direction=top]/drawer-content:text-center md:gap-1.5',
        'grid gap-1 p-4 text-center sm:text-left',
        className
      )}
      {...props}
    />
  );
}

function DrawerFooter({ className, ...props }: ComponentProps<'div'>) {
  return <div data-slot="drawer-footer" className={cn('mt-auto flex flex-col gap-2 p-4', className)} {...props} />;
}

function DrawerTitle({ className, ...props }: ComponentProps<typeof DrawerPrimitive.Title>) {
  return (
    <DrawerPrimitive.Title
      data-slot="drawer-title"
      className={cn('text-right text-lg leading-none font-semibold tracking-tight', className)}
      {...props}
    />
  );
}

function DrawerDescription({ className, ...props }: ComponentProps<typeof DrawerPrimitive.Description>) {
  return (
    <DrawerPrimitive.Description
      data-slot="drawer-description"
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  );
}

export {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerPortal,
  DrawerTitle,
  DrawerTrigger,
};
