import type { Metadata, Viewport } from 'next';

import { orbitron, satoshi } from '@/assets/fonts';
import { cn } from '@/lib';

import { TailwindIndicator } from '@/components/ui';
import { CSSProperties } from 'react';
import '../assets/styles/globals.css';

export const metadata: Metadata = {
  title: 'Worm',
  description: 'Worm Frontend',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1.0,
  viewportFit: 'cover',
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
        {children}
        <TailwindIndicator />
      </body>
    </html>
  );
}
