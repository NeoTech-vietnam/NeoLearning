# Learning Web T01 foundation — design

## Boundary

The foundation owns process startup, build conventions, the app shell, and
shared transport contracts. Domain features remain behind later task boundaries.

## Runtime shape

- Vite serves the React client during development.
- A Node/Express process serves `/api/health` during development.
- A concurrency script starts both processes through one `npm run dev` command.
- Vite proxies `/api` to the Node port so client code uses one relative origin.
- Production compiles the client and server separately; the Node entry serves
  the static client build with an SPA fallback.

## Contract ownership

`src/shared/` is the only owner of cross-layer TypeScript contracts. Browser
and server import those types instead of defining local payload variants.
Contracts are data-only and do not introduce indexer, editor, or quest logic.

## Constraints

- Bind the API to loopback by default.
- Use an explicit configurable port with a documented default.
- Avoid framework layers beyond what T01 needs.
- Do not move or rewrite curriculum Markdown.

## Rollback

All changes are isolated under `Learning Web/` plus its existing `.gitignore`
ownership. Reverting the T01-owned files removes the runtime without touching
the curriculum.
