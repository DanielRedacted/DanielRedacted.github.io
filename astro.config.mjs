// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// Static export for GitHub Pages. Directory format so routes serve as
// /me/index.html etc. No framework integrations — the digital-rain canvas
// is a plain script; nothing on this site needs hydration.
export default defineConfig({
  site: 'https://danielredacted.net',
  build: { format: 'directory' },
  vite: {
    plugins: [tailwindcss()],
  },
});
