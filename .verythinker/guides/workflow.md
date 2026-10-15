# Engineering workflow

Use one native agent platform for a session. Read the active task before its journal: current requirements and baselines take precedence over historical observations. Read `process.md` when choosing verification levels or evaluating a gate.

For a user's new engineering intent or a resumed increment, first read `manager.md`: the manager owns intake, specialist discussion, decisions, delegation, documentation, acceptance, and contribution closure. The steps below are the worker lifecycle; commands are operated by agents.

## Start or resume

1. Run `verythinker doctor` and inspect the capability report. Use the CLI when a native capability is unavailable; report the limit in the work record.
2. Use the `task` commands to find or create the assignment. Inspect its requirements, dependencies, baseline, and current status.
3. Generate `verythinker context <task-id>` and read the referenced records and assigned role contract from `.verythinker/roles/`. Inspect the actual working tree before changing files.
4. Check the `ready` gate. Begin execution when dependencies and verification criteria are sufficient. Return unresolved contradictions to the manager.

Each step is complete when its findings are recorded or its referenced artifact has been inspected. A context packet is a navigation aid; it does not replace source inspection.

## Bound the assignment

The manager assigns one objective with requirement IDs, acceptance criteria, baseline, source references, decisions, assumptions, allowed paths, dependencies, tools, outputs, checks, execution limits, and escalation conditions. Use references to records instead of repeating their entire content. Split a task if it cannot reasonably finish in one worker session.

Start with a manager and no more than three concurrent workers. Delegate only independent work with clear ownership. Prefer one worker when the work shares substantial mutable state. A worker may request further decomposition; the manager owns that decision.

Resolve `economy`, `balanced`, and `strong` tiers against the selected platform's available models. Record both the requested model and the observed model; use `unavailable` when the platform does not expose the observation. Tier names express a routing choice, not a quality guarantee.

## Execute and submit

1. Update task state through the core's `task` and `record` commands. Follow the assigned role's permissions and change scope.
2. Produce the smallest complete deliverable that satisfies the requirement. Record changed contracts and new assumptions for manager review.
3. Run the agreed checks through `check` commands when executable checks are defined. Preserve command output, revision, environment, and limitations as evidence.
4. Complete assigned documentation outputs and update affected requirements/designs/interfaces/project guides. Write substantive content under all seven standard work-record sections: concrete sources, decisions and rationale, results, evidence, limitations, and applicable lessons. State a specific no-lesson reason when applicable.
5. Submit the task with artifact references, actual results, unresolved limitations, and the full `work_record` body through core submission. The core stores its linked knowledge record with `kind: work-record`; the reviewer assesses completeness and consistency on the current documentation baseline. Submission requests review; it does not establish acceptance.

Escalate missing inputs, contradictory requirements, interface changes, work outside scope, or evidence that cannot support the criterion. After one repair attempt, repeated failure returns to the manager for stronger assistance, re-scoping, or a documented blocked state.

A bound worker cannot wait for its own inference to finish. Inspect its receipt with `native_status`, submit the current work report, and return control; the coordinator waits on other workers. A self-wait request is rejected immediately so a worker cannot spend its bounded turn waiting on itself.

## Review and finish

Use a separate reviewer invocation from implementation. The reviewer reads requirements, relevant engineering standards, the actual deliverable, required documentation, work record, checks, and evidence. Record findings with locations and reasons; resolve each finding or obtain a documented owner disposition.

Run the applicable `verify` gate before changing a task to accepted. Use core operations for acceptance; a hook notification or a worker's summary cannot bypass the validator. Hook failure must leave the CLI workflow usable.

Finish with accepted task state and a resumption note: current baseline, task status, remaining decisions, and the next executable action. The manager assigns the curator to derive qualified lessons and complete contribution disposition under `automation.json`. Shared contributions follow `process.md` and `manager.md`; automatic creation of a reviewed draft PR is separate from human approval to merge it.

## Recover

After interruption, inspect task state, latest work records, the working tree, and existing evidence. Continue from the latest verified checkpoint. Repair a deterministic core, schema, configuration, or environment fault within the assignment when the cause and fix are bounded. Keep earlier interrupted histories and failures as historical evidence; resumed claims need current applicable evidence. Do not restart a live worker solely because its latest output message is old while its records continue to advance, and do not add repair/review rounds without a concrete finding. Produce requested local deliverables and continue independent work if an optional provider or publication service fails; report service limits and real credential, trust, or permission blockers. Ask one consolidated question for material product-intent uncertainty. Re-run checks whose revision or environment no longer applies.

Use `verythinker --help` as the source of truth for command arguments. The CLI and MCP expose the same core operations.
