---
schema_version: 1
id: VT-FB18E4DC-CHK-0006
type: check
title: DSP document integration, links and coverage executable plan
owner: verifier
status: draft
revision: 2
created_at: 2026-10-12T08:31:31.582Z
updated_at: 2026-10-12T15:37:07.908Z
links:
  - type: verifies
    target: VT-FB18E4DC-REQ-0001
  - type: verifies
    target: VT-FB18E4DC-REQ-0003
  - type: verifies
    target: VT-FB18E4DC-REQ-0005
  - type: verifies
    target: VT-FB18E4DC-REQ-0006
  - type: verifies
    target: VT-FB18E4DC-REQ-0007
  - type: references
    target: VT-FB18E4DC-CHK-0001
data:
  workflow_id: VT-FB18E4DC-KNW-0001
  requirement_ids:
    - VT-FB18E4DC-REQ-0001
    - VT-FB18E4DC-REQ-0003
    - VT-FB18E4DC-REQ-0005
    - VT-FB18E4DC-REQ-0006
    - VT-FB18E4DC-REQ-0007
  invocation_id: d743a43c-b400-416a-827f-5adb7515337b
  definition_status: bounded-awaiting-source-inventory-and-independent-plan-review
  execution_status: not-run
  source_baseline:
    VT-FB18E4DC-REQ-0001: 59b09d68f572e87fe86220f3bd0d389e4c5774556597382cb0bc83b6b6e70485
    VT-FB18E4DC-KNW-0002: 3d0cb3a3803c035acb47993d9052f503856ac988402af946cbc6ee402a295f04
    VT-FB18E4DC-REQ-0003: 0758d61933b4c3c5bb9a92231d00ff2867624b798ea9f47bf93745bbbe5efec3
    VT-FB18E4DC-REQ-0005: 8ca5bc6ffa040d1c02014a9c381bc58ce9bbc24c47897e0c0967457d7e54a85a
    VT-FB18E4DC-REQ-0006: a90e9de9fa33dd212546d2dab1fdea7492ff252cc5f28005fa238a29445eb3dc
    VT-FB18E4DC-REQ-0007: 109be3743b171e727316fb4158185f0ff2f3afb0b511448e777baddb7a5b3f44
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
  kind: planned-executable
  method: automated-test
  verification_level: integration
  dependencies:
    - independently inspected all-page/item/topic manifest
    - final reviewed artifact/index/asset schema and exact paths
    - authorized validator implementation with hash and exact argument array
    - authorized check-executor and independent plan review
  verification_cases:
    - id: INT-01
      input: complete inspected page/item/topic inventory and final coverage ledger
      expected: Page set exactly equals integers 1..N; page ordinals unique;
        item/topic IDs unique and all references resolve. Each substantive
        source item and topic has explicit final destinations/dispositions.
        Unknown/duplicate/missing IDs or out-of-range page endpoints fail.
        Output reports exact denominators/counts and ID-level diagnostics.
      oracle: Independently inspected manifest from CHK-0003, not a manifest silently
        regenerated from final notes.
    - id: INT-02
      input: final index -> all linked Markdown, local assets, source navigation and
        practice/answer paths
      expected: Every local relative/encoded/fragment link resolves to an existing
        correct target/heading from its declaring file; recursively reachable
        coverage includes every required artifact. Exercise/answer/user-solution
        paths distinct; all intended outputs inside reviewed 01_learning scope;
        relative traversal to designated read-only sources allowed only by
        source manifest. Zero broken links, missing assets or unexpected
        outputs.
      oracle: Current artifact bytes and inspected file/source manifest. File
        existence does not prove target content or readable diagrams.
    - id: INT-03
      input: reviewed valid minimal fixture plus one independent fault per fixture
      expected: Validator detects missing page, duplicate page/item, orphan topic, bad
        range, missing heading/asset, incorrect exercise-answer ID pairing and
        same prompt/answer path. Every fault gives named failing criterion and
        nonzero status; unchanged valid fixture passes. Fault fixtures are
        isolated in approved scratch paths and never mutate protected PDFs/user
        solutions.
      oracle: Hand-constructed fixture mutations with known intended failure;
        validator must not merely echo implementation structure.
    - id: INT-04
      input: current actual Cornell record IDs and artifacts
      expected: Authorized note_validate called for every applicable note; retain
        actual outputs. Frozen validator rejects empty essential
        fields/template-only notes at structural level but content completeness
        still needs CHK-0005 manual review. Each observed result references
        current evidence; expected-only examples stay labelled expected.
      oracle: Cornell recipe 1.0.0 structural contract and actual current
        record/artifact identities.
  execution_ready: false
  command_binding_status: absent-pending-reviewed-artifacts
  author_invocation_id: d743a43c-b400-416a-827f-5adb7515337b
  invocation_role: verifier
  routing_required: true
---
# Objective
DSP document integration, links and coverage executable plan; authored by verifier invocation d5d56ba9-4373-453d-bae5-c1c27ff413c0 for VT-FB18E4DC-REQ-0003, VT-FB18E4DC-REQ-0005, VT-FB18E4DC-REQ-0006, VT-FB18E4DC-REQ-0007.

# Protected cases/rubric
INT-01: complete inspected page/item/topic inventory and final coverage ledger
Expected: Page set exactly equals integers 1..N; page ordinals unique; item/topic IDs unique and all references resolve. Each substantive source item and topic has explicit final destinations/dispositions. Unknown/duplicate/missing IDs or out-of-range page endpoints fail. Output reports exact denominators/counts and ID-level diagnostics.
Independent oracle: Independently inspected manifest from CHK-0003, not a manifest silently regenerated from final notes.

INT-02: final index -> all linked Markdown, local assets, source navigation and practice/answer paths
Expected: Every local relative/encoded/fragment link resolves to an existing correct target/heading from its declaring file; recursively reachable coverage includes every required artifact. Exercise/answer/user-solution paths distinct; all intended outputs inside reviewed 01_learning scope; relative traversal to designated read-only sources allowed only by source manifest. Zero broken links, missing assets or unexpected outputs.
Independent oracle: Current artifact bytes and inspected file/source manifest. File existence does not prove target content or readable diagrams.

INT-03: reviewed valid minimal fixture plus one independent fault per fixture
Expected: Validator detects missing page, duplicate page/item, orphan topic, bad range, missing heading/asset, incorrect exercise-answer ID pairing and same prompt/answer path. Every fault gives named failing criterion and nonzero status; unchanged valid fixture passes. Fault fixtures are isolated in approved scratch paths and never mutate protected PDFs/user solutions.
Independent oracle: Hand-constructed fixture mutations with known intended failure; validator must not merely echo implementation structure.

INT-04: current actual Cornell record IDs and artifacts
Expected: Authorized note_validate called for every applicable note; retain actual outputs. Frozen validator rejects empty essential fields/template-only notes at structural level but content completeness still needs CHK-0005 manual review. Each observed result references current evidence; expected-only examples stay labelled expected.
Independent oracle: Cornell recipe 1.0.0 structural contract and actual current record/artifact identities.

# Permitted procedure
Create/review deterministic validator and isolated fault fixtures under explicit allowed paths. Before execution append exact executable/argument arrays, paths and SHA-256 for validator and oracle fixtures to verification_artifact_paths via reviewed definition revision. Commands are missing now: this is a bounded executable specification, NOT an execution-ready check. Execute using check_run only from authorized check-executor; preserve stdout/stderr, status, tool versions, input/output hashes and diagnostics. No arbitrary shell fallback. Complementary CHK-0002..0005 manual evidence is mandatory; passing this check establishes linkage/manifest conformance only.

# Dependencies and execution status
independently inspected all-page/item/topic manifest
final reviewed artifact/index/asset schema and exact paths
authorized validator implementation with hash and exact argument array
authorized check-executor and independent plan review
NOT RUN. Bounded plan awaits source inventory, exact executable/fixture/artifact bindings where applicable, and independent planning review. Empty verification_artifact_paths means no script has been falsely declared/frozen; executor must not run until reviewed complete bindings exist.

# Change control and evidence
Retain prior expectations, review and failure history. Any semantic oracle/rubric/script correction needs explicit reviewed change and fresh evidence; never loosen expectations to obtain a pass.
Capture check fingerprint, source/output baselines, executor/inspector invocation, timestamp, environment/dependency versions, stdout/stderr or observations, status, archived evidence IDs and limitations. No structural pass or administrative receipt is DSP content/runtime evidence.
