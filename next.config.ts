import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  output: 'export',
  basePath: process.env.PAGES_BASE_PATH,
  assetPrefix: 'http://worm.cx/fontend/',
};

export default nextConfig;
