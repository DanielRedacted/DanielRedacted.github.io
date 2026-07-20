# danielredacted.net

Daniel's personal site, served at **danielredacted.net** from this repo via GitHub Pages. The "Daniel Redacted" persona (redaction blocks, digital rain, monospace) is the style; the engineering substance (AP0110 work, bio, toolbox) is the content.

**Stack:** Astro 5 (static output, `build.format: 'directory'`) · Tailwind CSS v4 (`@tailwindcss/vite`, CSS-first, no config file) · **no React, no framework islands** — the only JS is the vanilla digital-rain canvas and a copy-to-clipboard button.
**Deploy:** `npm run build` → `dist/` → GitHub Pages via `.github/workflows/deploy.yml` (push to `main`). `CNAME` pins danielredacted.net (also `public/CNAME` so it lands in `dist/`).
**Node:** 20 (`.nvmrc`)

```bash
npm run dev      # dev server
npm run build    # static build → dist/ (the gate)
npm run preview  # serve built dist/
```

## Map

```
src/
├── layouts/Base.astro        # head/meta, header nav, optional rain layer (rain prop)
├── styles/global.css         # Tailwind import + persona tokens (--backgroundColor/--color/
│                             #   --high/--medium/--disabled), .redacted, .pane, rain layer
├── fragments/toolbox.html    # legacy toolbox body+styles, extracted verbatim from the 2024
│                             #   hand-written site; injected raw into /toolbox
└── pages/
    ├── index.astro           # persona card + work cards (AP0110, AP0110.ORG, digital-rain.js)
    ├── me.astro              # partially-redacted first-person bio
    ├── contact.astro         # email + socials + QR
    ├── toolbox.astro         # wraps the fragment
    └── 404.astro
public/                       # copied verbatim to dist/
├── CNAME  favicons/  site.webmanifest  images/avatar.jpg  qr/contact.png
└── scripts/digital-rain.js   # Daniel's own vanilla-JS Matrix rain (MIT); loaded by Base
```

## Brand and voice

- **Own persona brand — NOT the AP0110 design system.** Never import AP0110 chrome, tokens, Kunst Grotesk, or the byte-identical shared-file rule from the .com/.org repos. Dark/light follows `prefers-color-scheme`; the tokens in `global.css` carry over from the 2024 site.
- **Voice:** first person, direct, opinionated — this surface sits *above* the corporate voice in the voice hierarchy. Operative rules:
  - Building-not-racing framing; name the human actor, never "AI is doing X".
  - Empathy-first: lead from what people are up against, not self-promotion.
  - The full voice brief (including the never-publish list) is maintained privately — when in doubt, leave it out.
- **The redaction rule:** the persona masks *identifiers*, never the substance of claims. New bio copy keeps real accomplishments readable and redacts only the identifying nouns.

## Copy rules

- "AP0110" always capitalized exactly like that (site-wide monospace already satisfies the mono rule).
- **No em-dashes** anywhere in rendered copy or metadata. Grep `—` before finishing.
- No visible "last updated" dates in the UI.

## Watch out

- Static export only — no SSR, no API routes.
- The rain block in `Base.astro` is emitted via `set:html` on purpose: expression children inside `<script>` get HTML-escaped by Astro. Keep it that way.
- `digital-rain.js` sizes its canvas from the canvas's *parent* — the `.rain-layer` wrapper must stay a fixed, viewport-sized box.
- `src/fragments/toolbox.html` is legacy hand-written HTML (inline styles, `onclick="window.open(...)"` cards). Treat it as data: edit entries in place, don't try to modernize it wholesale unless asked.
- Rain respects `prefers-reduced-motion` — don't remove that check.
- **The human commits, not the agent.** Finish by handing Daniel a ready-to-run git command.
