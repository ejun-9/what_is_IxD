# Interactive infographic

Personal scroll story built with **Next.js** (App Router), **Tailwind CSS**, and **Framer Motion**—editorial layout with scroll-linked zoom and `prefers-reduced-motion` support.

## Develop

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Content

- Most copy lives in [`src/content/profile.ts`](src/content/profile.ts). Add a portrait by setting `hero.portraitSrc` to a path under `public/` (e.g. `/images/portrait.jpg`) in `public/images/`.
- **Case study (Part five):** edit [`src/content/case-study.json`](src/content/case-study.json) (`beats[]` = one card per slide or section). See [`src/content/README.md`](src/content/README.md). The case study is behind a client-side password gate (default `lucaiscute`; override with env **`NEXT_PUBLIC_CASE_STUDY_PASSWORD`** on Vercel). Unlock state is stored in `sessionStorage` for the browser tab.

## Deploy on Vercel

1. Push this folder to a GitHub repository.
2. In [Vercel](https://vercel.com/new), **Import** the repository.
3. Use the default settings: **Framework Preset** Next.js, **Root Directory** the repo root (or this project if the repo is monorepo).
4. Deploy. Vercel runs `next build` automatically.

No `vercel.json` is required for a standard static export of this app.

## Scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm run start` — serve production build locally
- `npm run lint` — ESLint
