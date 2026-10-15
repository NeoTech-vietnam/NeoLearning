---
schema_version: 1
id: VT-FB18E4DC-TASK-0002
type: task
title: Run prescribed read-only CORE PDF bootstrap and capture source/runtime evidence
owner: check-executor
status: superseded
revision: 18
created_at: 2026-10-12T12:31:52.561Z
updated_at: 2026-10-13T03:40:37.779Z
links:
  - type: satisfies
    target: VT-FB18E4DC-REQ-0010
  - type: references
    target: VT-FB18E4DC-DES-0001
  - type: references
    target: VT-FB18E4DC-KNW-0023
  - type: references
    target: VT-FB18E4DC-PRB-0001
data:
  workflow_id: VT-FB18E4DC-KNW-0001
  stage: source-bootstrap
  kind: verification
  requirement_ids:
    - VT-FB18E4DC-REQ-0010
  check_ids:
    - VT-FB18E4DC-CHK-0012
    - VT-FB18E4DC-CHK-0013
  design_ids:
    - VT-FB18E4DC-DES-0001
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
  baseline:
    kind: intake-observed-expected-bootstrap
    head: d7016f359bbe6f8f6b6cddc35fd26a8e33cb55c4
    current_runtime: C:/Users/daveb/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe
    actual_preservation_baseline: Pending fresh prescribed execution
    requirement_revision: 2
    requirement_fingerprint: 89a0bdc57a1165e60aeb24500c39084b7ee945dadc446d6f575bf7fb68506d5f
    check_versions:
      VT-FB18E4DC-CHK-0012:
        revision: 5
        fingerprint: a144f8782b208cc9f8210072bf0efa47e93b8a83f49af882c3653942c5aafd4a
      VT-FB18E4DC-CHK-0013:
        revision: 4
        fingerprint: d4d328d2f043fb687b9094bd17039921743b9d341e38f25d105b65bac7bc8a89
    design_revision: 6
    design_fingerprint: 1d755a1c73156f94a9e47044a2e352a53d223458ed04b1efe5c979ffdaf6d085
    previous_design_binding:
      revision: 5
      fingerprint: 4758f2e8f57ba5b1cb979a5e1d27ea18bd2275d2bfebe18de759778f6006bec6
    prior_design_binding_snapshot:
      revision: 4
      fingerprint: 92eb6da431e4ada8d243c063f08ee5d5154945c898b01a842d7508533bc7f4b8
    previous_check_versions_snapshot:
      entries:
        VT-FB18E4DC-CHK-0012:
          revision: 4
          fingerprint: 323bf4f975ce56a50634b983eb62120197fe99e97e9a71372c1a35e4c41941bc
        VT-FB18E4DC-CHK-0013:
          revision: 3
          fingerprint: bbdfa09b2f7163d1e974c7d89424ee346ec4d0de5cbff5446cc2be651a4fb3df
      superseded_by:
        - VT-FB18E4DC-REV-0079
        - VT-FB18E4DC-REV-0080
      reason: Preserve the exact task-bound check fingerprints replaced after the
        reviewed additive baseline_paths repair; task acceptance criteria,
        command procedures and execution order are unchanged.
      intermediate_task_revision: 13
      intermediate_task_fingerprint: 4c5ae34c605ebe5cb77eb4271aae76e04ec75b1258f2135393c29ed309e5381d
      intermediate_entries:
        VT-FB18E4DC-CHK-0012:
          rev: 5
          fp: a144f8782b208cc9f8210072bf0efa47e93b8a83f49af882c3653942c5aafd4a
        VT-FB18E4DC-CHK-0013:
          rev: 4
          fp: d4d328d2f043fb687b9094bd17039921743b9d341e38f25d105b65bac7bc8a89
      correction_reason: Preserve the immediately preceding manager-authored rebind
        representation, then normalize field names to the established
        revision/fingerprint schema.
    current_check_plan_reviews:
      VT-FB18E4DC-CHK-0012: VT-FB18E4DC-REV-0079
      VT-FB18E4DC-CHK-0013: VT-FB18E4DC-REV-0080
  dependencies: []
  outputs:
    - CORE bootstrap execution/evidence records and archived actual logs for
      BOOT-01..07
    - Fresh runtime/skill/source/workspace baseline for downstream source
      TASK-0001
    - Seven-section bootstrap work record; source-audit Cornell/practice/answer
      artifacts are TASK-0001 outputs and remain required before parent
      REQ-0001..0009/final workflow acceptance, but are not TASK-0002 acceptance
      prerequisites
  tools:
    - check_run
    - check_inspect
    - evidence_archive
    - project_read
  limits: One reviewed bootstrap invocation and one legitimate feedback repair; no
    shell helper, network, source/learning writes in bootstrap operations,
    direct managed-file edits, installs, sandbox change, Trellis or recursive
    manager.
  planning_blockers:
    - Rerun the CORE ready and design-ready gates against this refreshed
      TASK-0002 check baseline; execution remains prohibited unless the current
      gate passes.
    - Actual operation-local source/workspace/solution/collision baseline and
      prescribed runtime evidence remain pending.
    - The earlier task_submit failed because the declared provenance
      documentation path did not yet exist; produce substantive documentation
      only through the authorized task-bound core note operation, then retry
      submission after checks.
  escalation_conditions:
    - CORE task/check gate or command descriptor rejection
    - Python process failure or oracle mismatch
    - Unapproved output/collision or preservation ambiguity
  author_invocation_id: 18d0de54-cf62-462d-9a92-b0d5b0f0328d
  invocation_role: component-owner
  routing_required: true
  prescribed_execution_order:
    - VT-FB18E4DC-CHK-0013
    - VT-FB18E4DC-CHK-0012
    - VT-FB18E4DC-CHK-0013
  previous_task_baseline:
    task_revision: 2
    task_fingerprint: 22073fe01c3be6bfd097926e859dbf744cf853401ac054f5cd9fcfc11cf03798
    requirement_revision: 1
    check_versions:
      VT-FB18E4DC-CHK-0012: 2
      VT-FB18E4DC-CHK-0013: 1
    reason: Refresh TASK-0002 provenance after the signed REQ-0010/CHK-0012/CHK-0013
      repairs and current DES-0001 revision 4; preserve execution order and
      every check criterion. Actual bootstrap evidence remains pending.
  task_update_invocation_id: 7c5f6c13-b8e6-40e9-bbe9-0672da252033
  task_update_role: manager
  task_update_reason: Correct the manager-authored check-version key names to the
    established {revision,fingerprint} schema after the current independently
    reviewed CHK-0012/0013 rebind. The intermediate representation and prior
    original fingerprints are retained in previous_check_versions_snapshot; no
    task acceptance criterion, check definition, execution order, or failure
    history changes.
  previous_planning_blockers:
    - Fresh independent review of current REQ-0010 rev2, CHK-0012 rev4, CHK-0013
      rev3, TASK-0002 allocation and DES-0001 rev6 pending.
    - CORE verify ready currently imports linked source/final checks beyond this
      bootstrap allocation; do not start/check_run unless the actual ready gate
      passes. Preserve PRB-0002 for any unsupported task-local readiness
      behavior.
    - Actual operation-local source/workspace/solution/collision baseline and
      prescribed runtime evidence pending.
  current_task_allocation:
    status: current check fingerprints rebound to independently reviewed
      definitions; awaiting fresh CORE readiness and evidence
    requirement: VT-FB18E4DC-REQ-0010 rev2 /
      89a0bdc57a1165e60aeb24500c39084b7ee945dadc446d6f575bf7fb68506d5f
    checks:
      - VT-FB18E4DC-CHK-0012 rev5 /
        a144f8782b208cc9f8210072bf0efa47e93b8a83f49af882c3653942c5aafd4a
      - VT-FB18E4DC-CHK-0013 rev4 /
        d4d328d2f043fb687b9094bd17039921743b9d341e38f25d105b65bac7bc8a89
    design: VT-FB18E4DC-DES-0001 rev6 /
      1d755a1c73156f94a9e47044a2e352a53d223458ed04b1efe5c979ffdaf6d085
    previous_design:
      revision: 5
      fingerprint: 4758f2e8f57ba5b1cb979a5e1d27ea18bd2275d2bfebe18de759778f6006bec6
      previous:
        revision: 4
        fingerprint: 92eb6da431e4ada8d243c063f08ee5d5154945c898b01a842d7508533bc7f4b8
    execution_order:
      - VT-FB18E4DC-CHK-0013
      - VT-FB18E4DC-CHK-0012
      - VT-FB18E4DC-CHK-0013
    no_execution_or_acceptance: true
    check_plan_reviews:
      VT-FB18E4DC-CHK-0012: VT-FB18E4DC-REV-0079
      VT-FB18E4DC-CHK-0013: VT-FB18E4DC-REV-0080
  invocation_id: dd730282-aa88-461e-8a54-ef7741716ad4
  requested_model: gpt-6-luna
  confirmed_model: gpt-6-luna
  blocked_reason: null
  attempts: 1
  feedback: "Preserve the first attempt and its KNW-0090 report. CORE rejected
    CHK-0013 before execution with `Check needs baseline_paths for
    implementation inputs.` Separately task_submit failed with `Baseline input
    does not exist:
    07_mechatronics_engineering_master_program/04_Signal-Processing-For-Mechatr\
    onic-System/01_learning/intro_dsp_study/provenance`. Authorize one bounded
    repair only: inspect the actual check_run/core task submission schemas; if
    baseline_paths is a supported invocation input, supply the minimum exact
    task input paths already declared by the reviewed CHK-0013 scope and rerun
    CHK-0013 → CHK-0012 → CHK-0013 unchanged. Do not modify or weaken any check
    expectation. If a check/task contract field or filesystem artifact is
    required, stop and report the exact needed field/path plus the narrow
    independent review/update route. Do not create directories/files outside
    assigned paths or use a shell/direct-write workaround. Preserve all
    historical failures."
  repair_requested_at: 2026-10-13T02:26:34.568Z
  submission:
    summary: "Executed CHK-0013 → CHK-0012 → CHK-0013 and archived
      EVD-0001/0002/0003. Results: pass, fail, pass. Submission records the
      failed runtime inventory and blocked Cornell documentation step; no task
      completion or acceptance is claimed."
    at: 2026-10-13T02:51:22.956Z
    submission_id: 932471fe-8cf0-4d29-97f9-a9be540e12b6
    task_fingerprint: c90e64a64a6622ea5132d90b569e2ec696b1af02bced13adf76dc1b80cea809f
    work_record_id: VT-FB18E4DC-KNW-0094
    work_record_fingerprint: 35787be5c12b9289255b3a710a575d9e0696abe1df3caf42edc490f26fb2a014
    documentation_snapshot:
      07_mechatronics_engineering_master_program/04_Signal-Processing-For-Mechatronic-System/01_learning/intro_dsp_study/provenance/source_audit.md: 57a854f9f22098f364682ee7fec23828258db0b2752aae9c4049f8f9fa8cc9da
      07_mechatronics_engineering_master_program/04_Signal-Processing-For-Mechatronic-System/01_learning/intro_dsp_study/provenance/source_navigation_answer.md: 0ee416e23e759e5d4d23275a06e02007d30cdda2d39c0a2ed46d9e9003360ed5
      07_mechatronics_engineering_master_program/04_Signal-Processing-For-Mechatronic-System/01_learning/intro_dsp_study/provenance/source_navigation_exercise.md: 09d2aa703578c04b9018f6ab6fd7feab096a0998ceb55ae893405e6400f4a4e8
  escalation_required: false
  prior_invocation_ids:
    - 1ad52046-5d89-4c1e-939f-4ba63c6c86f9
  resumed_at: 2026-10-13T02:46:40.645Z
  escalation_reason: >-
    Escalation tied to VT-FB18E4DC-REV-0081 (fingerprint
    704897041e368bccd94b2bbc98d9320c0cc6e54c13b3ac538dd97e6993060c5e) and its
    report VT-FB18E4DC-KNW-0096, reviewing VT-FB18E4DC-TASK-0002 rev16
    fingerprint
    c90e64a64a6622ea5132d90b569e2ec696b1af02bced13adf76dc1b80cea809f. Diagnosis:
    VT-FB18E4DC-EVD-0002 is a preserved CHK-0012 rev5 failure (exit 1; log
    SHA-256 b90c5314aff0c9b639ecec7a3c7adfc02e17bfd4e5de10ffaa825ac547f9df72);
    the archived log contains 156 dependency_owner_unavailable entries pointing
    into bundled Python Lib/DLLs, outside the intended installed-distribution
    inventory scope of site-packages. VT-FB18E4DC-EVD-0001 and
    VT-FB18E4DC-EVD-0003 are historical CHK-0013 passes bound to TASK-0002
    revision 15; their manifests
    0dca87720cc7c1acb10cfa61731b946c3f01bd5d9b98ab98aa85b5700a4c83bc and
    9bec3b8aad4ef6343764293a80f3af988649b8cf6c9cb6bb6b8de5ad549a77c9 omit the
    three provenance files in the rev16 submitted snapshot. The exact current
    file hashes are source_audit.md
    57a854f9f22098f364682ee7fec23828258db0b2752aae9c4049f8f9fa8cc9da,
    source_navigation_exercise.md
    09d2aa703578c04b9018f6ab6fd7feab096a0998ceb55ae893405e6400f4a4e8, and
    source_navigation_answer.md
    0ee416e23e759e5d4d23275a06e02007d30cdda2d39c0a2ed46d9e9003360ed5. The task
    submission still links VT-FB18E4DC-KNW-0094, whose no-files statement is
    corrected by VT-FB18E4DC-KNW-0095; the follow-up is not the linked
    submission. No Cornell knowledge record or successful note_validate is
    evidenced; those Cornell artifacts are assigned to VT-FB18E4DC-TASK-0001 and
    are not VT-FB18E4DC-TASK-0002 acceptance prerequisites.


    Another ordinary task_repair is not permitted: the one-repair limit is
    already consumed (attempts=1; limit says one legitimate feedback repair),
    and this component-owner capability does not expose task_repair. Proposed
    recovery, owned by the workflow manager: preserve VT-FB18E4DC-TASK-0002 as
    submitted with all history; have the verifier create a new
    VT-FB18E4DC-CHK-0012 revision that corrects the distribution-inventory scope
    without weakening the three acceptance criteria; independently review that
    exact new fingerprint before binding. Keep VT-FB18E4DC-CHK-0013 rev4 /
    VT-FB18E4DC-REV-0080 bound to its exact reviewed fingerprint unless a
    separate review finds a concrete defect. Create a distinct successor task
    under VT-FB18E4DC-REQ-0010, copy the acceptance criteria verbatim, bind the
    independently reviewed new CHK-0012 and existing reviewed CHK-0013
    fingerprints, include the three current provenance hashes, and pass fresh
    ready and design-ready gates. Then run only CORE checks in order
    VT-FB18E4DC-CHK-0013 → revised VT-FB18E4DC-CHK-0012 → VT-FB18E4DC-CHK-0013;
    archive actual outcomes, submit a new accurate seven-section record linked
    to the successor, obtain an independent submission review, and pass the CORE
    accepted gate.


    Preserve the exact acceptance criteria:

    1. Execute only independently reviewed exact CORE source-bootstrap checks,
    never the failed native command helper.

    2. Capture real Python/library/PDFskill/source identity/count evidence and
    fresh operation-local workspace/source/solution/collision baseline against
    all BOOT criteria; preserve expected values on failure.

    3. Archive actual CORE evidence and substantive seven-section record with
    command, source/check hashes, environment, timestamps and limitations; no
    claim of all-page coverage or final teaching acceptance.


    Preserve TASK-0002 submitted status and revision-16 submission
    932471fe-8cf0-4d29-97f9-a9be540e12b6; retain VT-FB18E4DC-REV-0081,
    VT-FB18E4DC-KNW-0096, VT-FB18E4DC-REV-0079, VT-FB18E4DC-REV-0080,
    VT-FB18E4DC-EVD-0001, VT-FB18E4DC-EVD-0002, VT-FB18E4DC-EVD-0003,
    VT-FB18E4DC-KNW-0094, and VT-FB18E4DC-KNW-0095 unchanged as history. This
    entry records diagnosis and proposed ownership only; no check, expectation,
    artifact, evidence, task status, or acceptance criterion is changed.
  escalation_invocation_id: 18d0de54-cf62-462d-9a92-b0d5b0f0328d
  escalation_attempt: 1
  escalation_feedback_sha256: 07b1ee7721672145d4768035c9efe65493d1e7a1d5dea49a67f7eff2b71bb509
  task_id: VT-FB18E4DC-TASK-0002
---
# Objective
Bounded source-bootstrap execution assignment for the existing DSP workflow, not full source-audit or teaching completion. Original final expectations remain unchanged.

# Sources, ownership and route
Read the exact expected sources/runtime in REQ-0010 and KNW-0023. Check-executor owns only prescribed execution and actual evidence/report capture. Bootstrap operations have zero learning/source writes. No source preservation global claim without actual before/after observations. Developer/source researcher later owns learning materialization; they are other workers, so preserve their changes and unrelated state.

# Readiness and checks
Task is DRAFT. Current project routing requires strong roles gpt-6-luna/max and workers gpt-6-luna/medium, with gpt-5.6-terra/medium only after bridge-observed Luna unavailability. Fresh independent review of current REQ-0010/CHK-0012/CHK-0013 and the current task contract, followed by a passing actual ready gate, must precede task_start/check_run. A source-only architecture disposition must be established without importing finished F2/F3 teaching artifacts as prerequisites. A successful bootstrap provides only configuration/source-identity and operation-local evidence. Source-audit documentation is a TASK-0001 output and remains required for parent REQ-0001..0009/final workflow closure; it is not a TASK-0002 acceptance prerequisite.

# Evidence and recovery
Use the actual check_run id/task schema. Preserve stdout/stderr, exit/result and evidence records; archive real evidence IDs. If the gateway refuses a record field or task binding, record its exact actionable error without retrying the native helper or asserting unreadable PDFs.

# Authoritative current status
This task remains draft and unstarted. Its current baseline binds REQ-0010 rev2, CHK-0012 rev4, CHK-0013 rev3 and DES-0001 rev6; the prescribed execution order remains CHK-0013, CHK-0012, CHK-0013. Historical draft wording that named a Sol verifier is superseded by the current project routing and receipts. The actual readiness gate currently imports linked checks beyond this task's bootstrap allocation, so no task_start/check_run is authorized until the independent current reviews and actual CORE ready gate permit it. No bootstrap evidence, source-audit completion, or acceptance is claimed.
