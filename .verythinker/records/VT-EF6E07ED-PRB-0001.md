---
schema_version: 1
id: VT-EF6E07ED-PRB-0001
type: problem
title: KNW-0014 native receipt persistence and diagnostic binding limits
owner: manager
status: draft
revision: 5
created_at: 2026-10-11T23:01:33.246Z
updated_at: 2026-10-11T23:38:00.437Z
links:
  - type: references
    target: VT-EF6E07ED-TASK-0003
  - type: references
    target: VT-EF6E07ED-TASK-0004
  - type: references
    target: VT-EF6E07ED-CHK-0004
  - type: references
    target: VT-EF6E07ED-KNW-0048
  - type: references
    target: VT-EF6E07ED-KNW-0047
data:
  workflow_id: VT-EF6E07ED-KNW-0014
  affected_invocations:
    - efdfecbd-788f-464b-afa7-b91e18183bcf
    - 084744b8-6b68-4c43-8d12-05722904421c
    - 7d86b340-5554-47b2-9ad4-f0900de34ea6
    - b5ac5af1-34aa-405d-a2ef-6e867cade049
    - e820a7b6-d884-4707-92b5-5ed6892f8b54
    - bf2b6da4-d151-453c-a40f-ff14a990d7a6
  severity: workflow-blocker
  next_action: Restore reliable native receipt persistence and provide supported
    consistent task-local applicability in installed core across
    context/ready/design-ready/start/check authorization/verified/accepted;
    retain lineage and downstream impact links, no weakened criteria.
    Installed-core repair is outside the authorized one-exercise scope. Then
    resume existing diagnosticreviewer1b5fa071 andexecutor2df805da, provide
    diagnostic design allocation/current review, capture actual preflight, full
    product design review, implementTASK0004, execute reviewed checks, separate
    final review/acceptance, curate and policy close/archive.
  invocation_id: 26caa8e8-9c38-443e-8010-c64f8a560aa9
  author_invocation_id: 26caa8e8-9c38-443e-8010-c64f8a560aa9
  invocation_role: manager
  routing_required: true
  core_scope_observation:
    task: VT-EF6E07ED-TASK-0003
    current_requirements:
      - VT-EF6E07ED-REQ-0004
    check_ids:
      - VT-EF6E07ED-CHK-0003
      - VT-EF6E07ED-CHK-0004
      - VT-EF6E07ED-CHK-0005
      - VT-EF6E07ED-CHK-0006
      - VT-EF6E07ED-CHK-0007
      - VT-EF6E07ED-CHK-0008
      - VT-EF6E07ED-CHK-0009
      - VT-EF6E07ED-CHK-0010
      - VT-EF6E07ED-CHK-0011
    source: Actual task_context100000 and verify ready2026-10-11T23:27:02; not
      guessed implementation.
  blocker: "Two independent execution blockers remain: (1) recurring EPERM atomic
    rename can orphan current completed-looking reviews, invalidating strict
    completed-inference provenance; (2) completed Sol architect9de58bba
    diagnosed task-local applicability mismatch: diagnosticTASK0003 verified
    gate requires productCHK0003..11 andDES0003 though it is allocated
    onlyREQ0004/CHK0004. ProductTASK0004 depends on diagnostic acceptance,
    forming an evidence cycle."
  diagnosis_report_id: VT-EF6E07ED-KNW-0048
  product_plan_review_report_id: VT-EF6E07ED-KNW-0047
---
# Observed failures
Manager invocation 36735cc4-1b0b-474f-bcd1-2b49eac9be17 observed native_status EPERM atomic receipt rename failures orphaning architect efdfecbd and verifier084744. Architect recovered via native_resume995a62dc and completed; verifier7d86b340 current recovery. Durable design/check changes and reports remain, but orphaned inference cannot support native-author gates.
# Scope binding
Completed-review CHK-0004 execution requested by workflow-scoped check-executor7efa007e was rejected: Native invocation belongs to a different task. No command ran, no execution evidence or pass. Existing TASK-0003 must be bound to executor and ready after current cap re-review. This is enforced boundary; do not use shell/native write/permissions workaround.
# Diagnosis limits
No root cause of EPERM confirmed. No tools or source changes outside approved workflow. Recover exact receipts/history through native operations only; if repeated recovery fails, preserve open workflow and record required client transport repair.
