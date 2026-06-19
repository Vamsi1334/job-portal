'use client';

import { useEffect } from 'react';

import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Replace with your logging service in production.
    console.error(error);
  }, [error]);

  return (
    <Container className="flex min-h-dvh flex-col items-center justify-center gap-4 text-center">
      <h1 className="font-display text-xl font-semibold">Something went wrong</h1>
      <p className="max-w-sm text-sm text-muted-foreground">
        An unexpected error occurred. Try again, and if it persists, contact support.
      </p>
      <Button onClick={reset} className="mt-2">
        Try again
      </Button>
    </Container>
  );
}
