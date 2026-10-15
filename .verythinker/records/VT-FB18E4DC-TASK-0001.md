---
schema_version: 1
id: VT-FB18E4DC-TASK-0001
type: task
title: Inspect current DSP sources and establish a source-verifiable coverage baseline
owner: researcher
status: draft
revision: 14
created_at: 2026-10-12T08:35:56.629Z
updated_at: 2026-10-13T02:22:52.227Z
links:
  - type: satisfies
    target: VT-FB18E4DC-REQ-0002
  - type: satisfies
    target: VT-FB18E4DC-REQ-0003
  - type: satisfies
    target: VT-FB18E4DC-REQ-0008
  - type: references
    target: VT-FB18E4DC-PRB-0001
  - type: implements
    target: VT-FB18E4DC-DES-0001
  - type: references
    target: VT-FB18E4DC-KNW-0012
  - type: depends-on
    target: VT-FB18E4DC-TASK-0002
data:
  workflow_id: VT-FB18E4DC-KNW-0001
  requirement_ids:
    - VT-FB18E4DC-REQ-0001
    - VT-FB18E4DC-REQ-0002
    - VT-FB18E4DC-REQ-0003
    - VT-FB18E4DC-REQ-0008
  acceptance_criteria:
    - Record current workspace branch/revision/status,
      deleted/untracked/solution inventory and protected file hashes without
      changes.
    - Verify actual book edition/title/copyright and lecture page count;
      enumerate every page and substantive item with direct and visual source
      observations, hashes and dual page locators.
    - Store substantive source/topic/page/reading metadata in core research
      records and a source-audit Cornell note with separate navigation
      practice/answer in provenance/.
    - Submit substantive seven-section record distinguishing observations,
      expectations and unresolved gaps; no unsupported source or acceptance
      claims.
  allowed_paths:
    - 07_mechatronics_engineering_master_program/04_Signal-Processing-For-Mechatronic-System/01_learning/intro_dsp_study/provenance/
  documentation_required: true
  documentation_paths:
    - 07_mechatronics_engineering_master_program/04_Signal-Processing-For-Mechatronic-System/01_learning/intro_dsp_study/provenance/
  source_paths:
    - 07_mechatronics_engineering_master_program/04_Signal-Processing-For-Mechatronic-System/03_resources/
  baseline: "Current source-stage planning inputs: REQ-0001 rev3, REQ-0002 rev2,
    REQ-0003 rev2, REQ-0008 rev2, REQ-0009 rev3, REQ-0010 rev2, DES-0001 rev6
    and intake KNW-0023 rev1. The source checks are bound through task check_ids
    and their own current source baselines to avoid a task/check fingerprint
    cycle. TASK-0002 is the explicit bootstrap predecessor; its acceptance
    supplies source/runtime/operation-local evidence but not source-audit
    completion. Fresh exhaustive source inventory and
    workspace/deletion/solution/collision evidence remain pending."
  check_ids:
    - VT-FB18E4DC-CHK-0009
    - VT-FB18E4DC-CHK-0010
    - VT-FB18E4DC-CHK-0011
  dependencies:
    - VT-FB18E4DC-TASK-0002
  planning_blockers:
    - Current independent review of DES-0001 rev6, TASK-0001's TASK-0002
      predecessor allocation, and CHK-0009/0010/0011 current
      definitions/baselines remains pending.
    - CORE verify ready currently expands across connected design/check records
      beyond this task's CHK-0009/0010/0011 allocation; no task_start until the
      actual gate passes.
    - TASK-0002 REQ-0010 bootstrap evidence and task acceptance must be current
      before source inspection can start.
    - Fresh current source/workspace/deletion/solution/collision baseline and
      output-path collision disposition remain pending prescribed source checks.
    - Final teaching/runtime findings F2/F3 on CHK-0006/0007 remain downstream
      and unresolved.
  outputs:
    - Core source/workspace manifest
    - Core exhaustive visual lecture inventory
    - Core verified book reading inventory
    - Source-audit Cornell/practice/answer
  limits: One bounded Luna-medium source assignment after readiness; one repair;
    no PDF/user-solution edits, historical-note restoration, unrelated writes,
    Trellis or permission workaround.
  escalation_conditions:
    - Approved source route unavailable
    - Ambiguous edition/page locators
    - Unexpected scope/collision
    - Repeated failure
  author_invocation_id: 7c5f6c13-b8e6-40e9-bbe9-0672da252033
  invocation_role: manager
  routing_required: true
  planning_reconciliation:
    prior_manager_invocation_id: 8365d0b1-b191-4a84-8fea-ffa4bee05b85
    current_manager_invocation_id: 7b368162-4ddd-4ef4-85c4-c59efd268972
    prior_task_fingerprint: 0882b92511cdc613e3ab4eb323926d5fbb636b603586941bf44b28331adad75d
    prior_task_revision: 1
    reason: Read and retained actual draft task. It remains unstarted; re-author
      draft provenance under resumed signed manager before independent planning
      review. No execution scope, acceptance criteria, evidence or
      model-selection field changed.
  design_ids:
    - VT-FB18E4DC-DES-0001
  proposed_source_stage_check_ids:
    - VT-FB18E4DC-CHK-0009
    - VT-FB18E4DC-CHK-0010
    - VT-FB18E4DC-CHK-0011
  proposed_source_audit_paths:
    - 07_mechatronics_engineering_master_program/04_Signal-Processing-For-Mechatronic-System/01_learning/intro_dsp_study/provenance/source_audit.md
    - 07_mechatronics_engineering_master_program/04_Signal-Processing-For-Mechatronic-System/01_learning/intro_dsp_study/provenance/source_navigation_exercise.md
    - 07_mechatronics_engineering_master_program/04_Signal-Processing-For-Mechatronic-System/01_learning/intro_dsp_study/provenance/source_navigation_answer.md
  source_stage_rebinding:
    status: draft-proposal-awaiting-independent-review-and-actual-source/output-collision-bindings
    prior_task_revision: 3
    prior_task_fingerprint: f74a7f75a4554a59f91b185e7feda5b62dfa2f57383b6190d7c14958f5523d3a
    prior_manager_invocation_id: 7b368162-4ddd-4ef4-85c4-c59efd268972
    current_manager_invocation_id: 8d0f3b89-92ba-437d-8f0a-275bd3e00569
    final_check_ids_retained:
      - VT-FB18E4DC-CHK-0001
      - VT-FB18E4DC-CHK-0002
      - VT-FB18E4DC-CHK-0003
    reason: Additive source/final split. Existing check_ids are not represented as
      source execution bindings; only after new independent review and actual
      input/collision evidence may they be replaced through reviewed task
      update. No source-stage or final pass.
  source_stage_check_ids:
    - VT-FB18E4DC-CHK-0009
    - VT-FB18E4DC-CHK-0010
    - VT-FB18E4DC-CHK-0011
  downstream_final_check_ids:
    - VT-FB18E4DC-CHK-0001
    - VT-FB18E4DC-CHK-0002
    - VT-FB18E4DC-CHK-0003
    - VT-FB18E4DC-CHK-0004
    - VT-FB18E4DC-CHK-0005
    - VT-FB18E4DC-CHK-0006
    - VT-FB18E4DC-CHK-0007
    - VT-FB18E4DC-CHK-0008
  stage: source-inspection
  source_baseline:
    VT-FB18E4DC-REQ-0001:
      revision: 3
      fingerprint: 3910ed7d981d5434c94b104ad999ba322afd426430bf90983af15628f7ba7833
    VT-FB18E4DC-REQ-0002:
      revision: 2
      fingerprint: ae9579bf290a21d4b900f9015f4e7b848584dda7b619c2005831479b71b74bc1
    VT-FB18E4DC-REQ-0003:
      revision: 2
      fingerprint: f6f97211e010a6d5527427982f95f7139d58e61f58fd336b2dda1952f3d05f83
    VT-FB18E4DC-REQ-0008:
      revision: 2
      fingerprint: b7fd31c0c387ddaab3d1b0ac89d1422846c0c67429cdbbe92338a2d81004eb1d
    VT-FB18E4DC-REQ-0009:
      revision: 3
      fingerprint: 5920703360ab39ce2c04ad49f3feba05fef4229d673163228fe02c8fa267d1ce
    VT-FB18E4DC-REQ-0010:
      revision: 2
      fingerprint: 89a0bdc57a1165e60aeb24500c39084b7ee945dadc446d6f575bf7fb68506d5f
    VT-FB18E4DC-DES-0001:
      revision: 6
      fingerprint: 1d755a1c73156f94a9e47044a2e352a53d223458ed04b1efe5c979ffdaf6d085
    VT-FB18E4DC-KNW-0023:
      revision: 1
      fingerprint: 1f685d97f36cfb2a1a3d544bb9016c67203c03118de93c2edaf5423c43ca7f62
  previous_task_contract:
    revision: 4
    fingerprint: db8781c822d309dce3e9f48ff805c4bd0fb77dbe3e573c82b086ffd074dd12a4
    prior_check_ids:
      - VT-FB18E4DC-CHK-0001
      - VT-FB18E4DC-CHK-0002
      - VT-FB18E4DC-CHK-0003
    prior_baseline: REQ-0001 rev2 and derived REQ-0002/0003/0008 planning baseline;
      actual source and working-tree baseline NOT OBSERVED.
    reason: Synchronize the task with the architect-authored DES-0001 rev4
      source/final allocation without dropping any downstream check or changing
      acceptance criteria. Record current record fingerprints; actual
      worktree/source baseline remains pending.
  task_update_invocation_id: 7c5f6c13-b8e6-40e9-bbe9-0672da252033
  task_update_role: manager
  task_update_reason: Record reviewed predecessor/baseline allocation and clarify
    source-bootstrap task acceptance boundary; preserve all criteria and
    downstream checks.
  previous_planning_blockers:
    - PRB-0001 fresh retry KNW-0018 failed before execution
    - New source-stage plan independent review and actual source/output bindings
      pending
    - Source-audit path collisions and protected workspace/source baseline
      unobserved
    - F2/F3 runtime bindings deferred to actual source inventory
  current_task_allocation:
    status: source-stage allocation reflected in current task check_ids, with
      accepted TASK-0002 bootstrap as predecessor; record metadata is
      authoritative for revision/fingerprint
    source_stage_check_ids:
      - VT-FB18E4DC-CHK-0009
      - VT-FB18E4DC-CHK-0010
      - VT-FB18E4DC-CHK-0011
    downstream_final_check_ids:
      - VT-FB18E4DC-CHK-0001
      - VT-FB18E4DC-CHK-0002
      - VT-FB18E4DC-CHK-0003
      - VT-FB18E4DC-CHK-0004
      - VT-FB18E4DC-CHK-0005
      - VT-FB18E4DC-CHK-0006
      - VT-FB18E4DC-CHK-0007
      - VT-FB18E4DC-CHK-0008
    design_revision: 6
    design_fingerprint: 1d755a1c73156f94a9e47044a2e352a53d223458ed04b1efe5c979ffdaf6d085
    bootstrap_predecessor: VT-FB18E4DC-TASK-0002
    source_records_remain_unobserved_by_current_task: true
    historical_rebinding_proposal_preserved: true
    previous_snapshot:
      status: synchronized-in-task-data-and-body; awaiting independent review and CORE
        ready gate
      task_revision: 7
      task_fingerprint: 01e34db377c20ce622dbac0c7fd2d9ba6b596c914c23f381c75a1666d039d3ec
      source_stage_check_ids:
        - VT-FB18E4DC-CHK-0009
        - VT-FB18E4DC-CHK-0010
        - VT-FB18E4DC-CHK-0011
      downstream_final_check_ids:
        - VT-FB18E4DC-CHK-0001
        - VT-FB18E4DC-CHK-0002
        - VT-FB18E4DC-CHK-0003
        - VT-FB18E4DC-CHK-0004
        - VT-FB18E4DC-CHK-0005
        - VT-FB18E4DC-CHK-0006
        - VT-FB18E4DC-CHK-0007
        - VT-FB18E4DC-CHK-0008
      design_revision: 4
      design_fingerprint: 92eb6da431e4ada8d243c063f08ee5d5154945c898b01a842d7508533bc7f4b8
      source_records_remain_unobserved_by_current_task: true
      historical_rebinding_proposal_preserved: true
    reason: Add the reviewed bootstrap predecessor and current DES-0001 rev6
      provenance without changing acceptance criteria or any check allocation.
  previous_check_source_baseline_snapshot:
    task_revision: 8
    task_fingerprint: c769ab0d6888488dbe8d4a5cf333de1762b99f34fdf5c604bc8e25f9aba7f8d4
    entries:
      VT-FB18E4DC-CHK-0009:
        revision: 3
        fingerprint: 25b1b3eb602717d2077d272a2962816b1e95b78bf325d578f5a5bd82eb21cdf9
      VT-FB18E4DC-CHK-0010:
        revision: 2
        fingerprint: b79f9de82cf6dff00d43fcec52b5c518b86d99bab4eea1d7fa2289b4a22fca64
      VT-FB18E4DC-CHK-0011:
        revision: 3
        fingerprint: 317101ea253f007318721c37f1b17b986bcc078c776125427139702f19e18932
    reason: Retired the cyclic task->check fingerprint snapshot from active
      source_baseline. Current check allocation is preserved in task check_ids;
      the checks reference the task fingerprint, so task must not also pin check
      fingerprints. Historical values are retained here.
  baseline_reconciliation:
    status: active source baseline contains only independent
      requirement/design/intake record baselines
    removed_cycle: Check definitions CHK-0009..0011 bind TASK-0001; TASK-0001 no
      longer binds their fingerprints.
    requirement_design_baselines_retained:
      - VT-FB18E4DC-REQ-0001
      - VT-FB18E4DC-REQ-0002
      - VT-FB18E4DC-REQ-0003
      - VT-FB18E4DC-REQ-0008
      - VT-FB18E4DC-REQ-0009
      - VT-FB18E4DC-DES-0001
      - VT-FB18E4DC-KNW-0023
    check_allocation_retained_in_check_ids: true
    invocation_id: 7c5f6c13-b8e6-40e9-bbe9-0672da252033
  previous_design_binding_snapshot:
    task_revision: 10
    task_fingerprint: 00354c16e94048d643a76b5e4efe203dd1ea53e438deba1a40374313bfd94d7a
    design_revision: 4
    design_fingerprint: 92eb6da431e4ada8d243c063f08ee5d5154945c898b01a842d7508533bc7f4b8
    reason: Preserve the prior source-stage task binding before adding current
      DES-0001 rev5 baseline provenance; task acceptance criteria, ownership and
      check allocations are unchanged.
---
# Objective
Draft source-inspection assignment for the unchanged DSP requirement. Not started or source-verified.

# Ownership and source scope
Researcher owns source-inspection core records and new provenance Cornell files only. Read exact primary PDFs and adjacent relevant alternatives. Preserve every source, user solution, deletion and unrelated dirty edit. Other workers own study content and verification; do not revert or overwrite their work. No work may start until the current CORE ready gate passes and the bootstrap predecessor is accepted.

# Prerequisites and procedure
Read current requirement, specialist work records, PRB-0001 and reviewed architecture/check definitions. TASK-0002 supplies REQ-0010 source-bootstrap evidence before this task can begin. Actual approved binary-PDF enumeration/hash/extract/render and fresh working-tree inventory are mandatory before starting. Confirm proposed output paths against deleted and untracked paths. Core metadata supplies the later Developer package; note_create produces only the assigned Cornell/practice/answer documents. No unverified contents or historical notes can be a source oracle.

# Verification and report
The current task-local source-stage checks are CHK-0009, CHK-0010 and CHK-0011, as specified by current DES-0001 allocation. Retain direct page observations, current hashes/environment and visual evidence; independent review and gates follow actual results. Submit complete seven-section work record with documentation references and honest limitations.

# Authoritative task allocation update (manager, current task revision)
This section supersedes the earlier body sentence that bound CHK-0001/0002/0003 to source inspection. TASK-0001 source inspection is allocated only to CHK-0009/0010/0011 and depends on completion/acceptance of the TASK-0002 source bootstrap under REQ-0010. CHK-0001 through CHK-0008 remain mandatory downstream/final checks with their existing complete criteria and failure histories intact; no source-stage observation passes or replaces them. CHK-0006/F2 and CHK-0007/F3 remain later final-artifact/executable binding gaps and are not claimed resolved. This task remains draft and unstarted. Current CORE readiness, independent plan review, fresh source/workspace/collision evidence, and all later final checks remain required before implementation or acceptance.
