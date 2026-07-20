---
name: How the FIELD design system was built
type: reference
tags: [design-system, provenance, method, methodology-failure]
---

# How this design system was built

The honest record of the method, including the part that failed. Read
[`design.md`](design.md) for *what* the system is; this is *how it got here* and
*why it claims so much less than it originally did*.

**The one-line version:** a palette was extracted from a photo corpus, the
extraction was tested against its own null hypothesis, it failed, and what
survived was smaller and true — the environment axis, derived from human scene
labels, plus design decisions that are now labelled as design decisions.

## Constraints that shaped everything

1. **No model ever viewed the images.** Every colour figure here comes from
   ImageMagick histograms. The corpus is unsanitized (OPSEC), so the images were
   processed, never looked at.
2. **The human is the eyes.** Anything requiring sight — what a photo *is*, who's
   in it, whether it's junk — came from purpose-built local UIs, never a guess.
3. **Local only.** No hosted artifacts; everything renders from `file://`.

## The pipeline

```
raw/images/{photos,live-photos,videos}     ← source media
        │
        ├─ build-index.sh          HEIC→JPEG, MOV→animated WebP, EXIF/GPS →  INDEX.md
        │                          + joins the human record into INDEX.md
        ├─ make-annotator.sh       generates annotate.html    ──►  annotations.json
        ├─ make-scene-labeler.sh   generates scene-label.html ──►  scene-labels.json
        │
design-system/
        └─ extract-palette.sh      annotations.json + scene-labels.json
                                     → .corpus.tsv → analysis/ → informs tokens.css
```

**Irreplaceable (never delete):**
| file | why |
|---|---|
| `raw/images/annotations.json` | hand-typed descriptions, OPSEC flags, palette flags |
| `raw/images/scene-labels.json` | hand-labelled terrain + light + write-ins |
| `raw/images/.metadata-cache.tsv` | video capture dates — the source `.mov`s are gone; **WebP cannot store them**, so this sidecar is the only copy |
| `raw/images/INDEX.md` | human-readable copy of all of the above |

Everything else regenerates. `annotate.html`, `scene-label.html`, `.corpus.tsv`
and `analysis/` are artifacts — deleted, rebuildable by their scripts.

## Stage 1 — media conversion

94 HEIC → JPEG (q95, EXIF preserved) and 76 MOV → animated WebP (full res/fps).
Originals deleted only after verifying a non-empty output. Lessons paid for:

- **ffmpeg silently eats stdin** and swallowed the `while read` file list. `-nostdin`.
- **macOS ships bash 3.2** — no associative arrays.
- **A tab `IFS` collapses empty fields**, shifting every column right whenever a
  photo lacked EXIF. Parse with `\037` (unit separator), a non-whitespace delimiter.
- **ffmpeg cannot decode animated WebP** at all; ImageMagick decodes *every frame*
  even for `[0]`. Frame extraction needs `webpmux -get frame` + `dwebp`.
- **Animated WebP has no inter-frame compression.** A 23 MB clip became 464 MB;
  the folder went 856 MB → 6.9 GB. Inherent to the format, not a bug.
- Scope conversion to the media dirs explicitly. A `find .` from the root once
  swept an archive folder and converted originals that were meant to be untouched.

## Stage 2 — the human passes

Two local, keyboard-driven, `file://` UIs. Both autosave to `localStorage` and
export JSON; both take an Import so work merges across sessions.

**`annotate.html`** — one line of description, general location, *Joseph in
frame?*, *others in frame?* (drives the censor pass), and a *palette* flag
(default on, untick junk). Deliberately the minimum that needs eyes: captions,
alt text and geocoding are all derivable from those.

**`scene-label.html`** — terrain and light as **two independent axes**, plus a
write-in. Two axes because a single label forced "evening desert" to choose, and
that starved the dusk group. Suggestions were offered only from the annotator's
*own words*, never from colour — seeding labels with a discredited heuristic
would launder its errors into the one signal that works.

Results: 163 annotated records; 100 palette stills labelled; 15 write-ins.

## Stage 3 — the method failure (the important part)

The system originally claimed its palette was **"measured, not chosen"** from the
corpus. That claim was tested and **it did not survive**.

| test | result |
|---|---|
| Same extraction over the **63 photos we discarded** (screenshots, a Chris Pratt stage photo) | **The same palette.** olive `#545135` vs `#545334`, khaki `#97916F` vs `#98936E`, coyote `#8A7765` vs `#8B7664` |
| Total-variation distance, corpus vs junk | **0.110** — ~89% identical |
| Quantization 8 → 25 colours | TVD 0.117 → 0.110 — **no improvement** |
| "Sky is the earned accent" (8.13 mass, 35% of images) | sky leads the **junk** too: 36% — artifact |
| "Dark red is 26.7× over-represented" | collapses to **3.0×** at k=25 — a quantization artifact |

**Why:** area-averaging quantized colour over ~100 photographs converges on the
universal photographic mean. Every photo has highlights, shadows and midtones.
*"Olive drab", "khaki" and "coyote" are simply what desaturated photographic
midtones look like* — they read as military because we gave them militaria names.
Any 100 photos would have produced them.

**Three separate "findings" evaporated under scrutiny** (rust recurring in every
cluster; sky being earned; the 26.7× dark red). That pattern *was* the verdict on
the method. The tell was noticed by the user, not the analysis: *"the palette
doesn't seem changed enough to be truly derived, given I added and excluded
photos."* Correct — it never could change, because it was never measuring the
photos.

**Method note worth keeping:** an extraction that cannot distinguish your corpus
from your trash is not measuring your corpus. That null test costs minutes and
should have been the first thing run, not the last.

## Stage 4 — what actually survived

Contrast **between human-labelled groups** is real and strong, because a human
said what each photo was; the histogram never knew.

| terrain | n | TVD vs rest | signature | over-rep | vs shipped token | Δ |
|---|---|---|---|---|---|---|
| jungle | 53 | 0.343 | `#7C9A58` | **47.9×** | `--field-green` `#728E58` | 29 |
| desert | 28 | 0.430 | `#9E876B` | 4.3× | `--khaki` `#9D906C` | 18 |
| urban | 13 | 0.344 | `#7D8CAC` | 22.0× | *new env* | — |
| indoor | 5 | 0.412 | — | — | too thin to ship | — |

Null reference: corpus-vs-junk **0.110**. Every terrain clears it 3–4×.

- **Real labels beat regex-guessed ones tenfold** — jungle went 4.9× → 47.9× once
  a human, not a keyword match, said what each photo was. The labelling UI was the
  highest-leverage thing built.
- **The derivation confirmed the shipped values.** The env axis was right all
  along — just not for the reason originally claimed.
- **The two-axis split didn't rescue dusk** (still n=7 — there simply aren't dusk
  photos). What it did was stop dusk *stealing* from terrain: desert 21→28,
  jungle 33→53. That's where the 47.9× came from.

## Stage 5 — the design decisions, labelled as such

The corpus cannot justify an accent: it contains almost no saturated colour.
So the accent is a **choice**, and says so.

**The real bug it fixes:** `--accent` `#AC4D3A` sat **Δ9 from `--critical`
`#B04A38`** — the CTA button and the critical alert were the same colour,
violating the system's own rule that status must never equal the accent. Since
rust is the brand accent, **critical moved** to `#D9342B` (Δ93), with a
deliberate saturation jump (rust `.50` → critical `.70`): rust reads earthy and
branded, critical reads alarm. That ordering is also semantically right — an
alarm should be more urgent than a button.

Status colours are **not** re-derived. Red = danger and amber = caution are
safety conventions; a photo corpus has no authority over them.

Backbone neutrals are design values. The junk produces the same ones, so there's
no honest basis to claim otherwise — or to change them.

## Reproducing

```sh
bash raw/images/build-index.sh          # convert + index + join the human record
bash raw/images/make-annotator.sh       # regenerate annotate.html
bash raw/images/make-scene-labeler.sh   # regenerate scene-label.html
bash design-system/extract-palette.sh   # human input → .corpus.tsv → analysis/
```

All are idempotent and bash-3.2 safe. `extract-palette.sh` **skips** any image
without a human label rather than guessing — the colour heuristic is gone, not
disabled.

## If you extend this

- **Ship an env only if it clears the null.** Group large enough, TVD well above
  ~0.110. `dusk` (n=7) and `indoor` (n=5) are held back for exactly this reason.
- **Label more dusk.** 61 videos are still unlabelled, and evening footage is
  where dusk data would come from.
- **Never let a heuristic label anything.** Blank beats a guess: an unlabelled
  image sits out, a wrong label corrupts the only derived part of the system.
- **Test any new claim against the junk** before believing it.
