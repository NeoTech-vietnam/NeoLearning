---
schema_version: 1
id: VT-FB18E4DC-CHK-0011
type: check
title: SOURCE-STAGE exact local book edition, dual locators, body readings and
  topic gaps
owner: verifier
status: draft
revision: 7
created_at: 2026-10-12T12:06:17.225Z
updated_at: 2026-10-12T18:04:13.622Z
links:
  - type: verifies
    target: VT-FB18E4DC-REQ-0001
  - type: verifies
    target: VT-FB18E4DC-REQ-0002
  - type: verifies
    target: VT-FB18E4DC-REQ-0009
  - type: derives-from
    target: VT-FB18E4DC-CHK-0002
  - type: references
    target: VT-FB18E4DC-REV-0012
  - type: references
    target: VT-FB18E4DC-DES-0001
  - type: references
    target: VT-FB18E4DC-TASK-0001
  - type: references
    target: VT-FB18E4DC-CHK-0009
  - type: references
    target: VT-FB18E4DC-CHK-0010
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
    - VT-FB18E4DC-REQ-0002
    - VT-FB18E4DC-REQ-0009
  verification_level: system
  inspection_items:
    - id: SRC-READ-01
      criterion: Exact local edition and dual locator observations
      expected: From current local title/copyright pages confirm author, full title,
        edition and publisher/year. Inspect TOC/index and printed-label mapping
        boundaries. Record each observed printed label, including Roman or
        unnumbered pages, separately from exact 1-based PDF index with source
        hash/render evidence. Filename/external edition/memory and a universal
        assumed offset cannot establish identity or locators.
      inputs:
        - CHK-0009 current book identity
        - current title/copyright/TOC/index and label-boundary renders (pending)
    - id: SRC-READ-02
      criterion: Source-only section/endpoints/body observations
      expected: For every relevant proposed reading row from the actual complete
        CHK-0010 topic inventory, inspect exact section number when present,
        printed heading, inclusive printed and PDF intervals, both endpoint
        contents and the relevant body passages. Record topic association,
        purpose/prerequisite/order and evidence supporting relevance. Observe
        discontinuous/unnumbered labels faithfully; TOC alone is insufficient.
        This is core source reading metadata, not a delivered final reading-map
        or index.
      inputs:
        - CHK-0010 exhaustive actual lecture topic IDs (pending)
        - current section endpoints/body renders and source reading records
          (pending)
    - id: SRC-READ-03
      criterion: All actual topics dispositioned with evidenced gaps
      expected: "Reconcile 100% of the complete observed lecture topic IDs exactly:
        verified relevant local book coverage, or evidenced not-covered with
        exact inspected TOC/index/relevant section search scope and a genuinely
        inspected relevant alternative primary/local source with hash/URI, body
        and exact locators. Distinguish an unverified search/access gap from
        proven absence. Pending/unreadable topics may remain in a partial
        blocked record but prevent whole source-stage pass; no invented section,
        guessed topic denominator, empty row or whole-book substitute."
      inputs:
        - CHK-0010 complete source topic inventory (pending)
        - inspected book search/body scope and alternative primary source
          observations (pending)
    - id: SRC-READ-04
      criterion: Independent observation fidelity and final navigation boundary
      expected: Independent inspector compares all
        edition/heading/label/endpoints/body/gap observations against the
        current frozen source pages, with source hash, record
        revision/fingerprint, exact locator, render evidence,
        invocation/time/tools/environment and limitations. All source-only rows
        have direct support; source-audit navigation practice may reference
        these rows. Final index -> topic -> source -> exact assigned range
        walkthrough and every final reading/source link remain NOT RUN under
        unchanged CHK-0002 READ-04; this stage cannot pass full REQ-0002 or
        final navigation.
      inputs:
        - all source reading/alternative rows and original pages (pending)
        - unchanged CHK-0002 READ-01..04
        - assigned source-audit core/Cornell references (pending)
  dependencies:
    - VT-FB18E4DC-CHK-0009 current source identities only; its later
      post-operation evidence is not an input to mapping
    - VT-FB18E4DC-CHK-0010 actual complete source topic inventory
    - authorized current book/alternative endpoint/body visual inspection
    - independent current plan review and manager source-only binding
  final_check_id: VT-FB18E4DC-CHK-0002
  finding_id: F1b
  oracle_rationale: Current local title/copyright/TOC/index, actual section
    endpoints/body pages and inspected primary alternatives independently
    determine edition/content/gaps. Full visual lecture inventory supplies the
    denominator; authored mapping rows do not prove themselves.
  author_invocation_id: 30e4942b-da46-4af4-b2eb-4a6409356783
  invocation_role: verifier
  routing_required: true
  task_id: VT-FB18E4DC-TASK-0001
  source_baseline_history:
    - invocation_id: e7b8f012-dd9c-41ba-ab1b-1c6a5669fb90
      captured_at: 2026-10-12 17:27:14 UTC
      record_revision: 5
      record_fingerprint: 8e236d3bedbd47915226f16fafe0fe5e82e2553671f3c492287fc70013420a9a
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
Additive F1b SOURCE-STAGE edition/dual-locator/body/gap inspection for TASK-0001. Native verifier 35b33a8c-3b96-4fed-86e3-b8e3359055d3. CHK-0002 rev2 and REV-0012 unchanged.

# Protected rubric
## SRC-READ-01
Criterion: Exact local edition and dual locator observations
Expected: From current local title/copyright pages confirm author, full title, edition and publisher/year. Inspect TOC/index and printed-label mapping boundaries. Record each observed printed label, including Roman or unnumbered pages, separately from exact 1-based PDF index with source hash/render evidence. Filename/external edition/memory and a universal assumed offset cannot establish identity or locators.
Inputs: CHK-0009 current book identity; current title/copyright/TOC/index and label-boundary renders (pending)

## SRC-READ-02
Criterion: Source-only section/endpoints/body observations
Expected: For every relevant proposed reading row from the actual complete CHK-0010 topic inventory, inspect exact section number when present, printed heading, inclusive printed and PDF intervals, both endpoint contents and the relevant body passages. Record topic association, purpose/prerequisite/order and evidence supporting relevance. Observe discontinuous/unnumbered labels faithfully; TOC alone is insufficient. This is core source reading metadata, not a delivered final reading-map or index.
Inputs: CHK-0010 exhaustive actual lecture topic IDs (pending); current section endpoints/body renders and source reading records (pending)

## SRC-READ-03
Criterion: All actual topics dispositioned with evidenced gaps
Expected: Reconcile 100% of the complete observed lecture topic IDs exactly: verified relevant local book coverage, or evidenced not-covered with exact inspected TOC/index/relevant section search scope and a genuinely inspected relevant alternative primary/local source with hash/URI, body and exact locators. Distinguish an unverified search/access gap from proven absence. Pending/unreadable topics may remain in a partial blocked record but prevent whole source-stage pass; no invented section, guessed topic denominator, empty row or whole-book substitute.
Inputs: CHK-0010 complete source topic inventory (pending); inspected book search/body scope and alternative primary source observations (pending)

## SRC-READ-04
Criterion: Independent observation fidelity and final navigation boundary
Expected: Independent inspector compares all edition/heading/label/endpoints/body/gap observations against the current frozen source pages, with source hash, record revision/fingerprint, exact locator, render evidence, invocation/time/tools/environment and limitations. All source-only rows have direct support; source-audit navigation practice may reference these rows. Final index -> topic -> source -> exact assigned range walkthrough and every final reading/source link remain NOT RUN under unchanged CHK-0002 READ-04; this stage cannot pass full REQ-0002 or final navigation.
Inputs: all source reading/alternative rows and original pages (pending); unchanged CHK-0002 READ-01..04; assigned source-audit core/Cornell references (pending)

# Oracle, evidence and limits
Current local title/copyright/TOC/index, actual section endpoints/body pages and inspected primary alternatives independently determine edition/content/gaps. Full visual lecture inventory supplies the denominator; authored mapping rows do not prove themselves.
Actual check_inspect observations remain separate from this protected manual rubric, supplying check fingerprint, source/input/output hashes/revisions, exact render/log references, inspector/time/tools/environment and limitations. All NOT RUN; actual edition/locator/topic/source identities pending; execution_ready false. No script exists; verification_artifact_paths empty. Source-access failure cannot prove absence or satisfy mapping coverage.

# Final allocation
CHK-0002 retains complete READ-01..04, including all delivered readings and the final index/topic/source navigation walkthrough. CHK-0005 intended-use study walkthrough remains mandatory downstream. A source-stage pass supports only observed source facts after applicability reassessment; no final check/requirement pass or task edit occurs. Manager binds TASK-0001 to CHK-0009/0010/0011 only after independent source-stage plan review, actual input identities and exact source-audit output/collision binding.
