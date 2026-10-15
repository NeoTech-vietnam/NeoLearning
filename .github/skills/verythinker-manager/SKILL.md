---
name: verythinker-manager
description: Manage a user's engineering requirement, batch, feature, fix, or interrupted VeryThinker workflow. For one exact requirement covered by an eligible project-local warm-procedure recipe binding, follow the Fast path in the manager guide; otherwise use the standard workflow.
license: MIT
---

# Own the engineering outcome

Read `.verythinker/guides/manager.md` and `.verythinker/roles/manager.md`. Follow the manager procedure automatically when the user gives engineering intent; the user does not need to name a role, invoke a skill, or operate the CLI.

Start by inspecting persisted workflow state and installed policies. When `.verythinker/routing.json` exists, the intake agent automatically invokes `manager_run` with the user's requirement or requirements array. Observe and resume the managed native coordinator through status, bounded waits, and native resumption. An already bound manager or specialist follows its packet without recursively launching another coordinator. Legacy projects without routing policy retain the `manager_begin` procedure.

For each new routed requirement, let the native manager select Fast only when `.verythinker/fast-bindings.json` contains one exact eligible requirement binding to a known reviewed versioned recipe for a qualified existing warm procedure. Unknown, ambiguous, malformed, changed, or risky bindings stay on Standard. When selected, read `.verythinker/guides/fast-workflow.md` for the one-task scope, stage grants, interruption recovery, follow-up reassessment, and unchanged evidence/review gates.

Complete the increment through actual core operations and signed native invocations. Strong roles use `gpt-6-luna` with max reasoning effort for requirements, design, verification strategy, and independent review. Luna workers use medium reasoning for bounded implementation, retrieval, documentation, and routine checks; Terra with medium reasoning requires bridge-confirmed Luna unavailability. Resolve role capabilities and reviewed recipes before dispatch. Record discussion, protected expectations, final decisions, substantive work records, Cornell demonstrations/practice, verification evidence, separate review, and acceptance. Use saved policy for automatic private archives and reviewed knowledge contribution PR creation. MCP is preferred; consult `verythinker --help` for agent-operated CLI fallback.

For interruption recovery and worker completion waits, follow the manager guide's recovery procedure. Bound workers report their current work and return instead of waiting on their own inference; the coordinator waits on workers. Produce requested local artifacts before optional provider or publication follow-up, and retain actual credential, trust, or permission blockers.

For pending user messages captured during an active invocation, follow the manager guide's continuation procedure and `docs/continuation-recovery.md`. Apply only exact IDs after incorporation and reassessment through the signed manager-only operation; acknowledgment alone does not apply them.

Report decisions, delivered behavior, evidence, documentation, task status, contribution PRs, and any real blocker. Ask only for missing product intent or a required external action. A blocked native capability remains a recorded limitation; it is never replaced by an invented success.
