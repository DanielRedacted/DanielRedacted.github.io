// Places I've been. Single source of truth: the frontmatter renders the visible
// list from these, the globe script filters geometry by the same names.
// `name` must match properties.name in the vendored atlases (see
// scripts/check-globe-data.mjs, which asserts exactly that).

export const home = { name: 'California', label: 'California' };

// us-atlas@3/states-10m.json
export const states = [
  { name: 'Oregon', label: 'Oregon' },
  { name: 'Washington', label: 'Washington' },
  { name: 'Idaho', label: 'Idaho' },
  { name: 'Montana', label: 'Montana' },
  { name: 'Wyoming', label: 'Wyoming' },
  { name: 'Colorado', label: 'Colorado' },
  { name: 'Nevada', label: 'Nevada' },
  { name: 'Utah', label: 'Utah' },
  { name: 'Arizona', label: 'Arizona' },
  { name: 'Texas', label: 'Texas' },
  { name: 'New York', label: 'New York' },
  { name: 'District of Columbia', label: 'Washington, D.C.' },
  { name: 'Hawaii', label: 'Hawaii' },
];

// world-atlas@2/countries-110m.json
export const countries = [
  { name: 'Mexico', label: 'Mexico' },
  { name: 'Brazil', label: 'Brazil' },
  { name: 'South Africa', label: 'South Africa' },
  { name: 'Thailand', label: 'Thailand' },
];

// Singapore is below the 110m resolution threshold, so it has no polygon to
// filter. Drawn from its coordinates as a dot, same as any sub-pixel feature.
export const points = [
  { name: 'Singapore', label: 'Singapore', lonLat: [103.82, 1.35] },
];

// Not been yet. Listed apart, but drawn on the globe exactly like the rest.
// Entries match against countries unless flagged `state: true`, so `Georgia`
// is the country and never collides with the US state of the same name.
export const soon = [
  { name: 'Alaska', label: 'Alaska', state: true },
  { name: 'Japan', label: 'Japan' },
  { name: 'Taiwan', label: 'Taiwan' },
  { name: 'Georgia', label: 'Georgia' },
  { name: 'Switzerland', label: 'Switzerland' },
  { name: 'India', label: 'India' },
  { name: 'Egypt', label: 'Egypt' },
];
