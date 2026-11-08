// One-off generator for src/data/sat-terrain.js: real contour lines for the
// /compute satellite-downlink diagram (03). A RANDOM continental frame is drawn
// each run and the coordinates are withheld from the committed data, matching
// gen-terrain.mjs's anonymize-by-omission idiom. A third independent one-off on
// purpose: its own location, its own frame, never reusing another surface's
// terrain. Run manually (node scripts/gen-sat-terrain.mjs); never part of the build.
// API: OpenTopoData SRTM 90m, free tier (100 points/call, 1 call/sec).
// Marching squares / join / chaikin copied from gen-mesh-terrain.mjs (standalone
// one-offs; kept independent on purpose).
//
// This frame is 30 deg tall (~3340 km) rather than the mesh diagram's 0.25 deg,
// because the satellite diagram draws real LEO pass geometry: a 2400 km
// reception horizon has to fit on the page. Two consequences of the span:
// longitude is corrected by cos(latCenter) only, so the frame is stretched by
// about +/-25% at its top and bottom edges (fine for texture, wrong for
// navigation), and SRTM 90m samples land at roughly 100 km here, so these are
// continental relief bands, not local contours.

const NX = 60, NY = 34;                    // sample grid, ~viewBox aspect
const VW = 1000, VH = 560;                 // satellite diagram viewBox
const LAT_SPAN = 30;                       // ~3340 km tall frame, km-true lon span
const NODE = [620, 235];                   // the node's viewBox position: must be land

// interior Asia: the only band that stays ~95% land across a 72 deg lon span
// and keeps the frame's north edge inside SRTM's 60N coverage limit
const BOXES = [
  { latMin: 40, latMax: 44.5, lonMin: 76, lonMax: 88 },
];
const MIN_LAND = 0.92;

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

const at = (f, x, y) => [
  f.latMax - (y / VH) * (f.latMax - f.latMin),
  f.lonMin + (x / VW) * (f.lonMax - f.lonMin),
];

// One 100-point call per attempt: a 9x11 coarse grid for the land fraction plus
// the node's own cell. Both have to pass before the full 2040-point fetch, since
// that costs ~25s of rate-limited calls.
async function pickFrame() {
  for (let attempt = 0; attempt < 10; attempt++) {
    const f = randomFrame();
    const pts = [];
    for (let j = 0; j < 11; j++)
      for (let i = 0; i < 9; i++) pts.push(at(f, (i / 8) * VW, (j / 10) * VH));
    pts.push(at(f, ...NODE));
    const elev = await elevations(pts.map(([la, lo]) => `${la.toFixed(5)},${lo.toFixed(5)}`).join('|'));
    await sleep(1100);
    const nodeElev = elev.pop();
    const land = elev.filter((e) => e !== null && e > 0).length / elev.length;
    if (land >= MIN_LAND && nodeElev !== null && nodeElev > 0) {
      console.log(
        `frame accepted on attempt ${attempt + 1}: ${(land * 100).toFixed(0)}% land, ` +
        `node sits at ${Math.round(nodeElev)} m (coords withheld from output)`,
      );
      return f;
    }
    console.log(`attempt ${attempt + 1} rejected: ${(land * 100).toFixed(0)}% land, node ${nodeElev} m`);
  }
  throw new Error('no continental frame found in 10 attempts');
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

// interval snapped so the frame yields roughly a dozen levels. 500 and 1000 m
// exist because continental relief spans thousands of meters, where the mesh
// diagram's local frame spanned tens.
const STEPS = [10, 20, 25, 50, 100, 200, 500, 1000];
const step = STEPS.find((s) => (max - min) / s <= 14) ?? 1000;
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

const body = `// Generated by scripts/gen-sat-terrain.mjs. Do not hand edit.
// Real SRTM contours for a RANDOM continental frame, coordinates withheld; its
// own location, neither terrain.js's nor mesh-terrain.js's. Levels are meters,
// ${step} m interval. viewBox 0 0 ${VW} ${VH}, 1 unit = ${((LAT_SPAN * 111.32) / VH).toFixed(2)} km.
export const satContours = ${JSON.stringify(contours)};
export const satIndexStep = ${indexStep};
`;
const { writeFileSync } = await import('node:fs');
writeFileSync(new URL('../src/data/sat-terrain.js', import.meta.url), body);
console.log(`wrote src/data/sat-terrain.js: ${contours.length} contour paths, ${step} m interval`);
