'use client';

import Link from 'next/link';
import Svg from 'react-inlinesvg';

import { useIsMobile } from '@/hooks';
import { cn } from '@/lib';
import { buttonVariants } from '@/ui';

export function HeroSection() {
  const isMobile = useIsMobile();

  return (
    <section className="flex flex-col items-center justify-center gap-10 px-4 py-12 md:container md:mx-auto md:grid md:max-w-280 md:grid-cols-1 md:gap-30 md:px-0 md:pt-0 md:pb-32 lg:grid-cols-[1fr_calc(var(--spacing)*89.25)]">
      <span className="flex items-center justify-start gap-2 md:hidden">
        <Svg src="/assets/icons/logo.svg" />
        <Svg src="/assets/icons/typed-logo.svg" />
      </span>
      <div className="corner-only relative w-full items-center justify-center overflow-clip rounded-base border-2 border-green-500/70 bg-surface text-gray-400 md:w-160 md:justify-self-center lg:justify-self-auto">
        <Svg
          src="/assets/icons/grid-patterns.svg"
          className="absolute -top-10 -right-10 -bottom-10 -left-10 -z-10 object-cover md:top-0 md:left-0 md:size-full"
        />
        <div className="flex size-full flex-col gap-10 px-8 py-19.5 md:px-25 md:py-20">
          <h1
            className={cn('orbitron-h1 noise flex w-full items-center-safe justify-center', {
              'orbitron-h2': isMobile,
            })}
            style={{
              textShadow:
                '0 0 0px rgba(150,250,209,0.5), 0 0 5px rgba(150,250,209,0.5), 0 0 10px rgba(150,250,209,0.5), 0 0 20px rgba(150,250,209,0.5)',
            }}
          >
            <span
              className={cn('orbitron-h1 noise leading-tight! md:text-[5.5rem]!', {
                'orbitron-h2 noise text-5xl! leading-snug!': isMobile,
              })}
            >
              Privacy
            </span>
            <sup className="noise pb-2 text-xl md:pt-4 md:text-4xl!">2</sup>
          </h1>

          <h3
            className={cn('satoshi-h1 text-center text-white', {
              'satoshi-h3': isMobile,
            })}
          >
            Hidden in the Ashes of ETH
          </h3>
        </div>
      </div>

      <div className="flex w-full flex-col items-start justify-start gap-10 self-center md:w-160 md:justify-self-center lg:max-w-full lg:justify-self-auto ">
        <span className="hidden items-center justify-start gap-2 md:flex">
          <Svg src="/assets/icons/logo.svg" />
          <Svg src="/assets/icons/typed-logo.svg" />
        </span>

        <span className="flex flex-col items-start justify-start gap-4">
          <h3 className="satoshi-h3 text-white">
            Transform irreversible ETH burns into an economically meaningful asset!
          </h3>
          <span className="flex items-center justify-start gap-2 text-orange-400">
            <Svg src="/assets/icons/home.svg" />
            <p className="satoshi-body3">Powered by EIP-7503</p>
          </span>
        </span>

        <div className="flex w-full items-center justify-center  gap-4 md:justify-start">
          <Link className={buttonVariants({ className: 'w-1/2 md:w-max' })} href="/app/mine">
            Get WORM
          </Link>

          <Link
            className={buttonVariants({
              variant: 'primary-outline',
              className: 'w-1/2 md:w-max [&_path]:fill-green-400!',
            })}
            href="https://x.com/EIP7503"
          >
            Follow on <Svg src="/assets/icons/x.svg" />
          </Link>
        </div>
      </div>
    </section>
  );
}
