# Self-Hosted Obsidian-Compatible Markdown Knowledge Base

## 1. Project Overview

Build a self-hosted web application that provides a browser-based interface for creating, editing, organizing, and browsing Markdown notes stored directly on a Linux server.

The primary goal is to eliminate the requirement that Obsidian must be installed on the machine being used to create and edit notes.

The application should behave like a web-based Markdown workspace while maintaining maximum compatibility with an Obsidian vault.

### Core Principle

**The filesystem is the source of truth.**

Notes must ultimately exist as normal files and directories on the Linux server.

Example:

```
/data/notes/
â”œâ”€â”€ 00-Inbox/
â”‚   â”œâ”€â”€ todo.md
â”‚   â””â”€â”€ idea.md
â”œâ”€â”€ Projects/
â”‚   â”œâ”€â”€ Project A/
â”‚   â”‚   â”œâ”€â”€ overview.md
â”‚   â”‚   â””â”€â”€ architecture.md
â”‚   â””â”€â”€ Project B/
â”œâ”€â”€ Research/
â”‚   â”œâ”€â”€ AI/
â”‚   â”‚   â””â”€â”€ agents.md
â”‚   â””â”€â”€ databases.md
â”œâ”€â”€ Daily Notes/
â”‚   â”œâ”€â”€ 2026-09-20.md
â”‚   â””â”€â”€ 2026-09-21.md
â”œâ”€â”€ Attachments/
â”‚   â”œâ”€â”€ image.png
â”‚   â””â”€â”€ diagram.svg
â””â”€â”€ .obsidian/
    â””â”€â”€ ...
```

The web application should read from and write to this directory.

The application must **NOT** convert the notes into a proprietary database format.

A database may optionally be used for metadata, search indexes, sessions, etc., but the Markdown files and attachments remain the authoritative data.

## 2. Problem Statement

Currently, creating and editing Obsidian notes requires access to a machine where:

- Obsidian is installed.
- The Obsidian vault exists locally.
- The user has access to that machine.

This creates unnecessary friction.

The desired workflow is:

```
Any device
    |
    | Browser
    v
Linux Server
    |
    v
Web Application
    |
    v
Markdown Vault
    |
    â”œâ”€â”€ .md files
    â”œâ”€â”€ attachments
    â”œâ”€â”€ folders
    â”œâ”€â”€ images
    â”œâ”€â”€ PDFs
    â””â”€â”€ other vault files
```

The user should be able to open:

```
http://SERVER_IP/
```

and immediately access the Markdown vault.

## 3. Primary Goals

The application MUST support:

- Viewing Markdown notes.
- Creating Markdown notes.
- Editing Markdown notes.
- Renaming notes.
- Deleting notes.
- Creating directories.
- Renaming directories.
- Deleting directories.
- Moving notes between directories.
- Moving directories.
- Uploading existing Markdown files.
- Uploading attachments.
- Preserving directory structure.
- Downloading/exporting the entire vault.
- Obsidian-compatible Markdown.
- Internal note links.
- Relative attachment paths.
- Search.
- File tree navigation.
- Markdown preview.
- Raw Markdown editing.
- Autosave or explicit save.
- Server-side filesystem persistence.
- Running entirely on a Linux server.

## 4. Non-Goals

Do **NOT** initially attempt to recreate all functionality of Obsidian.

The first version should **NOT** attempt to implement:

- Obsidian plugins.
- Full Obsidian Canvas compatibility.
- Full Dataview compatibility.
- Obsidian Sync protocol.
- Real-time multi-user collaborative editing.
- Complex graph visualization.
- Proprietary binary database storage.
- Conversion of Markdown into another note format.

The project should prioritize:

**Reliability + filesystem compatibility + simplicity.**

## 5. Source of Truth

This is one of the most important requirements.

The filesystem **MUST** be treated as the canonical source of truth.

For example:

```
/data/vault/Projects/test.md
```

is the actual note.

If the web application saves:

```
Projects/test.md
```

the server filesystem must contain:

```
/data/vault/Projects/test.md
```

If someone manually modifies:

```
/data/vault/Projects/test.md
```

outside the application, the application should detect the modification and display the updated contents.

Do not require the user to manually import/export notes after every change.

## 6. Vault Structure

The application should support an arbitrary directory structure.

Example:

```
vault/
â”œâ”€â”€ .obsidian/
â”œâ”€â”€ Notes/
â”œâ”€â”€ Projects/
â”‚   â”œâ”€â”€ Client A/
â”‚   â””â”€â”€ Client B/
â”œâ”€â”€ Books/
â”œâ”€â”€ Research/
â”œâ”€â”€ Attachments/
â””â”€â”€ Daily Notes/
```

- Do not flatten the directory structure.
- Do not rename files automatically unless explicitly requested.
- Do not move attachments automatically unless the user explicitly requests it.

Preserve:

- filenames
- directory names
- extensions
- relative paths
- capitalization
- spaces
- Unicode characters

as safely as the operating system allows.

## 7. Markdown Compatibility

The application must primarily support standard Markdown.

It should also support common Obsidian Markdown syntax where practical.

### Wikilinks

```
[[My Note]]

[[Projects/Project A]]

[[My Note|Display Name]]
```

### Embeds

```
![[image.png]]

![[Another Note]]
```

### Tags

```
#project
#research
```

### Frontmatter

```yaml
---
title: Example Note
created: 2026-09-21
tags:
  - project
  - example
---
```

Frontmatter must be preserved exactly as much as possible.

The application should not destroy unknown frontmatter fields.

## 8. Editing Experience

The application should provide a Markdown editor.

The initial implementation may use a proven Markdown editor library rather than building an editor from scratch.

Required capabilities:

- Markdown editing.
- Headings.
- Bold.
- Italic.
- Lists.
- Code blocks.
- Links.
- Images.
- Tables.
- Blockquotes.
- Checklists.
- Search/replace.
- Keyboard shortcuts.
- Save.
- Autosave.
- Preview.

The user should have two modes:

```
Edit
Preview
```

A split view may optionally be supported:

```
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚ Markdown             â”‚ Preview              â”‚
â”‚                      â”‚                      â”‚
â”‚ # My Note            â”‚ My Note              â”‚
â”‚                      â”‚                      â”‚
â”‚ Some **text**        â”‚ Some bold text       â”‚
â”‚                      â”‚                      â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

## 9. File Explorer

The main interface should contain a file tree.

Example:

```
VAULT

â–¾ Projects
  â–¾ Project A
      overview.md
      architecture.md
  â–¸ Project B

â–¾ Research
    AI.md
    Databases.md

â–¾ Daily Notes
    2026-09-20.md
    2026-09-21.md

Attachments
```

Actions:

- New note
- New folder
- Upload file
- Upload folder
- Rename
- Move
- Delete
- Download
- Refresh

Right-click/context-menu support is desirable but not mandatory for v1.

## 10. Creating a Note

The user should be able to click:

```
+ New Note
```

and enter:

```
Folder:
Filename:
```

Example:

```
Folder: Projects/Project A
Filename: meeting-notes.md
```

The application creates:

```
/data/vault/Projects/Project A/meeting-notes.md
```

The user can immediately begin editing.

The file must be a real `.md` file on disk.

## 11. New Note Templates

Optional but recommended.

Allow a configurable default template.

Example:

```markdown
---
created: {{date}}
modified: {{date}}
---

# {{title}}
```

Template functionality should not interfere with normal Markdown files.

## 12. Upload Existing Vault

The application must support importing an existing Obsidian vault.

The user should be able to upload:

```
MyVault/
â”œâ”€â”€ .obsidian/
â”œâ”€â”€ Notes/
â”œâ”€â”€ Projects/
â”œâ”€â”€ Attachments/
â””â”€â”€ ...
```

The application must preserve the directory structure.

Preferred upload formats:

**Option A**

Upload a ZIP:

```
MyVault.zip
```

The server extracts it into the configured vault directory.

**Option B**

Upload individual files/folders through the browser.

Both can eventually be supported.

ZIP import should be implemented first because it makes importing an existing Obsidian vault much easier.

## 13. Export Vault

Provide:

```
Download Vault
```

The application should create a ZIP containing the complete vault.

Example:

```
my-vault.zip
```

The ZIP must contain:

```
.obsidian/
Notes/
Projects/
Attachments/
*.md
```

The exported ZIP should be directly usable as an Obsidian vault.

## 14. Attachments

Attachments must be treated as normal filesystem files.

Support common types:

- PNG
- JPG/JPEG
- GIF
- SVG
- WebP
- PDF
- TXT
- CSV
- ZIP
- DOC/DOCX where appropriate
- Other files where safe

Do not unnecessarily convert attachments.

If the user uploads:

```
Attachments/image.png
```

the server should store exactly that file.

Markdown references should remain valid.

Example:

```
![[image.png]]
```

or:

```
![Image](../Attachments/image.png)
```

## 15. Image Upload From Editor

Allow the user to upload an image while editing a note.

Recommended workflow:

```
User pastes/drops image
        |
        v
Application uploads image
        |
        v
Image stored in configured attachment directory
        |
        v
Markdown reference inserted
```

For example:

```
![[Attachments/screenshot.png]]
```

The exact attachment strategy should be configurable.

## 16. Internal Links

The application should understand Obsidian-style links.

Example:

```
[[My Note]]
```

When clicked, the application should open the corresponding note.

It should support:

```
[[My Note]]
[[My Note|Custom text]]
[[Folder/My Note]]
```

Where possible, resolve links using the vault filesystem rather than relying on a database.

Broken links should be visually identifiable.

## 17. Standard Markdown Links

Also support:

```
[My Note](../Projects/test.md)
```

and:

```
[Website](https://example.com)
```

Do not rewrite normal Markdown links unnecessarily.

## 18. Search

Implement vault-wide search.

Search should look through `.md` files.

Example:

```
Search: docker deployment
```

Results:

```
Projects/Server Setup.md
Research/Docker.md
Daily Notes/2026-09-20.md
```

Display:

- filename
- directory
- matching text snippet
- line number if practical

Clicking a result should open the note.

## 19. Search Index

For small vaults, direct filesystem searching may be sufficient.

For larger vaults, use an optional search index.

Possible architecture:

```
Markdown files
      |
      v
Filesystem watcher
      |
      v
Search index
```

The search index is disposable.

If the search database is deleted, the application must be able to rebuild it from the Markdown files.

Never make the search database the source of truth.

## 20. External Filesystem Changes

The application should monitor the vault directory.

Example:

```
Obsidian
   |
   v
note.md changed
   |
   v
Filesystem
   |
   v
File watcher
   |
   v
Web application refreshes state
```

If a note is changed outside the application, the web UI should detect it.

If practical, use a filesystem watcher such as:

```
inotify
```

or an equivalent library for the chosen backend.

## 21. Concurrent Editing

For v1, multi-user real-time collaboration is **NOT** required.

However, the application must avoid silently overwriting external changes.

Example:

```
Browser opens note
        |
        v
Note version A
        |
        +---- External process modifies note
        |
        v
Note version B
```

If the browser tries to save version A after version B exists, detect the conflict.

Display something similar to:

```
This file was modified outside the application.

[View External Changes]
[Reload]
[Overwrite]
[Cancel]
```

Never silently destroy newer data.

## 22. File Safety

The application must prevent path traversal.

Never allow a request such as:

```
../../etc/passwd
```

to escape the configured vault directory.

Every filesystem operation must resolve and validate the final path.

The application must guarantee:

```
resolvedPath.startsWith(VAULT_ROOT)
```

before performing filesystem operations.

Do not expose arbitrary server filesystem access through the API.

## 23. Authentication

The application should support authentication even if it is initially deployed on a private LAN.

Minimum v1 authentication:

```
Username
Password
```

or a single-user password-based login.

- The application should not expose the vault anonymously by default.
- Sessions should be secure.
- Passwords must never be stored in plaintext.
- Use a proper password hashing algorithm such as Argon2 or bcrypt.

## 24. HTTPS

The application should work over HTTP during initial development.

Production deployment should support HTTPS.

Recommended production architecture:

```
Internet/LAN
     |
     v
Nginx / Caddy
     |
     v
Web Application
     |
     v
/data/vault
```

If HTTPS is configured, secure cookies must be used.

## 25. Server Architecture

Use a clean separation between frontend and backend.

Suggested architecture:

```
Browser
   |
   | HTTP/WebSocket
   v
Backend API
   |
   â”œâ”€â”€ Authentication
   â”œâ”€â”€ File API
   â”œâ”€â”€ Markdown API
   â”œâ”€â”€ Search
   â”œâ”€â”€ Upload
   â”œâ”€â”€ Export
   â””â”€â”€ Filesystem Watcher
          |
          v
     Vault Directory
```

Frontend:

```
React / TypeScript
```

Backend may use:

```
Node.js + TypeScript
```

or another mature backend framework.

Prefer technologies that are:

- stable
- easy to deploy on Linux
- well documented
- easy to maintain
- good at