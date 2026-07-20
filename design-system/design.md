---
name: FIELD Design System
version: 2.0 (single palette; v1 retired)
type: reference
tags: [design-system, tokens, military, derived-palette]
source: raw/images/ via scene-label.html + extract-palette.sh
---

# FIELD — a military design system

A design system built alongside the Joseph Mora image corpus. **No image was
ever viewed by a model** — all colour work is ImageMagick histogram analysis.

> **Provenance correction (supersedes v1's claim).** Earlier versions of this
> document said the palette was *"measured, not chosen"* from the corpus. **That
> claim was false and has been withdrawn.** See [What is and isn't
> derived](#what-is-and-isnt-derived) — it is the most important section here.

Consuming files: [`tokens.css`](tokens.css) (the source of truth),
[`index.html`](index.html) (living specimen).
**How this was built, including the method that failed: [`BUILD.md`](BUILD.md).**

## What is and isn't derived

The original method — quantize each image to 8 colours, area-average across the
corpus — was tested against its own null hypothesis and **failed**:

| test | result |
|---|---|
| Same extraction run on the **63 photos we discarded** (screenshots, a Chris Pratt stage photo) | Produced the *same* palette: olive `#545135` vs `#545334`, khaki `#97916F` vs `#98936E`, coyote `#8A7765` vs `#8B7664` |
| Total-variation distance, curated corpus vs junk | **0.110** — ~89% identical |
| Raising quantization 8 → 25 colours | TVD 0.117 → 0.110 — **no improvement** |
| Chromatic analysis (the sky/blue "accent" finding) | sky/blue leads the **junk** too: 36% of images vs 35% — artifact |

**Why:** area-averaging quantized colour over ~100 photographs converges on the
universal photographic mean — every photo has highlights, shadows and midtones.
*"Olive drab", "khaki" and "coyote" are simply what desaturated photographic
midtones look like.* They read as military because we gave them militaria names.
Any 100 photos would produce them.

**What IS derived — the environment axis.** 99 stills were hand-labelled in
[`raw/images/scene-label.html`](../raw/images/scene-label.html) on **two axes**
— terrain and light, kept separate because "evening desert" is both, and forcing
one label was what starved the dusk group. Every terrain group is strongly
distinct from the rest of the corpus, at 3–4× the corpus-vs-junk null (0.110):

| terrain | n | TVD vs rest | signature | over-rep | in tokens.css | Δ |
|---|---|---|---|---|---|---|
| jungle | 53 | 0.343 | `#7C9A58` | **47.9×** | `--field-green` `#728E58` | 29 |
| desert | 28 | 0.430 | `#9E876B` | 4.3× | `--khaki` `#9D906C` | 18 |
| urban | 13 | 0.344 | `#7D8CAC` | 22.0× | **new env, added** | — |
| indoor | 5 | 0.412 | — | — | too thin to ship | — |

Two things follow. **Real labels beat regex-guessed ones by an order of
magnitude** — the jungle signature went from 4.9× to 47.9× once a human, not a
keyword match, said what each photo was. And the derivation **confirms the values
already shipped**: v1's env axis was right, just not for the reason v1 claimed.

**`urban` is a genuinely new environment** the system never had (Thai city, the
faux-Arab rooftop training towns, cityscapes) — better evidenced than the `dusk`
env that already shipped at n=7.

**The two-axis split did not rescue dusk.** It's still n=7; there simply aren't
many dusk photos and no labelling scheme conjures data. What it *did* do is stop
dusk stealing photos from terrain (desert 21→28, jungle 33→53) — which is where
the 47.9× came from.

## Provenance

| | |
|---|---|
| Corpus | 99 palette-flagged stills, every one hand-labelled for terrain + light |
| Method | `magick` histograms → **contrast between human-labelled groups**. The colour-mass heuristic is removed: it was content-blind. |
| Backbone | **Design decisions.** Not derived — see above |
| Accent | **Design decision**: `--rust` `#AC4D3A`. `--critical` moved to `#D9342B` to resolve the Δ9 collision. |
| Environment axis | **Derived** from human scene labels via `scene-label.html` (jungle n=53, desert n=28, urban n=13; dusk n=7 pending the video pass) |
| Contrast floor | WCAG AA for all text/surface pairs; body text AAA (validated) |
| Reproduce | [`extract-palette.sh`](extract-palette.sh) → [`analysis/`](analysis/) |

## Architecture — two independent axes

Composed on the root element, e.g. `<html data-theme="dark" data-env="dusk">`.

- **`data-theme`** — `dark` (tactical console, default) · `light` (field manual).
  Drives grounds, surfaces, text. Falls back to `prefers-color-scheme` when unset.
- **`data-env`** — `field` (default) · `jungle` · `desert` · `dusk` · `urban` · `army`.
  Sets the environment signature `--env` and, in dark mode, tints the deep
  ground. Light mode stays neutral paper; env colors only the signature.
  `army` is the exception — see [Army env](#army-env-official-brand).

**Rule:** components consume *semantic* tokens only (`--bg`, `--surface`,
`--text`, `--accent`, `--go`…). Never reference a primitive (`--olive`,
`--rust`) directly in a component — that breaks theming.

## The design decisions (and why they're labelled as such)

**Accent — `--rust` `#AC4D3A`.** A choice, not a measurement. The corpus cannot
justify any accent: it contains almost no saturated colour, and every candidate
that looked "earned" turned out to lead the discarded junk too. Rust is kept
because it suits an earth-tone system and reads as brand rather than alarm.

**Critical — `#D9342B`, moved.** This fixes a real bug: the old `--critical`
`#B04A38` sat **Δ9 from the rust accent** — the CTA button and the critical alert
were the same colour, violating this system's own rule that status must never
equal the accent. Since rust is the brand accent, critical moved instead: now
Δ93, with a deliberate saturation jump (rust `.50` → critical `.70`). Rust reads
earthy; critical reads alarm. Red-means-danger stays a convention the corpus has
no authority over.

**Backbone neutrals.** Design values. The junk we discarded produces the same
ones, so there is no honest basis to claim otherwise — or to change them.

**Dusk env — held at v1 values.** Only 7 labelled stills. Under-sampled until the
video pass; the derived signature (`#7D8CAC`) is noted but not applied.

**Indoor (n=5)** — too thin to ship as an env.

## Primitive palette

Names follow militaria. These are **design values**, not measurements (see
[What is and isn't derived](#what-is-and-isnt-derived)); the env-signature
subset is the part contrastive analysis confirms.

| Token | Hex | Token | Hex | Token | Hex |
|---|---|---|---|---|---|
| `--paper` | #F6F7F8 | `--olive` | #4E5B34 | `--khaki` | #9E876B |
| `--stone` | #BBC0BD | `--olive-deep` | #242B22 | `--coyote` | #8D7359 |
| `--ash` | #9FA39A | `--fatigue` | #384735 | `--sand` | #CBB49A |
| `--field-grey` | #616259 | `--moss` | #5F6856 | `--brass` | #C2A962 |
| `--slate-char` | #3B3E3D | `--field-green` | #7C9A58 | `--loam` | #443B32 |
| `--ink` | #21221F | `--sage` | #929D6B | `--dusk-navy` | #2E3953 |
| `--night` | #151614 | `--flare` | #A1C158 | `--signal-blue` | #5E6D99 |
| `--rust` | #AC4D3A | `--rust-bright` | #C25B44 | `--slate-blue` | #7090B7 |
| `--ember` | #A75A4B | `--clay` | #8C4030 | | |

## Semantic tokens

| Token | Dark (default) | Light | Role |
|---|---|---|---|
| `--bg` | #1B1C19 | #E7E8E2 | page ground (env-tinted in dark) |
| `--surface` | #24251F | #F4F5F0 | panels, cards |
| `--surface-2` | #2C2D26 | #FBFBF7 | raised header/footer of a panel |
| `--surface-sunk` | #191A16 | #DEDFD7 | inputs, wells |
| `--border` | #3A3C35 | #CFD0C6 | hairlines |
| `--border-strong` | #4C4E45 | #B4B6A9 | input borders, ghost buttons |
| `--text` | #E8E9E3 | #22231E | body (AAA) |
| `--text-dim` | #A2A79A | #565A4E | secondary (AA) |
| `--text-mute` | #8B9080 | #6A6E60 | labels/captions (AA) |
| `--accent` | `--rust` #AC4D3A | same | primary action / CTA — a design choice |
| `--on-accent` | #F7EDE9 | #FBF3F0 | text on accent |
| `--env` | per `data-env` | per `data-env` | environment signature |
| `--focus` | `--slate-blue` | `--slate-blue` | focus ring |

### Operational status — separate from the accent

Status color must never equal the CTA accent, so an alarm never reads as a
button. Each has a solid, an `-fg` for text on it, and a `-ghost` tint for pills.

| Token | Value | Meaning |
|---|---|---|
| `--go` | #7C9A5B (field-green) | nominal / cleared |
| `--caution` | #C2A962 (brass) | degraded / watch |
| `--critical` | #D9342B (signal red, Δ93 from the accent) | fault / stop |
| `--info` | #7090B7 (slate-blue) | advisory |

## Environment overrides (`data-env`, dark mode)

| env | `--env` | `--bg` | `--surface` |
|---|---|---|---|
| field | #616259 | #1B1C19 | #24251F |
| jungle | #7C9A58 | #171C15 | #1F251B |
| desert | #9E876B | #1F1B15 | #28231B |
| dusk | #5E6D99 | #14161D | #1C1F28 |
| urban | #7D8CAC | #161A20 | #1E2229 |

## Army env (official brand)

`data-env="army"` is **not** measured from the corpus. It is sourced verbatim from
the **U.S. Army Brand Guidelines V1.0 (March 2023)**. Unlike the corpus envs, it also
overrides `--accent` and the status set, because the brand mandates its own accent
(Army Gold) and its signature pairing — *gold typography on Army Black*.

| Brand token | Hex | PMS | Role in system |
|---|---|---|---|
| Army Black | #221F20 | Black 3 C | dark `--bg` |
| Army Gold | #FFCC01 | 123 C | `--accent` + `--env` (dark) |
| Army Green | #2F372F | 4224 C | `--env` (light) |
| White | #FFFFFF | — | `--text` (dark) |
| Tan | #F1E4C7 | 9184 C | light `--bg` |
| Field 01 | #727365 | 416 C | `--info` (light), mutes |
| Field 02 | #BFB8A6 | 7535 C | `--text-dim` (dark) |
| Gray 01 | #565557 | Cool Gray 11 C | borders, `--text-dim` (light) |
| Gray 02 | #D5D5D7 | Cool Gray 3 C | `--info` (dark) |
| Highlight Orange | #F16521 | 7579 C | `--caution` |
| Highlight Green | #2DAA27 | 2257 C | `--go` |
| Highlight Red | #CF0000 | 185 C | `--critical` |

Dark = gold-on-black tactical console (bg #221F20). Light = brand-approved
black-on-Tan paper (bg #F1E4C7), green signature. No gradients (brand rule).
Contrast: gold-on-black ≈ 10.9:1, white-on-black ≈ 18:1, black-on-Tan ≈ 13:1 — all AA+.

The brand's proprietary **G.I.** typeface is not publicly licensable, so the system
keeps **B612** here for consistency; only the palette is authentically Army.

## Typography — B612

**B612** (display/body) + **B612 Mono** (data/labels), commissioned by Airbus
with Intactile DESIGN for cockpit-display legibility, SIL OFL. Self-hosted in
[`fonts/`](fonts/) as TTF — a genuine aviation face, deliberately **not** a
stencil pastiche.

| Token | Value |
|---|---|
| `--font-display` / `--font-body` | `"B612", Helvetica Neue, Arial, system-ui` |
| `--font-mono` | `"B612 Mono", ui-monospace, Menlo` |
| scale | `--step--1` .81 · `--step-0` .94 · `--step-1` 1.1 · `--step-2` 1.45 · `--step-3` 1.95 · `--step-4` 2.6 · `--step-5` clamp→4rem |

Conventions: uppercase + `--track-label` (.18em) for mono labels; headings
`text-wrap: balance`; coordinates/quantities use `--font-mono` +
`font-variant-numeric: tabular-nums`.

## Form language

Crisp, not soft: `--radius` 3px / `--radius-lg` 5px (military UI is rectilinear).
Layout uses flex/grid + `gap`. Wide content scrolls inside `overflow-x:auto`.
Focus is always visible via `--ring`. Respects `prefers-reduced-motion`.

## Reproduce / extend

```sh
bash design-system/extract-palette.sh   # regenerates analysis/ from .corpus.tsv
```
To add an environment: label the scenes in [`raw/images/scene-label.html`](../raw/images/scene-label.html),
rebuild `.corpus.tsv`, rerun `extract-palette.sh`, then add a `:root[data-env="…"]`
block in `tokens.css` and a switch button in `index.html`. Ship an env only if its
group is large enough and its TVD clears the ~0.110 null.
