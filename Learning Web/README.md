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
- Taxonomy source: the hierarchy and order declared in the repository root
  `README.md`; folder scanning supplements it but does not silently redefine it.
- Map hierarchy: Embedded World → country (`01`–`06`) → region → topic → lesson.
- Unindexed folders remain discoverable in an explicit `Uncharted` collection.
- Not in MVP: authentication, cloud sync, multiplayer, mobile editor, achievements,
  firmware compilation, or automatic Git commits.

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
