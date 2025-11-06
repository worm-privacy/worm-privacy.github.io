'use client';

import { cn } from '@/lib';
import { AnimatePresence, HTMLMotionProps, motion } from 'motion/react';
import { ReactNode, useState } from 'react';

import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/effect-creative';
import 'swiper/css/pagination';

type ExpandableCardProps = HTMLMotionProps<'div'> & {
  contents: {
    order: number;
    title: string;
    description: string;
    color: string;
    action?: ReactNode;
  }[];
};

export function ExpandableCard({ className, contents, ...props }: ExpandableCardProps) {
  const [activeContent, setActiveContent] = useState<number>(1);

  return (
    <motion.div
      initial={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{
        duration: 0.3,
        delay: 0.5,
      }}
      className={cn('relative w-full max-w-6xl bg-surface-1 px-5', className)}
      {...props}
    >
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="w-full">
        <div className="flex w-full items-center justify-center gap-6">
          {contents.map((content) => (
            <motion.div
              key={content.title}
              className="relative cursor-pointer overflow-hidden rounded-xl"
              initial={{ width: '8.5rem', height: '37.25rem' }}
              animate={{
                width: activeContent === content.order ? '26.125rem' : '8.5rem',
                height: activeContent === content.order ? '37.25' : '37.25rem',
              }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              onClick={() => setActiveContent(content.order)}
              // onHoverStart={() => setActiveContent(index)}
            >
              <AnimatePresence>
                {activeContent === content.order && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={`absolute h-full w-full `}
                  />
                )}
              </AnimatePresence>
              <AnimatePresence>
                {activeContent === content.order && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={`text-${content.color}-400 absolute flex h-full w-full flex-col justify-between p-6`}
                  >
                    <p className="orbitron-h1 absolute top-6 left-6 w-max">{content.order}</p>
                    <p
                      className="orbitron-h2 absolute bottom-0 left-0 w-max origin-center -rotate-90"
                      style={{
                        transform: 'translate(50%, -150%)',
                      }}
                    >
                      {content.title}
                    </p>
                    <motion.p
                      initial={{ opacity: 0, bottom: -10 }}
                      animate={{ opacity: 1, bottom: 32 }}
                      exit={{ opacity: 0, width: 0, bottom: -10 }}
                      transition={{ delay: 0.2 }}
                      className="satoshi-h3 absolute right-4 bottom-8 left-32 text-gray-400"
                    >
                      {content.description}
                    </motion.p>
                  </motion.div>
                )}
              </AnimatePresence>
              <div className={`text-${content.color}-400 relative size-full rounded-xl border border-green-400/12`}>
                <p className="orbitron-h1 absolute top-6 left-6 w-max">{content.order}</p>
                <p
                  className="orbitron-h2 absolute bottom-0 left-0 w-fit min-w-max origin-center -rotate-90"
                  style={{
                    transform: 'translate(50%, -150%)',
                  }}
                >
                  {content.title}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
