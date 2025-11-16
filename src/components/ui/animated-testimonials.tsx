'use client';

import { AnimatePresence, motion } from 'motion/react';
import { Fragment, useEffect, useState } from 'react';

import { buttonVariants, ScrollArea, Separator } from '@/ui';
import Link from 'next/link';
import { TEAM } from '../landing/constant';

export const AnimatedTestimonials = () => {
  const [active, setActive] = useState(TEAM[0].id);

  const isActive = (index: number) => {
    return index === active;
  };

  useEffect(() => {
    const interval = setInterval(() => setActive((prev) => (prev >= TEAM.length ? 1 : prev + 1)), 5000);

    return () => clearInterval(interval);
  }, []);

  const randomRotateY = () => {
    return Math.floor(Math.random() * 21) - 10;
  };
  return (
    <div className="relative grid h-104 w-full grid-cols-[1fr_16.5rem] gap-6">
      <div className="relative aspect-square h-100">
        <AnimatePresence>
          {TEAM.map((tm, index) => (
            <motion.div
              key={tm.id}
              initial={{
                opacity: '0',
                scale: 0.9,
                z: -100,
                rotate: randomRotateY(),
              }}
              animate={{
                opacity: isActive(tm.id) ? 1 : 0.7,
                scale: isActive(tm.id) ? 1 : 0.95,
                z: isActive(tm.id) ? 0 : -100,
                rotate: isActive(tm.id) ? 0 : randomRotateY(),
                zIndex: isActive(tm.id) ? 40 : TEAM.length + 2 - index,
                y: isActive(tm.id) ? [0, -80, 0] : 0,
              }}
              exit={{
                opacity: '0',
                scale: 0.9,
                z: 100,
                rotate: randomRotateY(),
              }}
              transition={{
                duration: 0.4,
                ease: 'easeInOut',
              }}
              className="absolute inset-0 origin-bottom"
            >
              <img
                src={tm.avatar.src}
                alt={tm.fullName}
                width={500}
                height={500}
                draggable={false}
                className="h-full w-full rounded-3xl object-cover object-center"
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <ScrollArea className="flex h-104 flex-col items-start justify-between gap-1">
        <motion.div
          initial={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{
            duration: 0.3,
            delay: 0.5,
          }}
          className="relative flex w-full flex-col items-start justify-start gap-2"
        >
          {TEAM.map((t) => (
            <motion.div
              key={t.fullName}
              className="flex flex-col items-start justify-start gap-4 rounded-lg bg-surface2 px-4 py-3 select-none"
              onMouseEnter={() => setActive(t.id)}
              onClick={() => setActive(t.id)}
              initial={{ width: '100%', height: '5rem' }}
              animate={{
                width: '100%',
                height: active === t.id ? '8.5rem' : '5rem',
              }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <AnimatePresence>
                <span key={t.fullName} className="flex flex-col items-start justify-start gap-2">
                  <h3 className="satoshi-h4 text-white">{t.fullName}</h3>
                  <span className="flex items-center justify-start gap-1.5">
                    {t.positions.map((p, pi) => (
                      <Fragment key={p}>
                        <span key={p} className="satoshi-body1 text-gray-400">
                          {p}
                        </span>
                        {t.positions.length > 1 && pi !== t.positions.length - 1 ? (
                          <Separator orientation="vertical" className="h-4! bg-gray-400" />
                        ) : (
                          ''
                        )}
                      </Fragment>
                    ))}
                  </span>
                </span>

                {active === t.id ? (
                  <motion.div
                    initial={{ opacity: 0, translateY: '1rem' }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{
                      duration: 0.3,
                      delay: 0.1,
                    }}
                    className="flex w-full items-center justify-start gap-2"
                  >
                    {t.socials.map((s) => (
                      <Link
                        key={s.link}
                        target="_blank"
                        href={s.link}
                        className={buttonVariants({ variant: 'primary-outline', className: s.label ? 'flex-1' : '' })}
                      >
                        <s.logo className="[&_path]:fill-green-400!" />
                        {s.label}
                      </Link>
                    ))}
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      </ScrollArea>
    </div>
  );
};
