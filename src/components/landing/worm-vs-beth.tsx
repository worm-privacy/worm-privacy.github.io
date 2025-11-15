'use client';

import Svg from 'react-inlinesvg';

import { useIsMobile } from '@/hooks';
import { cn } from '@/lib';

export function WormVSBethSection() {
  const isMobile = useIsMobile();

  return (
    <section className="relative mx-auto flex w-full flex-col items-start gap-8 px-4 py-12 md:items-center md:px-0 md:pt-3.5 md:pb-32 xl:max-w-280.5">
      <h1
        className={cn('orbitron-h2 text-green-400 uppercase md:absolute md:top-0 md:left-1/2 md:-translate-x-1/2', {
          'orbitron-h3': isMobile,
        })}
      >
        WORM VS BETH
      </h1>

      <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 md:gap-0">
        <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-start md:gap-7">
          <div className="relative md:h-113.75 md:w-48 md:rounded-xl md:border-3 md:border-green-500/36 lg:w-58">
            <h1
              className={cn(
                'orbitron-h1 text-green-500 uppercase',
                'md:absolute md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:-rotate-90 md:transform',
                {
                  'orbitron-h4': isMobile,
                }
              )}
            >
              worm
            </h1>
          </div>
          <div className="flex flex-1 flex-col gap-4 text-white md:gap-6">
            <h3 className="satoshi-h4">Scarce asset minted from BETH</h3>
            <ul
              className={cn(
                'satoshi-body1 flex flex-col items-start gap-3 md:gap-4 [&>li]:relative',
                '[&>li]:before:absolute [&>li]:before:top-1/2 [&>li]:before:-left-10.5 [&>li]:before:size-6 [&>li]:before:-translate-y-1/2 [&>li]:before:rounded-full [&>li]:before:bg-green-900 [&>li]:before:content-[""]',
                '[&>li]:after:absolute [&>li]:after:top-1/2 [&>li]:after:-left-9 [&>li]:after:size-3 [&>li]:after:-translate-y-1/2 [&>li]:after:rounded-full [&>li]:after:bg-green-300 [&>li]:after:content-[""]',
                {
                  '[&>li]:before:hidden [&>li]:after:hidden': isMobile,
                }
              )}
            >
              <li>World's first PPoB cryptocurrency</li>
              <li>Private bridge to privacy protocols</li>
              <li>Collect BETH minting fees</li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col-reverse items-end gap-4 md:flex-row md:items-center md:gap-7">
          <div className="flex flex-1 flex-col gap-4 text-white md:items-end md:gap-6">
            <h3 className={cn('satoshi-h4')}>ETH burn receipt</h3>
            <ul
              className={cn(
                'satoshi-body1 flex flex-col items-end gap-3 md:gap-4 [&>li]:relative',
                '[&>li]:before:absolute [&>li]:before:top-1/2 [&>li]:before:-right-10.5 [&>li]:before:z-10 [&>li]:before:size-6 [&>li]:before:-translate-y-1/2 [&>li]:before:rounded-full [&>li]:before:bg-blue-900 [&>li]:before:content-[""]',
                '[&>li]:after:absolute [&>li]:after:top-1/2 [&>li]:after:-right-9 [&>li]:after:z-10 [&>li]:after:size-3 [&>li]:after:-translate-y-1/2 [&>li]:after:rounded-full [&>li]:after:bg-blue-300 [&>li]:after:content-[""]',
                {
                  '[&>li]:before:hidden [&>li]:after:hidden': isMobile,
                }
              )}
            >
              <li>Anonymized burn receipts</li>
              <li>WORM minting</li>
              <li>ZK-payments</li>
            </ul>
          </div>

          <div className="relative md:h-113.75 md:w-48 md:rounded-xl md:border-3 md:border-blue-500/36 lg:w-58">
            <h1
              className={cn(
                'orbitron-h1 text-blue-500 uppercase',
                'md:absolute md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:-rotate-90 md:transform',
                {
                  'orbitron-h4': isMobile,
                }
              )}
            >
              beth
            </h1>
          </div>
        </div>
      </div>

      <div className="mt-24 flex size-full h-85.75 items-center justify-center rounded-lg bg-surface1 px-4 py-6 md:-mt-28 md:h-67.25 md:w-137 md:px-8 md:py-6">
        <p className="orbitron-h4 relative flex items-center gap-3 text-white">
          <span className="absolute -top-full">
            <Svg
              src="/assets/icons/arrow.svg"
              className="absolute -top-6 left-18 -rotate-30 md:left-14 md:-rotate-60"
            />
            <span className="satoshi-body3 absolute -top-16 -left-8 w-29 text-gray-400 md:-top-16 md:-left-14">
              User's share of WORM in <b className="text-white">E</b>poch i
            </span>
          </span>

          <span className="absolute -top-full right-0">
            <Svg src="/assets/icons/arrow.svg" className="absolute -top-6 right-0 -rotate-30 md:-right-6 md:rotate-0" />
            <span className="satoshi-body3 absolute -top-16 -right-12 w-32 text-gray-400 md:-top-16 md:-right-20">
              <b className="text-white">T</b>otal BETH put by all users on epoch i
            </span>
          </span>

          <span className="absolute right-0 -bottom-full">
            <Svg
              src="/assets/icons/arrow.svg"
              className="absolute right-15 -bottom-6 rotate-150 md:right-10 md:rotate-120"
            />
            <span className="satoshi-body3 absolute -right-14 -bottom-18 w-31 text-gray-400 md:-right-20 md:-bottom-16">
              BETH consumed by <b className="text-white">U</b>ser for epoch i
            </span>
          </span>

          <span className="absolute -bottom-full">
            <Svg
              src="/assets/icons/arrow.svg"
              className="absolute -bottom-6 left-2 rotate-150 md:-left-4 md:rotate-180"
            />
            <span className="satoshi-body3 absolute -bottom-22 -left-12 w-29 text-gray-400 md:-bottom-20 md:-left-32">
              Total <b className="text-white">W</b>ORM that can be generated at epoch i
            </span>
          </span>
          <span className="text-green-400">
            W<sub>i</sub>
          </span>
          <span>=</span>
          <span>
            E<sub>i</sub>
          </span>
          <span>x</span>
          <span>
            U<sub>i</sub>
          </span>
          <span>/</span>
          <span>
            T<sub>i</sub>
          </span>
        </p>
      </div>
    </section>
  );
}
