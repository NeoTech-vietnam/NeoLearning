---
schema_version: 1
id: VT-FB18E4DC-TASK-0003
type: task
title: Repeat reviewed DSP bootstrap checks on the current preserved provenance
  baseline
owner: check-executor
status: superseded
revision: 6
created_at: 2026-10-13T03:32:02.948Z
updated_at: 2026-10-14T02:24:59.836Z
links:
  - type: satisfies
    target: VT-FB18E4DC-REQ-0010
  - type: implements
    target: VT-FB18E4DC-DES-0001
  - type: references
    target: VT-FB18E4DC-TASK-0002
  - type: references
    target: VT-FB18E4DC-REV-0080
  - type: references
    target: VT-FB18E4DC-REV-0082
  - type: references
    target: VT-FB18E4DC-CHK-0013
  - type: references
    target: VT-FB18E4DC-CHK-0012
  - type: supersedes
    target: VT-FB18E4DC-TASK-0002
data:
  workflow_id: VT-FB18E4DC-KNW-0001
  stage: source-bootstrap
  kind: verification
  requirement_ids:
    - VT-FB18E4DC-REQ-0010
  design_ids:
    - VT-FB18E4DC-DES-0001
  check_ids:
    - VT-FB18E4DC-CHK-0013
    - VT-FB18E4DC-CHK-0012
  acceptance_criteria:
    - Execute only independently reviewed exact CORE source-bootstrap checks,
      never the failed native command helper.
    - Capture real Python/library/PDFskill/source identity/count evidence and
      fresh operation-local workspace/source/solution/collision baseline against
      all BOOT criteria; preserve expected values on failure.
    - Archive actual CORE evidence and substantive seven-section record with
      command, source/check hashes, environment, timestamps and limitations; no
      claim of all-page coverage or final teaching acceptance.
  allowed_paths:
    - 07_mechatronics_engineering_master_program/04_Signal-Processing-For-Mechatronic-System/01_learning/intro_dsp_study/provenance/
  documentation_required: true
  documentation_paths:
    - 07_mechatronics_engineering_master_program/04_Signal-Processing-For-Mechatronic-System/01_learning/intro_dsp_study/provenance/
  source_paths:
    - 07_mechatronics_engineering_master_program/04_Signal-Processing-For-Mechatronic-System/03_resources/
    - 07_mechatronics_engineering_master_program/04_Signal-Processing-For-Mechatronic-System/01_learning/intro_dsp_study/provenance/
  baseline:
    kind: source-bootstrap-successor-preserving-prior-submission
    branch: feature/04-signal-processing-for-mechatronic-systems
    head: d7016f359bbe6f8f6b6cddc35fd26a8e33cb55c4
    runtime_executable: C:/Users/daveb/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe
    requirement_revision: 2
    requirement_fingerprint: 89a0bdc57a1165e60aeb24500c39084b7ee945dadc446d6f575bf7fb68506d5f
    design_revision: 6
    design_fingerprint: 1d755a1c73156f94a9e47044a2e352a53d223458ed04b1efe5c979ffdaf6d085
    check_versions:
      VT-FB18E4DC-CHK-0013:
        revision: 4
        fingerprint: d4d328d2f043fb687b9094bd17039921743b9d341e38f25d105b65bac7bc8a89
      VT-FB18E4DC-CHK-0012:
        revision: 6
        fingerprint: 5f66014de3379a4eecb245374f1e0da81ba5b7bb8b6175b77a6ec6b2a2d6bbce
    current_check_plan_reviews:
      VT-FB18E4DC-CHK-0013: VT-FB18E4DC-REV-0080
      VT-FB18E4DC-CHK-0012: VT-FB18E4DC-REV-0082
    superseded_task:
      id: VT-FB18E4DC-TASK-0002
      revision: 17
      fingerprint: 8f0f997fd99b9b454e82dd76f88105d11cf05c616efd0ddce5d636899709474c
      status: submitted
      disposition: Preserve all prior evidence, reports, findings and failed/reviewed
        history unchanged; successor reruns the same criteria on a fresh current
        baseline.
    preserved_existing_provenance_files:
      07_mechatronics_engineering_master_program/04_Signal-Processing-For-Mechatronic-System/01_learning/intro_dsp_study/provenance/source_audit.md: 57a854f9f22098f364682ee7fec23828258db0b2752aae9c4049f8f9fa8cc9da
      07_mechatronics_engineering_master_program/04_Signal-Processing-For-Mechatronic-System/01_learning/intro_dsp_study/provenance/source_navigation_exercise.md: 09d2aa703578c04b9018f6ab6fd7feab096a0998ceb55ae893405e6400f4a4e8
      07_mechatronics_engineering_master_program/04_Signal-Processing-For-Mechatronic-System/01_learning/intro_dsp_study/provenance/source_navigation_answer.md: 0ee416e23e759e5d4d23275a06e02007d30cdda2d39c0a2ed46d9e9003360ed5
    actual_preservation_baseline: Pending new task-bound CHK-0013 execution. This
      task deliberately performs fresh before/after read-only captures with the
      existing provenance files present; recorded hashes above are input
      expectations to recheck, not new evidence.
  dependencies: []
  outputs:
    - Fresh CORE source/runtime/library/PDF-skill and immutable source
      identity/count evidence for BOOT-01..04/06/07
    - Fresh task-bound workspace/source/protected-solution/collision
      before/after baseline with the three existing provenance files included
    - Archived CORE evidence and exact logs for the prescribed execution sequence
    - Accurate seven-section work record bound to this successor task and its
      actual final evidence
  tools:
    - CORE check_run
    - CORE evidence_archive
    - CORE task_submit
  limits: Read-only CORE checks only in prescribed order CHK-0013 → CHK-0012 →
    CHK-0013; no shell/helper, native command helper, network, source or
    learning-file edits, note creation, direct managed-record edits, installs,
    permission changes, acceptance bypass, or claim beyond bootstrap evidence.
    If any run fails, preserve it and stop for manager diagnosis; no repair
    attempt within this successor.
  escalation_conditions:
    - Fresh ready/design-ready gate or task binding fails
    - CORE check definition/command/tool permission is refused or differs from
      reviewed procedure
    - Current source hashes/page counts, preserved file hashes,
      collision/preservation state or output baseline differs
    - Any execution or evidence-archive failure
  prescribed_execution_order:
    - VT-FB18E4DC-CHK-0013
    - VT-FB18E4DC-CHK-0012
    - VT-FB18E4DC-CHK-0013
  source_audit_not_complete: The three provenance files are existing preliminary
    outputs from TASK-0002. This bootstrap task does not complete exhaustive
    source audit, reading map, lecture inventory, Cornell knowledge notes,
    practice suite, final CHK-0001..0008, or parent requirement acceptance.
  author_invocation_id: e08f0fad-2078-4d57-bedc-ffea8ce4fda1
  invocation_role: manager
  routing_required: true
  invocation_id: 0f612fdb-d5e2-44b3-8683-686cfd77dbca
  requested_model: gpt-6-luna
  confirmed_model: gpt-6-luna
  blocked_reason: null
  submission: null
  attempts: 1
  feedback: "Preserve the submitted execution attempt and KNW-0107. CORE refused
    the first task-bound CHK-0013 call before running any executable: exact
    error “Native invocation belongs to a different task,” no evidence ID
    returned. Current CHK-0013 data.task_id and CHK-0012 data.task_id are still
    VT-FB18E4DC-TASK-0002, while this successor is TASK-0003. Reopen one bounded
    repair to rebind the two existing reviewed check definitions to TASK-0003
    through verifier-authored record revisions (commands, criteria, oracles
    unchanged), obtain independent current reviews of both new fingerprints,
    then update the successor's check_versions and review bindings and pass
    fresh ready/design-ready gates before another check-executor run. Do not
    delete/alter TASK-0002 or the refused invocation/report, do not run checks
    until the check/task IDs agree, and stop if the one permitted TASK-0003
    repair is already consumed."
  repair_requested_at: 2026-10-13T03:48:13.032Z
  escalation_required: false
---
## Objective

State the bounded deliverable and link its requirements.

## Acceptance Criteria

Identify the observable outcomes needed for review and acceptance.

## Baseline, Inputs, and Decisions

Record the source revision, required references, established decisions, and assumptions.

## Allowed Changes and Dependencies

Identify owned paths/artifacts, permitted tools, and blocking tasks.

## Outputs and Verification

List implementation and documentation deliverables and checks to execute before submission. Manager child tasks carry `workflow_id`, `documentation_required: true`, and `documentation_paths` for affected project docs within the allowed scope. Managed records are linked separately through the submitted work record.

## Execution Limits and Escalation

Define budget and the conditions requiring manager intervention.

## Submission and Resumption

Link actual artifacts, evidence, the substantive seven-section work record, remaining limitations, and the next executable action.
