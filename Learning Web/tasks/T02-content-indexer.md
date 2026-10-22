---
taskId: LW-T02
title: Curriculum content indexer
status: pending
priority: high
model: terra
wave: 1
dependencies: [LW-T01]
ownership: [server/content, server/routes/content.ts, src/shared/content.ts, tests/content]
---

# T02 — Curriculum content indexer

## Goal

Convert the on-disk curriculum hierarchy into a stable, searchable, multi-level
content tree that the atlas and editor can consume. README links provide preferred
labels and order where available.

## Requirements

- Parse root `README.md` links as preferred labels and ordering, not as the
  membership rule for on-disk directories.
- Scan `01_Hardware` through `06_Product_Concepts` to discover real content,
  including folders absent from the root README. Skip `Example`/`Examples`
  directory branches, including numbered variants such as `02_example`.
- Do not descend into `.git`, generated folders, `.data`, or submodule internals.
- Produce stable IDs from normalized repository-relative paths.
- Classify nodes as `world`, `country`, `region`, `topic`, or `lesson`;
  preserve arbitrary folder depth rather than assuming a fixed tree.
- Return the six canonical countries even when one is not yet present in the
  root README. Mark that difference as a diagnostic instead of hiding content.
- Capture title, relative path, section/region, children, Markdown summary,
  available headings, and last-modified timestamp.
- Parse optional YAML frontmatter without requiring it in existing documents.
- Place every discovered topic folder under its actual parent. Do not create
  virtual `Uncharted` nodes solely because a README link is absent.
- Expose `GET /api/content/tree`, `GET /api/content/document?path=...`, and
  `GET /api/content/search?q=...`.
- Use a process-memory index and refresh it after a successful file save.
- Search title, path, headings, and plain Markdown text; cap result size.

## Acceptance criteria

- The real top-level curriculum appears in the API tree in repository order.
- Country order is `01` through `06`; Software is not flattened into the world.
- Disk-only language, architecture, RTOS, advanced-topic, and product folders
  appear under their actual parents; README links to missing directories still
  produce diagnostics.
- Empty topic README files still appear as nodes.
- Malformed Markdown or frontmatter reports a per-file diagnostic without
  crashing the whole index.
- Fixture tests cover nested folders, Unicode, duplicate titles, empty files,
  malformed frontmatter, README/folder disagreement, arbitrary nesting,
  disk-only paths, excluded Example branches, and ignored paths.

## Validation

```bash
npm run test -- content
npm run typecheck
```
