-- D1 database `danielromo-forms`, bound as DB. Written by functions/api/form.js.
-- Apply: npx wrangler d1 execute danielromo-forms --remote --file schema.sql   (--local for dev)
CREATE TABLE IF NOT EXISTS submissions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')), -- UTC
  form TEXT NOT NULL,                                 -- 'contact'
  email TEXT NOT NULL,                                -- the reply-to, lowercased
  payload TEXT NOT NULL                               -- every other field (message), as JSON
);
CREATE INDEX IF NOT EXISTS submissions_form_created ON submissions (form, created_at);
