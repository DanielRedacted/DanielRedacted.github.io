# danielromo.org

Daniel Romo's personal site, served at **danielromo.org** from this repo via GitHub Pages.
The FIELD system (B612 type, aerospace-orange accent, dot grid, black-block wordmark) is the
style; the engineering substance (AP0110 work, the node, garage, library, toolbox) is the
content. The old "Daniel Redacted" redaction motif is **retired**: no censor bars, no `████`,
real surname in copy and titles. (Repo and social handles still say DanielRedacted; renames
are a separate, undecided task.)

**Stack:** Astro 5 (static output, `build.format: 'directory'`) · Tailwind CSS v4 (`@tailwindcss/vite`, CSS-first, no config file) · `@astrojs/sitemap` · **no React, no framework islands** — page scripts are vanilla (globe canvas, cert/gallery dialogs, garage `<model-viewer>` swaps).
**Deploy:** `npm run build` → `dist/` → GitHub Pages via `.github/workflows/deploy.yml` (push to `main`). `CNAME` pins danielromo.org (also `public/CNAME` so it lands in `dist/`).
**Node:** 20 (`.nvmrc`)

```bash
npm run dev      # dev server
npm run build    # static build → dist/ (the gate)
npm run preview  # serve built dist/
```

## Map

```
src/
├── layouts/Base.astro        # head/meta, header wordmark + topnav (compute/toolbox/library/garage,
│                             #   aria-current from Astro.url.pathname)
├── components/
│   ├── Globe.astro           # hero globe: d3-geo orthographic canvas, drag + auto-spin;
│   │                         #   places from src/data/places.js, atlases in public/data/
│   │                         #   (refetch: scripts/fetch-globe-data.sh, verify: scripts/check-globe-data.mjs)
│   ├── BookLedger.astro      # /library filterable ledger
│   └── Icon.astro  Mark.astro  AltPair.astro
├── styles/global.css         # Tailwind import + FIELD tokens (light-only), .pane, .wordmark, .topnav
├── fragments/toolbox.html    # legacy toolbox body+styles, extracted verbatim from the 2024
│                             #   hand-written site; injected raw into /toolbox
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
    ├── invite.astro          # structured invite form
    ├── toolbox.astro         # wraps the legacy fragment
    └── 404.astro
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
- **Voice:** first person, direct, opinionated — this surface sits *above* the corporate voice in the voice hierarchy. Operative rules:
  - Building-not-racing framing; name the human actor, never "AI is doing X".
  - Empathy-first: lead from what people are up against, not self-promotion.
  - The full voice brief (including the never-publish list) is maintained privately — when in doubt, leave it out.
- **The disclosure rule:** institutions and artifacts are named and linked — every claim
  should be verifiable by a stranger. Some personal identifiers stay off the site.

## Copy rules

- "AP0110" always capitalized exactly like that, in `.mono`.
- **No em-dashes or en-dashes** anywhere in rendered copy or metadata. `npm run check` greps
  `src/pages`, `src/layouts`, `src/components` for both and runs automatically before `build`.
- No visible "last updated" dates in the UI.
- Contact surface: `me@danielromo.org` (plain text in the footer) · LinkedIn · `/invite`.
  The socials rows in `index.astro` are deliberately commented out until the handle
  question is settled; don't un-hide them unasked.

## Watch out

- Static export only — no SSR, no API routes.
- `src/fragments/toolbox.html` is legacy hand-written HTML (inline styles, `onclick="window.open(...)"` cards). Treat it as data: edit entries in place, don't try to modernize it wholesale unless asked.
- `public/3d/` is ~47 MB of glTF; only `/garage` loads it. Don't reference `<model-viewer>` from other pages.
- **The human commits, not the agent.** Finish by handing Daniel a ready-to-run git command.
