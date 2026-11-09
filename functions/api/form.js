// POST /api/form handler (worker.js routes here), same shape as AP0110.com's Pages Function functions/api/form.js.
// The homepage contact form (form=contact, the Contact me section) posts here natively (no client JS).
// Every accepted submission is one row in D1 `danielromo-forms` → `submissions` (schema.sql). Read with
// `npx wrangler d1 execute danielromo-forms --remote --command "SELECT created_at, email, payload FROM submissions ORDER BY id DESC"`.
// ponytail: honeypot only; add Turnstile siteverify here when spam shows up in D1.

const EMAIL = /^[^@ ]+@[^@ ]+[.][^@ ]+$/; // same pattern as the input
const DONE = { contact: '/#sent' };
const MAX = 20_000; // chars of JSON per submission; the message is capped at 5000 in the form

const text = (body, status) =>
  new Response(body, { status, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });

export async function onRequestPost({ request, env }) {
  let d;
  try {
    d = Object.fromEntries(await request.formData());
  } catch {
    return text('Bad request.', 400);
  }
  const { form, website, ...fields } = d;
  if (!Object.hasOwn(DONE, form)) return text('Unknown form.', 400);
  const done = Response.redirect(new URL(DONE[form], request.url), 303);
  if (website) return done; // honeypot: hidden field only bots fill; drop silently
  if (typeof fields.email !== 'string' || !EMAIL.test(fields.email)) return text('Please enter a valid email.', 400);

  const payload = JSON.stringify(fields);
  if (payload.length > MAX) return text('Submission too long.', 413);

  try {
    await env.DB.prepare('INSERT INTO submissions (form, email, payload) VALUES (?1, ?2, ?3)')
      .bind(form, fields.email.trim().toLowerCase(), payload)
      .run();
  } catch (err) {
    console.error('form insert failed', err);
    return text('Something went wrong saving your message. Please email me@danielromo.org.', 500);
  }
  return done;
}
