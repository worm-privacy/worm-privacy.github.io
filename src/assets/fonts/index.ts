import { Orbitron } from 'next/font/google';
import localFont from 'next/font/local';

export const orbitron = Orbitron({
  subsets: ['latin'],
  preload: true,
  display: 'swap',
  variable: '--orbitron',
});

export const satoshi = localFont({
  src: [
    {
      path: './satoshi/Satoshi-Light.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: './satoshi/Satoshi-LightItalic.woff2',
      weight: '300',
      style: 'italic',
    },
    {
      path: './satoshi/Satoshi-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './satoshi/Satoshi-Italic.woff2',
      weight: '400',
      style: 'italic',
    },
    {
      path: './satoshi/Satoshi-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: './satoshi/Satoshi-MediumItalic.woff2',
      weight: '500',
      style: 'italic',
    },
    {
      path: './satoshi/Satoshi-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: './satoshi/Satoshi-BoldItalic.woff2',
      weight: '700',
      style: 'italic',
    },
    {
      path: './satoshi/Satoshi-Black.woff2',
      weight: '900',
      style: 'normal',
    },
    {
      path: './satoshi/Satoshi-BlackItalic.woff2',
      weight: '900',
      style: 'italic',
    },
  ],
  preload: true,
  variable: '--satoshi',
  display: 'swap',
});
