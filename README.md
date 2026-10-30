# SnipWise website

The launch site for [SnipWise](https://snipwise.akshitbhandari.codes), a clipboard manager for Windows that keeps everything you copy so you can search it, convert it and paste it back in a keystroke.

## Stack

- [Next.js 16](https://nextjs.org) (App Router, Turbopack) and React 19
- Tailwind CSS v4
- GSAP with ScrollTrigger for the scroll stories, Lenis for smooth scrolling
- Phosphor and mochi-icons for icons

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
```

Production build:

```bash
npm run build
npm start
```

The build needs more memory than Node's default on some machines. If it runs out, raise the heap:

```bash
NODE_OPTIONS=--max-old-space-size=8192 npm run build
```

## Where things live

| Path | What it holds |
|---|---|
| `content/site.ts` | Launch settings: site URL, release repo and installer name, version, SHA-256, social and sponsor links, "coming soon" flags |
| `content/copy.ts` | Page copy, the comparison table and the FAQ |
| `content/features.ts` | The feature gallery entries |
| `components/` | One file per page section (`Hero`, `UseCases`, `Compare`, `Privacy`, `Download`, `Faq`, …) |
| `components/desks/` | The interactive demo desks (developer, designer, writer) |
| `components/pal/PalGuide.tsx` | The pixel pal that travels down the page |
| `lib/` | Shared GSAP setup, the converters used by the demos, and the in-page clip store |
| `app/globals.css` | Design tokens for light and dark mode |

## Before a release

1. Update `site.release.version`, and set `site.release.sha256` to the installer's SHA-256 once the release is published.
2. Make sure the release repo in `site.release.repo` is public and its latest release has an asset named `site.release.asset`. The download button links to `/releases/latest/download/<asset>`.

## Feature videos

`VIDEO-SHOTLIST.md` has the recording brief for each feature clip.
