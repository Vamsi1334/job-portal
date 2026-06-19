import { env } from '@/lib/env';

export const siteConfig = {
  name: env.NEXT_PUBLIC_APP_NAME,
  description:
    'A modern recruitment portal for posting roles, reviewing candidates, and tracking applications.',
  url: 'https://example.com',
} as const;

export type SiteConfig = typeof siteConfig;
