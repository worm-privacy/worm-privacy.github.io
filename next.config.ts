import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  output: 'export',
  basePath: 'fontend',
  assetPrefix: 'frontend',
};

export default nextConfig;
