---
taskId: LW-T07
title: Automated quality and browser tests
status: pending
priority: high
model: terra
wave: 3
dependencies: [LW-T02, LW-T03, LW-T04A, LW-T04, LW-T05, LW-T06]
ownership: [playwright.config.ts, tests/e2e, tests/fixtures, scripts/test-fixture.ts]
---

# T07 — Automated quality and browser tests

## Goal

Prove the primary learning and authoring journeys in a real browser without
touching the actual curriculum.

## Requirements

- Configure Playwright against a temporary fixture repository created per suite.
- Cover: start app, open a country, zoom through region/topic/lesson, return by
  breadcrumb, browse a disk-only topic, search, open quest, complete
  milestone, restart server and retain progress, edit Markdown, preview diff,
  save, reload and verify content.
- Add negative journeys for traversal attempts, stale-revision conflict, invalid
  quest, API unavailable, and unsafe rendered HTML.
- Capture trace and screenshot on failure; tests must be deterministic and must
  not rely on internet access.
- Add an aggregate `npm run check` executing formatting/lint if configured,
  typecheck, unit/integration tests, production build and E2E tests.

## Acceptance criteria

- Tests use only temporary fixtures and leave the real repository unchanged.
- The full check passes from a clean install.
- A deliberately broken save, route, or persistence behavior causes a meaningful
  test failure.

## Validation

```bash
npm run check
```
