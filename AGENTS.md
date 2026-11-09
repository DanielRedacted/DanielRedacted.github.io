# danielromo.org

Daniel Romo's personal site, served at **danielromo.org** from this repo via GitHub Pages.
The FIELD system (B612 type, aerospace-orange accent, dot grid, black-block wordmark) is the
style; the engineering substance (AP0110 work, the node, garage, library) is the
content. The old "Daniel Redacted" redaction motif is **retired**: no censor bars, no `████`,
real surname in copy and titles. (Repo and social handles still say DanielRedacted; renames
are a separate, undecided task.)

**Stack:** Astro 5 (static output, `build.format: 'directory'`) · Tailwind CSS v4 (`@tailwindcss/vite`, CSS-first, no config file) · `@astrojs/sitemap` · **no React, no framework islands** — page scripts are vanilla (globe canvas, cert/gallery dialogs, garage `<model-viewer>` swaps).
**Deploy:** `npm run build` → `dist/` → GitHub Pages via `.github/workflows/deploy.yml` (push to `main`). `CNAME` pins danielromo.org (also `public/CNAME` so it lands in `dist/`).
**Node:** 20 (`.nvmrc`)

**Branch `simple`:** the homepage is one business-card "brick", ink on paper (`global.css` → "Brick"; script `components/LoadSequence.astro`). It borrows AP0110.com's micrographics *idiom* (micro-labels, hairline `.ctl` controls, labels typing in on load) but keeps FIELD tokens and B612 Mono, so no AP0110 files, fonts or colors. Org icons render as ink through a CSS mask (`.org-icon`; the LII hand uses `lii-icon-ink.png`, an alpha cut of `lii-icon.png`). A miniature RSVP reader (`.rsvp`, script at the bottom of `index.astro`) plays one prayer on repeat, picked at random per load from `PRAYERS` (Franklin's 1768 Lord's Prayer, then Jesus' own Gospel prayers, KJV, red-letter words only); its words come from `.rsvp-static`, which no-JS and reduced-motion visitors see as plain text. A full-width hero quote with citation is picked at random per load from `QUOTES` by an inline script, so LoadSequence types in the right citation. Home is brick-only; the other pages are unchanged and linked from the card. `dotorg` holds the full homepage.

```bash
npm run dev      # dev server
npm run build    # static build → dist/ (the gate)
npm run preview  # serve built dist/
```

## Map

```
src/
├── layouts/Base.astro        # head/meta, header wordmark (topnav temporarily hidden, kept as a comment)
├── components/
│   ├── Globe.astro           # hero globe: d3-geo orthographic canvas, drag + auto-spin;
│   │                         #   places from src/data/places.js, atlases in public/data/
│   │                         #   (refetch: scripts/fetch-globe-data.sh, verify: scripts/check-globe-data.mjs)
│   ├── BookLedger.astro      # /library filterable ledger
│   └── Icon.astro  Mark.astro  AltPair.astro
├── styles/global.css         # Tailwind import + FIELD tokens (light-only), .pane, .wordmark, .topnav
├── data/                     # books.js · places.js · terrain.js · tools.js (generated: scripts/gen-tools.sh)
└── pages/
    ├── index.astro           # hero (linked bio paragraph, cert chips, globe) + project cards
    │                         #   (CalCompute, UNA-USA, LII, AP0110, node) + garage cards +
    │                         #   library shelf + gallery + friends + footer contact
    ├── compute.astro         # /compute: BLUF textbook on the private/community node, 5 chapters
    │                         #   / 16 sections driven by the `chapters` array in its frontmatter
    │                         #   (nav + numbering + sec-heads all render from it via head())
    ├── garage.astro          # cars + FSAE: <model-viewer> stage, per-car story sections
    ├── library/index.astro   # ledger page; library/[slug].astro per-book field notes
    ├── invite.astro          # noindex stub forwarding old /invite links to /#contact
    └── 404.astro
functions/api/form.js         # Pages Function: POST /api/form → D1 `submissions` (schema.sql, wrangler.jsonc)
public/                       # copied verbatim to dist/
├── CNAME  robots.txt  favicons/  site.webmanifest  images/  photos/gallery/  posters/
├── 3d/                       # glTF models for /garage (largest asset tree by far)
├── data/  fonts/  qr/contact.png
└── scripts/digital-rain.js   # Daniel's own vanilla-JS Matrix rain (MIT); no longer loaded
                              #   by any page, kept as an artifact
```

## Brand and voice

- **Own FIELD brand — NOT the AP0110 design system.** Never import AP0110 chrome, tokens,
  Kunst Grotesk, or the byte-identical shared-file rule from the .com/.org repos. Light-only
  (`color-scheme:light` in `global.css`).
- **Voice:** first person, direct, opinionated — this surface sits *above* the corporate voice in the voice hierarchy (canonical brief: the `Daniel Personal Voice` surface page in the private AP0110-Wiki). Operative rules copied here:
  - Building-not-racing framing; name the human actor, never "AI is doing X".
  - Empathy-first: lead from what people are up against, not self-promotion.
  - Never publish: internal strategy/COI material, pre-AP0110 company names, founding dates.
  - Daniel's CalCompute title, **"Director, UC CalCompute Coalition"** (corrected from "President" by Daniel, 2026-08-09), is published on THIS site only (hero + CalCompute card). Never propagate it to AP0110.com/.org, CaliforniaCompute.org, or profile READMEs (COI mitigation).
- **The disclosure rule (replaces the old redaction rule):** institutions and artifacts are
  named **and linked** — every claim should be verifiable by a stranger. Stays off the site:
  home city/neighborhood, the family business name, family members.
- Facts about AP0110/Daniel must be grounded in the private AP0110-Wiki (workspace-level concern; see the coordination `AGENTS.md` one level up if working in the full workspace).

## Copy rules

- "AP0110" always capitalized exactly like that, in `.mono`.
- **No em-dashes or en-dashes** anywhere in rendered copy or metadata. `npm run check` greps
  `src/pages`, `src/layouts`, `src/components` for both and runs automatically before `build`.
- No visible "last updated" dates in the UI.
- Contact surface: `me@danielromo.org` (plain text in the footer) · LinkedIn · the homepage **Contact me** section (`/#contact`), opened by the mail icon in the socials row: a disclosure hung below the card (it never moves the card; space below it = space above the card), like AP0110.com's FAQ, with a message + reply-to email form that natively POSTs to `/api/form` and lands on `/#sent`.
- **Temporarily hidden** (unlinked, still built and in the sitemap): `/library`, `/lii`, `/compute`, `/garage`. The homepage LII entry links out to lifeimpactintl.org.
  The socials rows in `index.astro` are deliberately commented out until the handle
  question is settled; don't un-hide them unasked.

## Watch out

- Static export only — no SSR. The one runtime piece is `functions/api/form.js`, a Cloudflare Pages Function: it only runs once the site deploys on Cloudflare Pages (GitHub Pages ignores it, so `/api/form` 404s there).
- `public/3d/` is ~47 MB of glTF; only `/garage` loads it. Don't reference `<model-viewer>` from other pages.
- **The human commits, not the agent.** Finish by handing Daniel a ready-to-run git command.
