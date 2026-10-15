---
schema_version: 1
id: VT-FB18E4DC-CHK-0009
type: check
title: SOURCE-STAGE current DSP sources, workspace baseline and operation preservation
owner: verifier
status: draft
revision: 7
created_at: 2026-10-12T12:03:46.090Z
updated_at: 2026-10-12T18:04:00.411Z
links:
  - type: verifies
    target: VT-FB18E4DC-REQ-0001
  - type: verifies
    target: VT-FB18E4DC-REQ-0008
  - type: verifies
    target: VT-FB18E4DC-REQ-0009
  - type: derives-from
    target: VT-FB18E4DC-CHK-0001
  - type: references
    target: VT-FB18E4DC-REV-0011
  - type: references
    target: VT-FB18E4DC-DES-0001
  - type: references
    target: VT-FB18E4DC-TASK-0001
data:
  workflow_id: VT-FB18E4DC-KNW-0001
  invocation_id: 30e4942b-da46-4af4-b2eb-4a6409356783
  stage: source-stage
  kind: inspection
  method: inspection
  definition_status: source-stage-rubric-awaiting-independent-plan-review-and-actual-input-bindings
  execution_status: not-run
  execution_ready: false
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
    VT-FB18E4DC-REQ-0004:
      revision: 2
      fingerprint: 8ce9cbf563aacf47d9c8afa4f1092120a30bfdef51f2c1b1cd1433fd3cc33b1e
    VT-FB18E4DC-REQ-0008:
      revision: 2
      fingerprint: b7fd31c0c387ddaab3d1b0ac89d1422846c0c67429cdbbe92338a2d81004eb1d
    VT-FB18E4DC-REQ-0009:
      revision: 3
      fingerprint: 5920703360ab39ce2c04ad49f3feba05fef4229d673163228fe02c8fa267d1ce
    VT-FB18E4DC-DES-0001:
      revision: 6
      fingerprint: 1d755a1c73156f94a9e47044a2e352a53d223458ed04b1efe5c979ffdaf6d085
    VT-FB18E4DC-TASK-0001:
      revision: 13
      fingerprint: c3cd685f660e4e1cab081cb6391f778723bc247f5199da124371cfc08cbb8fa2
    VT-FB18E4DC-CHK-0001:
      revision: 5
      fingerprint: c57432eb51f84549aca0328d7929d3549de3ac5414875f5e10d8b88e3c682046
    VT-FB18E4DC-CHK-0002:
      revision: 4
      fingerprint: 778cb428624a00348629c8d898971693adc422d2a3e69df4448ee5e70bb2a308
    VT-FB18E4DC-CHK-0003:
      revision: 4
      fingerprint: c1439b38c91b24c1be935f2094188e256e31bd1b58b729a5fe1b01efa50b515e
    VT-FB18E4DC-REV-0011:
      revision: 1
      fingerprint: 85085b6a7216ff2990aff7251ed9a13d8215bf2bcd66202b517b6026b1d196e4
    VT-FB18E4DC-REV-0012:
      revision: 1
      fingerprint: 0b865920cf14405009aab2e05ef26eff2ab658748be19d5dc23236d451eb3507
    VT-FB18E4DC-REV-0013:
      revision: 1
      fingerprint: 3519a755ea1e3e99d05cf0faab797dd16fc3f063c5ad671619a17b9a58b7dc58
    VT-FB18E4DC-KNW-0017:
      revision: 1
      fingerprint: e9aa92230d9cbb1833da2acde64d30eb8b128bd1c2d56f86990be8d933278302
  verification_artifact_paths: []
  pending_input_bindings:
    source_manifest_record: null
    workspace_before_record: null
    workspace_after_record: null
    source_sha256: null
    pdf_page_counts: null
    edition: null
    lecture_topic_item_ids: null
    render_evidence_ids: null
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
    - Missing independent current plan review or manager source-stage task
      binding
    - Missing current source/workspace identities or required input/render
      evidence
    - Unknown/invented page/topic/item denominator, edition, or locator
    - Unreadable or unresolved essential source observations
    - Missing separate item-by-item actual check_inspect evidence
    - Only source extraction, row counts, note_validate, core gate, historical
      notes or native receipt
  change_policy: New additive source-stage rubric; no supersession or weakening of
    CHK-0001..0008, old reviews, final acceptance, or F2/F3. Any semantic
    correction requires independently reviewed revision and fresh applicable
    evidence.
  task_binding_proposal:
    task_id: VT-FB18E4DC-TASK-0001
    stage: source-stage
    owner: manager
    status: proposed-only-no-task-edit
    scope: source/workspace/book/lecture core metadata and assigned source-audit
      Cornell navigation practice/answer; final study outputs excluded
    required_before_execution:
      - Independent current source-stage plan review
      - Manager replaces source-task check_ids with all three new source-stage
        IDs while retaining existing final checks on downstream increments
      - Actual approved source route and fresh workspace/protected/collision
        baseline
      - Exact task source-audit output identities/path decisions, definition
        fingerprints and actual input record/hash/time/render bindings
  observation_policy: Expected values remain here; actual observations/results
    must be separate authorized check_inspect evidence. Pending fields are not
    verified facts. Partial blocked observations may be recorded but cannot pass
    incomplete items.
  requirement_ids:
    - VT-FB18E4DC-REQ-0001
    - VT-FB18E4DC-REQ-0008
    - VT-FB18E4DC-REQ-0009
  verification_level: configuration
  inspection_items:
    - id: SRC-BASE-01
      criterion: Current exact local source identity
      expected: For both stakeholder-designated PDFs and every used
        related/alternative primary source, inspect current bytes and record
        canonical path/URI, SHA-256, byte size, retrieval time and actual PDF
        page count. Link current title/copyright/TOC renders where applicable
        with exact 1-based PDF index and independently observed printed label. A
        filename or prior report does not prove existence, edition, contents or
        hash.
      inputs:
        - REQ-0001 designated sources
        - authorized current binary inventory/metadata/render evidence (pending)
    - id: SRC-BASE-02
      criterion: Fresh workspace, protected paths and pre-write collisions
      expected: Before any source-audit document write, capture actual branch/revision
        and tracked/untracked/deleted/staged/dirty path snapshot, existing
        user-solution hashes, protected source hashes and submodule state.
        Record exact manager-approved new source-audit paths within TASK-0001
        provenance scope and every collision disposition before writing. No
        historical restoration or clean-tree assumption.
      inputs:
        - current pre-operation workspace/protected snapshot (pending)
        - TASK-0001 allowed scope and manager exact output/collision decisions
          (pending)
    - id: SRC-BASE-03
      criterion: Source-operation preservation only
      expected: Compare the source-audit operation's before/after workspace snapshots,
        source/solution hashes, deletions, submodule state and authorized change
        ledger. All used source and existing solution hashes remain identical;
        unrelated state/deletions are preserved; any note_create artifacts stay
        within exact reviewed source-audit paths. Account explicitly for
        invocation-owned core-record changes and reconcile concurrently observed
        changes to their owners; never claim global preservation from absence of
        this invocation's direct writes. No final package diff is required for
        this stage.
      inputs:
        - operation-local before/after snapshots and hash evidence (pending)
        - authorized source-audit write ledger and concurrent-change
          dispositions (pending)
    - id: SRC-BASE-04
      criterion: Observation applicability and source-stage boundary
      expected: Every source observation/reused item states exact source hash, input
        record revision/fingerprint, evidence/render locator, inspector
        invocation/time/environment/tool versions and limitations; reassess
        against current bytes. Source-audit Cornell/practice/answer, when
        produced, reference these records and remain source-navigation/audit
        only with distinct answer/user-solution identities. A source-stage pass
        proves only these source-operation observations; final increment
        BASE-02/BASE-04, full teaching and acceptance remain pending under
        unchanged final checks.
      inputs:
        - source/workspace core metadata and actual evidence inventory (pending)
        - assigned source-audit Cornell/practice/answer and original final
          CHK-0001
  dependencies:
    - independently reviewed source-stage rubric and manager task binding
    - approved current binary-PDF and workspace inspection route
    - exact source-audit output/collision decisions; operation-local
      before/after evidence
  final_check_id: VT-FB18E4DC-CHK-0001
  finding_id: F1a
  oracle_rationale: Current frozen source bytes and fresh actual operation-local
    pre/post workspace/protected snapshots are independent of authored
    source-audit claims. Administrative receipts or historical snapshots cannot
    substitute.
  author_invocation_id: 30e4942b-da46-4af4-b2eb-4a6409356783
  invocation_role: verifier
  routing_required: true
  task_id: VT-FB18E4DC-TASK-0001
  source_baseline_history:
    - invocation_id: e7b8f012-dd9c-41ba-ab1b-1c6a5669fb90
      captured_at: 2026-10-12 17:27:14 UTC
      record_revision: 5
      record_fingerprint: 66b764b737edc40076fe582519abd06fe0da1dd362795a8012dff7e077e70c82
      bindings:
        VT-FB18E4DC-REQ-0001:
          revision: 2
          fingerprint: 59b09d68f572e87fe86220f3bd0d389e4c5774556597382cb0bc83b6b6e70485
        VT-FB18E4DC-REQ-0002:
          revision: 1
          fingerprint: ebf1a3215d2c8a75a72d9ef843ac35d1267ea065311e98f3a0133cff247cb747
        VT-FB18E4DC-REQ-0003:
          revision: 1
          fingerprint: 0758d61933b4c3c5bb9a92231d00ff2867624b798ea9f47bf93745bbbe5efec3
        VT-FB18E4DC-REQ-0004:
          revision: 1
          fingerprint: a98958282674924638cee5286aeda3c3c2613ada589692666ca874b5c0d69e3c
        VT-FB18E4DC-REQ-0008:
          revision: 1
          fingerprint: db2dde21e0b42755134fcc1e62115e833516d4a87da5f906dd1175194c11fed6
        VT-FB18E4DC-REQ-0009:
          revision: 3
          fingerprint: 5920703360ab39ce2c04ad49f3feba05fef4229d673163228fe02c8fa267d1ce
        VT-FB18E4DC-DES-0001:
          revision: 4
          fingerprint: 92eb6da431e4ada8d243c063f08ee5d5154945c898b01a842d7508533bc7f4b8
        VT-FB18E4DC-TASK-0001:
          revision: 10
          fingerprint: 00354c16e94048d643a76b5e4efe203dd1ea53e438deba1a40374313bfd94d7a
        VT-FB18E4DC-CHK-0001:
          revision: 2
          fingerprint: a43a72016e3a7aaba5bd446113a4cf8078d8777abf292b1908675cb903ca5b0b
        VT-FB18E4DC-CHK-0002:
          revision: 2
          fingerprint: f2fa3ad611511955a0de2441b6e34c27c4fef316fb2486375e5bae84e895af95
        VT-FB18E4DC-CHK-0003:
          revision: 2
          fingerprint: fd930c7297a65f52b5f887baeb49b582140a10ce2a0ac8fd337faee8376fda42
        VT-FB18E4DC-REV-0011:
          revision: 1
          fingerprint: 85085b6a7216ff2990aff7251ed9a13d8215bf2bcd66202b517b6026b1d196e4
        VT-FB18E4DC-REV-0012:
          revision: 1
          fingerprint: 0b865920cf14405009aab2e05ef26eff2ab658748be19d5dc23236d451eb3507
        VT-FB18E4DC-REV-0013:
          revision: 1
          fingerprint: 3519a755ea1e3e99d05cf0faab797dd16fc3f063c5ad671619a17b9a58b7dc58
        VT-FB18E4DC-KNW-0017:
          revision: 1
          fingerprint: e9aa92230d9cbb1833da2acde64d30eb8b128bd1c2d56f86990be8d933278302
---
# Objective
Additive F1a SOURCE-STAGE inspection for TASK-0001, authored by native verifier 35b33a8c-3b96-4fed-86e3-b8e3359055d3. Current CHK-0001 rev2 and REV-0011 remain unchanged; this is not final increment preservation.

# Protected source-stage rubric
## SRC-BASE-01
Criterion: Current exact local source identity
Expected: For both stakeholder-designated PDFs and every used related/alternative primary source, inspect current bytes and record canonical path/URI, SHA-256, byte size, retrieval time and actual PDF page count. Link current title/copyright/TOC renders where applicable with exact 1-based PDF index and independently observed printed label. A filename or prior report does not prove existence, edition, contents or hash.
Inputs: REQ-0001 designated sources; authorized current binary inventory/metadata/render evidence (pending)

## SRC-BASE-02
Criterion: Fresh workspace, protected paths and pre-write collisions
Expected: Before any source-audit document write, capture actual branch/revision and tracked/untracked/deleted/staged/dirty path snapshot, existing user-solution hashes, protected source hashes and submodule state. Record exact manager-approved new source-audit paths within TASK-0001 provenance scope and every collision disposition before writing. No historical restoration or clean-tree assumption.
Inputs: current pre-operation workspace/protected snapshot (pending); TASK-0001 allowed scope and manager exact output/collision decisions (pending)

## SRC-BASE-03
Criterion: Source-operation preservation only
Expected: Compare the source-audit operation's before/after workspace snapshots, source/solution hashes, deletions, submodule state and authorized change ledger. All used source and existing solution hashes remain identical; unrelated state/deletions are preserved; any note_create artifacts stay within exact reviewed source-audit paths. Account explicitly for invocation-owned core-record changes and reconcile concurrently observed changes to their owners; never claim global preservation from absence of this invocation's direct writes. No final package diff is required for this stage.
Inputs: operation-local before/after snapshots and hash evidence (pending); authorized source-audit write ledger and concurrent-change dispositions (pending)

## SRC-BASE-04
Criterion: Observation applicability and source-stage boundary
Expected: Every source observation/reused item states exact source hash, input record revision/fingerprint, evidence/render locator, inspector invocation/time/environment/tool versions and limitations; reassess against current bytes. Source-audit Cornell/practice/answer, when produced, reference these records and remain source-navigation/audit only with distinct answer/user-solution identities. A source-stage pass proves only these source-operation observations; final increment BASE-02/BASE-04, full teaching and acceptance remain pending under unchanged final checks.
Inputs: source/workspace core metadata and actual evidence inventory (pending); assigned source-audit Cornell/practice/answer and original final CHK-0001

# Oracle, evidence and limits
Current frozen source bytes and fresh actual operation-local pre/post workspace/protected snapshots are independent of authored source-audit claims. Administrative receipts or historical snapshots cannot substitute.
Manual inspection; actual observations are recorded separately through authorized check_inspect with current protected definition fingerprint, input/output hashes/revisions, timestamp, tools/environment, logs/render references and limitations. All items NOT RUN. Actual source and workspace bindings remain null/pending; no script exists, so verification_artifact_paths is empty. Source access and exact output/collision evidence are mandatory; independent planning approval alone cannot make execution ready.

# Final allocation and manager action
Bind TASK-0001 only to the three new source-stage check IDs after separate plan review and actual input/output binding. Preserve CHK-0001 BASE-01..04 and its complete expectations/history for downstream/final verification, including increment-wide preservation and final scoped diff. Source-stage observations can later be reassessed as inputs, never automatic full-check passes. No task or product edit is made.
