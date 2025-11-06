import Svg from 'react-inlinesvg';

export function HeroSection() {
  return (
    <section className="container mx-auto flex max-w-184 items-center justify-center gap-30 pb-32">
      <div className="relative flex flex-col items-center justify-center overflow-hidden rounded-base border-2 border-green-500/70 bg-surface px-16 py-20 text-gray-400">
        <Svg src="/assets/icons/grid-patterns.svg" className="absolute inset-0 z-10 size-full object-cover" />
        <h1 className="orbitron-h1 noise-effect flex items-center-safe">
          Private<sup className="text-4xl">2</sup>
        </h1>
        <div className="flex items-center justify-between gap-4">
          <h3 className="satoshi-h3 text-white">Hidden in the Ashes of ETH</h3>
        </div>
      </div>

      <div>
        <span className="flex items-center justify-start gap-2">
          <Svg src="/assets/icons/logo.svg" className="block md:hidden" />
          <Svg src="/assets/icons/typed-logo.svg" />
        </span>
      </div>
    </section>
  );
}
