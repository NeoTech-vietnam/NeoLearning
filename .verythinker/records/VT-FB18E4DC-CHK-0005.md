---
schema_version: 1
id: VT-FB18E4DC-CHK-0005
type: check
title: Cornell content completeness and intended-use acceptance inspection
owner: verifier
status: draft
revision: 4
created_at: 2026-10-12T08:27:37.171Z
updated_at: 2026-10-12T17:09:44.161Z
links:
  - type: verifies
    target: VT-FB18E4DC-REQ-0001
  - type: references
    target: VT-FB18E4DC-CHK-0001
  - type: references
    target: VT-FB18E4DC-KNW-0002
  - type: verifies
    target: VT-FB18E4DC-REQ-0007
data:
  workflow_id: VT-FB18E4DC-KNW-0001
  requirement_ids:
    - VT-FB18E4DC-REQ-0001
    - VT-FB18E4DC-REQ-0007
  invocation_id: b74cad1a-30d3-4c18-8304-0b4fd5841650
  definition_status: bounded-awaiting-source-inventory-and-independent-plan-review
  execution_status: not-run
  source_baseline:
    VT-FB18E4DC-REQ-0001:
      revision: 3
      fingerprint: 3910ed7d981d5434c94b104ad999ba322afd426430bf90983af15628f7ba7833
    VT-FB18E4DC-KNW-0002: 3d0cb3a3803c035acb47993d9052f503856ac988402af946cbc6ee402a295f04
    VT-FB18E4DC-REQ-0007:
      revision: 2
      fingerprint: 2d50d4e5e43f967fd6a17b54473048e74e62b5075982768f3f5ac55d6ec10e62
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
  inspection_items:
    - id: CORN-01
      criterion: Substantive Cornell content
      expected: Each topic note has concrete context/constraints, answerable cues,
        substantial source-cited main notes, synthesis/summary, a worked
        demonstration with separately labelled expected versus observed results,
        failure/boundary cases, and real practice with a distinct answer
        artifact. Empty templates, copied headings and superficial summaries
        fail.
      inputs:
        - all final Cornell notes and linked practice/answer artifacts
    - id: CORN-02
      criterion: Evidence labels and technical teaching
      expected: Definitions, source-reported claims, independently derived identities,
        assumptions/inferences and observed results are distinguishable.
        Explanations connect source concept -> diagram/numerical example ->
        derivation -> interpretation; figures are readable and match
        mathematics. No observed claim without applicable evidence.
      inputs:
        - all notes and independent source/math/visual observations
    - id: CORN-03
      criterion: Course-topic coverage and use
      expected: For every substantive 00_Intro topic, a reader can start at the index,
        find the relevant Cornell note, directly navigate exact verified
        book/alternative range, follow the worked example, attempt a question
        before opening the answer, and access runnable practice where
        applicable. Perform actual walkthrough for every topic; record paths and
        failures.
      inputs:
        - complete source topic inventory, final index, notes, reading map and
          practice
    - id: CORN-04
      criterion: Format is supporting evidence only
      expected: Run note_validate when authorized on actual note record IDs and retain
        output, then perform substantive manual source/content/visual review for
        every note. A format/links validator passing is necessary where
        applicable but never sufficient for correctness or intended-use
        acceptance.
      inputs:
        - Cornell recipe 1.0.0, actual note records, validator output and manual
          observations
  oracle_rationale: Original intended user reading/practice flow in REQ-0001 and
    source-audited topic/reading/example inventories. Cornell recipe
    cornell-evidence-note 1.0.0 hash
    2db1a7dbfd29f989ffe3d0f8703277b2ec2375a3ba02086f7dbff22b3b08aad1 contributes
    structure/provenance expectations only.
  dependencies:
    - completed reading/slide/exercise inspections
    - final Cornell notes/index/practice/answer artifacts
    - current refined requirements
  author_invocation_id: b74cad1a-30d3-4c18-8304-0b4fd5841650
  invocation_role: verifier
  routing_required: true
  previous_definition:
    revision: 1
    fingerprint: b1cc2aab0812ff2c127c05cd4a0574e969496d3e4ec1699240a718a57bb911a7
    body: >
      # Objective

      Cornell content completeness and intended-use acceptance inspection for
      REQ-0001. Definition authored by invocation
      d5d56ba9-4373-453d-bae5-c1c27ff413c0; bounded frozen rubric, not
      source-content evidence.


      # Protected inspection rubric

      ## CORN-01

      Criterion: Substantive Cornell content

      Expected: Each topic note has concrete context/constraints, answerable
      cues, substantial source-cited main notes, synthesis/summary, a worked
      demonstration with separately labelled expected versus observed results,
      failure/boundary cases, and real practice with a distinct answer artifact.
      Empty templates, copied headings and superficial summaries fail.

      Referenced inputs: all final Cornell notes and linked practice/answer
      artifacts


      ## CORN-02

      Criterion: Evidence labels and technical teaching

      Expected: Definitions, source-reported claims, independently derived
      identities, assumptions/inferences and observed results are
      distinguishable. Explanations connect source concept -> diagram/numerical
      example -> derivation -> interpretation; figures are readable and match
      mathematics. No observed claim without applicable evidence.

      Referenced inputs: all notes and independent source/math/visual
      observations


      ## CORN-03

      Criterion: Course-topic coverage and use

      Expected: For every substantive 00_Intro topic, a reader can start at the
      index, find the relevant Cornell note, directly navigate exact verified
      book/alternative range, follow the worked example, attempt a question
      before opening the answer, and access runnable practice where applicable.
      Perform actual walkthrough for every topic; record paths and failures.

      Referenced inputs: complete source topic inventory, final index, notes,
      reading map and practice


      ## CORN-04

      Criterion: Format is supporting evidence only

      Expected: Run note_validate when authorized on actual note record IDs and
      retain output, then perform substantive manual source/content/visual
      review for every note. A format/links validator passing is necessary where
      applicable but never sufficient for correctness or intended-use
      acceptance.

      Referenced inputs: Cornell recipe 1.0.0, actual note records, validator
      output and manual observations


      # Independent oracle and method

      Original intended user reading/practice flow in REQ-0001 and
      source-audited topic/reading/example inventories. Cornell recipe
      cornell-evidence-note 1.0.0 hash
      2db1a7dbfd29f989ffe3d0f8703277b2ec2375a3ba02086f7dbff22b3b08aad1
      contributes structure/provenance expectations only.

      Method: manual-acceptance; actual item-by-item observations must be
      recorded separately by authorized check_inspect. No executable result is
      claimed by this manual rubric.


      # Dependencies

      completed reading/slide/exercise inspections

      final Cornell notes/index/practice/answer artifacts

      current refined requirements

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
      method: manual-acceptance
      verification_level: acceptance
      inspection_items:
        - id: CORN-01
          criterion: Substantive Cornell content
          expected: Each topic note has concrete context/constraints, answerable cues,
            substantial source-cited main notes, synthesis/summary, a worked
            demonstration with separately labelled expected versus observed
            results, failure/boundary cases, and real practice with a distinct
            answer artifact. Empty templates, copied headings and superficial
            summaries fail.
          inputs:
            - all final Cornell notes and linked practice/answer artifacts
        - id: CORN-02
          criterion: Evidence labels and technical teaching
          expected: Definitions, source-reported claims, independently derived identities,
            assumptions/inferences and observed results are distinguishable.
            Explanations connect source concept -> diagram/numerical example ->
            derivation -> interpretation; figures are readable and match
            mathematics. No observed claim without applicable evidence.
          inputs:
            - all notes and independent source/math/visual observations
        - id: CORN-03
          criterion: Course-topic coverage and use
          expected: For every substantive 00_Intro topic, a reader can start at the index,
            find the relevant Cornell note, directly navigate exact verified
            book/alternative range, follow the worked example, attempt a
            question before opening the answer, and access runnable practice
            where applicable. Perform actual walkthrough for every topic; record
            paths and failures.
          inputs:
            - complete source topic inventory, final index, notes, reading map
              and practice
        - id: CORN-04
          criterion: Format is supporting evidence only
          expected: Run note_validate when authorized on actual note record IDs and retain
            output, then perform substantive manual source/content/visual review
            for every note. A format/links validator passing is necessary where
            applicable but never sufficient for correctness or intended-use
            acceptance.
          inputs:
            - Cornell recipe 1.0.0, actual note records, validator output and
              manual observations
      oracle_rationale: Original intended user reading/practice flow in REQ-0001 and
        source-audited topic/reading/example inventories. Cornell recipe
        cornell-evidence-note 1.0.0 hash
        2db1a7dbfd29f989ffe3d0f8703277b2ec2375a3ba02086f7dbff22b3b08aad1
        contributes structure/provenance expectations only.
      dependencies:
        - completed reading/slide/exercise inspections
        - final Cornell notes/index/practice/answer artifacts
        - current refined requirements
      author_invocation_id: d5d56ba9-4373-453d-bae5-c1c27ff413c0
      invocation_role: verifier
      routing_required: true
  refinement_reason: Mapped current detailed criteria VT-FB18E4DC-REQ-0007 to this
    check after reading every refined requirement. Parent REQ-0001 revision 2
    supersedes empty acceptance criteria; no executed evidence/pass exists.
    Preserve initial definition in data.previous_definition. Source-dependent
    bounds are unchanged.
---
# Objective
Cornell content completeness and intended-use acceptance inspection for REQ-0001. Definition authored by invocation d5d56ba9-4373-453d-bae5-c1c27ff413c0; bounded frozen rubric, not source-content evidence.

# Protected inspection rubric
## CORN-01
Criterion: Substantive Cornell content
Expected: Each topic note has concrete context/constraints, answerable cues, substantial source-cited main notes, synthesis/summary, a worked demonstration with separately labelled expected versus observed results, failure/boundary cases, and real practice with a distinct answer artifact. Empty templates, copied headings and superficial summaries fail.
Referenced inputs: all final Cornell notes and linked practice/answer artifacts

## CORN-02
Criterion: Evidence labels and technical teaching
Expected: Definitions, source-reported claims, independently derived identities, assumptions/inferences and observed results are distinguishable. Explanations connect source concept -> diagram/numerical example -> derivation -> interpretation; figures are readable and match mathematics. No observed claim without applicable evidence.
Referenced inputs: all notes and independent source/math/visual observations

## CORN-03
Criterion: Course-topic coverage and use
Expected: For every substantive 00_Intro topic, a reader can start at the index, find the relevant Cornell note, directly navigate exact verified book/alternative range, follow the worked example, attempt a question before opening the answer, and access runnable practice where applicable. Perform actual walkthrough for every topic; record paths and failures.
Referenced inputs: complete source topic inventory, final index, notes, reading map and practice

## CORN-04
Criterion: Format is supporting evidence only
Expected: Run note_validate when authorized on actual note record IDs and retain output, then perform substantive manual source/content/visual review for every note. A format/links validator passing is necessary where applicable but never sufficient for correctness or intended-use acceptance.
Referenced inputs: Cornell recipe 1.0.0, actual note records, validator output and manual observations

# Independent oracle and method
Original intended user reading/practice flow in REQ-0001 and source-audited topic/reading/example inventories. Cornell recipe cornell-evidence-note 1.0.0 hash 2db1a7dbfd29f989ffe3d0f8703277b2ec2375a3ba02086f7dbff22b3b08aad1 contributes structure/provenance expectations only.
Method: manual-acceptance; actual item-by-item observations must be recorded separately by authorized check_inspect. No executable result is claimed by this manual rubric.

# Dependencies
completed reading/slide/exercise inspections
final Cornell notes/index/practice/answer artifacts
current refined requirements
All observations NOT RUN. Final exact per-page/item/source locators await actual source inventory; no placeholder is a verified locator. Bind refined criterion IDs and source hashes by independently reviewed revision before execution. No verification script exists in this definition; verification_artifact_paths is empty intentionally.

# Protected expectations and evidence
Retain prior expectations, review and failure history. Any semantic oracle/rubric/script correction needs explicit reviewed change and fresh evidence; never loosen expectations to obtain a pass.
Capture inspector invocation, current source/deliverable revision and hashes, timestamp/environment/tools, observations per unique item, failures and limitations, render references and archived logs. Require independent plan review and current final review; structural core verify or recovery receipt cannot pass this check.


# Pre-review requirements reconciliation
Mapped current detailed criteria VT-FB18E4DC-REQ-0007 to this check after reading every refined requirement. Parent REQ-0001 revision 2 supersedes empty acceptance criteria; no executed evidence/pass exists. Preserve initial definition in data.previous_definition. Source-dependent bounds are unchanged.

# Current complete rubric (supersedes provisional wording where clarified)
CORN-01: Substantive Cornell content
Expected: Each topic note has concrete context/constraints, answerable cues, substantial source-cited main notes, synthesis/summary, a worked demonstration with separately labelled expected versus observed results, failure/boundary cases, and real practice with a distinct answer artifact. Empty templates, copied headings and superficial summaries fail.
Inputs: all final Cornell notes and linked practice/answer artifacts

CORN-02: Evidence labels and technical teaching
Expected: Definitions, source-reported claims, independently derived identities, assumptions/inferences and observed results are distinguishable. Explanations connect source concept -> diagram/numerical example -> derivation -> interpretation; figures are readable and match mathematics. No observed claim without applicable evidence.
Inputs: all notes and independent source/math/visual observations

CORN-03: Course-topic coverage and use
Expected: For every substantive 00_Intro topic, a reader can start at the index, find the relevant Cornell note, directly navigate exact verified book/alternative range, follow the worked example, attempt a question before opening the answer, and access runnable practice where applicable. Perform actual walkthrough for every topic; record paths and failures.
Inputs: complete source topic inventory, final index, notes, reading map and practice

CORN-04: Format is supporting evidence only
Expected: Run note_validate when authorized on actual note record IDs and retain output, then perform substantive manual source/content/visual review for every note. A format/links validator passing is necessary where applicable but never sufficient for correctness or intended-use acceptance.
Inputs: Cornell recipe 1.0.0, actual note records, validator output and manual observations
