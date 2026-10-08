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
<!-- TRELLIS:START -->
# Trellis Instructions

These instructions are for AI assistants working in this project.

This project is managed by Trellis. The working knowledge you need lives under `.trellis/`:

- `.trellis/workflow.md` — development phases, when to create tasks, skill routing
- `.trellis/spec/` — package- and layer-scoped coding guidelines (read before writing code in a given layer)
- `.trellis/workspace/` — per-developer journals and session traces
- `.trellis/tasks/` — active and archived tasks (PRDs, research, jsonl context)

If a Trellis command is available on your platform (e.g. `/trellis:finish-work`, `/trellis:continue`), prefer it over manual steps. Not every platform exposes every command.

If you're using Codex or another agent-capable tool, additional project-scoped helpers may live in:
- `.agents/skills/` — reusable Trellis skills
- `.codex/agents/` — optional custom subagents

Managed by Trellis. Edits outside this block are preserved; edits inside may be overwritten by a future `trellis update`.

<!-- TRELLIS:END -->
