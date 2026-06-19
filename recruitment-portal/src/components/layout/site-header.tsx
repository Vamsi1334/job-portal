'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';
import { mainNav } from '@/config/nav';
import { siteConfig } from '@/config/site';
import { Container } from '@/components/layout/container';
import { MobileNav } from '@/components/layout/mobile-nav';
import { HeaderAuth } from '@/components/layout/header-auth';

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <Container className="flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="font-display text-lg font-bold tracking-tight">
            {siteConfig.name}
          </Link>

          <nav className="hidden md:flex md:items-center md:gap-1">
            {mainNav.map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    active
                      ? 'bg-secondary text-secondary-foreground'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  {item.title}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <HeaderAuth />
          <MobileNav />
        </div>
      </Container>
    </header>
  );
}
