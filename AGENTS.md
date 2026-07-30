# AGENTS.md

## Project

`catalogo-web` — a digital catalog app (one page per business/tenant) built with **Next.js 16 App Router**, deployed as a **Cloudflare Worker** via **OpenNext**.

## Stack

- **Next.js** (App Router, Turbopack) → React 19 + Tailwind CSS 4
- **Drizzle ORM** + **SQLite** (D1 database on Cloudflare)
- **OpenNext** (`@opennextjs/cloudflare`) bridges Next.js to Cloudflare Workers
- **Wrangler** for local dev and deployments

## Key commands

| Command | What it does |
|---|---|
| `npm run dev` | Local dev server (`next dev`) |
| `npm run preview` | Local preview on Cloudflare runtime (uses `wrangler dev` + OpenNext) |
| `npm run build` | Production build |
| `npm run deploy` | Build + deploy to Cloudflare (`opennextjs-cloudflare build && opennextjs-cloudflare deploy`) |
| `npm run upload` | Build + upload to Cloudflare |
| `npm run cf-typegen` | Regenerate Cloudflare type bindings |

## Architecture

- **`src/app/page.tsx`** — landing page (still default Next.js template)
- **`src/app/[slug]/page.tsx`** — dynamic tenant page; fetches from D1 using `getCloudflareContext({ async: true })` + `drizzle(env.DB)`
- **`src/db/schema.ts`** — Drizzle schema: `negocios` (businesses) and `productos` (products) tables
- **`drizzle/`** — SQL migration files (run via `drizzle-kit`)
- **`data-local.sql`** — seed data for local dev (Exito Group + Olimpica)
- **`wrangler.jsonc`** — Cloudflare config: D1 binding (`DB` → `base-catalogos`), assets, `compatibility_date: 2026-07-26`
- **`open-next.config.ts`** — OpenNext config (empty/defaults; R2 cache optional)
- **`cloudflare-env.d.ts`** — auto-generated types for `DB`, `ASSETS`, `NEXTJS_ENV`

## Database

- SQLite via D1 on Cloudflare; local dev uses a Miniflare SQLite file at `.wrangler/state/v3/d1/...`
- Schema migration: `drizzle-kit generate` + apply migrations
- Seed: load `data-local.sql` into local SQLite for testing

## Important notes

- **Dynamic renders** must use `export const dynamic = 'force-dynamic'` in `[slug]/page.tsx` (required for D1 fetches at request time)
- **`getCloudflareContext({ async: true })`** is the correct API to access `env.DB` in server components — do not use the old sync `useCloudflareContext()`
- **`wrangler.jsonc`** has `compatibility_date: 2026-07-26` — keep this updated for latest runtime features
- Deploy target is **Cloudflare Workers** (not Vercel); the `.vercel/` dir is stale artifact
- The project uses **Tailwind CSS v4** (`@tailwindcss/postcss`) with `@import "tailwindcss"` in `globals.css`






