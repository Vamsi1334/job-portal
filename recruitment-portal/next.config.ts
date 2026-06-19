import type { NextConfig } from 'next';

// Where the Next server proxies /api to. Server-only, never sent to the browser.
const backend = process.env.BACKEND_INTERNAL_URL ?? 'http://localhost:5000';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
  },
  // Proxy API calls to the backend so the browser talks to a single origin.
  // This keeps the auth cookies first-party and removes CORS from the picture.
  async rewrites() {
    return [{ source: '/api/:path*', destination: `${backend}/api/:path*` }];
  },
};

export default nextConfig;
