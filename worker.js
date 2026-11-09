// Worker entry. Static assets (dist/) answer every request except /api/*, which runs here first
// (wrangler.jsonc, run_worker_first): POST /api/form is the contact form (functions/api/form.js).
import { onRequestPost } from './functions/api/form.js';

export default {
  fetch(request, env) {
    if (new URL(request.url).pathname !== '/api/form') return new Response('Not found.', { status: 404 });
    if (request.method !== 'POST') return new Response('Method not allowed.', { status: 405, headers: { Allow: 'POST' } });
    return onRequestPost({ request, env });
  },
};
