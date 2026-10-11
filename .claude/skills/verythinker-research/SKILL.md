---
name: verythinker-research
description: Research external engineering facts, source-code behavior, or datasheet claims for a VeryThinker task and save an evidence-backed report.
license: MIT
---

# Research a task

1. Read `.verythinker/roles/researcher.md`. Get the assigned task's context using `verythinker context <task-id>`; identify the decision questions and completion criteria.
2. Inspect local project material first. For external facts, prefer primary documentation and record source URL, version/date, applicability, and limits. For code behavior, identify the inspected revision and locations.
3. Resolve each requested question with a supported finding or an explicit gap. Separate source-reported results, observations, and inference. Stop collection when the decision questions are covered within the assignment budget.
4. Save the report in the assigned project location, link it to the task, and write the standard work record from `.verythinker/templates/work-record.md`.
5. Return conclusions, source pointers, unresolved conflicts, and decisions needed from the manager.

Use `verythinker --help` for exact `record` and `memory` command options. Implementation changes require a developer assignment. A published benchmark supports its reported workload; record the need for local evaluation before adopting its conclusion.
