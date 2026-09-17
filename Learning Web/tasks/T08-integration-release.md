---
taskId: LW-T08
title: Integration hardening and local release
status: pending
priority: critical
model: terra
wave: 4
dependencies: [LW-T07]
ownership: [Learning Web cross-cutting integration, README.md, docs, package scripts]
---

# T08 — Integration hardening and local release

## Goal

Integrate all feature branches, replace fixture seams with real APIs, and deliver
a documented local application that satisfies the MVP completion gate.

## Requirements

- Connect the atlas to the content index and quest route data.
- Connect region/topic navigation to reading and editing routes.
- Verify save-triggered index refresh and quest knowledge links.
- Add startup validation with actionable messages for wrong working directory,
  unavailable port, unreadable repo, or malformed local progress.
- Document prerequisites, install, development, production-local start, data
  location, backup behavior, tests, and troubleshooting.
- Measure initial atlas load and editor lazy-load; fix obvious regressions without
  adding speculative caching.
- Review all filesystem boundaries and confirm no endpoint writes outside the
  approved Markdown/progress targets.

## Acceptance criteria

- From a fresh clone: `npm ci`, `npm run check`, `npm run build`, and the
  documented production-local start all succeed.
- The complete manual journey works against the real NeoLearning curriculum.
- Closing and restarting the app preserves progress.
- Editing a Markdown file produces an inspectable Git working-tree change.
- No curriculum file is modified merely by browsing or tracking progress.
- Known limitations are documented; no critical TODO remains.

## Validation

```bash
npm ci
npm run check
npm run build
npm run start
```

After startup, perform the documented real-curriculum smoke test without saving
unless an intentional Markdown edit has been selected for verification.

## Final handoff

Report the exact commands run, test totals, browser used, changed-file summary,
known limitations, and the first recommended post-MVP task. Do not commit unless
the user explicitly asks.
