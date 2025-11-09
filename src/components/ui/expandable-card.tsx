'use client';

import { useIsMobile } from '@/hooks';
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
  const [activeContent, setActiveContent] = useState<number>(3);
  const isMobile = useIsMobile();

  return (
    <motion.div
      initial={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{
        duration: 0.3,
        delay: 0.5,
      }}
      className={cn('relative w-full px-0 md:max-w-6xl md:px-5', className)}
      {...props}
    >
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="w-full">
        <div className="flex w-full flex-col items-center justify-center gap-2 md:flex-row md:gap-6">
          {contents.map((content) => (
            <motion.div
              key={content.title}
              className="relative cursor-pointer overflow-hidden rounded-none bg-surface1 md:rounded-xl"
              initial={{ width: isMobile ? '100%' : '8.5rem', height: isMobile ? '6.75rem' : '37.25rem' }}
              animate={{
                width: isMobile ? '100%' : activeContent === content.order ? '26.125rem' : '8.5rem',
                height: isMobile ? (activeContent === content.order ? '12.75rem' : '6.75rem') : '37.25rem',
              }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              onClick={() => setActiveContent(content.order)}
              onMouseEnter={() => setActiveContent(content.order)}
            >
              <AnimatePresence>
                {/* {activeContent === content.order && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={`absolute h-full w-full`}
                  />
                )} */}
              </AnimatePresence>
              <AnimatePresence>
                {activeContent === content.order && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={`text-${content.color}-400 absolute flex h-full w-full flex-col justify-between p-6`}
                  >
                    <p
                      className={cn('orbitron-h1 absolute top-8 left-6 w-max', {
                        'orbitron-h2': isMobile,
                      })}
                    >
                      {content.order}
                    </p>
                    <p
                      className={cn(
                        'orbitron-h2 absolute top-10 left-24 w-max origin-center md:top-auto md:bottom-0 md:left-0 md:-rotate-90',
                        {
                          'orbitron-h3': isMobile,
                        }
                      )}
                      style={{
                        transform: isMobile ? 'translate(0, 0)' : 'translate(50%, -150%)',
                      }}
                    >
                      {content.title}
                    </p>
                    <motion.div
                      initial={{ opacity: 0, bottom: -10 }}
                      animate={{ opacity: 1, bottom: 32 }}
                      exit={{ opacity: 0, width: 0, bottom: -10 }}
                      transition={{ delay: 0.2 }}
                      className={cn(
                        'satoshi-h3 absolute bottom-6 left-6 flex flex-col items-start gap-6 text-gray-400 md:right-4 md:bottom-8 md:left-32',
                        {
                          'satoshi-h4': isMobile,
                        }
                      )}
                    >
                      <p>{content.description}</p>
                      {content.action ? content.action : null}
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div
                className={`text-${content.color}-400 relative size-full rounded-xl border-y border-green-400/12 md:border`}
              >
                <p
                  className={cn('orbitron-h1 absolute top-8 left-6 w-max', {
                    'orbitron-h2': isMobile,
                  })}
                >
                  {content.order}
                </p>
                <p
                  className={cn(
                    'orbitron-h2 absolute top-10 left-24 w-max origin-center md:top-auto md:bottom-0 md:left-0 md:-rotate-90',
                    {
                      'orbitron-h3': isMobile,
                    }
                  )}
                  style={{
                    transform: isMobile ? 'translate(0, 0)' : 'translate(50%, -150%)',
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
