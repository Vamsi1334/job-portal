import * as React from 'react';

/**
 * Monochrome Google "G" mark. Uses currentColor so it stays on-theme in a
 * strict black and white palette instead of the brand's multicolor logo.
 */
export function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 11v2.8h3.9c-.2 1-1.5 3-3.9 3-2.3 0-4.2-1.9-4.2-4.3S9.7 8.2 12 8.2c1.3 0 2.2.6 2.7 1.1l1.9-1.8C15.4 6.4 13.9 5.8 12 5.8c-3.6 0-6.5 2.9-6.5 6.5S8.4 18.8 12 18.8c3.8 0 6.3-2.6 6.3-6.4 0-.5 0-.8-.1-1.2H12z" />
    </svg>
  );
}
