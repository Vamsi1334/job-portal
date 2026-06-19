import { z } from 'zod';

/**
 * Validates environment variables at startup so a misconfigured deploy fails
 * fast and loud instead of silently breaking requests at runtime.
 *
 * Only NEXT_PUBLIC_* variables are readable in the browser, so every value
 * here is referenced explicitly (Next.js inlines them at build time).
 */
const envSchema = z.object({
  NEXT_PUBLIC_API_URL: z
    .string()
    .min(1)
    .refine((value) => value.startsWith('/') || /^https?:\/\//.test(value), {
      message: 'NEXT_PUBLIC_API_URL must be an absolute URL or a path starting with /',
    })
    .default('/api/v1'),
  NEXT_PUBLIC_APP_NAME: z.string().min(1).default('Recruitment Portal'),
  NEXT_PUBLIC_API_TIMEOUT: z.coerce.number().int().positive().default(15000),
});

const parsed = envSchema.safeParse({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
  NEXT_PUBLIC_API_TIMEOUT: process.env.NEXT_PUBLIC_API_TIMEOUT,
});

if (!parsed.success) {
  console.error('Invalid environment variables:', parsed.error.flatten().fieldErrors);
  throw new Error('Invalid environment variables. Check your .env file against .env.example.');
}

export const env = parsed.data;
