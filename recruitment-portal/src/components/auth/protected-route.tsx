'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { useAuth } from '@/providers/auth-provider';
import { LoadingSpinner } from '@/components/common/loading-spinner';

/**
 * Gates client rendering on an authenticated session. While the session is
 * being checked it shows a spinner; if there is no session it redirects to
 * /login with a redirect-back param. Middleware also gates these routes at the
 * edge, so this is the second layer for a smooth client experience.
 */
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [isLoading, isAuthenticated, pathname, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <LoadingSpinner label="Checking your session" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return <>{children}</>;
}
