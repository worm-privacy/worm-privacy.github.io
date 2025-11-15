import Link from 'next/link';
import Svg from 'react-inlinesvg';

import { useIsMobile } from '@/hooks';
import { cn } from '@/lib';
import { buttonVariants } from '@/ui';
import { SOCIALS } from './constant';

export function Footer() {
  const isMobile = useIsMobile();

  return (
    <footer className="h-max w-dvw bg-[radial-gradient(62.7%_92.25%_at_50.87%_100%,#070915_50.73%,rgba(7,9,21,0)_100%)]">
      <div className="mx-auto flex max-w-8xl flex-col gap-6 px-4 py-6 md:px-20 lg:container lg:px-40">
        <div className="col-span-2 flex w-full items-center justify-between">
          <span className="flex flex-col items-start gap-6 md:gap-2">
            <span className="flex items-center justify-start gap-2">
              <Svg src="/assets/icons/logo.svg" className="block md:hidden" />
              <Svg src="/assets/icons/typed-logo.svg" />
            </span>
            <p className="satoshi-body2 text-gray-400">Privacy first project built on Ethereum</p>
          </span>

          <Svg src="/assets/icons/logo.svg" className="hidden md:block" />
        </div>

        <nav className="flex w-full flex-col items-center justify-between gap-6 md:flex-row md:gap-0">
          <ul className="flex w-full items-center justify-center gap-3.5 md:justify-start md:gap-7">
            <li>
              <Link href="/docs" className={buttonVariants({ variant: 'link', className: 'px-3! py-2.5!' })}>
                Documentation
              </Link>
            </li>
            <li>
              <Link href="/press-kit" className={buttonVariants({ variant: 'link', className: 'px-3! py-2.5!' })}>
                Press kit
              </Link>
            </li>
            <li>
              <Link href="/app/mine" className={buttonVariants({ variant: 'link', className: 'px-3! py-2.5!' })}>
                Mint Worm
              </Link>
            </li>
          </ul>

          <ul className="flex items-center justify-between gap-4">
            {SOCIALS.map((s) => (
              <li key={s.link}>
                <Link href={s.link} className={buttonVariants({ variant: 'icon', size: 'icon' })}>
                  <Svg src={s.logo} className="size-4.5!" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <span
          className={cn('satoshi-caption1 col-span-2 text-center text-gray-400 md:text-left', {
            'satoshi-caption2': isMobile,
          })}
        >
          © 2025 WORM Protocol. MIT License - Fully Open Source
        </span>
      </div>
    </footer>
  );
}
