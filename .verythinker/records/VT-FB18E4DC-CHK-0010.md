---
schema_version: 1
id: VT-FB18E4DC-CHK-0010
type: check
title: SOURCE-STAGE exhaustive visual lecture page, item, formula and diagram
  inventory
owner: verifier
status: draft
revision: 6
created_at: 2026-10-12T12:05:28.192Z
updated_at: 2026-10-12T18:04:06.724Z
links:
  - type: verifies
    target: VT-FB18E4DC-REQ-0001
  - type: verifies
    target: VT-FB18E4DC-REQ-0003
  - type: verifies
    target: VT-FB18E4DC-REQ-0004
  - type: derives-from
    target: VT-FB18E4DC-CHK-0003
  - type: references
    target: VT-FB18E4DC-REV-0013
  - type: references
    target: VT-FB18E4DC-DES-0001
  - type: references
    target: VT-FB18E4DC-TASK-0001
  - type: references
    target: VT-FB18E4DC-CHK-0009
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
    - VT-FB18E4DC-REQ-0003
    - VT-FB18E4DC-REQ-0004
  verification_level: system
  inspection_items:
    - id: SRC-SLIDE-01
      criterion: Exact all-page visual denominator
      expected: Freeze current lecture SHA-256 and N from actual PDF metadata;
        independently view every rendered 1-based page 1..N, with one unique row
        per ordinal. Record observed slide/printed label separately, title,
        topic IDs, render reference and source-only disposition. Include
        cover/admin/blank/repeated pages with reason and repeated-source
        relations. Unknown N, missing/duplicate pages, sampling or
        extracted-text-only audit fails.
      inputs:
        - CHK-0009 current lecture identity
        - all current PDF metadata/page renders and page ledger (pending)
    - id: SRC-SLIDE-02
      criterion: Every substantive item and essential data
      expected: Record every topic, labelled/unlabelled or partially worked example,
        numeric substitution, prompt/exercise, demonstration step, formula,
        table and explanatory or diagram-only item. Stable IDs use source hash +
        PDF page + local ordinal; include page-region locators, multipage
        relations, faithful essential inputs/units/assumptions/conditions and
        source-defined symbols. Compare each page visually to every item row; no
        substantive example/figure is administrative. Unknown/unreadable
        essential data fails; never guess.
      inputs:
        - all current renders and extraction aid (pending)
        - source page/item/topic ledgers and multipage relations (pending)
    - id: SRC-SLIDE-03
      criterion: Source formula and diagram observation fidelity
      expected: Visually inventory every equation, plot/waveform, axis, block diagram,
        caption, arrow, legend and annotation. Preserve observed symbols/text,
        superscripts/subscripts, units, signs/directions, connections and region
        evidence. Label purpose source-reported or inferred; preserve source
        statement separately from suspected errors/corrections. Compare renders
        wherever extraction loses information; essential visual ambiguity fails.
        Source fidelity does not establish authored-redraw correctness or
        delivered mathematics.
      inputs:
        - full current renders (pending)
        - formula/visual-item records, extraction comparison and discrepancy
          ledger (pending)
    - id: SRC-SLIDE-04
      criterion: Complete reconciliation and honest downstream status
      expected: Independent source-to-ledger visual comparison shows 100% page
        dispositions and every substantive item with zero unexplained omissions.
        Enumerate the complete technical-topic denominator for source book
        mapping. Include exact locators/hash/evidence, inspector
        invocation/time/environment/tools for each observation. Final
        explanation/exercise/example destinations, redraws,
        derivations/recalculation and teaching accuracy remain explicitly
        pending-downstream; source-audit Cornell/navigation practice cannot mark
        final teaching covered/passed.
      inputs:
        - full page/item/topic reconciliation evidence (pending)
        - unchanged CHK-0003 SLIDE-01..05
        - source-audit core/Cornell references (pending)
  dependencies:
    - VT-FB18E4DC-CHK-0009 current source identity only; later post-operation
      evidence is not an input to inventory
    - authorized all-page visual source route
    - independent current plan review and manager source-only binding
  final_check_id: VT-FB18E4DC-CHK-0003
  finding_id: F1c
  oracle_rationale: Full independently viewed current lecture renders and actual
    PDF metadata are the coverage/fidelity oracle; ledgers/extraction are
    compared to original pages, not used as self-oracles.
  author_invocation_id: 30e4942b-da46-4af4-b2eb-4a6409356783
  invocation_role: verifier
  routing_required: true
  task_id: VT-FB18E4DC-TASK-0001
  source_baseline_history:
    - invocation_id: e7b8f012-dd9c-41ba-ab1b-1c6a5669fb90
      captured_at: 2026-10-12 17:27:14 UTC
      record_revision: 4
      record_fingerprint: 2f9f758917cf359b07756bdee705faa45360826f19c197f3f1178f61c07105a5
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
Additive F1c SOURCE-STAGE visual lecture inventory for TASK-0001, native verifier 35b33a8c-3b96-4fed-86e3-b8e3359055d3. CHK-0003 rev2 and REV-0013 unchanged.

# Protected rubric
## SRC-SLIDE-01
Criterion: Exact all-page visual denominator
Expected: Freeze current lecture SHA-256 and N from actual PDF metadata; independently view every rendered 1-based page 1..N, with one unique row per ordinal. Record observed slide/printed label separately, title, topic IDs, render reference and source-only disposition. Include cover/admin/blank/repeated pages with reason and repeated-source relations. Unknown N, missing/duplicate pages, sampling or extracted-text-only audit fails.
Inputs: CHK-0009 current lecture identity; all current PDF metadata/page renders and page ledger (pending)

## SRC-SLIDE-02
Criterion: Every substantive item and essential data
Expected: Record every topic, labelled/unlabelled or partially worked example, numeric substitution, prompt/exercise, demonstration step, formula, table and explanatory or diagram-only item. Stable IDs use source hash + PDF page + local ordinal; include page-region locators, multipage relations, faithful essential inputs/units/assumptions/conditions and source-defined symbols. Compare each page visually to every item row; no substantive example/figure is administrative. Unknown/unreadable essential data fails; never guess.
Inputs: all current renders and extraction aid (pending); source page/item/topic ledgers and multipage relations (pending)

## SRC-SLIDE-03
Criterion: Source formula and diagram observation fidelity
Expected: Visually inventory every equation, plot/waveform, axis, block diagram, caption, arrow, legend and annotation. Preserve observed symbols/text, superscripts/subscripts, units, signs/directions, connections and region evidence. Label purpose source-reported or inferred; preserve source statement separately from suspected errors/corrections. Compare renders wherever extraction loses information; essential visual ambiguity fails. Source fidelity does not establish authored-redraw correctness or delivered mathematics.
Inputs: full current renders (pending); formula/visual-item records, extraction comparison and discrepancy ledger (pending)

## SRC-SLIDE-04
Criterion: Complete reconciliation and honest downstream status
Expected: Independent source-to-ledger visual comparison shows 100% page dispositions and every substantive item with zero unexplained omissions. Enumerate the complete technical-topic denominator for source book mapping. Include exact locators/hash/evidence, inspector invocation/time/environment/tools for each observation. Final explanation/exercise/example destinations, redraws, derivations/recalculation and teaching accuracy remain explicitly pending-downstream; source-audit Cornell/navigation practice cannot mark final teaching covered/passed.
Inputs: full page/item/topic reconciliation evidence (pending); unchanged CHK-0003 SLIDE-01..05; source-audit core/Cornell references (pending)

# Oracle, evidence and limits
Full independently viewed current lecture renders and actual PDF metadata are the coverage/fidelity oracle; ledgers/extraction are compared to original pages, not used as self-oracles.
Separate actual check_inspect observations must capture current protected definition fingerprint, input/source/output hashes and revisions, exact locator/render/log references, inspector/time/tools/environment and limitations. All NOT RUN; actual N/hash/topic/item/render identities pending; execution_ready false. Manual core rubric, no verification script; verification_artifact_paths empty. Source failure is a blocker, never reduced coverage.

# Final allocation
Unchanged CHK-0003 preserves SLIDE-01/02 final destination linkage, SLIDE-03 authored-redraw fidelity, SLIDE-04 every delivered numeric/symbolic claim recomputation and SLIDE-05 final authored-content correctness. CHK-0005 final teaching/index walkthrough and CHK-0006/0007 final integration/runtime stay unchanged. Manager rebinds TASK-0001 to all three new source-stage IDs after separate review; no task edit or final pass is made here.
