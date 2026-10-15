---
schema_version: 1
id: VT-FB18E4DC-CHK-0008
type: check
title: DSP evidence sufficiency and workflow acceptance inspection
owner: verifier
status: draft
revision: 3
created_at: 2026-10-12T08:31:36.745Z
updated_at: 2026-10-12T16:25:02.498Z
links:
  - type: verifies
    target: VT-FB18E4DC-REQ-0001
  - type: verifies
    target: VT-FB18E4DC-REQ-0009
  - type: references
    target: VT-FB18E4DC-CHK-0001
data:
  workflow_id: VT-FB18E4DC-KNW-0001
  requirement_ids:
    - VT-FB18E4DC-REQ-0001
    - VT-FB18E4DC-REQ-0009
  invocation_id: 7e8d8e5d-5c7a-47df-98cc-3c499d2425e9
  definition_status: bounded-awaiting-source-inventory-and-independent-plan-review
  execution_status: not-run
  source_baseline:
    VT-FB18E4DC-REQ-0001: 59b09d68f572e87fe86220f3bd0d389e4c5774556597382cb0bc83b6b6e70485
    VT-FB18E4DC-KNW-0002: 3d0cb3a3803c035acb47993d9052f503856ac988402af946cbc6ee402a295f04
    VT-FB18E4DC-REQ-0009:
      revision: 3
      fingerprint: 5920703360ab39ce2c04ad49f3feba05fef4229d673163228fe02c8fa267d1ce
  verification_artifact_paths: []
  change_policy: Retain prior expectations, review and failure history. Any
    semantic oracle/rubric/script correction needs explicit reviewed change and
    fresh evidence; never loosen expectations to obtain a pass.
  evidence_requirements:
    - check ID and protected definition fingerprint
    - current requirement/design/deliverable/source hashes and revision
    - actual method, inspector/executor invocation, timestamp
    - environment and exact tool versions, raw logs/output and artifact hashes
    - item-by-item observations separated from expected values
    - limitations, failures and preserved history
    - archive evidence through authorized executor before independent final
      review
  no_pass_conditions:
    - source access absent
    - denominator or edition inferred rather than inspected
    - requirement refinement not reconciled
    - missing independent plan review
    - missing current evidence
    - only structural core validation or recovery receipt
  kind: inspection
  method: manual-acceptance
  verification_level: acceptance
  dependencies:
    - all assigned detailed criteria mapped to reviewed check/evidence
    - completed checks and independently reviewed artifacts/current work records
    - current core gate and archive/knowledge policy evidence
  inspection_items:
    - id: ACC-01
      criterion: Criterion-by-criterion evidence sufficiency
      expected: All REQ-0002..0009 criteria map to actual current checks, evidence and
        separate review. Manual source/visual observations use check_inspect;
        runnable tests use check_run. Evidence supplies actual result,
        source/output hashes/revision, method, time, tool/environment and
        limitations. Any required unrun/failed/stale check, source ambiguity,
        missing denominator, empty template or recovery-only receipt prevents
        unqualified acceptance.
      inputs:
        - current requirements/check/evidence/review trace
        - raw inspection and runtime outputs
        - current artifact hashes
    - id: ACC-02
      criterion: Independent review and gates
      expected: Separate signed reviewer invocation inspects actual source pages,
        artifacts, numerical oracles/results, work records and limitations; each
        finding has recorded disposition. Invoke appropriate core
        verified/accepted gate only after applicable current evidence and
        intended-use walkthrough, and inspect its result. Core structural pass
        alone cannot establish content correctness.
      inputs:
        - separate reviewer receipt and substantive review
        - task gate outputs
        - CHK-0005 actual intended-use observations
    - id: ACC-03
      criterion: Bounded closure and provenance
      expected: Only existing workflow and actual intro/relevant reading scope used.
        Substantive seven-section producer records and manager
        resumption/closure status present. Required evidence archived before
        final review. Publication occurs only after confirmed private
        destination/authentication and policy review; shared drafts contain
        reviewed generalized lessons without raw private course sources.
        Permission/source failures remain precise unresolved blockers with
        permitted next action.
      inputs:
        - manager decisions/tasks/work records
        - current scoped source inventory
        - archive/visibility/auth and knowledge disposition records
  author_invocation_id: 7e8d8e5d-5c7a-47df-98cc-3c499d2425e9
  invocation_role: verifier
  routing_required: true
  task_id: VT-FB18E4DC-TASK-0001
---
# Objective
DSP evidence sufficiency and workflow acceptance inspection; authored by verifier invocation d5d56ba9-4373-453d-bae5-c1c27ff413c0 for VT-FB18E4DC-REQ-0009.

# Protected cases/rubric
ACC-01: Criterion-by-criterion evidence sufficiency
Expected: All REQ-0002..0009 criteria map to actual current checks, evidence and separate review. Manual source/visual observations use check_inspect; runnable tests use check_run. Evidence supplies actual result, source/output hashes/revision, method, time, tool/environment and limitations. Any required unrun/failed/stale check, source ambiguity, missing denominator, empty template or recovery-only receipt prevents unqualified acceptance.
Referenced inputs: current requirements/check/evidence/review trace; raw inspection and runtime outputs; current artifact hashes

ACC-02: Independent review and gates
Expected: Separate signed reviewer invocation inspects actual source pages, artifacts, numerical oracles/results, work records and limitations; each finding has recorded disposition. Invoke appropriate core verified/accepted gate only after applicable current evidence and intended-use walkthrough, and inspect its result. Core structural pass alone cannot establish content correctness.
Referenced inputs: separate reviewer receipt and substantive review; task gate outputs; CHK-0005 actual intended-use observations

ACC-03: Bounded closure and provenance
Expected: Only existing workflow and actual intro/relevant reading scope used. Substantive seven-section producer records and manager resumption/closure status present. Required evidence archived before final review. Publication occurs only after confirmed private destination/authentication and policy review; shared drafts contain reviewed generalized lessons without raw private course sources. Permission/source failures remain precise unresolved blockers with permitted next action.
Referenced inputs: manager decisions/tasks/work records; current scoped source inventory; archive/visibility/auth and knowledge disposition records

# Permitted procedure
This is an inspection rubric, not authorization to accept or publish. Manager/reviewer own those transitions. Verifier inspects sufficiency; actual per-item observations recorded separately by authorized check_inspect. This invocation creates checks only and has no acceptance or check execution operation. No current check pass or gate approval claimed.

# Dependencies and execution status
all assigned detailed criteria mapped to reviewed check/evidence
completed checks and independently reviewed artifacts/current work records
current core gate and archive/knowledge policy evidence
NOT RUN. Bounded plan awaits source inventory, exact executable/fixture/artifact bindings where applicable, and independent planning review. Empty verification_artifact_paths means no script has been falsely declared/frozen; executor must not run until reviewed complete bindings exist.

# Change control and evidence
Retain prior expectations, review and failure history. Any semantic oracle/rubric/script correction needs explicit reviewed change and fresh evidence; never loosen expectations to obtain a pass.
Capture check fingerprint, source/output baselines, executor/inspector invocation, timestamp, environment/dependency versions, stdout/stderr or observations, status, archived evidence IDs and limitations. No structural pass or administrative receipt is DSP content/runtime evidence.
