'use client';

import { AnimatePresence } from 'motion/react';
import { ComponentProps, createContext, useContext, useState } from 'react';

import { useIsMobile } from '@/hooks';
import {
  Dialog as DialogPrimitive,
  DialogClose as DialogPrimitiveClose,
  DialogContent as DialogPrimitiveContent,
  DialogDescription as DialogPrimitiveDescription,
  DialogFooter as DialogPrimitiveFooter,
  DialogHeader as DialogPrimitiveHeader,
  DialogTitle as DialogPrimitiveTitle,
  DialogTrigger as DialogPrimitiveTrigger,
} from './dialog';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from './drawer';

const DialogContext = createContext<{
  isMobile: boolean;
  open: boolean;
}>({
  isMobile: true,
  open: false,
});

const useDialogContext = () => {
  const context = useContext(DialogContext);

  if (!context) {
    throw new Error('Dialog components cannot be rendered outside the Dialog Context');
  }
  return context;
};

function Dialog(props: ComponentProps<typeof DialogPrimitive | typeof Drawer>) {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);
  const Dialog = isMobile ? Drawer : DialogPrimitive;

  return (
    <AnimatePresence>
      <DialogContext.Provider value={{ isMobile, open }}>
        <Dialog open={open} onOpenChange={setOpen} {...props} {...(!isMobile && { autoFocus: true })} />
      </DialogContext.Provider>
    </AnimatePresence>
  );
}

function DialogTrigger(props: ComponentProps<typeof DialogPrimitiveTrigger | typeof DrawerTrigger>) {
  const { isMobile } = useDialogContext();
  const DialogTrigger = isMobile ? DrawerTrigger : DialogPrimitiveTrigger;

  return <DialogTrigger {...props} />;
}

function DialogClose(props: ComponentProps<typeof DialogPrimitiveClose | typeof DrawerClose>) {
  const { isMobile } = useDialogContext();
  const DialogClose = isMobile ? DrawerClose : DialogPrimitiveClose;

  return <DialogClose {...props} />;
}

function DialogContent(props: ComponentProps<typeof DialogPrimitiveContent | typeof DrawerContent>) {
  const { isMobile } = useDialogContext();
  const DialogContent = isMobile ? DrawerContent : DialogPrimitiveContent;

  // @ts-expect-error need to be fixed @arman94
  return <DialogContent {...props} />;
}

function DialogDescription(props: ComponentProps<typeof DialogPrimitiveDescription | typeof DrawerDescription>) {
  const { isMobile } = useDialogContext();
  const DialogDescription = isMobile ? DrawerDescription : DialogPrimitiveDescription;

  return <DialogDescription {...props} />;
}

function DialogHeader(props: ComponentProps<typeof DialogPrimitiveHeader | typeof DrawerHeader>) {
  const { isMobile } = useDialogContext();
  const DialogHeader = isMobile ? DrawerHeader : DialogPrimitiveHeader;

  return <DialogHeader {...props} />;
}

function DialogTitle(props: ComponentProps<typeof DialogPrimitiveTitle | typeof DrawerTitle>) {
  const { isMobile } = useDialogContext();
  const DialogTitle = isMobile ? DrawerTitle : DialogPrimitiveTitle;

  return <DialogTitle {...props} />;
}

function DialogFooter(props: ComponentProps<typeof DialogPrimitiveFooter | typeof DrawerFooter>) {
  const { isMobile } = useDialogContext();
  const DialogFooter = isMobile ? DrawerFooter : DialogPrimitiveFooter;

  return <DialogFooter {...props} />;
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
};
