'use client';

import {
  AccordionContent as AccordionContentPrimitive,
  AccordionHeader as AccordionHeaderPrimitive,
  AccordionItem as AccordionItemPrimitive,
  Accordion as AccordionPrimitive,
  AccordionTrigger as AccordionTriggerPrimitive,
  type AccordionContentProps as AccordionContentPrimitiveProps,
  type AccordionItemProps as AccordionItemPrimitiveProps,
  type AccordionProps as AccordionPrimitiveProps,
  type AccordionTriggerProps as AccordionTriggerPrimitiveProps,
} from '@/components/ui/accordion/accordion';
import { useIsMobile } from '@/hooks';
import { cn } from '@/lib/utils/index';

type AccordionProps = AccordionPrimitiveProps;

function Accordion({ className, ...props }: AccordionProps) {
  return <AccordionPrimitive className={cn('flex flex-col gap-6', className)} {...props} />;
}

type AccordionItemProps = AccordionItemPrimitiveProps;

function AccordionItem({ className, ...props }: AccordionItemProps) {
  return (
    <AccordionItemPrimitive
      className={cn('flex flex-col gap-4 transition-all ease-in-out data-[state=closed]:gap-0', className)}
      {...props}
    />
  );
}

type AccordionTriggerProps = AccordionTriggerPrimitiveProps & {
  status: 'active' | 'passed' | 'not-yet';
};

function AccordionTrigger({ className, children, status, ...props }: AccordionTriggerProps) {
  return (
    <AccordionHeaderPrimitive className="flex">
      <AccordionTriggerPrimitive
        className={cn(
          'grid w-full cursor-pointer grid-cols-[1.25rem_1fr] gap-6 transition-all outline-none',
          className
        )}
        {...props}
      >
        {children}
      </AccordionTriggerPrimitive>
    </AccordionHeaderPrimitive>
  );
}

type AccordionContentProps = AccordionContentPrimitiveProps & {
  status: 'active' | 'passed' | 'not-yet';
};

function AccordionContent({ className, children, status, ...props }: AccordionContentProps) {
  const isMobile = useIsMobile();

  return (
    <AccordionContentPrimitive
      className={cn(
        'satoshi-body1 pl-11 text-gray-400',
        {
          'satoshi-body2': isMobile,
        },
        className
      )}
      {...props}
    >
      {children}
    </AccordionContentPrimitive>
  );
}

export {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  type AccordionContentProps,
  type AccordionItemProps,
  type AccordionProps,
  type AccordionTriggerProps,
};
