---
planStatus:
  planId: plan-learning-web-mvp
  title: NeoLearning Local Learning Web MVP
  status: ready-for-development
  planType: initiative
  priority: high
  owner: hieu-tran
  stakeholders: []
  tags: [web-app, local-first, learning-by-making]
  created: "2026-09-15"
  updated: "2026-09-15T00:00:00.000Z"
  progress: 0
---

# NeoLearning Learning Web — Implementation Tasks

Build a local-first web application that turns the existing Markdown curriculum
into an interactive world map, supports full Markdown authoring, and tracks
project-based learning quests. The application runs on localhost and never
requires authentication or a cloud service.

## Fixed product decisions

- Runtime: local web application opened in a desktop browser.
- Frontend: React + TypeScript + Vite.
- Backend: small Node.js HTTP API with access restricted to the repository root.
- Content source of truth: the existing Markdown files and folder hierarchy.
- Authoring: source editor, rendered preview, diff, explicit save.
- Personal state: gitignored JSON under `Learning Web/.data/`.
- MVP visual direction: `nimbalyst-local/mockups/cartographic-adventure.mockup.html`.
- World artwork contract: `docs/world-map-art-spec.md`.
- Taxonomy source: on-disk curriculum folders define the hierarchy. The root
  `README.md` supplies preferred labels and ordering where links exist.
- Map hierarchy: Embedded World → country (`01`–`06`) → region → topic → lesson.
- Disk-only folders appear under their real parent, not in `Uncharted`.
  `Example`/`Examples` directory branches (including numbered names such as
  `02_example`) are omitted from the content index for now.
- Not in MVP: authentication, cloud sync, multiplayer, mobile editor, achievements,
  firmware compilation, or automatic Git commits.

## Private phone preview

The local app remains unauthenticated. To test the full app from a phone outside
the LAN, build it and run a separate server bound to localhost with an exact
Tailscale login allowlist:

```bash
npm run build
API_HOST=127.0.0.1 API_PORT=4175 NEOLEARNING_ALLOWED_TAILSCALE_LOGIN=you@example.com npm start
tailscale serve --bg 4175
```

Open the HTTPS URL reported by Tailscale Serve while the phone is connected to
the same tailnet. Serve supplies `Tailscale-User-Login` after stripping
client-supplied copies; the server rejects all page and API requests unless it
matches the allowlist. Keep `API_HOST=127.0.0.1`: direct access to a broader
network interface could forge that header. Do not use Tailscale Funnel for this
write-enabled app. To stop sharing, run `tailscale serve --https=443 off` and
stop the private preview server. First-time Serve activation may require
approval in the Tailscale admin console. Configuring Serve can also require local
administrator permission.

If Serve cannot be configured, use the machine's Tailscale IP directly. Set a
random password of at least 16 characters and require the exact IP-and-port
`Host` header to prevent DNS rebinding:

```bash
npm run build
API_HOST=<tailscale-ip> API_PORT=4176 NEOLEARNING_PREVIEW_HOST=<tailscale-ip>:4176 NEOLEARNING_PREVIEW_PASSWORD=<random-password> npm start
```

Open `http://<tailscale-ip>:4176/#/quests` while connected to the tailnet;
the browser asks for username `neo` and the configured password. The HTTP
address is encrypted by Tailscale's device-to-device tunnel, but browsers may
still label it insecure because there is no HTTPS certificate. Never bind this
server to `0.0.0.0`, forward its port on the router, or publish it with Funnel.

## Delivery waves

| Wave | Tasks | Dispatch rule |
| --- | --- | --- |
| 0 | [T01](tasks/T01-foundation.md) | Must finish first |
| 1 | [T02](tasks/T02-content-indexer.md), [T03](tasks/T03-safe-file-api.md), [T04A](tasks/T04A-visual-foundations.md), [T06](tasks/T06-quest-progress.md) | May run in parallel after T01 |
| 2 | [T04](tasks/T04-atlas-ui.md), [T05](tasks/T05-markdown-editor.md) | T04 starts after T02+T04A; T05 starts after T02+T03 |
| 3 | [T07](tasks/T07-quality-gates.md) | Starts after T02–T06 |
| 4 | [T08](tasks/T08-integration-release.md) | Final integration only |

## Shared implementation rules

1. Read this file and the assigned task completely before editing.
2. Work only inside the task's ownership paths. Do not reformat or revert files
   owned by another task.
3. Do not modify the curriculum Markdown unless a test fixture explicitly needs
   temporary content. Tests must use fixtures or temporary directories.
4. Never accept an absolute path from the client. Resolve canonical paths on the
   server and reject traversal, symlink escape, `.git`, `Examples/.git`, and
   `Learning Web/node_modules`.
5. No autosave to curriculum files. Saving must be explicit and conflict-aware.
6. Keep application state separate from curriculum content.
7. Every task must run its listed validation commands and leave a short handoff
   note describing changed files, commands run, and remaining risks.

## Dispatch prompt template

Use this prompt when assigning one file to a Terra implement session:

```text
Implement the task in Learning Web/tasks/<TASK_FILE>. Read Learning Web/README.md
and the complete task file first. You own only the paths declared by that task.
Other models may be working in the same repository: do not revert their edits;
adapt to compatible changes already present. Satisfy every acceptance criterion,
run the listed validation commands, and finish with a handoff containing changed
files, test results, assumptions, and remaining risks. Do not commit.
```

## Target project structure

```text
Learning Web/
├── package.json
├── vite.config.ts
├── tsconfig*.json
├── src/
│   ├── app/
│   ├── atlas/
│   ├── ui/
│   ├── editor/
│   ├── quests/
│   └── shared/
├── server/
│   ├── content/
│   ├── files/
│   ├── progress/
│   └── index.ts
├── tests/
└── .data/                 # gitignored personal state
```

## MVP completion gate

The initiative is complete only when a fresh clone can install dependencies,
start the app, browse the real curriculum, open and safely edit a Markdown file,
complete a quest milestone, retain progress after restart, and pass unit,
integration, and browser tests.

## Canonical world hierarchy

| Country | Repository root | Map role |
| --- | --- | --- |
| 01 — Hardware Kingdom | `01_Hardware` | Hardware, tools, prototyping and FPGA |
| 02 — Software Empire | `02_Software` | Largest country; software regions and subregions |
| 03 — Protocol Archipelago | `03_Interfaces-and-Protocols` | Interface and protocol families |
| 04 — Skills Guilds | `04_Soft-Skills` | Human and professional skills |
| 05 — Advanced Frontier | `05_Advanced-Topics` | Advanced and specialized domains |
| 06 — Product Realm | `06_Product_Concepts` | Product concepts and capstone destinations |

Map area may reflect descendant count, but every country must remain selectable.
The current cartographic mockup represents a country-level map, not the whole
Embedded World.
