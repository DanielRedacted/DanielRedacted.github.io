// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// Static export for GitHub Pages. Directory format so routes serve as
// /me/index.html etc. No framework integrations — the digital-rain canvas
// is a plain script; nothing on this site needs hydration.
export default defineConfig({
  site: 'https://danielromo.org',
  integrations: [sitemap({ filter: (p) => !p.endsWith('/invite/') })],
  build: { format: 'directory' },
  vite: {
    plugins: [tailwindcss()],
    // Dev only: these three live behind a page script or a lazy import(), so Vite
    // discovers them mid-session and re-optimizes, which 504s every dep URL an open
    // tab already loaded. Pre-bundling them at startup keeps the cache stable.
    optimizeDeps: { include: ['@google/model-viewer', 'd3-geo', 'topojson-client'] },
  },
});
