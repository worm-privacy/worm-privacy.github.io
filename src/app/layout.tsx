import type { Metadata, Viewport } from 'next';
import { CSSProperties } from 'react';

import { orbitron, satoshi } from '@/assets/fonts';
import { TailwindIndicator } from '@/components/ui';
import { cn } from '@/lib';

import RainbowKitRoot from '@/components/tools/rainbowkit-root';
import '../assets/styles/globals.css';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://worm.cx';
const SITE_NAME = 'WORM';
const SITE_TITLE = 'WORM — Plausibly deniable privacy on Ethereum';
const SITE_DESCRIPTION =
  'WORM is a privacy-first protocol on Ethereum. Mine WORM with private proof-of-burn (EIP-7503), and swap or send assets anonymously.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  category: 'technology',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: SITE_TITLE,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@EIP7503',
    creator: '@EIP7503',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ['/og.png'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1.0,
  viewportFit: 'cover',
  themeColor: '#05080f',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-surface ">
      <body
        className={cn(satoshi.variable, orbitron.variable, 'min-h-screen bg-transparent antialiased')}
        vaul-drawer-wrapper=""
      >
        <div
          className="fixed top-0 left-0 h-dvh w-dvw bg-surface1"
          style={{
            backgroundImage:
              'linear-gradient(0deg, rgb(0, 200, 113, 0.05) 25%, #05080f 25%, #05080f 50%, rgb(0, 200, 113, 0.05) 50%, rgb(0, 200, 113, 0.05) 75%, #05080f 75%, #05080f 100%)',
            backgroundSize: '16.00px 16.00px',
          }}
        />
        <div
          className="pointer-events-none fixed top-0 left-0 z-0 h-full w-full animate-scan-line ease-scan-line"
          style={
            {
              // background:
              //   'linear-gradient(to bottom, rgba(0, 255, 0, 0.05) 0%, rgba(0, 0, 0, 0.1) 10%, rgba(0, 255, 0, 0.05) 100%)',
              '--duration': '4',
              background: 'linear-gradient(360deg, rgba(72, 86, 226, 0.35) -171.31%, rgba(72, 86, 226, 0) 100%)',
            } as CSSProperties
          }
        />
        <RainbowKitRoot>{children}</RainbowKitRoot>
        <TailwindIndicator />
      </body>
    </html>
  );
}
