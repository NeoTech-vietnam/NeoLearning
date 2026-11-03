# AGENTS.md

Guidance for AI sessions (Codex and others) working in this repository.

## What this repo is

**NeoLearning** is a personal embedded-systems learning knowledge base, not a
software product repo. It has two roles:

1. A structured study curriculum for embedded engineering (hardware, firmware,
   protocols, soft skills), organized as a folder tree that mirrors
   `Embedded-Engineering-Roadmap.md`.
2. The design/planning home for **NeoAssistant**, a concrete hardware product
   (ESP32-S3 based AI assistant device) that the roadmap's "Phase 1" learning
   plan is building toward.

There is no build system, package manager, or app to run here — most work in
this repo is reading/writing Markdown notes, adding code examples, and
maintaining the curriculum structure. Actual firmware code examples live in
the `Examples/` submodule (see below), not in this repo directly.

## Top-level structure

| Path                                    | Purpose                                                                                                                                                                                                                                                                                                                                                                              |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `README.md`                             | Master index/table of contents into the numbered topic folders below. Update this whenever a folder is added, renamed, or removed.                                                                                                                                                                                                                                                   |
| `Embedded-Engineering-Roadmap.md`       | The full narrative roadmap this repo's structure is derived from. Large (~1500 lines); read the section you need rather than the whole file.                                                                                                                                                                                                                                         |
| `01_Hardware/` … `05_Advanced-Topics/`  | The curriculum itself, one folder per roadmap section (electronics, microcontrollers, protocols, soft skills, advanced topics). Folder numbering matches `README.md` headings.                                                                                                                                                                                                       |
| `06_Product_Concepts/04_NeoAssisstant/` | Product design docs for NeoAssistant: `Concept.md` (hardware BOM, firmware architecture, FreeRTOS task layout, phased roadmap) and `Learning_Tracker.md`/`.html` (progress tracker UI for the Phase 1 learning plan). Note the folder is misspelled `NeoAssisstant` (extra "s") — keep the existing spelling for link stability rather than renaming.                                |
| `Examples/`                             | Git **submodule** → `git@github.com:NeoTech-vietnam/NeoExamples.git`. Holds actual runnable code (ESP32, STM32, Linux, Windows examples) referenced by the curriculum. See `Examples/CLONE_GUIDE.md` for submodule clone/update/push workflow — it is a separate repo with its own history; changes inside it need a commit there *and* a pointer-update commit in this parent repo. |
| `alignment_demo`                        | A stray compiled ELF binary at repo root (not source-controlled intentionally, no obvious owner) — leave it alone unless asked to clean it up.                                                                                                                                                                                                                                       |
| `skills-lock.json`                      | Lockfile for Codex skills pulled from `JuliusBrussee/caveman` (the "caveman" skill suite). Mirrored under both `.agents/skills/` and `.Codex/skills/`.                                                                                                                                                                                                                        |
| `.github/workflows/Codex.yml`          | GitHub Action that runs Codex Action when an issue/PR comment or issue body/title contains `@Codex`.                                                                                                                                                                                                                                                                          |

## Working conventions

- Branches follow `feature/<name>` (current branch: `feature/setup-ai`, used for
  AI-tooling setup work like this file).
- When adding a new topic folder under `01_Hardware`–`05_Advanced-Topics`,
  add a matching entry to `README.md` in the same commit — the README is the
  only nav/index and goes stale otherwise.
- This project's tracker items use the `NEO-` issue key prefix (e.g. `NEO-1`).
- Don't assume this is a firmware build repo — there's no `CMakeLists.txt`,
  `platformio.ini`, or `sdkconfig` at this level. That kind of project
  scaffolding, if ever added, belongs in `Examples/` or a future dedicated
  firmware repo, not mixed into the curriculum tree.

<!-- BEGIN WORKFORCE instructions -->
## WorkForce request entrypoint

The user supplies an ordinary requirement. WorkForce owns the engineering process, worker sessions, model routing, tool execution, recovery and acceptance. This chat is an entrypoint, not a second orchestration engine.

When the backend supplies a role, stage and bound semantic tools, follow that bounded assignment instead of client intake instructions. Do not resubmit its request or reopen setup from this guide.

For a new user-request turn, call request_submit once with new_request: true and the user's full requirement verbatim. This expresses a new task even when the wording matches an older completed task. A retry after a lost tool reply in that same turn omits new_request, recovering the already saved admission instead of creating another task. Do not repeat new_request: true to repair an uncertain delivery. Resolve attached files/folders to actual workspace paths in context; the backend normalizes paths and file types. Do not invent missing attachment contents. Keep operational instructions and inferred obligations out of requirement. Retain the returned request ID and return its receipt. Do not spawn client-side specialists, claim assignments, construct IDs/credentials, write product files or poll progress in a loop.

When the user requests progress, call request_status with the saved request ID and report actual artifacts, criteria and remaining work. When asked to pause, resume or cancel, use request_control for that same request. A genuine unanswered product question is answered through request_control; backend/tool failures are not missing user requirements. An uncertain submission is reconciled by status before a duplicate request is submitted.

Discover the connected WorkForce tools through the client tool search when tools are deferred. Use the exact open trusted workspace. WorkForce runs OpenCode workers against the configured top-models and worker-models custom endpoint aliases. This chat's selected model is independent of worker routing. Accepted work continues when this chat closes while VS Code stays open. Workspace trust and endpoint credentials require the user's actual authorization; never change global security settings or claim unexecuted checks.

The team is WF.PM, WF.SWSD, WF.P-RES, WF.FnD, WF.Reviewer and WF.Tester. The backend tailors V-model/ASPICE obligations to the product and keeps independent review and testing separate from implementation. Each request has its own .workforce/requests folder. Historical NeoMind records retain their original identities and signed evidence. Read .workforce/guides/workforce.md for installation and operation.
<!-- END WORKFORCE instructions -->
