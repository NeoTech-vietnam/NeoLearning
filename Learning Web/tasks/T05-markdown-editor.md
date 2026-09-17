---
taskId: LW-T05
title: Markdown reader and authoring workspace
status: pending
priority: critical
model: terra
wave: 2
dependencies: [LW-T02, LW-T03]
ownership: [src/editor, src/app/routes/editor.tsx, tests/editor]
---

# T05 — Markdown reader and authoring workspace

## Goal

Provide a safe source/preview/diff workflow for reading and editing curriculum
Markdown through the browser.

## Requirements

- Three modes: rendered reading view, split source/preview, and pre-save diff.
- Use Monaco for source editing; lazy-load it so the atlas initial bundle does not
  include the editor.
- Render common Markdown and GFM safely; raw HTML must not execute scripts.
- Track dirty state and warn before navigation or browser close.
- Save is always explicit: request server diff, show it, then send the write with
  the base revision.
- On HTTP 409, preserve the user's draft and offer reload-current or copy-draft;
  do not auto-merge in MVP.
- After saving, show success and update to the returned revision.

## Acceptance criteria

- A user can open a real indexed document, edit it, preview it, review the exact
  diff, save it, reload, and see persisted content.
- Script-bearing Markdown is rendered inert.
- Failed and conflicting saves never discard the draft.
- Tests cover mode switching, dirty guard, preview, save, conflict, server error,
  and editor lazy loading.

## Validation

```bash
npm run test -- editor
npm run typecheck
npm run build
```

