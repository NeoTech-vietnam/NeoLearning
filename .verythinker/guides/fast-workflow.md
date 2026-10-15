# Fast workflow

Use this procedure only after `manager_run` has selected Fast for one exact requirement. Fast v1 is limited to one bounded developer task for a qualified existing warm procedure with a known reviewed recipe. The project binding, recipe version, single-task scope, risk flags, protected inputs, and hashes determine eligibility. Fast reduces coordination work; it makes no runtime or quality promise. Preserve the same evidence standard and acceptance gates.

## Plan

The managed native coordinator selects Fast automatically only when `.verythinker/fast-bindings.json` has one exact requirement match and the binding resolves to a supported reviewed recipe version. The binding supplies recipe parameters, up to five existing editable files, existing protected verification inputs, and all-false security, safety, interface, dependency, and environment risk flags. The planner must produce exactly one bounded developer task within that scope. Selection stores hashes for the binding, recipe, relevant policy, protected inputs, and planning baseline. Validate these again before using the selection. A batch, unknown or duplicate requirement, unsupported or changed recipe, malformed or unreadable file, protected path, risk flag, or plan that needs more than one task selects the Standard workflow. An explicitly requested invalid Fast selection fails closed.

The planner is one strong-role manager invocation with a core-issued composite grant for the manager, requirements, architect, and verifier responsibilities needed by this bounded plan. The grant is workflow-scoped and permits planning records only. Record measurable requirements, one unstarted developer task, design, and checks against the selected recipe. The planner may leave the task in draft; the separate independent strong-role plan review and `design-ready` core gate establish readiness before production. The Fast grant does not authorize the planner to edit project files.

**Done:** the plan is current, its allowed files and protected checks match the binding, and the independent planning review approves it.

## Produce and verify

Before production, verify `design-ready`; the task remains unstarted until the producer starts it. The core issues the developer producer a task-scoped grant only when this gate passes. The grant binds the selected workflow and task, exact editable paths, reviewed task plan, protected check identities, and current routing configuration. The producer uses the reviewed recipe and may edit only those files. It cannot change requirements, design, checks, protected inputs, or planning decisions. Revalidate the binding, protected inputs, and grant before each protected operation.

Run every assigned protected check against the current implementation. Archive actual outputs and failures against their exact baseline. Keep the independent reviewer out of implementation; it assesses the current files, records, evidence, and documentation, and retains the normal acceptance authority. Resolve findings through a bounded repair assignment, preserve old receipts and evidence, and rerun affected checks. A repair creates additional history; it never substitutes for fresh current evidence.

The successful path uses four principal native invocations: planner, independent planning reviewer, producer, and independent final reviewer. They use three native threads when the reviewer thread supports a fresh final-review invocation; otherwise use a separate final-review thread. Repair and private-resume invocations remain additional immutable history. Preserve the standard strong-role Luna/max and worker Luna/medium model policies, including Terra/medium only after bridge-observed Luna unavailability.

**Done:** every protected check has current archived evidence, the independent final review passes on the current baseline, and the core acceptance gate passes.

## Observe

Use `manager_progress` for routine polling while a native invocation runs; it is a compact read-only progress projection and leaves validation unevaluated. Read full `manager_status` at stage changes, before decisions and closure, or when the next action is unclear. It reevaluates workflow gates. Do not treat either polling output as a completion receipt: accept only through the normal core gate after current evidence and independent review.

The native `manager_run` controller selects and drives the workflow stages. Keep the user-facing path at the requirement and its results; the manager operates the native and core tools. On interruption, resume the same Fast stage through its private stage-aware resume, retaining its bounded grant and recording a fresh signed receipt. A user follow-up is saved and queued for plan reassessment; acceptance stays gated until the follow-up is incorporated and affected requirements, design, scope, and checks are reassessed. If a failure or newly discovered risk exceeds the selected recipe or task scope, preserve its receipts and evidence, then route the open work through Standard reassessment with the existing role/quorum requirements. Never edit the binding, protected oracle, evidence, or review to retain Fast eligibility.
