'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Briefcase } from 'lucide-react';

import { Button } from '@/components/ui/button';

/**
 * Home hero search. Mirrors the keyword / location / type search from the HTML
 * preview and routes to the jobs listing with the chosen filters as query params.
 */
export function HomeSearch() {
  const router = useRouter();
  const [q, setQ] = useState('');
  const [loc, setLoc] = useState('');
  const [type, setType] = useState('');

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (q.trim()) params.set('q', q.trim());
    if (loc.trim()) params.set('loc', loc.trim());
    if (type) params.set('type', type);
    const query = params.toString();
    router.push(query ? `/jobs?${query}` : '/jobs');
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mt-8 rounded-2xl border border-border bg-background p-3 shadow-sm sm:p-4"
      noValidate
    >
      <div className="grid grid-cols-1 gap-3 md:grid-cols-[1.4fr_1fr_1fr_auto]">
        <div className="flex items-center gap-3 rounded-xl border border-border px-4 py-3 focus-within:border-foreground">
          <Search className="size-[18px] shrink-0 text-muted-foreground" aria-hidden="true" />
          <label htmlFor="homeQ" className="sr-only">
            Job title or keyword
          </label>
          <input
            id="homeQ"
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Job title or keyword"
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-border px-4 py-3 focus-within:border-foreground">
          <MapPin className="size-[18px] shrink-0 text-muted-foreground" aria-hidden="true" />
          <label htmlFor="homeLoc" className="sr-only">
            Location
          </label>
          <input
            id="homeLoc"
            type="text"
            value={loc}
            onChange={(e) => setLoc(e.target.value)}
            placeholder="Location"
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-border px-4 py-3 focus-within:border-foreground">
          <Briefcase className="size-[18px] shrink-0 text-muted-foreground" aria-hidden="true" />
          <label htmlFor="homeType" className="sr-only">
            Job type
          </label>
          <select
            id="homeType"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full bg-transparent text-sm outline-none"
          >
            <option value="">Any type</option>
            <option>Full-time</option>
            <option>Part-time</option>
            <option>Contract</option>
            <option>Internship</option>
          </select>
        </div>

        <Button type="submit" size="lg" className="rounded-xl px-7">
          Search
        </Button>
      </div>
    </form>
  );
}
