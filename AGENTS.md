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

<!-- BEGIN NEOMIND instructions -->
## NeoMind controlled workflow

This project explicitly selects execution_mode: neomind-controlled. NeoMind opens and owns the Coordinator and worker sessions, their identity, tools, records, stage transitions and checks.

### Backend-owned session

When the runtime supplies an explicit runtime role and stage with bound tools, execute that bounded assignment with the supplied semantic tools. Use backend-provided execution state, policy and scope; project instructions describing client setup apply to the client intake below. The host enforces Workspace Trust and model access. Report an actual host or tool failure with its returned diagnostic; a private .neomind path is not a worker input or a reason to reopen client setup. Obtain required saved context through the advertised semantic tools and keep runtime identities, credentials and authorization bound by the backend.
When the assignment supplies a Cornell compiler, its canonical note.md, exercises.md and answers.md are compiler-owned generated artifacts; provide semantic research instead of hand-editing that trio. Ordinary source/report writes remain separate. A declared local script uses command and output_paths in execution_steps; a later task_run with title and input_path supplies prepared JSON on stdin without changing the command.

### Client intake

These steps apply to a direct user request outside a backend-owned session. This chat is an entrypoint into the exact project's NeoMind runtime.
Before submission, discover the connected NeoMind tools through the client tool search. Tools may be deferred; in functions.exec environments search ALL_TOOLS for the exact manager tool and invoke its tools function. An absent name in the initial visible list is not proof of a missing connection.
For a new user request call manager_run once with the complete requirement and execution_mode: neomind-controlled. Keep the returned durable workflow receipt. Accepted work continues while VS Code remains open, independently of this chat. Use manager_status when the user asks for progress; use manager_control with that exact workflow ID and action pause, resume or cancel when requested. Select an existing saved workflow explicitly when multiple workflows exist.
For request content, supply the full product goal in requirement or requirements, retaining all acceptance, process, scope, preservation and safety obligations. Select runtime dispatch with execution_mode; query status through manager_status and control a saved workflow through manager_control with its workflow_id and action. These client operations do not request product orchestration changes. Preserve actual authentication, storage, execution or orchestration product requirements. When product and operating instructions cannot be separated unambiguously, retain the complete request; the backend treats opaque input conservatively.
For a new intake, copy the complete user requirement verbatim. Do not append runtime operating instructions, inferred review gates, extra acceptance criteria or invented report files to requirement. The backend already owns dispatch, verification and final workflow reporting; keep those client operations in their declared tool fields. Resolve an explicit reference to an earlier user request from its saved context without inventing obligations.
The runtime performs planning, implementation and independent verification, with additional specialists and review according to risk and the saved contract. Return the receipt and actual saved outcome to the user. Tool credentials, assignment claims, progress bookkeeping and lifecycle changes are handled by the runtime. Native subagent delegation and separate parent-chat implementation are outside this controlled execution path.
Enable the Model Bridge for this exact trusted workspace and grant model access through VS Code before running work. Model workers use the VS Code LM Bridge and configured 9router/vendor model policy even when this chat is Codex. The parent chat's provider/model remains independent. Closing VS Code interrupts owned sessions and checks; reopening reconciles the last durable checkpoint. A missing Bridge or permission is an actionable setup condition; preserve the receipt instead of starting another implementation.
Saved legacy workflows retain their original mode, history and committed acceptance conditions. Backend continuation records link controlled execution to existing work without rewriting earlier evidence. Use only the saved IDs returned by NeoMind.
Read .neomind/guides/controlled-workflows.md for setup, recovery, evidence and platform limits. Generated config establishes registration intent; verify actual MCP tool discovery and invocation in this client. Model aliases and a completed model turn do not establish upstream model identity or accepted work.
<!-- END NEOMIND instructions -->
