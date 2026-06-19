import { Loader2 } from 'lucide-react';

import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  className?: string;
  label?: string;
}

/**
 * Accessible inline loading indicator.
 */
export function LoadingSpinner({ className, label = 'Loading' }: LoadingSpinnerProps) {
  return (
    <div className="flex items-center justify-center gap-2 text-muted-foreground" role="status">
      <Loader2 className={cn('h-5 w-5 animate-spin', className)} aria-hidden="true" />
      <span className="sr-only">{label}</span>
    </div>
  );
}
