---
name: verythinker-implement
description: Implement an assigned VeryThinker software, firmware, or hardware task within its allowed scope, then submit artifacts and actual check results.
license: MIT
---

# Implement a bounded assignment

1. Read `.verythinker/roles/developer.md` and `.verythinker/guides/workflow.md`. Inspect `verythinker context <task-id>`, the baseline, allowed paths, dependencies, and working tree.
2. Assess the `ready` gate, then start the task using core operations. Complete the assigned behavior within the agreed contracts and ownership boundary.
3. Run the applicable executable checks through the `check` command group. Capture actual results and implementation artifacts. Report unavailable checks and failures explicitly.
4. Update the task's implementation references and required project documentation. Complete substantive content under all seven sections of the standard work-record template.
5. Submit the task with outputs, evidence pointers, remaining limits, and the full `work_record` body for an independent reviewer invocation. The core stores the linked work record; documentation remains part of the reviewed baseline.

Use `verythinker --help` for exact task, record, and check arguments. Return interface changes, missing inputs, or out-of-scope work to the manager. One feedback repair is allowed; repeated failure triggers escalation. Submission is distinct from acceptance.
