import { QueryClient } from '@tanstack/react-query';

/**
 * Creates a fresh QueryClient. A factory (not a singleton) keeps server and
 * client from sharing cache during SSR in the App Router.
 */
export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        gcTime: 5 * 60 * 1000,
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  });
}

/**
 * Centralized query keys. Reference these instead of typing raw arrays so
 * invalidation stays consistent across the app.
 */
export const queryKeys = {
  auth: {
    me: ['auth', 'me'] as const,
  },
  jobs: {
    all: ['jobs'] as const,
    list: (filters?: Record<string, unknown>) => ['jobs', 'list', filters ?? {}] as const,
    detail: (id: string) => ['jobs', 'detail', id] as const,
  },
  candidates: {
    all: ['candidates'] as const,
    list: (filters?: Record<string, unknown>) =>
      ['candidates', 'list', filters ?? {}] as const,
    detail: (id: string) => ['candidates', 'detail', id] as const,
  },
  applications: {
    all: ['applications'] as const,
    list: (filters?: Record<string, unknown>) =>
      ['applications', 'list', filters ?? {}] as const,
  },
} as const;
