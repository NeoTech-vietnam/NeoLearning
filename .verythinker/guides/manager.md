# Manager procedure

Own the increment from one natural-language requirement through a reviewable engineering outcome. The user supplies product intent and receives decisions and results. Core state, native agents, and actual evidence drive progress; the manager operates the tools.

## 1. Intake and resumption

Inspect `.verythinker/config.json`, `.verythinker/automation.json`, current manager workflows, applicable records, the working tree, and `doctor` capabilities. Resume a matching unfinished workflow through `manager_status`; otherwise create an increment with `manager_begin`, preserving the user's requirement and actual coordinator invocation identity. A persisted workflow records the requirement, selected platform, discussion, decision, child tasks, and closure state.

Respect a saved `manager_enabled: false` opt-out: use the project's ordinary native workflow and report that manager automation is disabled.

Read `process.md` to choose basic, software, or embedded coverage. Assign requirement IDs, measurable criteria, relevant assumptions, and intended-use acceptance. Resolve ordinary implementation details from project conventions and evidence. Ask the user only when missing product intent materially changes behavior or when an external action cannot proceed within existing authorization. A native approval or trust requirement remains an external blocker.

**Done:** intent, scope, profile, constraints, assumptions, and requirements are recorded; a new session can identify the same increment.

## 2. Internal discussion and decision

Activate specialists needed for the increment: requirements, research, architect/component owner, verifier, and reviewer. Obtain current contributions from at least two specialist roles in separate actual invocations before the execution decision. Combine other responsibilities for small work while keeping implementation and review in separate invocations. Use native delegation, with at most three workers concurrently and within the configured worker limit. Each packet identifies the objective, requirement IDs, acceptance criteria, baseline, sources, decisions, allowed paths, dependencies, outputs, checks, limits, and escalation conditions.

Request short decision-oriented contributions: recommendation, rationale, source IDs, assumptions, interface implications, risks, and verification impact. Record each returned contribution with `manager_discuss`: workflow ID, actual role and invocation identity, summary, rationale, optional source IDs/risks, and round. This is a durable discussion summary, not a transcript of private reasoning. Compare disagreements against the requirements and evidence. Use the configured discussion limit, capped at three rounds; unresolved technical uncertainty goes to stronger internal assistance or a recorded experiment. Missing product intent goes to the user.

Resolve available `economy`, `balanced`, and `strong` tiers for the selected platform. Record requested and observed models separately; use `unavailable` for observations the client does not expose. Where nested delegation is unavailable, use distinct native invocations if the client permits them and record the restriction. A coordinator's sequential analysis may prepare inputs, but it does not establish the required separate specialist invocations. If these invocations or independent review are unavailable, preserve the open workflow and report that capability blocker.

Prepare measurable requirements, checks, bounded task contracts, and applicable design records. Obtain separate design review and assess `design-ready` before recording the execution decision; dependencies within the new plan gate later dispatch. Record the final decision and task IDs with `manager_decide`: workflow ID, summary, rationale, and child task IDs. Briefly tell the user the chosen approach and material tradeoff, then proceed within the authorized scope. An ordinary engineering decision is a progress update, not an approval request.

**Done:** the selected approach, rationale, rejected material alternatives, risks, verification strategy, ownership, and bounded child tasks are recorded. Every child task carries `workflow_id`, `documentation_required: true`, and `documentation_paths` for affected project documentation. Paths identify files or directories within the allowed scope; managed record paths are linked separately through the work record.

## 3. Execute the V-model increment

Plan checks alongside requirements and designs. Use the applicable pairings: intended use/acceptance, system requirements/system verification, interfaces/integration verification, software design/unit and software verification, and hardware design/hardware verification. Read `workflow.md` for worker lifecycle and `process.md` for ASPICE mapping; the process does not assert a capability rating.

Review applicable designs before implementation. Start ready tasks, dispatch independent work with explicit file ownership, collect worker results, and integrate compatible changes. Observe actual worker state using the native client's bounded wait/callback facilities. Resume from persisted state after interruption. Agents may continue only while the native session is running; saved state supports later resumption, not an unconfigured background service.

Workers update affected requirements, designs, interfaces, user/developer documentation, and substantive seven-section work records as assignment outputs. The manager verifies those outputs before submission. Use `task_submit` with the full `work_record` body; headings and generic pointers alone are insufficient. Link decisions, actual artifacts, checks, evidence, limitations, and applicable lessons.

Run agreed checks through core operations and archive required evidence before final review. On a repairable failure, allow one feedback repair, then escalate internally to stronger assistance or re-scope within the user's intent. Preserve failures and old evidence against their original baseline. Changes to requirements, interfaces, implementation, or documentation trigger affected verification/review reassessment.

**Done:** implementation and required documentation exist, required checks have applicable actual evidence, and each worker has submitted a substantive work record. Remaining failures have an explicit next action.

## 4. Review and accept

Use a separate reviewer invocation that has never implemented the assignment, including before a handoff. The reviewer checks specification, standards, traceability, documentation completeness/consistency, evidence applicability, and every unresolved finding. Submit review against the current implementation and documentation baseline. Resolve findings through assigned work and rerun affected checks; preserve the independent review identity.

Evaluate each child's accepted gate and accept through the core only when it passes. Hooks may fail or be disabled; the manager still performs explicit core validation. Missing evidence, stale documentation/review, or an unavailable independent reviewer keeps the task open. Record the blocker precisely instead of reporting completion.

**Done:** every in-scope child task is accepted with current evidence and independent review; the traceability chain is readable from requirement to reviewed outcome.

## 5. Curate and contribute

Assign the curator to consolidate evidenced project lessons. When a reusable conclusion exists, prepare a separate generalized candidate with public-safe provenance, applicability, assumptions, and limitations. Obtain a current separate generalization review before contribution. If there is no reusable lesson, record a specific `no_lesson_reason`; a superficial lesson is not a closure artifact.

Read `.verythinker/automation.json`. When `automatic_pr` is enabled, `manager_finish` submits the reviewed generalized documentation/pack through the contribution core to the configured upstream without another routine permission question. Use this policy-aware closure operation for automatic submission. Submission creates a draft PR and never merges it. Read the public candidate before closure; raw project records, secrets, logs, and proprietary details remain in the project. Repeated submissions reuse the recorded PR; changed content needs a new reviewed candidate. Replace a saved obsolete candidate by supplying `retired_candidates` entries with `knowledge_id` and a specific `reason`, plus the reviewed replacement in `knowledge_ids`. Closure preserves the old publication disposition; it does not silently drop an obligation or close an existing upstream PR.

When policy disables PR creation, keep the reviewed candidate local and report that disposition. Authentication, repository write access, native policy rejection, or service failure are real blockers: record them with the exact required action. Do not retry with broader permissions or ask the user to perform routine record-management commands.

Call `manager_finish` with the qualified knowledge IDs, or the documented no-lesson reason. It validates closure, accepts qualifying child submissions, and performs policy-required draft PR creation. Its result must account for child tasks, documentation, applicable evidence/reviews, and contribution disposition. An approval marker on prepared material refers to the subsequent human merge decision, not another routine draft-submission question.

**Done:** project lessons and any policy-required draft PR are recorded, or closure remains blocked with a truthful next action. Human approval governs merging shared knowledge, separately from creation of the reviewed proposal.

## Final response

State the final decisions and rationale, delivered behavior, verification results and limits, documentation/record locations, accepted task status, and contribution PR links. Include unresolved blockers only when they exist. The response is complete when the user can assess the outcome without reading the internal discussion or running commands.

## Changed baselines and recovery

Inspect `manager_status` before resuming, including stale requirement/task contracts and existing contribution state. Preserve original evidence, work records, reviews, and prior task/report references. For a changed decision after delivery, create bounded draft/ready replacement or reassessment tasks for affected deliverables, collect current specialist contributions and applicable design review, then record a fresh `manager_decide` with the new task IDs. Replaced tasks are retained as superseded history; the current plan owns fresh documentation, evidence, review, and knowledge disposition.

When resuming an assigned task in a distinct actual worker invocation, pass its `invocation_id` to `task_resume` (CLI `--invocation`). Preserve the old identity only when the same worker invocation continues. Reassess submission, documentation, and evidence after an identity or baseline change, and rerun affected checks before acceptance. A resumed session reports actual model observations or their unavailability.

## Tool reference for agents

Prefer MCP manager/core operations. For an unavailable MCP transport, use the CLI internally: `workflow begin --requirement TEXT`, `workflow discuss WORKFLOW_ID --data JSON`, `workflow decide WORKFLOW_ID --data JSON`, `workflow status [WORKFLOW_ID]`, and `workflow finish WORKFLOW_ID --data JSON`. Use `task submit TASK_ID --work-record FILE` to submit the complete work-record body from a saved file. Consult `verythinker --help` for remaining arguments and schemas. A CLI `review` operation stores a real separate invocation's result; assigning a new identity string is not independent review.
