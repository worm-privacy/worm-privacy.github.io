'use client';

import { HTMLMotionProps, motion, useInView } from 'motion/react';
import { MouseEventHandler, useRef } from 'react';
import Svg from 'react-inlinesvg';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/ui';
import { ROADMAP } from './constant';
import { Roadmap } from './type';

import { useIsMobile } from '@/hooks';
import { cn } from '@/lib';

type AnimatedItemProps = HTMLMotionProps<'li'> & {
  delay?: number;
  index: number;
  onMouseEnter?: MouseEventHandler<HTMLLIElement>;
  onClick?: MouseEventHandler<HTMLLIElement>;
};

function AnimatedItem({ children, delay = 0, index, onMouseEnter, onClick, ...props }: AnimatedItemProps) {
  const ref = useRef<HTMLLIElement>(null);
  const inView = useInView(ref, { amount: 0.5, once: false });

  return (
    <motion.li
      ref={ref}
      data-index={index}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
      initial={{ scale: 0.7, opacity: 0 }}
      animate={inView ? { scale: 1, opacity: 1 } : { scale: 0.7, opacity: 0 }}
      transition={{ duration: 0.2, delay }}
      {...props}
    >
      {children}
    </motion.li>
  );
}

function RoadmapSection() {
  const isMobile = useIsMobile();

  return (
    <section className="container mx-auto flex max-w-185 flex-col gap-6 px-4 py-12 md:px-0 md:pb-32">
      <h1
        className={cn('orbitron-h2 text-green-400', {
          'orbitron-h3': isMobile,
        })}
      >
        Roadmap
      </h1>

      <Accordion type="single" collapsible defaultValue={ROADMAP[2].title}>
        {ROADMAP.map((step) => (
          <RoadmapStep key={step.title} {...step} />
        ))}
      </Accordion>
    </section>
  );
}

function RoadmapStep({ title, status, deadline, description, order }: Roadmap) {
  return (
    <AnimatedItem index={order}>
      <AccordionItem
        value={title}
        className={cn('grid w-full gap-3 rounded-lg border border-green-400/12 bg-surface1 p-8 md:gap-4', {
          'grid-rows-1': status !== 'active',
        })}
      >
        <AccordionTrigger status={status}>
          {status === 'active' ? (
            <Svg src="/assets/icons/check.svg" className="self-center" />
          ) : status === 'passed' ? (
            <Svg src="/assets/icons/checks.svg" className="self-center" />
          ) : (
            <Svg src="/assets/icons/clock-countdown.svg" className="self-center" />
          )}
          <span className="flex w-full flex-col-reverse items-start justify-start gap-1 md:flex-row md:items-center md:justify-between md:gap-6">
            <h4
              className={cn('text-green-400', {
                'text-green-400/36': status === 'passed',
              })}
            >
              {title}
            </h4>
            <span className="text-orange-400">{deadline}</span>
          </span>
        </AccordionTrigger>
        <AccordionContent keepRendered status={status}>
          {description}
        </AccordionContent>
      </AccordionItem>
    </AnimatedItem>
  );
}

export { RoadmapSection };
