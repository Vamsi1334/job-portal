import { cn } from '@/lib/utils';
import { Container } from '@/components/layout/container';

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  contained?: boolean;
}

/**
 * Vertical rhythm wrapper for page sections. Set contained to false when the
 * child manages its own width.
 */
export function Section({ contained = true, className, children, ...props }: SectionProps) {
  const content = contained ? <Container>{children}</Container> : children;
  return (
    <section className={cn('py-10 sm:py-14', className)} {...props}>
      {content}
    </section>
  );
}
