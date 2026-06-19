'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2, LogOut } from 'lucide-react';

import { useAuth } from '@/providers/auth-provider';
import { useLogout } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';

export function HeaderAuth() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const logout = useLogout();
  const router = useRouter();

  if (isLoading) {
    return <div className="h-9 w-24 animate-pulse rounded-md bg-secondary" aria-hidden="true" />;
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center gap-2">
        <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex">
          <Link href="/login">Sign in</Link>
        </Button>
        <Button asChild size="sm">
          <Link href="/register">Create account</Link>
        </Button>
      </div>
    );
  }

  const onLogout = async () => {
    await logout.mutateAsync();
    router.replace('/login');
  };

  return (
    <div className="flex items-center gap-2">
      <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
        <Link href="/dashboard">Dashboard</Link>
      </Button>
      <Link
        href="/profile"
        className="flex items-center gap-2 rounded-md px-2 py-1.5 transition-colors hover:bg-secondary"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-foreground text-xs font-bold text-background">
          {`${user?.firstName?.[0] ?? ''}${user?.lastName?.[0] ?? ''}`.toUpperCase() || 'U'}
        </span>
        <span className="hidden text-sm font-medium sm:inline">{user?.firstName}</span>
      </Link>
      <Button variant="outline" size="sm" onClick={onLogout} disabled={logout.isPending}>
        {logout.isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        ) : (
          <LogOut className="h-4 w-4" aria-hidden="true" />
        )}
        <span className="hidden sm:inline">Sign out</span>
      </Button>
    </div>
  );
}
