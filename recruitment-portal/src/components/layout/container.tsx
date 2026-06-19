import { cn } from '@/lib/utils';

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType;
}

/**
 * Centered, padded content wrapper used across pages for consistent gutters.
 */
export function Container({ as: Comp = 'div', className, ...props }: ContainerProps) {
  return <Comp className={cn('mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8', className)} {...props} />;
}
