# Handoff

Implemented the approved reader/notebook/motion scope in Learning Web; no curriculum, Examples or reward-rule edits.

Validation: npm run check passed on 2026-10-01: TypeScript, 60 unit/integration tests, production build and 46 Playwright E2E. git diff --check passed. Desktop and phone reader screenshots inspected. Existing Monaco chunk-size warning remains; no new dependency.

Reader preferences remain browser-local; reading position, highlights, notes and bookmarks persist in the private server's notebook.json. Source revisions guard anchors, and changed-source notes/bookmarks remain detached rather than attaching to another passage. CSS Custom Highlight support paints selections; quoted entries/navigation remain available without it. Common-language code coloring is lexical, with plain fallback.

Authenticated preview service was restarted using the tested build. http://100.123.52.88:4176/#/atlas is available through Tailscale; unauthenticated notebook requests return 401.

No commit/push this turn. Leave task records in progress until user reviews/requests commit; do not archive with uncommitted code. No tracker_update tool is available.
