'use client';

import { useIsMobile } from '@/hooks';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Icons } from '../ui/icons';

export function HeroSection() {
  return (
    <section className="flex w-full max-w-230 flex-col items-center justify-center gap-10 px-4 py-10 md:gap-10 md:px-0 md:pt-0 md:pb-25 lg:grid-cols-[1fr_calc(var(--spacing)*89.25)]">
      <LogoSet />
      <div className="corner-only relative w-full items-center justify-center overflow-clip rounded-base border-2 border-brand/70 bg-surface text-gray-400  md:justify-self-center lg:justify-self-auto">
        <Icons.gridPattern className="absolute size-full scale-170" />
        <Privacy2 />
        <div className="text-center font-satoshi text-[30px] font-bold text-brand">EIP - 7503</div>
        <SlidingText />
      </div>
      <div className="flex flex-col gap-3 md:flex-row">
        <WormholeCard />
        <WormCard />
      </div>
    </section>
  );
}

const LogoSet = () => {
  return (
    <div className="z-50 flex flex-row items-center justify-start gap-2 md:-mb-20">
      <Icons.logo />
      <Icons.typedLogo />
    </div>
  );
};

const Privacy2 = () => {
  const [isSafari, setIsSafari] = useState(false);
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

  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();
    if (ua.indexOf('safari') !== -1 && ua.indexOf('chrome') === -1) {
      setIsSafari(true);
    }
  }, []);

  return (
    <div className="flex size-full flex-col items-center gap-10 px-8 pt-19.5 md:px-25 md:pt-20">
      {isSafari ? (
        <h1
          className="mx-auto flex w-full items-center-safe justify-center text-center font-orbitron text-[3rem] font-bold text-brand sm:text-[4rem] md:text-[5.625rem]"
          style={{
            textShadow:
              '0 0 0px rgba(150,250,209,0.5), 0 0 5px rgba(150,250,209,0.5), 0 0 10px rgba(150,250,209,0.5), 0 0 20px rgba(150,250,209,0.5)',
          }}
        >
          Privacy<sup className="fill-brand font-orbitron text-xl md:text-4xl">2</sup>
        </h1>
      ) : (
        <svg className="h-17 w-full md:h-30">
          <filter id="f">
            <feGaussianBlur stdDeviation="10 10" result="glow" fillOpacity="0.5" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="glow" />
              <feMergeNode in="glow" />
            </feMerge>
            <feTurbulence
              ref={noise}
              type="fractalNoise"
              baseFrequency="0.75"
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
              className="fill-[#96fad1] font-orbitron text-[3rem] font-bold sm:text-[4rem] md:text-[5.625rem]"
            >
              Privacy
              <tspan
                dy={isMobile ? '-2rem' : '-3rem'}
                textAnchor="middle"
                className="fill-brand font-orbitron text-xl md:pt-4 md:text-4xl"
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
              className="fill-[#96fad1] font-orbitron text-[3rem] font-bold sm:text-[4rem] md:text-[5.625rem]"
              fillOpacity={0.4}
            >
              Privacy
              <tspan
                dy={isMobile ? '-2rem' : '-3rem'}
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
              className="fill-[#96fad1] font-orbitron text-[3rem] font-bold sm:text-[4rem] md:text-[5.625rem]"
            >
              Privacy
              <tspan
                dy={isMobile ? '-2rem' : '-3rem'}
                textAnchor="middle"
                className="fill-green-500 font-orbitron text-xl md:pt-4 md:text-4xl"
                fillOpacity={0.4}
              >
                2
              </tspan>
            </text>
          </g>
        </svg>
      )}
    </div>
  );
};
const WormholeCard = () => {
  return (
    <div className="w-full rounded-2xl bg-[#05080f]">
      <div className="flex size-full flex-col gap-8 rounded-2xl border border-slate-500/24 bg-linear-to-r from-[#05080f] to-[rgba(var(--brand-rgb),0.05)] p-8">
        <div className="relative flex  flex-col items-start justify-start gap-8 self-stretch">
          <p className="self-stretch text-left font-orbitron text-2xl font-bold text-white">
            Wormhole <span className="font-satoshi text-[14px] font-normal text-brand">Newest feature</span>
          </p>
          <p className=" self-stretch text-left font-satoshi text-lg text-white">
            <span className="self-stretch text-left text-lg text-white">
              Automate and easy privacy-first swap, Send and receive anonymously
            </span>
            <span className="self-stretch text-left text-lg text-white">. </span>
            <span className="self-stretch text-left text-lg font-bold text-white">Powered by WORM</span>
          </p>
        </div>
        <div className="flex h-10  items-center justify-start gap-4 self-stretch">
          <div className="flex  items-center justify-center rounded-[9px] bg-[#00c871] px-3">
            <div className="relative flex items-center justify-center px-1">
              <Link className="p-3 font-satoshi font-bold" href="/wormhole">
                Try Wormhole
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const WormCard = () => {
  return (
    <div className="flex min-w-[130px] grow flex-col items-start justify-start gap-8 rounded-2xl border border-slate-500/24 bg-[#05080f] p-8">
      <p className=" self-stretch  text-left font-orbitron text-2xl font-bold text-white">WORM Mechanism</p>
      <div className="relative flex  flex-col items-start justify-start gap-1 self-stretch">
        <p className="self-stretch text-left font-satoshi text-lg text-white">
          Transform irreversible ETH burns into an economically meaningful asset.
        </p>
      </div>
      <div className="flex  items-center justify-start gap-4">
        <div className="flex  items-center justify-center rounded-[9px] border border-[#00c871]/24 px-3">
          <div className="relative flex  items-center justify-center px-1">
            <Link href="/tools/mine-worm" className="p-3 text-center text-sm font-medium text-brand">
              Get WORM
            </Link>
          </div>
        </div>
        <Link
          href="https://x.com/EIP7503"
          className="relative flex items-center justify-center rounded-[9px] border border-slate-500/24 p-3"
        >
          <Icons.x />
        </Link>
      </div>
    </div>
  );
};

const SUBTITLES = [
  'Plausible deniability transactions',
  'Hidden in the Ashes of ETH',
  'Massive anonymity set',
  'No smart contract risk',
];

function SlidingText() {
  const duplicatedItems = [...SUBTITLES, ...SUBTITLES, ...SUBTITLES, ...SUBTITLES];

  return (
    <div className="relative w-full overflow-hidden pt-10 pb-5 font-satoshi shadow-lg">
      <style>{`
        @keyframes ticker-scroll-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-ticker {
          animation: ticker-scroll-left 60s linear infinite;
          will-change: transform;
        }
        .animate-ticker:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Edge Fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-linear-to-r from-[#1119] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-linear-to-l from-[#1119] to-transparent" />

      <div className="animate-ticker flex min-w-max flex-nowrap items-center px-8">
        {duplicatedItems.map((item, index) => (
          <span
            key={index}
            className="inline-flex shrink-0 cursor-default items-center text-base font-medium tracking-wide text-white transition-colors duration-200 select-none "
          >
            <span className="mx-5 inline-block text-xl leading-none text-(--neutral-low-rgb)">|</span>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
