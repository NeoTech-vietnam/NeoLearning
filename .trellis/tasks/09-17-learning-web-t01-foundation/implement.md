# Learning Web T01 foundation — implementation plan

1. Inspect existing files and confirm no generated app foundation exists.
2. Add package scripts and TypeScript/Vite configuration.
3. Add shared contracts and the minimal React app shell.
4. Add the Node health API, dev proxy, and production static serving.
5. Add targeted tests for health and contract-safe boot behavior.
6. Install from the lockfile, then run typecheck and production build.
7. Start the dev processes, request `/api/health`, and stop them cleanly.
8. Review the diff only within T01 ownership and produce a handoff.

## Validation

```bash
cd "Learning Web"
npm ci
npm run typecheck
npm run build
```

The final validation also starts `npm run dev` and checks the health endpoint.
