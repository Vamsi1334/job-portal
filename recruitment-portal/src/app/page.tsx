import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { SiteFooter } from '@/components/layout/site-footer';
import { SiteHeader } from '@/components/layout/site-header';
import { HomeSearch } from '@/components/home/home-search';
import { StatCounter } from '@/components/home/stat-counter';
import { jobs, categories, companies, stories, heroStats } from '@/data/home';

const featuredJobs = jobs.slice(0, 6);

export default function HomePage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* ============ HERO ============ */}
        <section className="relative overflow-hidden border-b border-border">
          <div className="grid-lines absolute inset-0" aria-hidden="true" />
          <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-20 sm:px-6 lg:px-8 lg:pb-24 lg:pt-28">
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">
              Jobs worth the move
            </p>
            <h1 className="mt-5 max-w-4xl font-display text-[clamp(2.5rem,7vw,5.5rem)] font-black leading-[0.98] tracking-tight">
              Find a role worth
              <br className="hidden sm:block" /> showing up for.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Search openings from teams that take hiring seriously. Filter by role, location, and
              how you want to work.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Link
                href="/jobs"
                className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
              >
                Search jobs
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="#categories"
                className="inline-flex items-center rounded-full border border-border px-6 py-3.5 text-sm font-semibold transition-colors hover:border-foreground"
              >
                Browse categories
              </Link>
            </div>

            <dl className="mt-16 grid max-w-2xl grid-cols-1 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-3">
              {heroStats.map((stat) => (
                <StatCounter
                  key={stat.label}
                  value={stat.value}
                  suffix={stat.suffix}
                  label={stat.label}
                />
              ))}
            </dl>
          </div>

          {/* Trending marquee */}
          <div className="relative border-t border-border py-4">
            <div className="flex items-center">
              <span className="relative z-10 shrink-0 bg-background pl-4 pr-5 font-mono text-xs uppercase tracking-widest text-muted-foreground sm:pl-6 lg:pl-8">
                Trending
              </span>
              <div className="relative flex-1 overflow-hidden">
                <div className="pointer-events-none absolute inset-y-0 left-0 z-[5] w-10 bg-gradient-to-r from-background to-transparent" />
                <div className="marquee-track gap-3 pl-3" aria-hidden="true">
                  {[...jobs, ...jobs].map((job, i) => (
                    <span
                      key={`${job.id}-${i}`}
                      className="whitespace-nowrap rounded-full border border-border px-4 py-1.5 text-sm"
                    >
                      {job.title}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============ HOME SEARCH ============ */}
        <section className="border-b border-border bg-muted py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">
              Search
            </p>
            <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
              Start with what you do.
            </h2>
            <HomeSearch />
          </div>
        </section>

        {/* ============ FEATURED JOBS ============ */}
        <section className="border-b border-border py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">
                  Featured
                </p>
                <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
                  Roles getting attention now.
                </h2>
              </div>
              <Link href="/jobs" className="group inline-flex items-center gap-2 text-sm font-semibold">
                View all jobs
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {featuredJobs.map((job) => (
                <Link
                  key={job.id}
                  href={`/jobs/${job.id}`}
                  className="group flex flex-col justify-between rounded-2xl border border-border bg-background p-6 transition-all duration-300 hover:-translate-y-1 hover:border-foreground"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-display text-lg font-bold leading-tight tracking-tight">
                          {job.title}
                        </h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {job.company} &middot; {job.loc}
                        </p>
                      </div>
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted font-mono text-sm font-bold">
                        {job.company.charAt(0)}
                      </span>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {job.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-border px-2.5 py-0.5 text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                      <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs">{job.type}</span>
                    </div>
                  </div>
                  <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                    <span className="font-mono text-sm font-medium">{job.pay}</span>
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                      {job.age} ago
                      <ArrowRight className="size-4 text-foreground transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ============ CATEGORIES ============ */}
        <section id="categories" className="scroll-mt-16 bg-foreground py-16 text-background sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="max-w-2xl">
                <p className="font-mono text-xs uppercase tracking-[0.25em] text-background/50">
                  Browse by category
                </p>
                <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
                  Pick a lane. We will show you the openings.
                </h2>
              </div>
              <Link
                href="/jobs"
                className="group inline-flex items-center gap-2 text-sm font-semibold text-background"
              >
                All categories
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-background/15 bg-background/15 sm:grid-cols-2 lg:grid-cols-4">
              {categories.map((cat) => (
                <Link
                  key={cat.name}
                  href={`/jobs?cat=${encodeURIComponent(cat.name)}`}
                  className="group bg-foreground p-7 transition-colors duration-300 hover:bg-background/10"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-display text-xl font-bold tracking-tight">{cat.name}</span>
                    <ArrowRight className="size-4 text-background/40 transition-transform group-hover:translate-x-1" />
                  </div>
                  <p className="mt-2 font-mono text-sm text-background/50">{cat.count} open</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ============ COMPANIES ============ */}
        <section className="border-b border-border py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">
              Companies hiring
            </p>
            <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
              Teams already posting roles.
            </h2>
          </div>

          {/* Logo marquee */}
          <div className="mt-12 flex overflow-hidden border-y border-border py-8">
            <div className="marquee-track gap-16 px-8" aria-hidden="true">
              {[...companies, ...companies].map((company, i) => (
                <span
                  key={`${company.name}-${i}`}
                  className="shrink-0 font-display text-2xl font-bold tracking-tight text-muted-foreground transition-colors duration-300 hover:text-foreground"
                >
                  {company.name}
                </span>
              ))}
            </div>
          </div>

          {/* Company cards */}
          <div className="mx-auto mt-12 max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {companies.map((company) => (
                <Link
                  key={company.name}
                  href={`/jobs?q=${encodeURIComponent(company.name)}`}
                  className="group flex items-center justify-between rounded-2xl border border-border bg-background p-6 transition-all duration-300 hover:-translate-y-1 hover:border-foreground"
                >
                  <div className="flex items-center gap-4">
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-foreground font-display text-lg font-bold text-background">
                      {company.name.charAt(0)}
                    </span>
                    <div>
                      <p className="font-display text-base font-bold tracking-tight">
                        {company.name}
                      </p>
                      <p className="text-sm text-muted-foreground">{company.sector}</p>
                    </div>
                  </div>
                  <span className="text-right">
                    <span className="block font-mono text-sm font-medium">{company.open}</span>
                    <span className="block text-xs text-muted-foreground">open</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ============ STORIES ============ */}
        <section className="bg-muted py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">
                Success stories
              </p>
              <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
                People who found the right room.
              </h2>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
              {stories.map((story) => (
                <figure
                  key={story.name}
                  className="flex flex-col justify-between rounded-2xl border border-border bg-background p-7"
                >
                  <blockquote className="text-lg font-medium leading-snug">
                    {story.quote}
                  </blockquote>
                  <figcaption className="mt-8 flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-foreground font-mono text-sm font-bold text-background">
                      {story.initials}
                    </span>
                    <span>
                      <span className="block text-sm font-semibold">{story.name}</span>
                      <span className="block text-xs text-muted-foreground">{story.role}</span>
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* ============ CTA ============ */}
        <section className="border-t border-border py-16 sm:py-20">
          <div className="mx-auto flex max-w-7xl flex-col items-start gap-6 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
            <h2 className="max-w-xl font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
              Your next role is already posted.
            </h2>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-4 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
            >
              Create your account
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
