import { useIsMobile } from '@/hooks';
import { cn } from '@/lib';
import Svg from 'react-inlinesvg';
import { Button } from '../ui';

export function HeroSection() {
  const isMobile = useIsMobile();

  return (
    <section className="flex flex-col items-center justify-center gap-10 px-4 pt-12 pb-12 md:container md:mx-auto md:grid md:max-w-280 md:grid-cols-[1fr_calc(var(--spacing)*89.25)] md:gap-30 md:px-0 md:pt-0 md:pb-32">
      <span className="flex items-center justify-start gap-2 md:hidden">
        <Svg src="/assets/icons/logo.svg" />
        <Svg src="/assets/icons/typed-logo.svg" />
      </span>
      <div className="corner-only relative w-full items-center justify-center overflow-clip rounded-base border-2 border-green-500/70 bg-surface text-gray-400 md:w-160">
        <Svg
          src="/assets/icons/grid-patterns.svg"
          className="absolute -top-10 -right-10 -bottom-10 -left-10 -z-10 object-cover md:top-0 md:left-0 md:size-full"
        />
        <div className="flex size-full flex-col gap-10 px-8 py-19.5 md:px-16 md:py-20">
          <h1
            className={cn('orbitron-h1  noise-effect flex items-center-safe justify-center', {
              'orbitron-h2': isMobile,
            })}
          >
            Privacy<sup className="noise-effect text-4xl!">2</sup>
          </h1>

          <div className="flex flex-col items-center justify-center gap-4 md:flex-row md:justify-between">
            <h3
              className={cn('satoshi-h1 text-center text-white md:text-left', {
                'satoshi-h3': isMobile,
              })}
            >
              Hidden in the
              <br className="hidden md:block" /> Ashes of ETH
            </h3>
          </div>
        </div>
      </div>

      <div className="flex w-full flex-col items-start justify-start gap-10 self-center md:max-w-full">
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
          <Button className="w-1/2 md:w-max">Get WORM</Button>
          <Button variant="primary-outline" className="w-1/2 md:w-max [&_path]:fill-green-400!">
            Follow on <Svg src="/assets/icons/x.svg" />
          </Button>
        </div>
      </div>
    </section>
  );
}
