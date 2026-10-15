---
schema_version: 1
id: VT-FB18E4DC-CHK-0001
type: check
title: DSP source identity, workspace preservation and evidence applicability
owner: verifier
status: draft
revision: 5
created_at: 2026-10-12T08:25:38.481Z
updated_at: 2026-10-12T17:09:05.405Z
links:
  - type: verifies
    target: VT-FB18E4DC-REQ-0001
  - type: references
    target: VT-FB18E4DC-KNW-0002
  - type: verifies
    target: VT-FB18E4DC-REQ-0008
  - type: verifies
    target: VT-FB18E4DC-REQ-0009
data:
  workflow_id: VT-FB18E4DC-KNW-0001
  requirement_ids:
    - VT-FB18E4DC-REQ-0001
    - VT-FB18E4DC-REQ-0008
    - VT-FB18E4DC-REQ-0009
  invocation_id: b74cad1a-30d3-4c18-8304-0b4fd5841650
  definition_status: bounded-awaiting-source-inventory-and-independent-plan-review
  execution_status: not-run
  source_baseline:
    VT-FB18E4DC-REQ-0001:
      revision: 3
      fingerprint: 3910ed7d981d5434c94b104ad999ba322afd426430bf90983af15628f7ba7833
    VT-FB18E4DC-KNW-0002: 3d0cb3a3803c035acb47993d9052f503856ac988402af946cbc6ee402a295f04
    VT-FB18E4DC-REQ-0008:
      revision: 2
      fingerprint: b7fd31c0c387ddaab3d1b0ac89d1422846c0c67429cdbbe92338a2d81004eb1d
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
  method: inspection
  verification_level: configuration
  inspection_items:
    - id: BASE-01
      criterion: Current exact local source identity
      expected: Inventory every used primary/local source using canonical path,
        SHA-256, byte size, retrieval/inspection time and PDF total pages;
        source identity comes from current bytes, never historical notes.
        Title/copyright/edition/TOC observations have exact 1-based PDF locators
        and observed printed page labels.
      inputs:
        - original source paths in REQ-0001
        - authorized binary source inventory and title/copyright/TOC renders
          (pending)
    - id: BASE-02
      criterion: Preserve source files and unrelated dirty state
      expected: Before/after source SHA-256 identical for all used sources; task
        mutations confined to reviewed allowed paths; preserve all unrelated
        changes, deletions, submodule state and existing user solution bytes.
        Compare before/after workspace snapshots and authorized change ledger,
        not a clean-tree assumption.
      inputs:
        - baseline branch/revision and tracked/untracked/deleted/submodule
          snapshot (pending)
        - post-work snapshot and task allowed paths (pending)
    - id: BASE-03
      criterion: Evidence applicability
      expected: Every reused observation lists its source/deliverable hash and
        original revision and is reassessed for current applicability; receipt
        recovery is administrative only and cannot satisfy any DSP
        source/content/math criterion.
      inputs:
        - evidence inventory
        - native provenance
        - current hashes
    - id: BASE-04
      criterion: Deleted-path collision disposition
      expected: Before any output write that collides with a tracked user-deleted
        path, record manager disposition; prefer a fresh distinct artifact name.
        No restoration of prior bytes, unrelated staging/commit/push or changes
        to config/submodule permitted.
      inputs:
        - fresh pre-edit deleted-path inventory
        - manager path decision
        - final scoped diff
  dependencies:
    - authorized binary-PDF inventory/hash/render
    - workspace before/after snapshot
    - measurable requirements and reviewed plan
  author_invocation_id: b74cad1a-30d3-4c18-8304-0b4fd5841650
  invocation_role: verifier
  routing_required: true
  previous_definition:
    revision: 1
    fingerprint: 20ed5928af468f584a271075be31e793cd07f4b085b58f86d282790bdf37b5e1
    body: >
      # Objective

      Configuration and source baseline inspection for REQ-0001, authored by
      invocation d5d56ba9-4373-453d-bae5-c1c27ff413c0. This freezes the
      acceptance rubric, not any unobserved source facts.


      # Protected procedure and expected results

      ## BASE-01

      Criterion: Current exact local source identity

      Expected: Inventory every used primary/local source using canonical path,
      SHA-256, byte size, retrieval/inspection time and PDF total pages; source
      identity comes from current bytes, never historical notes.
      Title/copyright/edition/TOC observations have exact 1-based PDF locators
      and observed printed page labels.

      Inputs: original source paths in REQ-0001; authorized binary source
      inventory and title/copyright/TOC renders (pending)


      ## BASE-02

      Criterion: Preserve source files and unrelated dirty state

      Expected: Before/after source SHA-256 identical for all used sources; task
      mutations confined to reviewed allowed paths; preserve all unrelated
      changes, deletions, submodule state and existing user solution bytes.
      Compare before/after workspace snapshots and authorized change ledger, not
      a clean-tree assumption.

      Inputs: baseline branch/revision and tracked/untracked/deleted/submodule
      snapshot (pending); post-work snapshot and task allowed paths (pending)


      ## BASE-03

      Criterion: Evidence applicability

      Expected: Every reused observation lists its source/deliverable hash and
      original revision and is reassessed for current applicability; receipt
      recovery is administrative only and cannot satisfy any DSP
      source/content/math criterion.

      Inputs: evidence inventory; native provenance; current hashes


      # Method and oracle

      Manual configuration/source inspection using current binary inventory,
      hashes and authorized before/after workspace evidence. Independent oracle
      is the current source bytes and original workspace snapshot, not generated
      notes or HEAD historical content. A text-only project_read cannot
      establish binary SHA-256 or PDF page counts. Routine authorized hashing
      may supply evidence, but this record does not pretend a hash command has
      run.


      # Dependencies and limits

      Binary-PDF read/hash/page-count/render and before/after workspace
      inventory route pending; no task or allowed-path baseline yet. No source
      PDF content inspected. All items NOT RUN. Independent plan review and
      refined requirements reconciliation required before execution. Product
      hardware/bench/HIL are not applicable to this documentation increment;
      numerical demonstrations are software simulation only.


      # Change control

      Preserve this expectation baseline and all failed evidence. Require
      reviewed revision and fresh affected evidence if inputs/procedure change.
      Do not undo user deletions or restore prior notes mechanically.
    data:
      workflow_id: VT-FB18E4DC-KNW-0001
      requirement_ids:
        - VT-FB18E4DC-REQ-0001
      invocation_id: d5d56ba9-4373-453d-bae5-c1c27ff413c0
      definition_status: bounded-awaiting-source-inventory-and-independent-plan-review
      execution_status: not-run
      source_baseline:
        VT-FB18E4DC-REQ-0001: bbd07b4837f095b672c1caeeb9ac69b8e30dae5d0bd867338756fde5896c3b4d
        VT-FB18E4DC-KNW-0002: 3d0cb3a3803c035acb47993d9052f503856ac988402af946cbc6ee402a295f04
      verification_artifact_paths: []
      change_policy: Retain prior expectations, review and failure history. Any
        semantic oracle/rubric/script correction needs explicit reviewed change
        and fresh evidence; never loosen expectations to obtain a pass.
      evidence_requirements:
        - check ID and protected definition fingerprint
        - current requirement/design/deliverable/source hashes and revision
        - actual method, inspector/executor invocation, timestamp
        - environment and exact tool versions, raw logs/output and artifact
          hashes
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
      method: inspection
      verification_level: configuration
      inspection_items:
        - id: BASE-01
          criterion: Current exact local source identity
          expected: Inventory every used primary/local source using canonical path,
            SHA-256, byte size, retrieval/inspection time and PDF total pages;
            source identity comes from current bytes, never historical notes.
            Title/copyright/edition/TOC observations have exact 1-based PDF
            locators and observed printed page labels.
          inputs:
            - original source paths in REQ-0001
            - authorized binary source inventory and title/copyright/TOC renders
              (pending)
        - id: BASE-02
          criterion: Preserve source files and unrelated dirty state
          expected: Before/after source SHA-256 identical for all used sources; task
            mutations confined to reviewed allowed paths; preserve all unrelated
            changes, deletions, submodule state and existing user solution
            bytes. Compare before/after workspace snapshots and authorized
            change ledger, not a clean-tree assumption.
          inputs:
            - baseline branch/revision and tracked/untracked/deleted/submodule
              snapshot (pending)
            - post-work snapshot and task allowed paths (pending)
        - id: BASE-03
          criterion: Evidence applicability
          expected: Every reused observation lists its source/deliverable hash and
            original revision and is reassessed for current applicability;
            receipt recovery is administrative only and cannot satisfy any DSP
            source/content/math criterion.
          inputs:
            - evidence inventory
            - native provenance
            - current hashes
      dependencies:
        - authorized binary-PDF inventory/hash/render
        - workspace before/after snapshot
        - measurable requirements and reviewed plan
      author_invocation_id: d5d56ba9-4373-453d-bae5-c1c27ff413c0
      invocation_role: verifier
      routing_required: true
  refinement_reason: Mapped current detailed criteria VT-FB18E4DC-REQ-0008,
    VT-FB18E4DC-REQ-0009 to this check after reading every refined requirement.
    Parent REQ-0001 revision 2 supersedes empty acceptance criteria; no executed
    evidence/pass exists. Preserve initial definition in
    data.previous_definition. Source-dependent bounds are unchanged.
  task_id: VT-FB18E4DC-TASK-0001
---
# Objective
Configuration and source baseline inspection for REQ-0001, authored by invocation d5d56ba9-4373-453d-bae5-c1c27ff413c0. This freezes the acceptance rubric, not any unobserved source facts.

# Protected procedure and expected results
## BASE-01
Criterion: Current exact local source identity
Expected: Inventory every used primary/local source using canonical path, SHA-256, byte size, retrieval/inspection time and PDF total pages; source identity comes from current bytes, never historical notes. Title/copyright/edition/TOC observations have exact 1-based PDF locators and observed printed page labels.
Inputs: original source paths in REQ-0001; authorized binary source inventory and title/copyright/TOC renders (pending)

## BASE-02
Criterion: Preserve source files and unrelated dirty state
Expected: Before/after source SHA-256 identical for all used sources; task mutations confined to reviewed allowed paths; preserve all unrelated changes, deletions, submodule state and existing user solution bytes. Compare before/after workspace snapshots and authorized change ledger, not a clean-tree assumption.
Inputs: baseline branch/revision and tracked/untracked/deleted/submodule snapshot (pending); post-work snapshot and task allowed paths (pending)

## BASE-03
Criterion: Evidence applicability
Expected: Every reused observation lists its source/deliverable hash and original revision and is reassessed for current applicability; receipt recovery is administrative only and cannot satisfy any DSP source/content/math criterion.
Inputs: evidence inventory; native provenance; current hashes

# Method and oracle
Manual configuration/source inspection using current binary inventory, hashes and authorized before/after workspace evidence. Independent oracle is the current source bytes and original workspace snapshot, not generated notes or HEAD historical content. A text-only project_read cannot establish binary SHA-256 or PDF page counts. Routine authorized hashing may supply evidence, but this record does not pretend a hash command has run.

# Dependencies and limits
Binary-PDF read/hash/page-count/render and before/after workspace inventory route pending; no task or allowed-path baseline yet. No source PDF content inspected. All items NOT RUN. Independent plan review and refined requirements reconciliation required before execution. Product hardware/bench/HIL are not applicable to this documentation increment; numerical demonstrations are software simulation only.

# Change control
Preserve this expectation baseline and all failed evidence. Require reviewed revision and fresh affected evidence if inputs/procedure change. Do not undo user deletions or restore prior notes mechanically.


# Pre-review requirements reconciliation
Mapped current detailed criteria VT-FB18E4DC-REQ-0008, VT-FB18E4DC-REQ-0009 to this check after reading every refined requirement. Parent REQ-0001 revision 2 supersedes empty acceptance criteria; no executed evidence/pass exists. Preserve initial definition in data.previous_definition. Source-dependent bounds are unchanged.

# Current complete rubric (supersedes provisional wording where clarified)
BASE-01: Current exact local source identity
Expected: Inventory every used primary/local source using canonical path, SHA-256, byte size, retrieval/inspection time and PDF total pages; source identity comes from current bytes, never historical notes. Title/copyright/edition/TOC observations have exact 1-based PDF locators and observed printed page labels.
Inputs: original source paths in REQ-0001; authorized binary source inventory and title/copyright/TOC renders (pending)

BASE-02: Preserve source files and unrelated dirty state
Expected: Before/after source SHA-256 identical for all used sources; task mutations confined to reviewed allowed paths; preserve all unrelated changes, deletions, submodule state and existing user solution bytes. Compare before/after workspace snapshots and authorized change ledger, not a clean-tree assumption.
Inputs: baseline branch/revision and tracked/untracked/deleted/submodule snapshot (pending); post-work snapshot and task allowed paths (pending)

BASE-03: Evidence applicability
Expected: Every reused observation lists its source/deliverable hash and original revision and is reassessed for current applicability; receipt recovery is administrative only and cannot satisfy any DSP source/content/math criterion.
Inputs: evidence inventory; native provenance; current hashes

BASE-04: Deleted-path collision disposition
Expected: Before any output write that collides with a tracked user-deleted path, record manager disposition; prefer a fresh distinct artifact name. No restoration of prior bytes, unrelated staging/commit/push or changes to config/submodule permitted.
Inputs: fresh pre-edit deleted-path inventory; manager path decision; final scoped diff
