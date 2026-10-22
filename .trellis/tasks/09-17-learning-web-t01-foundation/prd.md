# Learning Web T01 foundation

## Goal

Implement LW-T01 from Learning Web/tasks/T01-foundation.md as the blocking foundation for the Learning Web MVP.

## Requirements

- Implement the complete scope of `Learning Web/tasks/T01-foundation.md`.
- Create a runnable React 18 + TypeScript + Vite frontend and a minimal Node HTTP API.
- `npm run dev` must start the browser app and API together; Vite proxies `/api`.
- The production Node process must serve both API routes and the built frontend.
- Define shared contracts for content nodes/documents, quests/milestones,
  progress state, and typed API errors without implementing domain behavior.
- Expose `GET /api/health` returning `{ "status": "ok" }`.
- Keep all new application source under `Learning Web/` and keep dependencies
  minimal.
- Ignore dependencies, build output, coverage, and personal `.data/` state.
- Do not implement curriculum indexing, file writes, atlas UI, editor, quest
  persistence, or production artwork in this task.

## Acceptance Criteria

- [ ] `npm ci` completes from the committed lockfile.
- [ ] `npm run typecheck` succeeds for browser and server code.
- [ ] `npm run build` produces a production frontend and server build.
- [ ] `npm run dev` starts both processes and `/api/health` returns the required
  JSON payload.
- [ ] Shared contracts compile when imported from browser and server modules.
- [ ] No application source is created outside `Learning Web/`.

## Notes

- Canonical implementation task: `Learning Web/tasks/T01-foundation.md`.
- Tracker: NEL.10; umbrella review tracker: NEL.4.
