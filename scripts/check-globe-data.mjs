// Asserts every place in src/data/places.js resolves to a feature in the
// vendored atlases, so a renamed Natural Earth label can't silently drop a
// highlight off the globe. Run after scripts/fetch-globe-data.sh:
//   node scripts/check-globe-data.mjs
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { home, states, countries, points, soon } from '../src/data/places.js';

const read = (f) => JSON.parse(readFileSync(new URL(`../public/data/${f}`, import.meta.url)));
const namesIn = (topo, key) =>
  new Set(topo.objects[key].geometries.map((g) => g.properties.name));

const stateNames = namesIn(read('states-10m.json'), 'states');
const countryNames = namesIn(read('countries-110m.json'), 'countries');

const soonStates = soon.filter((s) => s.state);
for (const p of [home, ...states, ...soonStates]) assert(stateNames.has(p.name), `missing state: ${p.name}`);
for (const p of [...countries, ...soon.filter((s) => !s.state)])
  assert(countryNames.has(p.name), `missing country: ${p.name}`);
for (const p of points) {
  const [lon, lat] = p.lonLat;
  assert(Math.abs(lon) <= 180 && Math.abs(lat) <= 90, `bad coordinates: ${p.name}`);
}

console.log(`ok: ${1 + states.length} states, ${countries.length} countries, ${points.length} points`);
