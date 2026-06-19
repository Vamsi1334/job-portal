import Link from 'next/link';

import { siteConfig } from '@/config/site';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      {/* Brand panel: hidden on mobile, monochrome and quiet. */}
      <aside className="relative hidden flex-col justify-between bg-foreground p-10 text-background lg:flex">
        <Link href="/" className="font-display text-lg font-extrabold tracking-tight">
          {siteConfig.name}
        </Link>

        <blockquote className="max-w-md">
          <p className="font-display text-2xl font-bold leading-snug tracking-tight">
            The role you want is already looking for you.
          </p>
          <footer className="mt-4 text-xs uppercase tracking-widest text-background/50">
            Sign in to pick up where you left off
          </footer>
        </blockquote>

        <p className="text-xs uppercase tracking-widest text-background/40">
          {new Date().getFullYear()} {siteConfig.name}
        </p>
      </aside>

      {/* Form area */}
      <main className="flex items-center justify-center px-4 py-12 sm:px-6">
        <div className="w-full max-w-sm">{children}</div>
      </main>
    </div>
  );
}
