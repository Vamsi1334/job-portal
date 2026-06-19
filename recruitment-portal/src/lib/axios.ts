import axios, {
  type AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from 'axios';

import { env } from '@/lib/env';

/**
 * Shape the backend uses for error responses.
 */
export interface ApiErrorResponse {
  status?: string;
  message: string;
  details?: Array<{ path: string; message: string }>;
}

/**
 * Error thrown to callers. Carries the HTTP status and any field-level details
 * so forms can surface them.
 */
export interface ApiError extends Error {
  status?: number;
  details?: ApiErrorResponse['details'];
}

function normalizeError(error: AxiosError<ApiErrorResponse>): ApiError {
  const message =
    error.response?.data?.message ?? error.message ?? 'Something went wrong. Try again.';
  const err = new Error(message) as ApiError;
  err.status = error.response?.status;
  err.details = error.response?.data?.details;
  return err;
}

/**
 * Single shared Axios client. withCredentials sends the HTTP-only auth cookies,
 * which are first-party because /api is proxied to the backend (next.config.ts).
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
  timeout: env.NEXT_PUBLIC_API_TIMEOUT,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// Endpoints where a 401 or 400 is an expected user-facing result (bad password,
// bad code) rather than an expired session, so we never try to refresh on them.
const NO_REFRESH = [
  '/auth/login',
  '/auth/register',
  '/auth/refresh',
  '/auth/verify-otp',
  '/auth/forgot-password',
  '/auth/reset-password',
];

let isRefreshing = false;
let waiters: Array<{ resolve: () => void; reject: (reason?: unknown) => void }> = [];
const drain = (error?: unknown) => {
  waiters.forEach((w) => (error ? w.reject(error) : w.resolve()));
  waiters = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorResponse>) => {
    const original = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;
    const status = error.response?.status;
    const url = original?.url ?? '';

    const canRefresh =
      status === 401 && original && !original._retry && !NO_REFRESH.some((p) => url.includes(p));

    if (canRefresh) {
      // If a refresh is already in flight, wait for it, then replay this request.
      if (isRefreshing) {
        await new Promise<void>((resolve, reject) => waiters.push({ resolve, reject }));
        return apiClient(original);
      }

      original._retry = true;
      isRefreshing = true;
      try {
        await apiClient.post('/auth/refresh');
        drain();
        return apiClient(original);
      } catch (refreshError) {
        drain(refreshError);
        // Tell the app the session is gone so it can clear state and redirect.
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('auth:logout'));
        }
        return Promise.reject(normalizeError(error));
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(normalizeError(error));
  },
);
