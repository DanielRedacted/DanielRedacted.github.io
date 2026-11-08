// The node's modeled solar day. One source for the field map's HUD readouts and
// the resilience diagram's 24-hour chart, so the two can never disagree: the HUD
// samples it at the visitor's real clock hour, the diagram draws the whole cycle
// and marks that same hour. Deterministic here; the HUD adds its own drift.

export const SUNRISE = 6.5;
export const SUNSET = 19.5;

// Peak PV output as a share of the array's rating, and the node's continuous
// draw on that same scale. ponytail: load is drawn flat and carries no number.
// The node runs all day; the ratio is illustrative, not a spec.
export const PV_PEAK = 88;
export const LOAD_PCT = 10;

// Share of rated PV for a given hour, dark outside the solar window.
export const solarPct = (h) =>
  h < SUNRISE || h > SUNSET ? 0 : Math.sin(((h - SUNRISE) / (SUNSET - SUNRISE)) * Math.PI) * PV_PEAK;

// Battery follows the clock: morning recharge to float, float through the day,
// then overnight discharge at 2.5 points an hour. The dawn floor is where the
// night's discharge actually lands (2.5 x 11 dark hours), not a separate
// number, so the cycle closes on itself and the drawn curve has no step in it.
export const NIGHT_H = 24 - (SUNSET - SUNRISE);
export const FLOOR = 100 - NIGHT_H * 2.5;
export const RECHARGE_H = 2.5;
export const batt = (h) => {
  if (h >= SUNRISE && h <= SUNSET) {
    const t = h - SUNRISE;
    return t < RECHARGE_H
      ? { pct: FLOOR + ((100 - FLOOR) * t) / RECHARGE_H, mode: 'CHG' }
      : { pct: 100, mode: 'FLOAT' };
  }
  const t = h > SUNSET ? h - SUNSET : h + (24 - SUNSET); // hours since sunset
  return { pct: Math.min(100, Math.max(FLOOR, 100 - t * 2.5)), mode: 'DISCHG' };
};

/* ---- the resilience diagram's plot, derived from the model above ----------
   viewBox 0 0 1000 420: percent up the y axis, 24 hours across the x. The
   figure and the sweep script both map through these, so the drawn curves and
   the moving marks cannot drift apart. */

export const PLOT = { x0: 62, x1: 962, y0: 40, y1: 300 };
export const RAIL_Y = 344;

// rounded: these land straight in the markup, and a 1000-unit viewBox has no
// use for the sixteenth decimal place of a float
const round = (n) => Math.round(n * 100) / 100;
export const xAt = (h) => round(PLOT.x0 + (h / 24) * (PLOT.x1 - PLOT.x0));
export const yAt = (pct) => round(PLOT.y1 - (pct / 100) * (PLOT.y1 - PLOT.y0));

// 15-minute samples: fine enough that the curves read as curves.
const sample = (f) =>
  Array.from({ length: 97 }, (_, i) => `${xAt(i / 4).toFixed(1)},${yAt(f(i / 4)).toFixed(1)}`).join(' ');
export const solarCurve = sample(solarPct);
export const socCurve = sample((h) => batt(h).pct);

// One utility outage, in daylight and fixed. Fixed because it is a claim, not
// decoration: the chart says an outage passes through this node without moving
// generation, storage, or load, and a claim you can watch happen at a stated
// hour is checkable in a way a reroll on every pass is not.
export const OUTAGE = { from: 13.2, to: 16.4 };

// Utility presence rail: one line punched with gaps, each gap an outage. Hours
// in, dash pattern out.
export const railDash = (gaps) => {
  const w = PLOT.x1 - PLOT.x0;
  const u = (h) => (h / 24) * w;
  let at = 0;
  const parts = [];
  for (const [from, to] of gaps) {
    parts.push(u(from) - at, u(to) - u(from));
    at = u(to);
  }
  parts.push(w - at);
  return parts.map((n) => n.toFixed(1)).join(' ');
};
