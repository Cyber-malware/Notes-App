# Fieldnotes

A private Markdown workspace with a responsive editor, nested folders, search, attachments, and Obsidian-compatible import/export.

## Deploy on Vercel with Neon (free-tier option)

1. Create a **Free** project at https://neon.com. Choose a region close to your Vercel function region. Copy the pooled PostgreSQL connection string from **Connect**, including `sslmode=require`.
2. Open Neon's SQL editor and run `db/schema.sql`. Alternatively, set `DATABASE_URL` locally and run `npm run db:migrate`.
3. Run `npm install` and `npm run password`. Enter a new password when prompted. The command prints `APP_PASSWORD_HASH` and a random `SESSION_SECRET` for Vercel. Do not put these values in GitHub or chat.
4. Push a **clean code-only repository** to GitHub. See the Git history note below.
5. Import that GitHub repository into Vercel. Keep the repository root as the root directory, use the included `vercel.json`, and leave custom build/output-directory overrides unset. Select Node.js 24.
6. In Vercel's environment variables, set `DATABASE_URL`, `APP_PASSWORD_HASH`, and `SESSION_SECRET`. Use a separate Neon branch/database for preview deployments, or restrict these variables to Production.
7. Deploy, sign in with the password from step 3, and upload your notes folder or ZIP.

No account credentials are bundled. Vercel mode always uses PostgreSQL and never falls back to temporary filesystem storage. The database schema must be installed before login. Free plans have provider usage/storage limits; check your Neon dashboard as your vault grows.

### Git history note

This repository previously tracked `vault/` and `.state/password.json`. They have been removed from the staging index and ignored, **but earlier commits still contain them**. Local files remain on disk. Do not publish that old history as a public code repository. For a fresh GitHub repository, copy only these project files into a new empty directory and initialize Git there:

- `public/`, `api/`, `db/`, `scripts/`, `test/`
- `server.js`, `local-server.js`, `cloud.js`
- `package.json`, `package-lock.json`, `vercel.json`
- `.gitignore`, `.env.example`, `.dockerignore`, `Dockerfile`, `compose.yaml`, `README.md`

Do not copy `.git/`, `.state/`, `vault/`, `.env`, or `node_modules/`. If the previous history was already published, remove the sensitive history separately and use a new deployment password.

## Run locally

Node.js 22.9+ (24 recommended):

```sh
npm ci
npm start
```

Open http://localhost:3000. With no `DATABASE_URL`, local mode uses ordinary files in `vault/` and a first-visit password stored as a bcrypt hash in `.state/`. Existing local vaults stay intact. To run cloud mode locally, copy `.env.example` to `.env`, fill in the values, migrate the database, and restart. Local notes are not automatically copied into PostgreSQL; upload them after deployment.

## Everyday use

- Select a folder to choose where new notes, folders, and uploads go. Click it to expand/collapse. **Vault root** resets the destination.
- Use an item's **⋯** menu for rename/move/delete. A full destination path creates missing parent directories. Moving an open note or its parent updates the editor path. Links inside Markdown are not rewritten automatically.
- Edit, preview, or split the screen. Autosave runs after a pause; Ctrl/Cmd+S saves immediately. External updates are checked every 30 seconds while the tab is visible. Conflicting saves preserve the draft; download it before reopening the disk/database version.
- Upload individual files or a whole folder. Paths, spaces, Unicode, hidden files, and file bytes are retained. Browser folder pickers do not include empty folders; ZIP imports can preserve them. Hidden files are kept for export but omitted from the tree.
- ZIP imports retain the ZIP's enclosing folder if present. Existing paths are skipped, never overwritten. Progress reports imported/skipped/failed counts. Imports are per-file, not all-or-nothing; retrying the same folder safely skips successful files.
- **Download vault** assembles a ZIP in your browser including `.obsidian/` and attachments. It is usable as an Obsidian vault. Keep regular exports; delete is permanent.

## Limits and storage

For Vercel compatibility, the UI limits each file to **2 MB**, ZIP inputs to **50 MB compressed**, and ZIP expansion/export to **100 MB** with at most **10,000 ZIP entries**. Files larger than the limit are reported and skipped; they are not silently truncated. ZIP import/export uses browser memory. Large media vaults need a future object-storage/direct-upload implementation. Export is assembled file-by-file, so avoid concurrent edits while exporting if you need a consistent backup.

Cloud mode stores original file bytes and directory paths in PostgreSQL; it does not maintain a live Linux filesystem. Local mode remains filesystem-backed. Folder moves and saves in cloud mode use transactions and a shared database lock. Sessions use signed cookies with server-checked expiry; rotating `SESSION_SECRET` or the password hash invalidates them. This is a single-owner app, not a multi-account service. Rate limits are shared through PostgreSQL; old login-attempt rows can periodically be cleared using `DELETE FROM login_attempts WHERE started < now() - interval '1 day';`.

Markdown source and frontmatter are preserved. Wikilinks, aliases, relative images/links and GFM previews are supported; note embeds appear as links. Plugins, graph views, automatic backlink rewriting, and rendered PDF/SVG embeds are not implemented.

## Linux / Docker

```sh
docker compose up -d --build
```

Local storage uses the mounted `vault/` and `.state/` directories. Bindings are localhost-only by default. For HTTPS use Caddy/Nginx to proxy to port 3000 and set `HTTPS=true` behind the trusted proxy. Local settings: `HOST`, `PORT`, `VAULT_PATH`, `STATE_PATH`.

## Verification

```sh
npm test
npm audit
```

Tests cover local filesystem behavior, PostgreSQL SQL behavior through PGlite, persistence across app instances, login, binary uploads, conflicts, nested folders, moves/deletes, traversal rejection, and DOM-level editor/import behavior. PGlite tests do not verify an actual Neon connection or Vercel deployment. Browser smoke checks cover login, nested-note creation, editing, preview and saving. Deployment still requires your Neon/Vercel configuration.
