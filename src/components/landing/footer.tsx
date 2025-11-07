import Link from 'next/link';
import Svg from 'react-inlinesvg';

import { Button } from '@/ui';

export function Footer() {
  return (
    <footer
      className="mx-auto flex max-w-8xl flex-col gap-6 px-4 py-6 md:px-20 lg:container lg:px-40"
      style={{
        background: 'radial-gradient(62.7% 92.25% at 50.87% 100%, rgba(7, 9, 21, 0.6) 50.73%, rgba(7, 9, 21, 0) 100%)',
      }}
    >
      <div className="col-span-2 flex w-full items-center justify-between">
        <span className="flex flex-col items-start gap-2">
          <span className="flex items-center justify-start gap-2">
            <Svg src="/assets/icons/logo.svg" className="block md:hidden" />
            <Svg src="/assets/icons/typed-logo.svg" />
          </span>
          <p className="satoshi-body2 text-gray-400">Privacy first project built on Ethereum</p>
        </span>

        <Svg src="/assets/icons/logo.svg" className="hidden md:block" />
      </div>

      <nav className="flex w-full flex-col items-center justify-between md:flex-row">
        <ul className="flex items-center justify-between gap-6 md:gap-7">
          <li>
            <Button asChild variant="link">
              <Link href="/docs">Documentation</Link>
            </Button>
          </li>
          <li>
            <Button asChild variant="link">
              <Link href="/press-kit">Press kit</Link>
            </Button>
          </li>
          <li>
            <Button asChild variant="link">
              <Link href="/mint-worm">Mint Worm</Link>
            </Button>
          </li>
        </ul>

        <ul className="flex items-center justify-between gap-4">
          <li>
            <Button asChild size="icon" variant="icon">
              <Link href="/docs">
                <Svg src="/assets/icons/x.svg" />
              </Link>
            </Button>
          </li>
          <li>
            <Button asChild size="icon" variant="icon">
              <Link href="/press-kit">
                <Svg src="/assets/icons/discord.svg" />
              </Link>
            </Button>
          </li>
          <li>
            <Button asChild size="icon" variant="icon">
              <Link href="/mint-worm">
                <Svg src="/assets/icons/github.svg" />
              </Link>
            </Button>
          </li>
          <li>
            <Button asChild size="icon" variant="icon">
              <Link href="/mint-worm">
                <Svg src="/assets/icons/telegram.svg" />
              </Link>
            </Button>
          </li>
        </ul>
      </nav>

      <span className="satoshi-caption-1 col-span-2 text-gray-400">
        © 2025 WORM Protocol. MIT License - Fully Open Source
      </span>
    </footer>
  );
}
