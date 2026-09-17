---
taskId: LW-T03
title: Safe Markdown filesystem API
status: pending
priority: critical
model: terra
wave: 1
dependencies: [LW-T01]
ownership: [server/files, server/routes/files.ts, src/shared/files.ts, tests/files]
---

# T03 — Safe Markdown filesystem API

## Goal

Allow full Markdown authoring while preventing path escape, accidental overwrite,
and partial writes.

## API contract

- `GET /api/files/read?path=...` returns content, relative path, mtime, and SHA-256
  revision hash.
- `POST /api/files/preview-diff` accepts path, base revision, and proposed content;
  it returns a line-oriented diff without writing.
- `PUT /api/files/write` accepts the same fields and writes only when the base
  revision still matches.
- Conflicts return HTTP 409 with the current revision; invalid paths return 400;
  forbidden paths return 403.

## Safety requirements

- Permit only `.md` files inside the repository root; reject absolute paths,
  traversal, null bytes, symlink escape, hidden Git data, and dependency/build
  directories.
- Write to a sibling temporary file and atomically rename it over the target.
- Serialize writes per canonical path.
- Do not implement delete, rename, Git commit, or arbitrary file upload.
- Emit structured errors safe to display in the UI.

## Acceptance criteria

- Concurrent stale edits cannot silently overwrite newer content.
- A failed write leaves the original byte-for-byte unchanged.
- Tests cover traversal variants, absolute paths, symlinks, non-Markdown files,
  conflicting revisions, Unicode content, and successful atomic replacement.

## Validation

```bash
npm run test -- files
npm run typecheck
```

