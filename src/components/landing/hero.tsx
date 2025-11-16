'use client';

import Link from 'next/link';

import { useIsMobile } from '@/hooks';
import { cn } from '@/lib';
import { buttonVariants } from '@/ui';
import { useEffect, useRef } from 'react';
import { Icons } from '../ui/icons';

export function HeroSection() {
  const isMobile = useIsMobile();
  const noise = useRef<SVGFETurbulenceElement>(null);

  useEffect(() => {
    function animateNoise(time?: number) {
      if (noise.current) {
        noise.current.setAttribute('seed', (Number(time) * 0.01).toString());
        requestAnimationFrame(animateNoise);
      }
    }

    animateNoise();
  }, []);

  return (
    <section className="flex flex-col items-center justify-center gap-10 px-4 py-12 md:container md:mx-auto md:grid md:max-w-280 md:grid-cols-1 md:gap-30 md:px-0 md:pt-0 md:pb-32 lg:grid-cols-[1fr_calc(var(--spacing)*89.25)]">
      <span className="flex items-center justify-start gap-2 md:hidden">
        <Icons.logo />
        <Icons.typedLogo />
      </span>
      <div className="corner-only relative w-full items-center justify-center overflow-clip rounded-base border-2 border-green-500/70 bg-surface text-gray-400 md:w-160 md:justify-self-center lg:justify-self-auto">
        <Icons.gridPattern className="absolute -top-10 -right-10 -bottom-10 -left-10 -z-10 object-cover md:top-0 md:left-0 md:size-full" />

        <div className="flex size-full flex-col gap-10 px-8 py-19.5 md:px-25 md:py-20">
          <svg className="h-30">
            <filter id="f">
              <feGaussianBlur stdDeviation="10 10" result="glow" fillOpacity="0.5" />
              <feMerge>
                <feMergeNode in="glow" />
                <feMergeNode in="glow" />
                <feMergeNode in="glow" />
              </feMerge>
              {/* <feTurbulence ref={noise} type="fractalNoise" baseFrequency="0.75" seed="100" /> */}
              <feTurbulence
                ref={noise}
                type="fractalNoise"
                baseFrequency="0.85"
                numOctaves="100000"
                result="turbulence"
              />
              <feDisplacementMap
                in2="turbulence"
                in="SourceGraphic"
                scale="200"
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>

            <clipPath id="textClip">
              <text
                y="75%"
                x="50%"
                textAnchor="middle"
                className="fill-[#96fad1] font-orbitron text-[3rem] font-bold md:text-[5.625rem]"
              >
                Privacy
                <tspan
                  dy={isMobile ? '-1.5rem' : '-3rem'}
                  textAnchor="middle"
                  className="fill-green-500 font-orbitron text-xl md:pt-4 md:text-4xl"
                  fillOpacity={0.4}
                >
                  2
                </tspan>
              </text>
            </clipPath>

            <g id="background">
              <text
                y="75%"
                x="50%"
                textAnchor="middle"
                className="fill-[#96fad1] font-orbitron text-[3rem] font-bold md:text-[5.625rem]"
                fillOpacity={0.4}
              >
                Privacy
                <tspan
                  dy={isMobile ? '-1.5rem' : '-3rem'}
                  textAnchor="middle"
                  className="fill-green-500 font-orbitron text-xl md:pt-4 md:text-4xl"
                  fillOpacity={0.4}
                >
                  2
                </tspan>
              </text>
            </g>

            <g id="background" clipPath="url(#textClip)" filter="url(#f)">
              <text
                y="75%"
                x="50%"
                textAnchor="middle"
                className="fill-[#96fad1] font-orbitron text-[3rem] font-bold md:text-[5.625rem]"
              >
                Privacy
                <tspan
                  dy={isMobile ? '-1.5rem' : '-3rem'}
                  textAnchor="middle"
                  className="fill-green-500 font-orbitron text-xl md:pt-4 md:text-4xl"
                  fillOpacity={0.4}
                >
                  2
                </tspan>
              </text>
            </g>
          </svg>

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
          <Icons.logo />
          <Icons.typedLogo />
        </span>

        <span className="flex flex-col items-start justify-start gap-4">
          <h3 className="satoshi-h3 text-white">
            Transform irreversible ETH burns into an economically meaningful asset!
          </h3>
          <span className="flex items-center justify-start gap-2 text-orange-400">
            <Icons.home />
            <p className="satoshi-body3">Powered by EIP-7503</p>
          </span>
        </span>

        <div className="grid w-full grid-cols-2 gap-4 md:flex md:items-center md:justify-start">
          <Link className={buttonVariants({ className: 'w-full md:w-max' })} href="/app/mine">
            Get WORM
          </Link>

          <Link
            className={buttonVariants({
              variant: 'primary-outline',
              className: 'w-full md:w-max [&_path]:fill-green-400!',
            })}
            href="https://x.com/EIP7503"
          >
            Follow on <Icons.x />
          </Link>
        </div>
      </div>
    </section>
  );
}
