import type { NextConfig } from 'next';
import withSerwistInit from '@serwist/next';

const withSerwist = withSerwistInit({
  swSrc: 'src/sw.ts',
  swDest: 'public/sw.js',
  disable: process.env.NODE_ENV === 'development',
});

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/stay',
        destination: '/',
        permanent: true,
      },
      {
        source: '/dining',
        destination: '/',
        permanent: true,
      },
      {
        source: '/tours',
        destination: '/',
        permanent: true,
      },
      {
        source: '/events',
        destination: '/',
        permanent: true,
      },
      {
        source: '/booking',
        destination: '/',
        permanent: true,
      },
      {
        source: '/booking/:path*',
        destination: '/',
        permanent: true,
      },
    ];
  },
  async rewrites() {
    const apiTarget = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    return [
      {
        source: '/api/:path*',
        destination: `${apiTarget}/api/:path*`,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          },
        ],
      },
    ];
  },
  poweredByHeader: false,
  reactStrictMode: true,
  experimental: {
    serverActions: {
      allowedOrigins: [
        'localhost:3000',
        'yarvohotel.com',
        'www.yarvohotel.com',
        '72.61.15.24',
        '72.61.15.24:3050',
        ...(process.env.DOMAIN ? [
          process.env.DOMAIN,
          `www.${process.env.DOMAIN}`,
          `api.${process.env.DOMAIN}`,
        ] : []),
      ],
    },
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'http',  hostname: 'localhost' },
      // Allow API subdomain (any domain set via DOMAIN env var)
      ...(process.env.DOMAIN ? [
        { protocol: 'https' as const, hostname: `api.${process.env.DOMAIN}` },
      ] : [
        { protocol: 'https' as const, hostname: '*.yarvohotel.com' },
      ]),
    ]
  },
  output: 'standalone',
};

export default withSerwist(nextConfig);