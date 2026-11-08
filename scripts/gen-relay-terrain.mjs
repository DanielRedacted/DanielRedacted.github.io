// One-off generator for src/data/relay-terrain.js: real contour lines for the
// /compute amateur-radio-relay diagram (02). A RANDOM inland frame is drawn each
// run and the coordinates are withheld from the committed data, matching
// gen-mesh-terrain.mjs's anonymize-by-omission idiom. Its own location: never
// the mesh diagram's frame, never the satellite diagram's, never the map's.
// Run manually (node scripts/gen-relay-terrain.mjs); never part of the build.
// API: OpenTopoData SRTM 90m, free tier (100 points/call, 1 call/sec).
// Marching squares / join / chaikin copied from gen-mesh-terrain.mjs (standalone
// one-offs; kept independent on purpose).

const NX = 60, NY = 34;                    // sample grid, ~viewBox aspect
const VW = 1000, VH = 560;                 // relay diagram viewBox
// One city and its surroundings: ~56 km tall and ~99 km wide, twice the mesh
// diagram's frame. The scale is the section's subject. A repeater's coverage
// has to fill most of the drawing and a handheld's own reach has to still be
// visible inside it, which puts the two an order of magnitude apart on one
// frame and rules out both a local and a regional span.
const LAT_SPAN = 0.5;

// inland, relief-prone regions; a random frame is probed until it is dry land
const BOXES = [
  { latMin: 34, latMax: 46, lonMin: -115, lonMax: -105 },
  { latMin: 36, latMax: 45, lonMin: 22, lonMax: 40 },
  { latMin: -35, latMax: -22, lonMin: 137, lonMax: 148 },
  { latMin: 40, latMax: 50, lonMin: 70, lonMax: 90 },
  { latMin: -25, latMax: -12, lonMin: -65, lonMax: -50 },
  { latMin: 6, latMax: 14, lonMin: 16, lonMax: 34 },
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function elevations(locations) {
  const res = await fetch('https://api.opentopodata.org/v1/srtm90m', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ locations }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return (await res.json()).results.map((r) => r.elevation);
}

function randomFrame() {
  const b = BOXES[Math.floor(Math.random() * BOXES.length)];
  const lat = b.latMin + Math.random() * (b.latMax - b.latMin);
  const lon = b.lonMin + Math.random() * (b.lonMax - b.lonMin);
  const lonSpan = ((VW / VH) * LAT_SPAN) / Math.cos((lat * Math.PI) / 180);
  return {
    latMin: lat - LAT_SPAN / 2, latMax: lat + LAT_SPAN / 2,
    lonMin: lon - lonSpan / 2, lonMax: lon + lonSpan / 2,
  };
}

// probe corners + center: all land (elevation > 0, non-null) AND some relief
// across the frame, or try again. The relief test is this generator's own: at
// 28 km the mesh generator's boxes are relief-prone by construction, but 167 km
// of the same boxes can land entirely inside a basin, which yields a handful of
// meandering 10 m contours and no texture at all.
const MIN_RELIEF = 300; // meters across the probe points
async function pickFrame() {
  for (let attempt = 0; attempt < 25; attempt++) {
    const f = randomFrame();
    const pts = [
      [f.latMax, f.lonMin], [f.latMax, f.lonMax],
      [(f.latMin + f.latMax) / 2, (f.lonMin + f.lonMax) / 2],
      [f.latMin, f.lonMin], [f.latMin, f.lonMax],
    ].map(([la, lo]) => `${la.toFixed(5)},${lo.toFixed(5)}`).join('|');
    const elev = await elevations(pts);
    await sleep(1100);
    if (elev.every((e) => e !== null && e > 0) &&
        Math.max(...elev) - Math.min(...elev) >= MIN_RELIEF) {
      console.log(`frame accepted on attempt ${attempt + 1} (coords withheld from output)`);
      return f;
    }
  }
  throw new Error('no land frame with relief found in 25 attempts');
}

async function fetchGrid(f) {
  const pts = [];
  for (let j = 0; j < NY; j++) {
    const lat = f.latMax - (j / (NY - 1)) * (f.latMax - f.latMin); // j=0 north
    for (let i = 0; i < NX; i++) {
      const lon = f.lonMin + (i / (NX - 1)) * (f.lonMax - f.lonMin);
      pts.push(`${lat.toFixed(5)},${lon.toFixed(5)}`);
    }
  }
  const elev = [];
  for (let k = 0; k < pts.length; k += 100) {
    elev.push(...(await elevations(pts.slice(k, k + 100).join('|'))).map((e) => e ?? 0));
    process.stdout.write(`\rfetched ${Math.min(k + 100, pts.length)}/${pts.length}`);
    await sleep(1100);
  }
  console.log();
  const grid = [];
  for (let j = 0; j < NY; j++) grid.push(elev.slice(j * NX, (j + 1) * NX));
  return grid;
}

function marchingSquares(grid, level) {
  const segs = [];
  for (let j = 0; j < NY - 1; j++) {
    for (let i = 0; i < NX - 1; i++) {
      const tl = grid[j][i], tr = grid[j][i + 1], br = grid[j + 1][i + 1], bl = grid[j + 1][i];
      const idx = (tl >= level ? 8 : 0) | (tr >= level ? 4 : 0) | (br >= level ? 2 : 0) | (bl >= level ? 1 : 0);
      if (idx === 0 || idx === 15) continue;
      const t = (a, b) => (level - a) / (b - a);
      const T = [i + t(tl, tr), j], R = [i + 1, j + t(tr, br)];
      const B = [i + t(bl, br), j + 1], L = [i, j + t(tl, bl)];
      const table = {
        1: [[L, B]], 2: [[B, R]], 3: [[L, R]], 4: [[T, R]],
        5: [[T, R], [L, B]], 6: [[T, B]], 7: [[L, T]], 8: [[L, T]],
        9: [[T, B]], 10: [[T, L], [B, R]], 11: [[T, R]], 12: [[L, R]],
        13: [[B, R]], 14: [[L, B]],
      };
      for (const s of table[idx]) segs.push(s);
    }
  }
  return joinSegments(segs);
}

function joinSegments(segs) {
  const key = (p) => `${p[0].toFixed(4)},${p[1].toFixed(4)}`;
  const adj = new Map();
  const push = (k, s) => (adj.get(k) ?? adj.set(k, []).get(k)).push(s);
  segs.forEach((s, n) => { push(key(s[0]), n); push(key(s[1]), n); });
  const used = new Set();
  const lines = [];
  const walk = (start) => {
    const [a, b] = segs[start];
    used.add(start);
    const line = [a, b];
    for (const dir of [1, 0]) {
      for (;;) {
        const end = dir ? line[line.length - 1] : line[0];
        const next = (adj.get(key(end)) ?? []).find((n) => !used.has(n));
        if (next === undefined) break;
        used.add(next);
        const [p, q] = segs[next];
        const pt = key(p) === key(end) ? q : p;
        dir ? line.push(pt) : line.unshift(pt);
      }
    }
    return line;
  };
  for (let n = 0; n < segs.length; n++) if (!used.has(n)) lines.push(walk(n));
  return lines;
}

function chaikin(line) {
  if (line.length < 3) return line;
  const out = [line[0]];
  for (let k = 0; k < line.length - 1; k++) {
    const [ax, ay] = line[k], [bx, by] = line[k + 1];
    out.push([ax * 0.75 + bx * 0.25, ay * 0.75 + by * 0.25]);
    out.push([ax * 0.25 + bx * 0.75, ay * 0.25 + by * 0.75]);
  }
  out.push(line[line.length - 1]);
  return out;
}

const toView = ([i, j]) => [(i / (NX - 1)) * VW, (j / (NY - 1)) * VH];

function toPath(line) {
  const pts = chaikin(line).map(toView).map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`);
  return `M${pts[0]}L${pts.slice(1).join(' ')}`;
}

const frame = await pickFrame();
const grid = await fetchGrid(frame);

const flat = grid.flat();
const min = Math.min(...flat), max = Math.max(...flat);
console.log(`elevation min ${min} max ${max}`);

// interval snapped so the frame yields roughly a dozen levels. 500 is on the
// list here and not on the mesh generator's: a 167 km frame crosses whole
// ranges, so its relief spans far more than a 28 km one's.
const STEPS = [10, 20, 25, 50, 100, 200, 500];
const step = STEPS.find((s) => (max - min) / s <= 14) ?? 500;
const indexStep = step * 4;

const levels = [];
for (let l = Math.ceil(min / step) * step; l <= max; l += step) levels.push(l);

const contours = [];
for (const level of levels) {
  for (const line of marchingSquares(grid, level)) {
    if (line.length < 4) continue; // drop specks
    contours.push({ level, d: toPath(line) });
  }
}

const body = `// Generated by scripts/gen-relay-terrain.mjs. Do not hand edit.
// Real SRTM contours for a RANDOM inland frame, coordinates withheld; its own
// location, not the mesh diagram's or the satellite diagram's. Levels are
// meters, ${step} m interval. viewBox 0 0 ${VW} ${VH}, ~1.5 degrees of latitude.
export const relayContours = ${JSON.stringify(contours)};
export const relayIndexStep = ${indexStep};
`;
const { writeFileSync } = await import('node:fs');
writeFileSync(new URL('../src/data/relay-terrain.js', import.meta.url), body);
console.log(`wrote src/data/relay-terrain.js: ${contours.length} contour paths, ${step} m interval`);
