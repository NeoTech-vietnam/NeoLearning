---
taskId: LW-T01
title: Application foundation and contracts
status: pending
priority: critical
model: terra
wave: 0
dependencies: []
ownership: [package.json, package-lock.json, vite.config.ts, tsconfig.json, tsconfig.node.json, index.html, src/main.tsx, src/app, src/shared, server/index.ts, .gitignore]
---

# T01 — Application foundation and contracts

## Goal

Create a runnable React/Vite frontend and Node API skeleton inside `Learning Web`
that all later tasks can extend without changing build conventions.

## Requirements

- Provide `npm run dev`, `npm run build`, `npm run typecheck`, `npm run test`, and
  `npm run test:e2e` scripts. `npm run dev` starts frontend and API together.
- Configure Vite to proxy `/api` to the local server in development.
- The production Node process serves the built frontend and API.
- Define shared TypeScript contracts for `ContentNode`, `ContentDocument`,
  `Quest`, `QuestMilestone`, `ProgressState`, and typed API errors.
- Add a minimal app shell and `/api/health` returning `{ "status": "ok" }`.
- Add `.data/`, build output, coverage, and dependency folders to `.gitignore`.
- Keep dependencies minimal; do not implement domain features in this task.

## Acceptance criteria

- `npm ci && npm run dev` opens a page and the health endpoint responds.
- `npm run build` and `npm run typecheck` succeed.
- Shared contracts compile from both browser and server code.
- No source files are created outside `Learning Web`.

## Validation

```bash
npm ci
npm run typecheck
npm run build
```

## Handoff

Document the selected API port, dev URLs, dependency choices, and any contract
assumptions for T02–T07.

