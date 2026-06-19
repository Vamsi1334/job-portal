# Recruitment Portal

A production-ready frontend for a recruitment portal. Post roles, review candidates, and track applications. Built mobile first with a strict black and white theme.

Authentication is intentionally not included yet.

## Tech stack

- Next.js 15 (App Router) with React 19
- TypeScript (strict)
- Tailwind CSS with CSS variable tokens
- shadcn/ui (Radix primitives)
- React Hook Form with Zod validation
- TanStack React Query
- Axios (single shared client)
- Framer Motion
- ESLint (flat config) and Prettier

## Getting started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy the environment file and adjust values:

   ```bash
   cp .env.example .env
   ```

3. Run the dev server:

   ```bash
   npm run dev
   ```

   The app runs at http://localhost:3000.

## Scripts

- `npm run dev` start the dev server
- `npm run build` create a production build
- `npm run start` run the production build
- `npm run lint` run ESLint
- `npm run lint:fix` fix lint issues
- `npm run format` format with Prettier
- `npm run format:check` check formatting
- `npm run typecheck` run the TypeScript compiler with no emit

## Environment variables

Defined and validated in `src/lib/env.ts` with Zod, so a bad config fails at startup instead of at runtime. Only `NEXT_PUBLIC_*` values are available in the browser.

| Variable | Description | Default |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | Base URL of the backend API | required |
| `NEXT_PUBLIC_APP_NAME` | App name shown across the UI | Recruitment Portal |
| `NEXT_PUBLIC_API_TIMEOUT` | Axios request timeout in ms | 15000 |

## Folder structure

```
src/
  app/                      App Router routes
    (main)/                 Route group sharing the header and footer
      jobs/                 Jobs list
        [id]/               Job detail
      candidates/           Candidates list
      applications/         Applications list
    layout.tsx              Root layout: fonts, metadata, providers
    page.tsx                Landing page
    providers.tsx           React Query provider
    globals.css             Tailwind layers and theme tokens
    loading.tsx             Route-level loading UI
    error.tsx               Route-level error boundary
    not-found.tsx           404 page
  components/
    ui/                     shadcn primitives (button, input, card, form, ...)
    layout/                 Header, footer, container, mobile nav
    common/                 Page header, empty state, spinner, section
    forms/                  Composed forms (example: job-form)
  config/                   Site and navigation config
  constants/                Enumerations and shared constants
  hooks/                    React Query and utility hooks
  lib/                      env, utils (cn), axios client, query client
  schemas/                  Zod schemas and inferred form types
  services/                 API call layer wrapping the Axios client
  types/                    Shared domain types
```

## Architecture notes

- Data flow is one direction: `services` call the Axios client, `hooks` wrap services with React Query, components consume hooks. Components never call the API client directly.
- Query keys live in `src/lib/query-client.ts` so cache invalidation stays consistent.
- Forms follow one pattern: a Zod schema in `src/schemas`, the resolver in the form component, and typed values inferred from the schema. See `src/components/forms/job-form.tsx`.
- The theme is monochrome only. Colors are HSL tokens in `globals.css` with a light and a dark variant, both strictly black, white, and grays.
- Typography pairs Archivo (display) with Inter (body), loaded through `next/font` with no layout shift.

## Adding shadcn components

`components.json` is configured for the new-york style with the neutral base color. Add more primitives with:

```bash
npx shadcn@latest add dialog
```

## Next steps

- Add authentication and attach the token in the Axios request interceptor (`src/lib/axios.ts`).
- Replace the empty states on the list pages with live React Query data.
- Point `NEXT_PUBLIC_API_URL` at your backend.
