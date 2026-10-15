---
schema_version: 1
id: VT-FB18E4DC-CHK-0003
type: check
title: Exhaustive 00_Intro slide, visual, example and numerical content audit
owner: verifier
status: draft
revision: 4
created_at: 2026-10-12T08:27:30.896Z
updated_at: 2026-10-12T17:09:25.107Z
links:
  - type: verifies
    target: VT-FB18E4DC-REQ-0001
  - type: references
    target: VT-FB18E4DC-CHK-0001
  - type: references
    target: VT-FB18E4DC-KNW-0002
  - type: verifies
    target: VT-FB18E4DC-REQ-0003
  - type: verifies
    target: VT-FB18E4DC-REQ-0004
data:
  workflow_id: VT-FB18E4DC-KNW-0001
  requirement_ids:
    - VT-FB18E4DC-REQ-0001
    - VT-FB18E4DC-REQ-0003
    - VT-FB18E4DC-REQ-0004
  invocation_id: b74cad1a-30d3-4c18-8304-0b4fd5841650
  definition_status: bounded-awaiting-source-inventory-and-independent-plan-review
  execution_status: not-run
  source_baseline:
    VT-FB18E4DC-REQ-0001:
      revision: 3
      fingerprint: 3910ed7d981d5434c94b104ad999ba322afd426430bf90983af15628f7ba7833
    VT-FB18E4DC-KNW-0002: 3d0cb3a3803c035acb47993d9052f503856ac988402af946cbc6ee402a295f04
    VT-FB18E4DC-REQ-0003:
      revision: 2
      fingerprint: f6f97211e010a6d5527427982f95f7139d58e61f58fd336b2dda1952f3d05f83
    VT-FB18E4DC-REQ-0004:
      revision: 2
      fingerprint: 8ce9cbf563aacf47d9c8afa4f1092120a30bfdef51f2c1b1cd1433fd3cc33b1e
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
  verification_level: system
  inspection_items:
    - id: SLIDE-01
      criterion: All-slide denominator and coverage
      expected: List every current 1-based PDF page 1..N exactly once with observed
        slide label/title, topic and disposition. Review every page visually,
        not just pages with extracted text; include cover/admin pages with
        explicit reason. Map every substantive element to final
        note/exercise/example IDs. N comes from actual PDF metadata, never prior
        notes.
      inputs:
        - current full 00_Intro page inventory, page renders and final coverage
          matrix
    - id: SLIDE-02
      criterion: Complete worked examples and exercises
      expected: Audit all labelled and unlabelled examples, numerical substitutions,
        exercise prompts, demonstration steps and diagram-only questions. Stable
        IDs use source hash + PDF page + local ordinal; transcribe essential
        input/units/assumptions and preserve relation to source. All detected
        items included with exact locators; no omissions hidden as background
        figures.
      inputs:
        - every lecture page render/extract, example/exercise inventory and
          final artifacts
    - id: SLIDE-03
      criterion: Diagram and formula fidelity
      expected: For every plot, waveform, axis, block diagram, caption, equation,
        arrow, legend and annotation, compare source render to
        explanation/redrawn diagram; record its purpose, labels, units,
        sign/direction and connections. Inspect all pages where extraction loses
        symbols, superscripts, subscripts or graphics. Unresolved visual
        ambiguity is a gap, not pass.
      inputs:
        - all page renders, visual-element manifest and authored diagrams
    - id: SLIDE-04
      criterion: All numerical claims and assumptions
      expected: Audit every reported input, intermediate and final number and symbolic
        formula in notes, examples, diagrams and answers. Independently
        derive/recompute using source-defined conventions and list units, sample
        rate/period, Hz/rad/s/rad/sample, amplitude RMS/peak, normalization,
        phase/time index, quantizer model and rounding where applicable. Check
        domains and boundary conditions. Preserve and explain source errors
        instead of silently propagating them.
      inputs:
        - all numerical/symbolic claim ledger, source pages, independently
          calculated oracle
    - id: SLIDE-05
      criterion: Content accuracy and evidence
      expected: For each page/element, log actual visual/source observations, exact
        PDF and observed printed/slide locator, inspector identity and
        disposition. Sampling, regex checks, note_validate, source receipt
        recovery or generated answer self-comparison cannot establish exhaustive
        semantic correctness.
      inputs:
        - itemized manual inspection evidence and current artifacts
  oracle_rationale: Full current lecture renders and independently inspected local
    textbook/primary sections; use independently worked mathematics rather than
    expected values generated by the practice under test. Extraction is an aid;
    visual inspection establishes diagram/symbol observations. No DSP facts are
    asserted before source access.
  dependencies:
    - CHK-0001 current lecture hash and actual total pages
    - all-page extracted text and rendered lecture pages
    - final notes/examples and source independent calculations
  author_invocation_id: b74cad1a-30d3-4c18-8304-0b4fd5841650
  invocation_role: verifier
  routing_required: true
  previous_definition:
    revision: 1
    fingerprint: ac4fb1f13307d96b8cd65e4ef5b7f5691e0970118fe81009248c56776decae48
    body: >
      # Objective

      Exhaustive 00_Intro slide, visual, example and numerical content audit for
      REQ-0001. Definition authored by invocation
      d5d56ba9-4373-453d-bae5-c1c27ff413c0; bounded frozen rubric, not
      source-content evidence.


      # Protected inspection rubric

      ## SLIDE-01

      Criterion: All-slide denominator and coverage

      Expected: List every current 1-based PDF page 1..N exactly once with
      observed slide label/title, topic and disposition. Review every page
      visually, not just pages with extracted text; include cover/admin pages
      with explicit reason. Map every substantive element to final
      note/exercise/example IDs. N comes from actual PDF metadata, never prior
      notes.

      Referenced inputs: current full 00_Intro page inventory, page renders and
      final coverage matrix


      ## SLIDE-02

      Criterion: Complete worked examples and exercises

      Expected: Audit all labelled and unlabelled examples, numerical
      substitutions, exercise prompts, demonstration steps and diagram-only
      questions. Stable IDs use source hash + PDF page + local ordinal;
      transcribe essential input/units/assumptions and preserve relation to
      source. All detected items included with exact locators; no omissions
      hidden as background figures.

      Referenced inputs: every lecture page render/extract, example/exercise
      inventory and final artifacts


      ## SLIDE-03

      Criterion: Diagram and formula fidelity

      Expected: For every plot, waveform, axis, block diagram, caption,
      equation, arrow, legend and annotation, compare source render to
      explanation/redrawn diagram; record its purpose, labels, units,
      sign/direction and connections. Inspect all pages where extraction loses
      symbols, superscripts, subscripts or graphics. Unresolved visual ambiguity
      is a gap, not pass.

      Referenced inputs: all page renders, visual-element manifest and authored
      diagrams


      ## SLIDE-04

      Criterion: All numerical claims and assumptions

      Expected: Audit every reported input, intermediate and final number and
      symbolic formula in notes, examples, diagrams and answers. Independently
      derive/recompute using source-defined conventions and list units, sample
      rate/period, Hz/rad/s/rad/sample, amplitude RMS/peak, normalization,
      phase/time index, quantizer model and rounding where applicable. Check
      domains and boundary conditions. Preserve and explain source errors
      instead of silently propagating them.

      Referenced inputs: all numerical/symbolic claim ledger, source pages,
      independently calculated oracle


      ## SLIDE-05

      Criterion: Content accuracy and evidence

      Expected: For each page/element, log actual visual/source observations,
      exact PDF and observed printed/slide locator, inspector identity and
      disposition. Sampling, regex checks, note_validate, source receipt
      recovery or generated answer self-comparison cannot establish exhaustive
      semantic correctness.

      Referenced inputs: itemized manual inspection evidence and current
      artifacts


      # Independent oracle and method

      Full current lecture renders and independently inspected local
      textbook/primary sections; use independently worked mathematics rather
      than expected values generated by the practice under test. Extraction is
      an aid; visual inspection establishes diagram/symbol observations. No DSP
      facts are asserted before source access.

      Method: inspection; actual item-by-item observations must be recorded
      separately by authorized check_inspect. No executable result is claimed by
      this manual rubric.


      # Dependencies

      CHK-0001 current lecture hash and actual total pages

      all-page extracted text and rendered lecture pages

      final notes/examples and source independent calculations

      All observations NOT RUN. Final exact per-page/item/source locators await
      actual source inventory; no placeholder is a verified locator. Bind
      refined criterion IDs and source hashes by independently reviewed revision
      before execution. No verification script exists in this definition;
      verification_artifact_paths is empty intentionally.


      # Protected expectations and evidence

      Retain prior expectations, review and failure history. Any semantic
      oracle/rubric/script correction needs explicit reviewed change and fresh
      evidence; never loosen expectations to obtain a pass.

      Capture inspector invocation, current source/deliverable revision and
      hashes, timestamp/environment/tools, observations per unique item,
      failures and limitations, render references and archived logs. Require
      independent plan review and current final review; structural core verify
      or recovery receipt cannot pass this check.
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
      verification_level: system
      inspection_items:
        - id: SLIDE-01
          criterion: All-slide denominator and coverage
          expected: List every current 1-based PDF page 1..N exactly once with observed
            slide label/title, topic and disposition. Review every page
            visually, not just pages with extracted text; include cover/admin
            pages with explicit reason. Map every substantive element to final
            note/exercise/example IDs. N comes from actual PDF metadata, never
            prior notes.
          inputs:
            - current full 00_Intro page inventory, page renders and final
              coverage matrix
        - id: SLIDE-02
          criterion: Complete worked examples and exercises
          expected: Audit all labelled and unlabelled examples, numerical substitutions,
            exercise prompts, demonstration steps and diagram-only questions.
            Stable IDs use source hash + PDF page + local ordinal; transcribe
            essential input/units/assumptions and preserve relation to source.
            All detected items included with exact locators; no omissions hidden
            as background figures.
          inputs:
            - every lecture page render/extract, example/exercise inventory and
              final artifacts
        - id: SLIDE-03
          criterion: Diagram and formula fidelity
          expected: For every plot, waveform, axis, block diagram, caption, equation,
            arrow, legend and annotation, compare source render to
            explanation/redrawn diagram; record its purpose, labels, units,
            sign/direction and connections. Inspect all pages where extraction
            loses symbols, superscripts, subscripts or graphics. Unresolved
            visual ambiguity is a gap, not pass.
          inputs:
            - all page renders, visual-element manifest and authored diagrams
        - id: SLIDE-04
          criterion: All numerical claims and assumptions
          expected: Audit every reported input, intermediate and final number and symbolic
            formula in notes, examples, diagrams and answers. Independently
            derive/recompute using source-defined conventions and list units,
            sample rate/period, Hz/rad/s/rad/sample, amplitude RMS/peak,
            normalization, phase/time index, quantizer model and rounding where
            applicable. Check domains and boundary conditions. Preserve and
            explain source errors instead of silently propagating them.
          inputs:
            - all numerical/symbolic claim ledger, source pages, independently
              calculated oracle
        - id: SLIDE-05
          criterion: Content accuracy and evidence
          expected: For each page/element, log actual visual/source observations, exact
            PDF and observed printed/slide locator, inspector identity and
            disposition. Sampling, regex checks, note_validate, source receipt
            recovery or generated answer self-comparison cannot establish
            exhaustive semantic correctness.
          inputs:
            - itemized manual inspection evidence and current artifacts
      oracle_rationale: Full current lecture renders and independently inspected local
        textbook/primary sections; use independently worked mathematics rather
        than expected values generated by the practice under test. Extraction is
        an aid; visual inspection establishes diagram/symbol observations. No
        DSP facts are asserted before source access.
      dependencies:
        - CHK-0001 current lecture hash and actual total pages
        - all-page extracted text and rendered lecture pages
        - final notes/examples and source independent calculations
      author_invocation_id: d5d56ba9-4373-453d-bae5-c1c27ff413c0
      invocation_role: verifier
      routing_required: true
  refinement_reason: Mapped current detailed criteria VT-FB18E4DC-REQ-0003,
    VT-FB18E4DC-REQ-0004 to this check after reading every refined requirement.
    Parent REQ-0001 revision 2 supersedes empty acceptance criteria; no executed
    evidence/pass exists. Preserve initial definition in
    data.previous_definition. Source-dependent bounds are unchanged.
---
# Objective
Exhaustive 00_Intro slide, visual, example and numerical content audit for REQ-0001. Definition authored by invocation d5d56ba9-4373-453d-bae5-c1c27ff413c0; bounded frozen rubric, not source-content evidence.

# Protected inspection rubric
## SLIDE-01
Criterion: All-slide denominator and coverage
Expected: List every current 1-based PDF page 1..N exactly once with observed slide label/title, topic and disposition. Review every page visually, not just pages with extracted text; include cover/admin pages with explicit reason. Map every substantive element to final note/exercise/example IDs. N comes from actual PDF metadata, never prior notes.
Referenced inputs: current full 00_Intro page inventory, page renders and final coverage matrix

## SLIDE-02
Criterion: Complete worked examples and exercises
Expected: Audit all labelled and unlabelled examples, numerical substitutions, exercise prompts, demonstration steps and diagram-only questions. Stable IDs use source hash + PDF page + local ordinal; transcribe essential input/units/assumptions and preserve relation to source. All detected items included with exact locators; no omissions hidden as background figures.
Referenced inputs: every lecture page render/extract, example/exercise inventory and final artifacts

## SLIDE-03
Criterion: Diagram and formula fidelity
Expected: For every plot, waveform, axis, block diagram, caption, equation, arrow, legend and annotation, compare source render to explanation/redrawn diagram; record its purpose, labels, units, sign/direction and connections. Inspect all pages where extraction loses symbols, superscripts, subscripts or graphics. Unresolved visual ambiguity is a gap, not pass.
Referenced inputs: all page renders, visual-element manifest and authored diagrams

## SLIDE-04
Criterion: All numerical claims and assumptions
Expected: Audit every reported input, intermediate and final number and symbolic formula in notes, examples, diagrams and answers. Independently derive/recompute using source-defined conventions and list units, sample rate/period, Hz/rad/s/rad/sample, amplitude RMS/peak, normalization, phase/time index, quantizer model and rounding where applicable. Check domains and boundary conditions. Preserve and explain source errors instead of silently propagating them.
Referenced inputs: all numerical/symbolic claim ledger, source pages, independently calculated oracle

## SLIDE-05
Criterion: Content accuracy and evidence
Expected: For each page/element, log actual visual/source observations, exact PDF and observed printed/slide locator, inspector identity and disposition. Sampling, regex checks, note_validate, source receipt recovery or generated answer self-comparison cannot establish exhaustive semantic correctness.
Referenced inputs: itemized manual inspection evidence and current artifacts

# Independent oracle and method
Full current lecture renders and independently inspected local textbook/primary sections; use independently worked mathematics rather than expected values generated by the practice under test. Extraction is an aid; visual inspection establishes diagram/symbol observations. No DSP facts are asserted before source access.
Method: inspection; actual item-by-item observations must be recorded separately by authorized check_inspect. No executable result is claimed by this manual rubric.

# Dependencies
CHK-0001 current lecture hash and actual total pages
all-page extracted text and rendered lecture pages
final notes/examples and source independent calculations
All observations NOT RUN. Final exact per-page/item/source locators await actual source inventory; no placeholder is a verified locator. Bind refined criterion IDs and source hashes by independently reviewed revision before execution. No verification script exists in this definition; verification_artifact_paths is empty intentionally.

# Protected expectations and evidence
Retain prior expectations, review and failure history. Any semantic oracle/rubric/script correction needs explicit reviewed change and fresh evidence; never loosen expectations to obtain a pass.
Capture inspector invocation, current source/deliverable revision and hashes, timestamp/environment/tools, observations per unique item, failures and limitations, render references and archived logs. Require independent plan review and current final review; structural core verify or recovery receipt cannot pass this check.


# Pre-review requirements reconciliation
Mapped current detailed criteria VT-FB18E4DC-REQ-0003, VT-FB18E4DC-REQ-0004 to this check after reading every refined requirement. Parent REQ-0001 revision 2 supersedes empty acceptance criteria; no executed evidence/pass exists. Preserve initial definition in data.previous_definition. Source-dependent bounds are unchanged.

# Current complete rubric (supersedes provisional wording where clarified)
SLIDE-01: All-slide denominator and coverage
Expected: List every current 1-based PDF page 1..N exactly once with observed slide label/title, topic and disposition. Review every page visually, not just pages with extracted text; include cover/admin pages with explicit reason. Map every substantive element to final note/exercise/example IDs. N comes from actual PDF metadata, never prior notes.
Inputs: current full 00_Intro page inventory, page renders and final coverage matrix

SLIDE-02: Complete worked examples and exercises
Expected: Audit all labelled and unlabelled examples, numerical substitutions, exercise prompts, demonstration steps and diagram-only questions. Stable IDs use source hash + PDF page + local ordinal; transcribe essential input/units/assumptions and preserve relation to source. All detected items included with exact locators; no omissions hidden as background figures.
Inputs: every lecture page render/extract, example/exercise inventory and final artifacts

SLIDE-03: Diagram and formula fidelity
Expected: For every plot, waveform, axis, block diagram, caption, equation, arrow, legend and annotation, compare source render to explanation/redrawn diagram; record its purpose, labels, units, sign/direction and connections. Inspect all pages where extraction loses symbols, superscripts, subscripts or graphics. Unresolved visual ambiguity is a gap, not pass.
Inputs: all page renders, visual-element manifest and authored diagrams

SLIDE-04: All numerical claims and assumptions
Expected: Audit every reported input, intermediate and final number and symbolic formula in notes, examples, diagrams and answers. Independently derive/recompute using source-defined conventions and list units, sample rate/period, Hz/rad/s/rad/sample, amplitude RMS/peak, normalization, phase/time index, quantizer model and rounding where applicable. Check domains and boundary conditions. Preserve and explain source errors instead of silently propagating them.
Inputs: all numerical/symbolic claim ledger, source pages, independently calculated oracle

SLIDE-05: Content accuracy and evidence
Expected: For each page/element, log actual visual/source observations, exact PDF and observed printed/slide locator, inspector identity and disposition. Sampling, regex checks, note_validate, source receipt recovery or generated answer self-comparison cannot establish exhaustive semantic correctness.
Inputs: itemized manual inspection evidence and current artifacts
