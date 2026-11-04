# Fieldnotes

A self-hosted Markdown workspace based on `file.md`. Notes and attachments are ordinary files in `vault/`; you can open that directory with Obsidian.

## Start locally

Install Node.js 24 or newer, then run:

```sh
npm install
npm start
```

Open http://localhost:3000 and create your password on first visit. The first visitor claims the workspace; complete setup locally before exposing it to a network. Passwords are bcrypt hashed in `.state/password.json`. Sessions expire after one day or a server restart.

Click **New note**, enter a filename or a path such as `Projects/Ideas.md`, and start writing. Autosave runs after one second; Ctrl/Cmd+S saves immediately. Upload files, directories, or a ZIP to bring in an existing vault. ZIP entries are imported as named, including any enclosing root folder. Existing files are never overwritten by imports. Downloads include hidden files such as `.obsidian/`.

Click a folder to select it and expand/collapse its contents. New notes, new folders, and uploads default to the selected folder; click **Vault root** to return to the top level. Use the folder's **⋯** button to rename, move, or delete it. Rename/move accepts a full destination path. Moving files does not rewrite existing links. Export your vault regularly; deletion is permanent.

## Linux / Docker

```sh
docker compose up -d --build
```

The application binds to localhost by default. Use an SSH tunnel for initial setup. Place Caddy or Nginx in front for remote HTTPS access; proxy to localhost:3000 and set `HTTPS=true` in the container environment to enable secure cookies. Only enable proxy trust behind your trusted reverse proxy. Example Caddy configuration:

```text
notes.example.com {
    reverse_proxy 127.0.0.1:3000
}
```

Environment variables: `VAULT_PATH`, `STATE_PATH`, `HOST`, `PORT`, and `HTTPS`. Back up both the vault and state directories. Existing vaults can be mounted directly at `/data/vault`.

## Included

Markdown source editor, sanitized preview, split view, GFM tables/checklists, find/replace, autosave, folders, rename/move/delete, content search, wikilinks and aliases, relative Markdown links/images, image paste/drop, uploads, ZIP import/export, password login, external-change polling, and SHA-256 save-conflict detection. Raw Markdown and frontmatter are preserved on save.

## Current limits

This is a single-user first version. Note embeds appear as links; graph views, plugins, live collaboration, automatic link rewriting, and rendered PDF/SVG embeds are not implemented. File changes are polled every five seconds. Conflicts retain your draft: download it before reopening the note. Save checks catch changes made before a save, but external programs are not locked during the final filesystem write. ZIP imports are limited to 100 MB uncompressed and 10,000 entries; JSON uploads have a 32 MB request limit. Imports are not transactional; an I/O error can leave a partially imported directory. Symbolic links are rejected. Sessions use memory and reset on restart. Only administrators should have write access to the underlying server filesystem.

Run `npm test` for filesystem, authentication, conflict, traversal, upload, and export integration checks.
