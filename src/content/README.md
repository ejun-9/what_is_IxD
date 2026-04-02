# Content sync (case study)

## Case study

**Canonical file:** [`case-study.json`](./case-study.json)

1. **Treat this JSON as the source of truth** for the case study section on the site.
2. **`lead`** — short intro under the chapter title. **`leadHighlights`** — optional list (`label` + `text`) for key facts (e.g. user, cohorts, cohort builders). **`leadImage`** — optional `{ "src": "/images/...", "alt": "..." }`; place assets under `public/images/`.
3. **`beats[]`** — one block per slide or section (`kicker`, `title`, `body`). Optional **`plain: true`** removes the card border; optional **`figures`** is an array of `{ "src", "alt" }` for SVGs under `public/` (scroll-zoom applied). Figma Slides can’t be exported via API — replace `public/images/case-study/slide-node-*.svg` with your own exports if you want pixel match.

The site imports this file in [`profile.ts`](./profile.ts); you do not duplicate case study text elsewhere in code.

## Why not auto-import from Figma?

Figma doesn’t expose Slides text in a reliable way for this repo. Keeping `case-study.json` in Git gives you version history and a simple workflow.
