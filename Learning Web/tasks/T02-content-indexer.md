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

Convert the README taxonomy plus the actual Markdown hierarchy into a stable,
searchable, multi-level content tree that the atlas and editor can consume.

## Requirements

- Parse root `README.md` links as the canonical taxonomy, labels, and ordering.
- Scan `01_Hardware` through `06_Product_Concepts` to discover real content and
  detect paths missing from the canonical index.
- Do not descend into `.git`, generated folders, `.data`, or submodule internals.
- Produce stable IDs from normalized repository-relative paths.
- Classify nodes as `world`, `country`, `region`, `topic`, `lesson`, or
  `unindexed`; preserve arbitrary folder depth rather than assuming a fixed tree.
- Return the six canonical countries even when one is not yet present in the
  root README. Mark that difference as a diagnostic instead of hiding content.
- Capture title, relative path, section/region, children, Markdown summary,
  available headings, and last-modified timestamp.
- Parse optional YAML frontmatter without requiring it in existing documents.
- Place discovered-but-unindexed content under `Uncharted` at the nearest valid
  ancestor and return a diagnostic containing its repository-relative path.
- Expose `GET /api/content/tree`, `GET /api/content/document?path=...`, and
  `GET /api/content/search?q=...`.
- Use a process-memory index and refresh it after a successful file save.
- Search title, path, headings, and plain Markdown text; cap result size.

## Acceptance criteria

- The real top-level curriculum appears in the API tree in repository order.
- Country order is `01` through `06`; Software is not flattened into the world.
- Known README/folder mismatches are reported, including any unindexed language,
  architecture, RTOS, advanced topic, or product concept paths.
- Empty topic README files still appear as nodes.
- Malformed Markdown or frontmatter reports a per-file diagnostic without
  crashing the whole index.
- Fixture tests cover nested folders, Unicode, duplicate titles, empty files,
  malformed frontmatter, README/folder disagreement, arbitrary nesting,
  unindexed paths, and ignored paths.

## Validation

```bash
npm run test -- content
npm run typecheck
```
