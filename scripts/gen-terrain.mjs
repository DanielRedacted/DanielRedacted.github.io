// One-off generator for src/data/terrain.js: real contour lines for the /compute
// field-diagram hero, north-up and unmodified. Anonymized only by omission: the
// sample frame is deliberately not committed; fill in the constants to rerun.
// Run manually (node scripts/gen-terrain.mjs); never part of the build.
// API: OpenTopoData SRTM 90m, free tier (100 points/call, 1 call/sec).

// Frame aspect matches the viewBox (km-true equirectangular): lat span chosen so
// lon_km / lat_km = VW / VH, so distances are isotropic and a scale bar is exact.
const LAT_MIN = null, LAT_MAX = null;     // withheld, set locally to rerun
const LON_MIN = null, LON_MAX = null;
const NX = 80, NY = 50;                    // sample grid
const VW = 1600, VH = 1000;                // output viewBox

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchGrid() {
  const pts = [];
  for (let j = 0; j < NY; j++) {
    const lat = LAT_MAX - (j / (NY - 1)) * (LAT_MAX - LAT_MIN); // j=0 north
    for (let i = 0; i < NX; i++) {
      const lon = LON_MIN + (i / (NX - 1)) * (LON_MAX - LON_MIN); // i=0 west
      pts.push(`${lat.toFixed(5)},${lon.toFixed(5)}`);
    }
  }
  const elev = [];
  for (let k = 0; k < pts.length; k += 100) {
    const res = await fetch('https://api.opentopodata.org/v1/srtm90m', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ locations: pts.slice(k, k + 100).join('|') }),
    });
    if (!res.ok) throw new Error(`batch ${k / 100}: HTTP ${res.status}`);
    const data = await res.json();
    for (const r of data.results) elev.push(r.elevation ?? 0); // null = ocean
    process.stdout.write(`\rfetched ${Math.min(k + 100, pts.length)}/${pts.length}`);
    await sleep(1100);
  }
  console.log();
  const grid = [];
  for (let j = 0; j < NY; j++) grid.push(elev.slice(j * NX, (j + 1) * NX));
  return grid;
}

// Standard marching squares over grid cells; returns polylines in grid coords.
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
      // extend from tail (dir 1) then from head (dir 0, prepend)
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

// One round of Chaikin corner cutting; endpoints preserved on open lines.
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

// Grid coords -> viewBox, north-up (j=0 is the north row).
const toView = ([i, j]) => [(i / (NX - 1)) * VW, (j / (NY - 1)) * VH];

function toPath(line) {
  const pts = chaikin(line).map(toView).map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`);
  return `M${pts[0]}L${pts.slice(1).join(' ')}`;
}

const grid = await fetchGrid();

const flat = grid.flat();
console.log(`elevation min ${Math.min(...flat)} max ${Math.max(...flat)}`);

const levels = [];
for (let l = 50; l <= Math.max(...flat); l += 50) levels.push(l);

const contours = [];
for (const level of levels) {
  for (const line of marchingSquares(grid, level)) {
    if (line.length < 4) continue; // drop specks
    contours.push({ level, d: toPath(line) });
  }
}
const coast = marchingSquares(grid, 0.5)
  .filter((l) => l.length >= 6)
  .map(toPath);

// Diagnostics for hand-placing map furniture: sea share per viewBox edge + land ASCII.
const seaAt = (i, j) => grid[j][i] <= 0;
const edges = { top: 0, bottom: 0, left: 0, right: 0 };
for (let i = 0; i < NX; i++) { if (seaAt(i, 0)) edges.top++; if (seaAt(i, NY - 1)) edges.bottom++; }
for (let j = 0; j < NY; j++) { if (seaAt(0, j)) edges.left++; if (seaAt(NX - 1, j)) edges.right++; }
console.log('sea per viewBox edge:', edges);
for (let j = 0; j < NY; j += 2) {
  let row = '';
  for (let i = 0; i < NX; i += 2) row += seaAt(i, j) ? '~' : grid[j][i] >= 300 ? '^' : '#';
  console.log(row);
}

const body = `// Generated by scripts/gen-terrain.mjs. Do not hand edit.
// Real SRTM contours, north-up and unmodified; anonymized only by omitting
// labels and the sample frame. Levels are meters, 50 m interval.
// viewBox 0 0 ${VW} ${VH}.
export const contours = ${JSON.stringify(contours)};
export const coast = ${JSON.stringify(coast)};
`;
const { writeFileSync } = await import('node:fs');
writeFileSync(new URL('../src/data/terrain.js', import.meta.url), body);
console.log(`wrote src/data/terrain.js: ${contours.length} contour paths, ${coast.length} coast paths`);
