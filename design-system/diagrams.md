---
name: FIELD Diagrams
version: 1.0
type: reference
tags: [design-system, diagrams, compute-page, animation]
source: decisions made building the mesh-radio diagram, its field-map layer, the resilience power chart, the satellite-downlink diagram, the weather-station schematic, and the amateur-radio-relay diagram, 2026-08
---

# FIELD diagrams — the /compute section-diagram system

Rules for technical diagrams on the compute page, distilled from building the
mesh-radio diagram (section 01), extending its mesh layer onto the field-map
hero, building the resilience power chart (section 05), the satellite-downlink
diagram (section 03), the weather-station schematic (section 04), and the
amateur-radio-relay diagram (section 02). Every rule below was decided during that
work; nothing here is speculative. The diagrams are the reference
implementations — where a rule needs an example, look there, not in this file.

**Three kinds of surface.** A *scene* diagram draws a place (the mesh diagram,
the relay diagram, the satellite diagram, the field map): terrain, glyphs,
geography. A *chart*
diagram draws a quantity over time (the power chart). A *schematic* draws where
a thing goes (the weather-station diagram): blocks, pipes, a boundary. Every
rule below applies to all three unless it says otherwise; where they differ, the
difference is called out in place.

> **Status, 2026-09-05.** Only two of these diagrams are on the page: `#mesh-radio`
> (`meshTraffic`, `.meshdiagram`) and `#satellite-downlink` (`satPass`,
> `.satdiagram`). The relay, weather-station and power surfaces never had a
> `<figure>` in the markup, so their engines, geometry and style blocks were dead
> code and were removed from `compute.astro` during the BLUF rewrite. Their rules
> below still hold and are kept deliberately: they are the specification to build
> against if any of the three is drawn. `src/data/relay-terrain.js` went with them;
> `scripts/gen-relay-terrain.mjs` stays and regenerates it.

Reference implementations, all in
[`src/pages/compute.astro`](../src/pages/compute.astro): the `#mesh-radio`
figure with the `meshTraffic` engine and the `.meshdiagram` style block; the
`#resilience` figure with its sweep script and the `.powerdiagram` block, over
the shared day model in [`src/data/solarday.js`](../src/data/solarday.js); the
`#satellite-downlink` figure with the `satPass` engine and the `.satdiagram`
block; the `#weather-station` figure with the `wxPipeline` engine and the
`.wxdiagram` block; the `#amateur-relay` figure with the `relayTraffic` engine
and the `.relaydiagram` block. Terrain generators, one per scene surface:
[`scripts/gen-mesh-terrain.mjs`](../scripts/gen-mesh-terrain.mjs),
[`scripts/gen-relay-terrain.mjs`](../scripts/gen-relay-terrain.mjs) and
[`scripts/gen-sat-terrain.mjs`](../scripts/gen-sat-terrain.mjs).
Shared figure chrome is the `.diagram` class; a new diagram gets
`class="diagram <name>diagram"` and inherits the brackets, the scroller, and the
mono legend type without restating them.

## Placement and chrome

- The diagram leads its section: directly under the `sec-head`, before the
  prose. The prose then explains what the reader has already seen moving.
- Chrome is the HUD corner-bracket idiom on a `<figure>`: two 12px brackets,
  top-left and bottom-right. **No title, no figcaption, no border, no internal
  padding** — the drawing runs to the bracket corners.
- An inner scroller div holds the svg: brackets stay pinned to the figure while
  the drawing scrolls horizontally on narrow screens. The svg gets a min-width
  so its 13px mono text never shrinks below legibility.

## Layers, back to front

1. **Backdrop** — on a scene diagram, real SRTM contours for a random inland
   frame, fetched by a one-off generator per surface (never part of the build),
   coordinates withheld from the committed data. Each surface gets its own
   frame: **never reuse another surface's terrain.** Rendered backmost at
   reduced opacity so it reads as texture, not content; index contours slightly
   heavier. **How far the texture recedes is set by how much standing geometry
   sits over it**, not by one house value: 0.45 carries the mesh diagram, which
   puts a single range ring over its ground, and the relay diagram takes 0.3
   because it puts seven rings and a moving cast over the same area. Tune it
   against the busiest layer the surface will ever carry, not against the
   contours in isolation.
   **A generator's accept test has to be written for its own frame
   size**: the mesh generator only checks that its 28 km frame is dry land,
   because at that size the relief-prone boxes it draws from are relief-prone
   by construction. The relay generator inherited that test, was run at a span
   several times larger, and returned a frame sitting entirely inside a basin,
   95 m of relief and 49 limp contours. It now requires a spread across the
   probe points it was already fetching. Copying a generator means copying an
   assumption about scale along with it. **A chart diagram gets no terrain** — contours under a time axis
   imply a geography the drawing is not about. Its backdrop is whatever the
   subject's own domain already shades: day/night bands on the power chart.
   **Where the mechanism produces the ground, the backdrop stops being a
   backdrop**: the satellite diagram starts with its contours fully masked and
   paints them in under each swath as a pass sweeps it, so the map is built up
   rather than handed over. Such a backdrop is drawn **darker than texture**
   (0.7 against the usual 0.45, and a ramp step down from the other diagrams'
   contour strokes), and it carries a **faint ground wash** under the linework
   so freshly swept ground reads as ground rather than as blank page, and the
   leading edge of a sweep stays visible over featureless terrain. Put the wash
   inside the same masked group as the linework and it inherits the reveal for
   free, off one mask. Give the whole thing a **lifetime**, not just an
   entrance: a strip ages from the moment it is finished until the mechanism
   returns to redraw it, spread evenly across that whole interval rather than
   held and then dropped, so several strips coexist at several ages and the
   drawing says the data has to keep being re-acquired. The revisit interval is
   the fade duration, computed from the cycle rather than picked. Reach for this
   only when the diagram's whole point is that the data had to be acquired; a
   mechanism that merely happens over a place gets the plain backdrop.
   **A revealed backdrop must tile exactly.** Overlapping sweeps double-cover
   ground and quietly claim coverage the mechanism does not have; gaps claim the
   opposite. Derive the spacing from the frame and let it fix the sweep width,
   rather than picking a real instrument's width and living with the seams: on
   the satellite diagram that forced all four tracks parallel, since any
   crossing track images the same ground twice. Where the derived number then
   differs from the real one, say so in a comment and keep the prose off the
   claim.
   **The coordinate frame stays outside the mask.** A revealed backdrop needs
   something that does not move, or the reader has no fixed reference against
   which to see the ground arrive and age. The satellite diagram's graticule is
   drawn over the terrain and outside the reveal, so the coordinates hold still
   while the ground under them comes and goes: a grid is the frame you read the
   drawing in, never something the mechanism produced. Where the surface's
   location is withheld, the lines carry no labels and land on no round numbers,
   and the spacing alone does the work. Watch the ramp when you add one, since
   the wash raises the floor: the field map's `--border` graticule is the wash's
   own value and would vanish on this surface, so it steps down to
   `--border-strong` and is then held back with opacity, because furniture must
   survive the backdrop without outweighing the content drawn over it.
   **Do not let the revealed backdrop absorb a stricter claim.** Painting is
   what the instrument swept; receiving is a separate and narrower thing, so
   they get separate geometry. On the satellite diagram the swath paints along
   the whole track while the node's receive flash stays gated on the reception
   ring, which is what lets one pass lay down ground with the node never
   flashing. Collapsing the two would have been tidier and would have quietly
   overstated what the node gets.
   **A schematic gets no terrain either**, for the chart's reason: it draws
   where a thing goes, not where it is, and contours would furnish it with a
   geography it is not making a claim about. It has no substitute backdrop at
   all — the blank is correct, since a pipeline has no ambient quantity of its
   own to shade.
2. **Standing geometry** — range rings, relationship lines. Dashed strokes
   only; meaning is encoded in **color plus dash length, never arrowheads**.
   Direction, when it matters, is shown by motion.
   A schematic's standing geometry is its pipes and its boundary, and here the
   dashed-only rule inverts: **the pipes are solid and the boundary is the one
   dashed stroke on the surface**, so the dash signature means exactly one thing
   and needs no legend row to say which. Route the pipes **orthogonally and from
   the leg roster**, never by hand — a stray diagonal reads as a scene. A pipe
   is a route, not a payload, so it never takes accent no matter what rides it.
3. **Transient animation** — pooled one-shot elements the script parks and
   fires (waves, packet, badges).
4. **Subjects** — glyphs, attribute badges.
5. **Legend** — bottommost rows inside the viewBox.

## The legend ("the key")

- Lives along the bottom edge. Content keeps clearance on the legend's side;
  the other three edges run tight.
- Mono 13px rows: sample mark left, terse uppercase label right, `·` as the
  separator. Two columns when needed.
- An entry exists only for a mark a viewer cannot otherwise decode. If a mark
  becomes self-evident or leaves the diagram, its row goes too.
- **A diagram may have no key at all.** If every mark is decodable from its own
  motion, from vocabulary the page has already established, or from the prose
  beside it, the key is furniture that costs clearance on one edge and earns
  nothing. The satellite diagram ended up here: its ring, tracks and expanding
  fronts all read from movement, so dropping the key gave the drawing its whole
  frame back. Check this whenever a diagram simplifies, since a key that was
  load-bearing at one revision is often dead weight two revisions later.

## Labels

- **Exhibit diagrams are label-free.** The legend and the surrounding prose
  carry all text; subjects are distinguished by glyph, tone, and badge.
- **Coordinate furniture is not a label.** The map's graticule ticks and the
  power chart's hour marks name the frame you read the drawing in, not the
  things inside it, so they carry mono tags and stay. The test is whether the
  text names a subject: an axis may be labeled, a subject may not. Furniture
  earns its place only where the drawing is undecodable without it, which is
  why the power chart marks hours and leaves its percent axis bare.
- **The field map labels everything it draws** (stations, vessels,
  satellites), so any layer added to the map carries the map's mono tags.
  This split is deliberate; don't average it.
- **A schematic labels its stages**, and takes the map's stance rather than the
  exhibit's. A scene can leave its subjects unnamed because a viewer decodes
  them from the place; a block has no place to be decoded from, so an unlabeled
  one is a puzzle. The tell that the rule was right here: the legend would
  otherwise have had to name all eight blocks, which is a legend doing a
  label's job. Labeling the stages is what keeps the legend down to three rows
  that say what the drawing genuinely cannot.

## Color

- FIELD tokens only.
- **Accent is scarce and semantic**: reserved for the subject's own / private /
  active elements. Everything else uses the grey ramp. When a non-owned or
  non-private thing becomes active, it darkens within the greys — it never
  borrows accent. When an owned thing handles something that isn't its own,
  it stays grey too: color follows the payload, not the node.
- On a schematic, accent marks the **private payloads and the one store that
  holds them**, and nothing else — the weather-station diagram spends it on the
  microphone's audio, the record, the write into it, and the answer that comes
  back out. Everything else is grey because it is public from the moment it
  exists, which is the section's claim rather than a palette decision.
- On a chart, accent goes to **one** plotted quantity: the one the section is
  arguing for. The power chart gives it to stored charge and leaves generation
  and load in the greys, with the utility rail lightest of the three, since the
  grid is the one input that is not ours. Two accented series is one too many.
- **An accent-free surface is a claim, so make it one and say so in the block
  comment.** Where the section's whole point is that nothing here is private,
  the absence of accent carries it: the relay diagram has none anywhere, because
  every payload on an amateur band is public by law and color follows the
  payload, so there is no private thing left to spend it on. Better still,
  **remove the mark rather than declining to use it**. That surface has no key
  elements in its DOM at all, so the mesh diagram's badge for an exchange only
  two nodes can read cannot appear on it even by accident, the same way the
  satellite diagram makes receive-only unfalsifiable by never setting `--sig`.
  A rule the drawing has no instance to break is stronger than one the script
  merely remembers to obey.
- **Greys in one drawing must differ in kind, not in weight.** Two mid-grey
  lines a few tenths of a pixel apart in width are one line to the eye. Separate
  them by stroke kind and dash signature as well as tone: on the power chart
  generation is a dark solid curve and load is a light long-dashed level, and
  every dash length on that surface is distinct and means something (`2 6` hour
  grid, `8 5` load, `4 4` the reader's hour, `3 4` the outage edges).

## Iconography

- Lucide icons, hand-inlined into shared `<defs>` with the ISC attribution
  comment, strokes on `currentColor`. Defs are shared across all inline SVGs
  on the page via `<use>` — define once.
- Conditional strokes (radiating-wave arcs and similar) carry a `.signal`
  class gated by the `--sig` custom property, which inherits through `<use>`
  shadow clones where selectors cannot reach.
- Small companion glyphs act as badges: persistent badges for attributes,
  transient badges (script-parked) for per-event roles.

## Animation

- **Vanilla JS in the map's idiom**: pooled elements toggled `.live`, one-shot
  CSS animations restarted by reflow, rAF interpolation for movement,
  class-toggle flashes with per-element timers. No frameworks.
- **Timing is physics.** Every visible delay derives from the depicted
  mechanics and the drawn geometry — if a front expands at a set speed, a
  thing at distance d reacts at d over that speed, computed, not eyeballed.
  Speed constants live in exactly two places (CSS keyframe duration, script
  constant) and are changed together. On a chart the physics is the time
  compression: one constant states how much real time a modeled second is
  worth, and every mark's position is read off the model at the modeled
  instant, never tweened between hand-picked keyframes. A propagation front is
  the exception that proves it: it is drawn at a legible speed, not a physical
  one, since real RF crosses any of these frames instantly. What the geometry
  still decides is which fronts arrive at all, and in what order.
  **A front is not the only way to draw a transmission, and often not the best
  one.** Where the point is coverage rather than propagation, light the ranges
  the transmission is using instead: on the relay diagram a handheld keying up
  turns its own small ring and the repeater's large ring solid in the same
  instant, and that single mark is the mechanism stated once, since the handheld
  reaches only the mast and the mast reaches the city. An expanding pulse there
  drew attention to the travelling and away from the reaching, which was the
  section's whole subject. It also spends a dash signature well: **dashed is what
  a radio could reach, solid is what it is reaching now**, and nothing else on
  that surface means anything by its dashes.
  Reach for a front when arrival order is the content (the mesh's hop chain, the
  satellite's footprint sweeping a horizon); reach for lit standing geometry when
  the content is who is covered.
- **State marks are honest**: a mark that means "doing X" appears only while X
  is happening. Idle is quiet. **Absence is a claim too**: the satellite
  diagram says receive-only by never setting `--sig` on that surface, so the
  page's own transmit mark is not suppressed there, it is unable to appear.
  Better still, **build the surface so the mark cannot lie**. The weather
  schematic keys up whichever block a packet passes through, which sounds
  reckless until you notice only two of its eight defs carry `.signal` arcs:
  the node and the relay, the only two things on it that transmit. A sensor or
  a database cannot show a transmit mark there because it has none to show.
- **Derive a duration from the leg it belongs to, not from a number.** A block
  that forwards a packet keys up for exactly as long as the leg it is putting
  that packet onto, measured off the drawn route. Nothing then has to be kept
  in agreement by hand when the geometry moves.
- **Behavior is randomized but rule-bound**: random actors, deterministic
  rules, continuous activity with a short breath between events. Cadence is
  per-surface — an exhibit diagram can run hot; a layer on the busy map runs
  ambient.
- **Randomize ambience, never a claim.** Traffic and passes are ambient, so
  they reroll. The power chart's outage is a specific assertion about what
  happens to this node when the grid drops, so it is fixed at a stated hour
  where a reader can watch it and check it. A claim that moves every pass reads
  as decoration, and decoration is not checkable. An instrument's own duty
  cycle is a fact, not ambience, for the same reason: the weather station's
  reporting interval is fixed at the real one, compressed by a stated constant,
  while the birds and the researchers, who genuinely arrive when they arrive,
  reroll.
- **Draw the split, do not caption it.** Where a section's argument is that one
  event has two different destinations, fire both in the same instant off the
  same event and let the fork be visible per occurrence. The weather
  schematic's acoustic detection puts a grey packet on the public list and an
  accent packet into the private record simultaneously; the alternative was a
  legend row asserting the same thing, which a reader has to take on trust.
- **Each surface owns its vocabulary.** A signature visual belongs to the
  layer that established it on that surface; a new layer must communicate the
  same idea another way rather than reuse it.
- **One mechanism, one engine.** When the same mechanism appears on two
  surfaces, a single parameterized function drives both; differences are
  config, not forks.
- **A subject and the geometry that belongs to it move as one thing.** Where a
  subject carries its own range, the ring is not scenery near the glyph, it is
  part of the glyph: the relay engine writes both out of one position array in
  one function, so no frame can exist in which a handheld has walked away from
  its own reach. Anything a subject owns and a viewer would read as attached
  belongs in that same write.
- Ground the idiom in the domain first: before inventing a visualization,
  research how the domain already draws the mechanism, and prefer its idiom.

## Data and geometry

- The diagram's content roster lives in **one frontmatter array** feeding both
  the SVG template and the runtime script (`define:vars`). Derived geometry
  (links, adjacency, routes) is computed from that data — never hand-drawn.
- When a diagram depicts a mechanism another surface already reports, the model
  moves to a module in `src/data/` and **both** surfaces read it: the HUD
  samples `solarday.js` at the visitor's clock hour while the power chart draws
  the whole cycle and marks that same hour, so the two cannot drift apart.
  Sample the curves at build time and map them through the module's own
  coordinate helpers, so the drawn line and the moving mark share one geometry.
  Prefer a model whose cycle **closes on itself**: the power chart's dawn floor
  is where the night's discharge actually lands rather than a second number
  beside it, which is what keeps a visible step out of the drawn curve.
  A `define:vars` script cannot import, so a diagram that shares a module gets
  its own plain `<script>` block.
- **Scale is the mechanism's, not the page's.** A scene diagram's frame is
  whatever the thing being drawn needs in order to be true to size: the mesh
  diagram spans 28 km, the relay diagram 99 km, the satellite diagram 6000 km,
  so that a 2400 km
  reception horizon can be drawn at its real radius. Standing geometry too big
  for the viewBox is **clipped by the frame, never shrunk to fit** — a ring
  resized to fit states a distance that is simply wrong.
  **The frame is set by the pair of distances the section is contrasting, not by
  the largest one.** The relay diagram has to hold a repeater's 30 km coverage
  and a handheld's own 4 km on the same surface, which rules out a local frame
  (the coverage would not fit) and a regional one (the handheld's ring would be
  a dot), and leaves exactly one span that works.
- **A true-scale echo of another surface's geometry is worth drawing only while
  the two are far apart.** An earlier cut of the relay diagram brought the mesh
  diagram's whole range ring across at true scale, so the reader could see
  section 01's world sitting inside section 02's rather than take a ratio on
  trust. That was right at a 298 km frame, where the echo was a seventh of the
  coverage ring. It stopped being right when the section's claim moved to city
  scale and the same echo came out half the size of the ring beside it: a second
  ring of nearly equal size reads as a competing subject, not as a reference,
  and it crossed the drawing's actual subjects to do it. The rule is worth
  keeping and so is the condition on it. **An echo is a reference only while it
  is obviously smaller than the thing it is being read against.**
- **Let one drawn thing carry both meanings when the mechanism makes them one.**
  The satellite diagram's ring is the node's reception horizon and each
  satellite's broadcast footprint at the same time, because those are the same
  distance. "Did this sweep land" then reduces to whether the satellite was
  inside the ring when it keyed, with nothing special-cased, and outcomes fall
  out for free: the grazing pass leaves a half-finished picture because its
  chord across the ring is shorter, not because anything scripts a partial.
- **Name the arrival, do not measure it.** Where a script has to act when a
  payload reaches a place, key the action to the leg it just finished rather
  than to a distance along the route. The weather engine's `after` map is
  indexed by leg, so a moved corner changes the drawing and the timing together
  and there is no second copy of the geometry to keep in step.
- Positions are **verified computationally before shipping**: connectivity,
  range membership, collision with page furniture and the legend, and
  placement against the terrain data (subjects sit on land). On a schematic add
  the checks the form makes possible and the claim makes necessary: every
  segment orthogonal, every leg end meeting the block it serves, and **the
  count of legs crossing the boundary**, which is the whole argument reduced to
  an assertion (two, and only the two intended). Where a scene's point is that
  one thing reaches and another does not, **assert both halves and assert the
  negative first**: the relay check requires every handheld to stay inside the
  repeater's coverage and, separately, requires every pair of them to be too far
  apart to work each other directly, which is what makes each drawn exchange one
  the mast is genuinely carrying. A check that only confirms what does work would
  pass a drawing whose whole argument had quietly collapsed.
- **A moving scene is checkable too, if the movement is bounded rather than
  free.** Give each subject a home and a wander radius instead of a path, and
  every claim becomes an assertion over the whole space the walk can reach:
  home-to-centre plus the wander stays inside coverage, and home-to-home minus
  twice the wander stays outside the pair's own reach, so the two facts hold at
  every instant without the check ever simulating one. Randomness that cannot
  break an invariant is worth far more than randomness policed at runtime, and
  the engine's guard against a too-close pair should then be dead code that
  never fires rather than the thing keeping the drawing honest. Run the checks
  against the **built** page rather than the source, so what is verified is what
  ships.

## Accuracy

- Depicted behavior must be true to the real system's documented capability.
  Simplification is allowed; contradiction is not — especially contradiction
  of the prose sitting next to the diagram. When diagram and prose describe
  the same mechanism, they must agree.
- Audit for drift after iteration. The recurring failure found in practice:
  behavior changes while the aria-label, comments, and legend describe the
  previous version. It happens **before shipping too**, not only after: the
  weather diagram's first aria-label called the answer the only accent payload
  while three others were already drawn in accent, and its key said the private
  payload stays local while the whole point is that a keyed one leaves. Read
  the label and the key back against the built behavior as a distinct pass —
  writing them from the intent rather than from the drawing is how both got
  through.
- **Draw a null result where it can be seen.** When the point is that one thing
  does *not* move another, the two have to cross: the power chart's outage
  started as a bar under the plot with nothing above it reacting, and read as an
  unused mark, because a reader cannot see an absence of reaction in a place the
  curves never go. Drawn instead as a column running from the plot's ceiling
  down to the rail, the same non-reaction reads as the claim it is. Never
  manufacture a fake effect to make a mark feel used: if the honest answer is
  that nothing happens, move the mark to where nothing visibly happens.

## Accessibility and degradation

- Exhibit diagrams are content: `role="img"` plus a complete `aria-label`
  describing both what is drawn and how the animation behaves. It is updated
  with **every** behavior change. (The map svg is a decorative hero and stays
  `aria-hidden`.)
- `prefers-reduced-motion`: animation engines never start, CSS animations are
  frozen, and the static diagram must still carry the full story on its own.
  **Placing a mark is not animating it**: the power chart's NOW tick is set
  under reduced motion too, since it is a fact about the reader's clock rather
  than movement. Anything the frozen diagram would otherwise lose has to be
  baked in at build time: the power chart's outage is drawn at build time and
  never moves, so the frozen chart makes the same claim the moving one does.

## Workflow

- `npm run build` is the gate; geometry checks run as throwaway node scripts;
  built output is grepped to confirm counts and removals; `graphify update .`
  after edits; visual review is the human's; the human commits.

## Diagram candidates

None outstanding.

Built: mesh radio (01), amateur radio relay (02), satellite downlinks (03),
weather station (04), resilience / power (05).
