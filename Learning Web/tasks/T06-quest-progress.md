---
taskId: LW-T06
title: Quest definitions and progress tracking
status: pending
priority: high
model: terra
wave: 1
dependencies: [LW-T01]
ownership: [quests, server/progress, server/routes/quests.ts, server/routes/progress.ts, src/quests, src/shared/quests.ts, tests/quests]
---

# T06 — Quest definitions and progress tracking

## Goal

Make Learning by Making functional with version-controlled quest definitions and
local personal progress.

## Requirements

- Define a documented Markdown/frontmatter quest schema: id, title, level,
  problem, regions, knowledge links, milestones, evidence requirements and
  completion criteria.
- Add one complete `environmental-sentinel` example quest using real curriculum
  links; implementation artifacts may remain placeholders.
- Validate quest IDs, milestone IDs, relative knowledge links and ordering.
- Store personal state in `.data/progress.json` using atomic writes and schema
  versioning. The file must be gitignored.
- Expose APIs to list quests, load one quest, read progress, and set a milestone
  state. Reject unknown quest/milestone IDs.
- Implement Quest Board, quest detail, milestone checklist, knowledge links and
  evidence status. No XP economy or achievements in MVP.

## Acceptance criteria

- The example quest loads from Markdown rather than compiled source.
- Progress survives server restart and never modifies the quest definition.
- A quest cannot be marked complete until required milestones/evidence are done.
- Tests cover invalid schemas, broken links, progress migration, atomic writes,
  unknown IDs, and completion rules.

## Validation

```bash
npm run test -- quests
npm run typecheck
```

