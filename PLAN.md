# HackerKnews — Implementation Plan

## Overview
A Progressive Web App HackerNews client built with **Nuxt 3 + Vue 3**, featuring a clean card-based UI with link preview images fetched via server-side Open Graph parsing.

## Tech Stack
- **Framework**: Nuxt 3 (Vue 3, Composition API, `<script setup>`)
- **Server**: Nitro (built into Nuxt) for API routes
- **Styling**: Tailwind CSS v4
- **PWA**: `@vite-pwa/nuxt`
- **OG parsing**: `cheerio` (server-side HTML parsing for meta tags)
- **HTTP**: `ofetch` (built into Nuxt/Nitro)
- **HackerNews API**: Official Firebase API (`https://hacker-news.firebaseio.com/v0/`)

---

## Step 1 — Scaffold the Nuxt 3 Project

Set up the base Nuxt 3 app with all core dependencies.

- Initialize Nuxt 3 project with `nuxi init`
- Install dependencies: `tailwindcss`, `@vite-pwa/nuxt`, `cheerio`
- Configure `nuxt.config.ts` with modules and basic settings
- Add a `.gitignore` for Nuxt (node_modules, .nuxt, .output, dist)
- Verify the dev server starts cleanly

**Files created:**
- `nuxt.config.ts`
- `package.json`
- `tsconfig.json`
- `.gitignore`
- `app.vue` (root shell)
- `tailwind.css` (Tailwind entry point)

---

## Step 2 — Layout and Core UI Shell

Build the app layout: header/nav, main content area, and base styling.

- Create `layouts/default.vue` with a sticky top nav bar
- Nav bar includes: logo/title "HackerKnews", section tabs (Top, New, Best)
- Set up base Tailwind theme: font stack, color palette (warm neutral tones), spacing
- Add dark mode support via `prefers-color-scheme` (Tailwind's `dark:` variant)
- Create `pages/index.vue` as the default landing page (redirects to Top stories)
- Create route structure: `pages/[section].vue` for Top/New/Best

**Files created:**
- `layouts/default.vue`
- `pages/index.vue`
- `pages/[section].vue`

---

## Step 3 — HackerNews API Composable

Create a reusable composable to fetch stories from the HN Firebase API.

- Create `composables/useHackerNews.ts`
- Implement functions:
  - `fetchStoryIds(section)` — fetches top/new/best story ID lists
  - `fetchItem(id)` — fetches a single story/comment item
  - `fetchStories(section, page, pageSize)` — fetches a paginated batch of stories with their details
- Use Nuxt's `useFetch` / `useAsyncData` for SSR-compatible data fetching
- Add pagination support (load 30 stories at a time)

**Files created:**
- `composables/useHackerNews.ts`

---

## Step 4 — Story Card Component

Build the main story card UI component.

- Create `components/StoryCard.vue`
  - Displays: preview thumbnail (left side), title, domain, points, author, time ago, comment count
  - Placeholder/skeleton state while loading
  - Fallback icon when no preview image is available (use first letter of domain or a generic link icon)
- Create `components/StoryList.vue`
  - Renders a list of StoryCard components
  - "Load more" button at the bottom for pagination
- Time formatting: relative time ("2h ago", "3d ago") — small utility function, no library needed

**Files created:**
- `components/StoryCard.vue`
- `components/StoryList.vue`
- `utils/formatTime.ts`

---

## Step 5 — Open Graph Preview Image API Route

Server-side endpoint that fetches a URL, parses its OG meta tags, and returns the preview image URL.

- Create `server/api/preview.get.ts`
  - Accepts `?url=<encoded-url>` query parameter
  - Fetches the target page HTML (with a timeout of ~5 seconds, user-agent header)
  - Parses `og:image`, `twitter:image`, or first large `<img>` as fallback
  - Returns JSON: `{ image: string | null, title?: string, description?: string }`
  - Caches results in-memory (simple Map with TTL) to avoid re-fetching
  - Handles errors gracefully (returns `{ image: null }` on failure)
- Add rate limiting / basic abuse prevention (optional, can defer)

**Files created:**
- `server/api/preview.get.ts`
- `server/utils/ogCache.ts`

---

## Step 6 — Wire Preview Images into Story Cards

Connect the OG image API to the story card components.

- In `StoryCard.vue`, call `/api/preview?url=<story.url>` to get the image
- Use lazy loading: image fetches after the card is visible (IntersectionObserver or Vue's built-in lazy)
- Show a subtle loading shimmer while the image is being fetched
- Gracefully handle missing images with a domain-colored fallback
- Cache fetched preview URLs on the client side to avoid re-fetching on navigation

**Files modified:**
- `components/StoryCard.vue`
- `composables/useHackerNews.ts` (add preview data to story objects)

---

## Step 7 — PWA Configuration

Configure the app as an installable Progressive Web App.

- Configure `@vite-pwa/nuxt` in `nuxt.config.ts`:
  - App manifest (name, short_name, icons, theme_color, background_color)
  - Service worker with runtime caching strategies:
    - HN API calls: NetworkFirst (fresh data, offline fallback)
    - Preview images: CacheFirst (images rarely change)
    - Static assets: CacheFirst
  - Offline fallback page
- Create PWA icons (simple text-based icon generated or placeholder)
- Add `<meta>` tags for iOS PWA support (apple-mobile-web-app-capable, status-bar-style)

**Files created/modified:**
- `nuxt.config.ts` (PWA module config)
- `public/icons/` (PWA icon set)
- `public/favicon.ico`

---

## Step 8 — Polish and Final Touches

- Add loading states and skeleton screens for initial page load
- Add pull-to-refresh gesture support (for mobile PWA)
- Smooth page transitions between sections
- Responsive design review: ensure it looks good from 320px to desktop widths
- Add external link indicators and "open in new tab" behavior
- Add a simple comment count badge that links to the HN discussion page
- Final accessibility pass: semantic HTML, keyboard navigation, ARIA labels

**Files modified:**
- Various component files
- `layouts/default.vue`

---

## Architecture Diagram

```
┌─────────────────────────────────────────┐
│               Browser (PWA)             │
│  ┌───────────┐  ┌────────────────────┐  │
│  │  Vue App  │  │  Service Worker    │  │
│  │  (Nuxt)   │  │  (Workbox/Cache)   │  │
│  └─────┬─────┘  └────────────────────┘  │
│        │                                │
└────────┼────────────────────────────────┘
         │
    ┌────▼────┐
    │  Nitro  │  (Nuxt Server)
    │  Server │
    ├─────────┤
    │ GET /api/preview?url=...            │
    │  → fetch URL                        │
    │  → parse OG tags (cheerio)          │
    │  → return { image, title, desc }    │
    ├─────────┤
    │ SSR renders pages using             │
    │ HN Firebase API directly            │
    └─────────┘
         │
    ┌────▼──────────────────────┐
    │ HN Firebase API           │
    │ hacker-news.firebaseio.com│
    └───────────────────────────┘
```

---

## Estimated Steps Summary

| Step | Description | Scope |
|------|-------------|-------|
| 1 | Scaffold Nuxt 3 project | Project setup |
| 2 | Layout and core UI shell | UI foundation |
| 3 | HN API composable | Data layer |
| 4 | Story card component | UI components |
| 5 | OG preview image API route | Server API |
| 6 | Wire preview images into cards | Integration |
| 7 | PWA configuration | PWA features |
| 8 | Polish and final touches | UX refinement |
