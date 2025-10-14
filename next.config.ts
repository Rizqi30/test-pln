import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,

  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  async rewrites() {
    return [
      {
        source: '/detail',
        destination: '/anotherPages/detail',
      },
      {
        source: '/project',
        destination: '/anotherPages/project',
      },
      {
        source: '/home',
        destination: '/anotherPages/home',
      },
      {
        source: '/reports',
        destination: '/anotherPages/reports',
      }
    ];
  },
};

export default nextConfig;
