# AGENTS.md

## Cursor Cloud specific instructions

### Overview

HackerKnews is a Nuxt 3 (Vue 3) PWA client for Hacker News. It is a single-service app — one command (`npm run dev`) starts both the Vue frontend and the Nitro API server on port 3000.

### Key facts

- **No database, no secrets, no Docker** — all data comes from the public HackerNews Firebase API.
- **No test framework configured** — there are no automated tests in this repo.
- **No linter configured** — there is no ESLint/Prettier setup. Use `npm run build` as the primary correctness check (TypeScript + Vite build).
- The `postinstall` script (`nuxt prepare`) auto-generates the `.nuxt` directory with TypeScript types after `npm install`.

### Common commands

See `package.json` scripts. Key ones:

| Task | Command |
|---|---|
| Install deps | `npm install` |
| Dev server | `npm run dev` (port 3000) |
| Production build | `npm run build` |
| Preview prod build | `npm run preview` |

### Caveats

- The `/api/preview` endpoint fetches external URLs for OG images. If outbound HTTP is blocked, preview images won't load but the app still works (falls back to colored letter avatars).
- Tailwind CSS v4 is loaded via `@nuxtjs/tailwindcss` from `~/assets/css/tailwind.css`.
