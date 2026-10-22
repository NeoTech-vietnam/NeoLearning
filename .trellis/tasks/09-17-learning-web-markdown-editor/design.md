# Learning Web Markdown editor — design

## Boundaries

The browser owns only transient draft state. `server/files` remains responsible
for path containment, revision comparison, diff generation, and atomic writes.
The Editor sends the exact revision returned by its last read or successful
write; it never predicts a new revision.

## Data flow

```text
Atlas lesson -> #/editor?path=... -> GET /api/files/read
draft change -> safe Markdown preview (local only)
Review save  -> POST /api/files/preview-diff
Confirm save -> PUT /api/files/write -> returned revision becomes new base
409 conflict -> preserve draft -> user copies draft or reloads current
```

`App.tsx` lazy-imports the editor page. Monaco, React Markdown, and GFM parsing
are imported only from that chunk. Raw HTML support is deliberately not enabled,
so script-bearing Markdown remains inert.

Monaco workers use the package's public `editor/editor.worker` export. Importing
the physical `esm/vs/...` path is incompatible with Monaco 0.56's export map,
which remaps public subpaths into that directory.

## Navigation safety

`beforeunload` handles browser close/reload. A capture listener intercepts local
hash links while dirty and opens an application confirmation modal. Confirming
navigation discards only the browser draft; it never writes or deletes a file.
