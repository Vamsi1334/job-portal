import { CheckCircle2, AlertCircle } from 'lucide-react';

import { cn } from '@/lib/utils';

interface FormStatusProps {
  variant: 'error' | 'success';
  message: string;
  className?: string;
}

/**
 * Inline error or success banner, monochrome and accessible.
 */
export function FormStatus({ variant, message, className }: FormStatusProps) {
  const Icon = variant === 'success' ? CheckCircle2 : AlertCircle;
  return (
    <div
      role={variant === 'error' ? 'alert' : 'status'}
      className={cn(
        'flex items-start gap-2 rounded-md border px-3 py-2.5 text-sm',
        variant === 'error'
          ? 'border-foreground/20 bg-secondary text-foreground'
          : 'border-foreground bg-foreground text-background',
        className,
      )}
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <span>{message}</span>
    </div>
  );
}
