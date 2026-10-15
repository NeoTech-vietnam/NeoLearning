# Shared agent tools

Every role can read/search project context, inspect review applicability, resolve project-approved providers, and create its own knowledge, problem and change records. Provider installation follows the saved project policy. A role's specialization guides assignment; it does not hide the shared tools. Signed Fast stages retain their frozen operation and artifact scope.

For a file edit, obtain a task owned by your role with explicit allowed paths. Use `task_file_write` with the current signed invocation and observed file hash. Continue interrupted writes through the same-role resume lineage. Current requirements, design and verification reviews must cover the assignment. Protected expectations and immutable evidence remain managed by their dedicated operations.

A reviewer inspecting another producer's task has read-only implementation access. The reviewer can produce its own assignment report and knowledge records. A separately assigned reviewer-owned documentation task can use editing tools. Review that task through a fresh workflow-bound reviewer invocation with no task assignment, on a different native thread from every producer invocation; the core verifies this independence. Native editing access depends on the assignment and the client's observed permissions.

Use `record_review_status` to inspect the selected review, its decision, target fingerprint, baseline and native observation. A stored review can be present while its applicability is stale. Inspect the stated reason and obtain a fresh separate review for changed inputs. Retain historical passes and failures.

The manager uses `manager_acknowledge` to bind its own confirmed invocation to the same workflow. This records invocation acknowledgment; it does not approve designs, manufacture evidence, accept a task, apply continuations, or change arbitrary workflow fields. After substantively incorporating and reassessing pending user messages, the bound manager uses `manager_apply_continuations` with exact IDs, rationale, and inspected decision/reassessment source IDs. See `docs/continuation-recovery.md` for its contract and recovery examples.

VeryThinker core means the software rules and authoritative records behind these operations. Resolve a rule or implementation defect through a bounded repair assignment. Refer to the actual record, field and validation result; a fictional “CORE owner” is not an escalation destination.
