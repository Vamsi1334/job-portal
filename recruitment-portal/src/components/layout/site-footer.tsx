import Link from 'next/link';

import { footerNav } from '@/config/nav';
import { siteConfig } from '@/config/site';
import { Container } from '@/components/layout/container';

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border">
      <Container className="flex flex-col gap-6 py-10 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <p className="font-display text-base font-bold tracking-tight">{siteConfig.name}</p>
          <p className="max-w-sm text-sm text-muted-foreground">{siteConfig.description}</p>
        </div>

        <nav className="flex flex-wrap gap-x-6 gap-y-2">
          {footerNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.title}
            </Link>
          ))}
        </nav>
      </Container>

      <Container className="border-t border-border py-6">
        <p className="text-xs text-muted-foreground">
          {year} {siteConfig.name}. All rights reserved.
        </p>
      </Container>
    </footer>
  );
}
