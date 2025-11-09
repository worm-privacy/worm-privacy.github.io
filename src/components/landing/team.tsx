'use client';

import { AnimatePresence, motion } from 'motion/react';
import Link from 'next/link';
import { Fragment, useState } from 'react';
import Svg from 'react-inlinesvg';

import { useIsMobile } from '@/hooks';
import { cn } from '@/lib';
import { BlurFade, Button, Carousel, CarouselContent, CarouselItem, Separator } from '@/ui';

import { TEAM } from './constant';
import { TeamMemberInfo } from './type';

export function TeamSection() {
  const isMobile = useIsMobile();
  const [activeMember, setActiveMember] = useState(1);

  return (
    <section className="container mx-auto flex max-w-185 flex-col gap-6 py-12 md:pb-32">
      <h1
        className={cn('orbitron-h2 px-4 text-green-400 md:px-0', {
          'orbitron-h3': isMobile,
        })}
      >
        Team
      </h1>
      {isMobile ? (
        <Carousel
          opts={{
            dragFree: true,
            loop: true,
          }}
        >
          <CarouselContent>
            {TEAM.map((t) => (
              <MemberCard key={t.id} {...t} />
            ))}
          </CarouselContent>
        </Carousel>
      ) : (
        <div className="grid h-166 grid-cols-[1fr_28.75rem] gap-6">
          <motion.div
            initial={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{
              duration: 0.3,
              delay: 0.5,
            }}
            className="relative flex w-full flex-col items-start justify-start gap-2 rounded-lg bg-surface2"
          >
            {TEAM.map((t) => (
              <motion.div
                key={t.fullName}
                className="flex flex-col items-start justify-start gap-4 px-4 py-3 select-none"
                onMouseEnter={() => setActiveMember(t.id)}
                onClick={() => setActiveMember(t.id)}
                initial={{ width: '100%', height: '5rem' }}
                animate={{
                  width: '100%',
                  height: activeMember === t.id ? '8.5rem' : '5rem',
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

                  {activeMember === t.id ? (
                    <motion.div
                      initial={{ opacity: 0, translateY: '1rem' }}
                      animate={{ opacity: 1, translateY: 0 }}
                      transition={{
                        duration: 0.3,
                        delay: 0.1,
                      }}
                      className="flex items-center justify-start gap-2"
                    >
                      {t.socials.map((s) => (
                        <Button key={s.link} variant="primary-outline" asChild>
                          <Link target="_blank" href={s.link}>
                            <Svg src={s.logo} className="[&_path]:fill-green-400!" />
                            {s.label}
                          </Link>
                        </Button>
                      ))}
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>

          <div className="relative aspect-square size-115 self-center py-6">
            {TEAM.map(({ avatar, fullName, id }, idx) => (
              <BlurFade key={fullName} delay={0.25 + idx * 0.05} inView>
                <span
                  onMouseEnter={() => setActiveMember(id)}
                  className={cn(
                    'absolute',
                    'delay-200 before:absolute before:inset-0 before:top-0 before:left-0 before:size-full before:rounded-full before:bg-black/60 before:content-[""]',
                    {
                      'before:bg-transparent': id === activeMember,
                    }
                  )}
                  style={{
                    width: `calc(var(--spacing) * ${avatar.size})`,
                    height: `calc(var(--spacing) * ${avatar.size})`,
                    top: `calc(var(--spacing) * ${avatar.position?.top})`,
                    left: `calc(var(--spacing) * ${avatar.position?.left})`,
                  }}
                >
                  <img
                    src={avatar.src}
                    alt={fullName}
                    className={cn(
                      'size-full rounded-full object-cover transition-transform duration-300 hover:scale-105',
                      {
                        'scale-105': id === activeMember,
                      }
                    )}
                  />
                </span>
              </BlurFade>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function MemberCard({ fullName, positions, avatar, socials }: TeamMemberInfo) {
  return (
    <CarouselItem className="relative mx-1 flex h-112 max-w-80! flex-col overflow-clip rounded-lg bg-surface2 select-none">
      <span className="relative size-80">
        <img
          className="absolute top-0 left-0 z-0 size-full object-cover"
          src={avatar.src}
          style={{
            background: 'linear-gradient(180deg, rgba(9, 12, 21, 0) 14.36%, #090C15 93.39%)',
          }}
        />
        <span
          className="absolute top-0 left-0 z-0 size-full "
          style={{ background: 'linear-gradient(180deg, rgba(9, 12, 21, 0) 14.36%, #090C15 93.39%)' }}
        />
      </span>
      <div className="flex flex-col gap-4 px-4 pb-4">
        <span className="flex flex-col gap-2">
          <p className="satoshi-h4 text-white">{fullName}</p>
          <span className="flex items-center justify-start gap-1.5">
            {positions.map((p, pi) => (
              <Fragment key={p}>
                <span key={p} className="satoshi-body1 text-gray-400">
                  {p}
                </span>
                {positions.length > 1 && pi !== positions.length - 1 ? (
                  <Separator orientation="vertical" className="h-4! bg-gray-400" />
                ) : (
                  ''
                )}
              </Fragment>
            ))}
          </span>
        </span>

        <div className="flex items-center justify-start gap-2">
          {socials.map((s) => (
            <Button key={s.link} variant="primary-outline" asChild>
              <Link target="_blank" href={s.link}>
                <Svg src={s.logo} className="[&_path]:fill-green-400!" />
                {s.label}
              </Link>
            </Button>
          ))}
        </div>
      </div>
    </CarouselItem>
  );
}
