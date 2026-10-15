---
schema_version: 1
id: VT-FB18E4DC-CHK-0004
type: check
title: Exercise provenance, instructional variety and separate answers inspection
owner: verifier
status: draft
revision: 4
created_at: 2026-10-12T08:27:34.202Z
updated_at: 2026-10-12T17:09:35.165Z
links:
  - type: verifies
    target: VT-FB18E4DC-REQ-0001
  - type: references
    target: VT-FB18E4DC-CHK-0001
  - type: references
    target: VT-FB18E4DC-KNW-0002
  - type: verifies
    target: VT-FB18E4DC-REQ-0005
data:
  workflow_id: VT-FB18E4DC-KNW-0001
  requirement_ids:
    - VT-FB18E4DC-REQ-0001
    - VT-FB18E4DC-REQ-0005
  invocation_id: b74cad1a-30d3-4c18-8304-0b4fd5841650
  definition_status: bounded-awaiting-source-inventory-and-independent-plan-review
  execution_status: not-run
  source_baseline:
    VT-FB18E4DC-REQ-0001:
      revision: 3
      fingerprint: 3910ed7d981d5434c94b104ad999ba322afd426430bf90983af15628f7ba7833
    VT-FB18E4DC-KNW-0002: 3d0cb3a3803c035acb47993d9052f503856ac988402af946cbc6ee402a295f04
    VT-FB18E4DC-REQ-0005:
      revision: 2
      fingerprint: ecd7b7a952b9cac0f449cc1dabf42b2fbdc6e961b5f279ecf2bef7236f5cc790
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
    - id: EX-01
      criterion: Source provenance and completeness
      expected: All lecture exercises and unlabelled prompts map to unique IDs and
        exact PDF page/local item. Every additional item is labelled sourced,
        adapted (with changes) or original. Sourced/adapted items cite actually
        retrieved primary source title, edition/version, URL/path, date and
        exact page/section/problem ID; original items cite conceptual source
        plus author label and assumptions.
      inputs:
        - lecture inventory, source retrieval evidence and exercise set
    - id: EX-02
      criterion: Additional practice coverage
      expected: Collect every supplied exercise/question/worked-example prompt; add at
        least two distinct relevant inspected official/primary-source exercises,
        spanning at least two introductory technical topics when the lecture
        contains two or more. Original/adapted items are optional and cannot
        replace the two sourced exercises. Topic-to-practice dispositions cover
        all inventoried topics with concrete non-practicable reasons; do not
        require additional exercises per topic or expand beyond REQ-0005. Do not
        count duplicate/renamed exercises, existing lecture prompts, empty
        questions or answer-only snippets.
      inputs:
        - requirements coverage threshold, topic matrix and exercise set
    - id: EX-03
      criterion: Separate answer and solution paths
      expected: Question, answer key and optional user solution paths are distinct and
        reachable. Question artifacts provide necessary inputs and expected form
        without leaking final answers; answer links are deliberate. Preserve
        preexisting user solution bytes, and do not overwrite them with
        answer/starter content. Paired IDs and citations remain consistent.
      inputs:
        - before/after file hashes and final question/answer/solution paths
    - id: EX-04
      criterion: Answer validity and responsible excerpts
      expected: Every answer explains derivation, assumptions, units and independently
        verified result, including ambiguity/failure cases. Source/adaptation
        labels match actual origin. Use bounded quotations/excerpts and original
        explanation; do not reproduce whole external exercise collections or
        present inventions as source material.
      inputs:
        - answer files, independent source/math oracle and inspected
          primary-source passages
  oracle_rationale: Actual local lecture prompts and directly inspected primary
    extra-practice sources, plus independently derived answers. Generated
    answers cannot prove their own correctness. Provenance review and math
    execution provide separate evidence.
  dependencies:
    - complete lecture example/exercise inventory
    - inspected primary additional exercise sources
    - reviewed requirement numerical coverage threshold
    - final exercise/answer/user-solution files
  author_invocation_id: b74cad1a-30d3-4c18-8304-0b4fd5841650
  invocation_role: verifier
  routing_required: true
  previous_definition:
    revision: 1
    fingerprint: 453342322968a8d0d0647ab6dba6de79ade38c6daf05c6c3cc947adec5bc54ee
    body: >
      # Objective

      Exercise provenance, instructional variety and separate answers inspection
      for REQ-0001. Definition authored by invocation
      d5d56ba9-4373-453d-bae5-c1c27ff413c0; bounded frozen rubric, not
      source-content evidence.


      # Protected inspection rubric

      ## EX-01

      Criterion: Source provenance and completeness

      Expected: All lecture exercises and unlabelled prompts map to unique IDs
      and exact PDF page/local item. Every additional item is labelled sourced,
      adapted (with changes) or original. Sourced/adapted items cite actually
      retrieved primary source title, edition/version, URL/path, date and exact
      page/section/problem ID; original items cite conceptual source plus author
      label and assumptions.

      Referenced inputs: lecture inventory, source retrieval evidence and
      exercise set


      ## EX-02

      Criterion: Additional practice coverage

      Expected: For each substantive lecture topic, include meaningful
      additional practice at the current reviewed requirement minimum; until
      that threshold is fixed, leave pending. Cover conceptual/interpretive and
      quantitative/diagram tasks where relevant, plus boundary/fault cases. Do
      not count renamed duplicates, existing lecture items, empty questions or
      answer-only snippets as new exercises.

      Referenced inputs: requirements coverage threshold, topic matrix and
      exercise set


      ## EX-03

      Criterion: Separate answer and solution paths

      Expected: Question, answer key and optional user solution paths are
      distinct and reachable. Question artifacts provide necessary inputs and
      expected form without leaking final answers; answer links are deliberate.
      Preserve preexisting user solution bytes, and do not overwrite them with
      answer/starter content. Paired IDs and citations remain consistent.

      Referenced inputs: before/after file hashes and final
      question/answer/solution paths


      ## EX-04

      Criterion: Answer validity and responsible excerpts

      Expected: Every answer explains derivation, assumptions, units and
      independently verified result, including ambiguity/failure cases.
      Source/adaptation labels match actual origin. Use bounded
      quotations/excerpts and original explanation; do not reproduce whole
      external exercise collections or present inventions as source material.

      Referenced inputs: answer files, independent source/math oracle and
      inspected primary-source passages


      # Independent oracle and method

      Actual local lecture prompts and directly inspected primary extra-practice
      sources, plus independently derived answers. Generated answers cannot
      prove their own correctness. Provenance review and math execution provide
      separate evidence.

      Method: inspection; actual item-by-item observations must be recorded
      separately by authorized check_inspect. No executable result is claimed by
      this manual rubric.


      # Dependencies

      complete lecture example/exercise inventory

      inspected primary additional exercise sources

      reviewed requirement numerical coverage threshold

      final exercise/answer/user-solution files

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
        - id: EX-01
          criterion: Source provenance and completeness
          expected: All lecture exercises and unlabelled prompts map to unique IDs and
            exact PDF page/local item. Every additional item is labelled
            sourced, adapted (with changes) or original. Sourced/adapted items
            cite actually retrieved primary source title, edition/version,
            URL/path, date and exact page/section/problem ID; original items
            cite conceptual source plus author label and assumptions.
          inputs:
            - lecture inventory, source retrieval evidence and exercise set
        - id: EX-02
          criterion: Additional practice coverage
          expected: For each substantive lecture topic, include meaningful additional
            practice at the current reviewed requirement minimum; until that
            threshold is fixed, leave pending. Cover conceptual/interpretive and
            quantitative/diagram tasks where relevant, plus boundary/fault
            cases. Do not count renamed duplicates, existing lecture items,
            empty questions or answer-only snippets as new exercises.
          inputs:
            - requirements coverage threshold, topic matrix and exercise set
        - id: EX-03
          criterion: Separate answer and solution paths
          expected: Question, answer key and optional user solution paths are distinct and
            reachable. Question artifacts provide necessary inputs and expected
            form without leaking final answers; answer links are deliberate.
            Preserve preexisting user solution bytes, and do not overwrite them
            with answer/starter content. Paired IDs and citations remain
            consistent.
          inputs:
            - before/after file hashes and final question/answer/solution paths
        - id: EX-04
          criterion: Answer validity and responsible excerpts
          expected: Every answer explains derivation, assumptions, units and independently
            verified result, including ambiguity/failure cases.
            Source/adaptation labels match actual origin. Use bounded
            quotations/excerpts and original explanation; do not reproduce whole
            external exercise collections or present inventions as source
            material.
          inputs:
            - answer files, independent source/math oracle and inspected
              primary-source passages
      oracle_rationale: Actual local lecture prompts and directly inspected primary
        extra-practice sources, plus independently derived answers. Generated
        answers cannot prove their own correctness. Provenance review and math
        execution provide separate evidence.
      dependencies:
        - complete lecture example/exercise inventory
        - inspected primary additional exercise sources
        - reviewed requirement numerical coverage threshold
        - final exercise/answer/user-solution files
      author_invocation_id: d5d56ba9-4373-453d-bae5-c1c27ff413c0
      invocation_role: verifier
      routing_required: true
  refinement_reason: Mapped current detailed criteria VT-FB18E4DC-REQ-0005 to this
    check after reading every refined requirement. Parent REQ-0001 revision 2
    supersedes empty acceptance criteria; no executed evidence/pass exists.
    Preserve initial definition in data.previous_definition. Source-dependent
    bounds are unchanged. EX-02 is clarified to the actual newly refined minimum
    (two total sourced exercises across two topics if available), replacing the
    provisional per-topic wording; this is pre-review scope reconciliation, not
    a pass-seeking change.
---
# Objective
Exercise provenance, instructional variety and separate answers inspection for REQ-0001. Definition authored by invocation d5d56ba9-4373-453d-bae5-c1c27ff413c0; bounded frozen rubric, not source-content evidence.

# Protected inspection rubric
## EX-01
Criterion: Source provenance and completeness
Expected: All lecture exercises and unlabelled prompts map to unique IDs and exact PDF page/local item. Every additional item is labelled sourced, adapted (with changes) or original. Sourced/adapted items cite actually retrieved primary source title, edition/version, URL/path, date and exact page/section/problem ID; original items cite conceptual source plus author label and assumptions.
Referenced inputs: lecture inventory, source retrieval evidence and exercise set

## EX-02
Criterion: Additional practice coverage
Expected: For each substantive lecture topic, include meaningful additional practice at the current reviewed requirement minimum; until that threshold is fixed, leave pending. Cover conceptual/interpretive and quantitative/diagram tasks where relevant, plus boundary/fault cases. Do not count renamed duplicates, existing lecture items, empty questions or answer-only snippets as new exercises.
Referenced inputs: requirements coverage threshold, topic matrix and exercise set

## EX-03
Criterion: Separate answer and solution paths
Expected: Question, answer key and optional user solution paths are distinct and reachable. Question artifacts provide necessary inputs and expected form without leaking final answers; answer links are deliberate. Preserve preexisting user solution bytes, and do not overwrite them with answer/starter content. Paired IDs and citations remain consistent.
Referenced inputs: before/after file hashes and final question/answer/solution paths

## EX-04
Criterion: Answer validity and responsible excerpts
Expected: Every answer explains derivation, assumptions, units and independently verified result, including ambiguity/failure cases. Source/adaptation labels match actual origin. Use bounded quotations/excerpts and original explanation; do not reproduce whole external exercise collections or present inventions as source material.
Referenced inputs: answer files, independent source/math oracle and inspected primary-source passages

# Independent oracle and method
Actual local lecture prompts and directly inspected primary extra-practice sources, plus independently derived answers. Generated answers cannot prove their own correctness. Provenance review and math execution provide separate evidence.
Method: inspection; actual item-by-item observations must be recorded separately by authorized check_inspect. No executable result is claimed by this manual rubric.

# Dependencies
complete lecture example/exercise inventory
inspected primary additional exercise sources
reviewed requirement numerical coverage threshold
final exercise/answer/user-solution files
All observations NOT RUN. Final exact per-page/item/source locators await actual source inventory; no placeholder is a verified locator. Bind refined criterion IDs and source hashes by independently reviewed revision before execution. No verification script exists in this definition; verification_artifact_paths is empty intentionally.

# Protected expectations and evidence
Retain prior expectations, review and failure history. Any semantic oracle/rubric/script correction needs explicit reviewed change and fresh evidence; never loosen expectations to obtain a pass.
Capture inspector invocation, current source/deliverable revision and hashes, timestamp/environment/tools, observations per unique item, failures and limitations, render references and archived logs. Require independent plan review and current final review; structural core verify or recovery receipt cannot pass this check.


# Pre-review requirements reconciliation
Mapped current detailed criteria VT-FB18E4DC-REQ-0005 to this check after reading every refined requirement. Parent REQ-0001 revision 2 supersedes empty acceptance criteria; no executed evidence/pass exists. Preserve initial definition in data.previous_definition. Source-dependent bounds are unchanged. EX-02 is clarified to the actual newly refined minimum (two total sourced exercises across two topics if available), replacing the provisional per-topic wording; this is pre-review scope reconciliation, not a pass-seeking change.

# Current complete rubric (supersedes provisional wording where clarified)
EX-01: Source provenance and completeness
Expected: All lecture exercises and unlabelled prompts map to unique IDs and exact PDF page/local item. Every additional item is labelled sourced, adapted (with changes) or original. Sourced/adapted items cite actually retrieved primary source title, edition/version, URL/path, date and exact page/section/problem ID; original items cite conceptual source plus author label and assumptions.
Inputs: lecture inventory, source retrieval evidence and exercise set

EX-02: Additional practice coverage
Expected: Collect every supplied exercise/question/worked-example prompt; add at least two distinct relevant inspected official/primary-source exercises, spanning at least two introductory technical topics when the lecture contains two or more. Original/adapted items are optional and cannot replace the two sourced exercises. Topic-to-practice dispositions cover all inventoried topics with concrete non-practicable reasons; do not require additional exercises per topic or expand beyond REQ-0005. Do not count duplicate/renamed exercises, existing lecture prompts, empty questions or answer-only snippets.
Inputs: requirements coverage threshold, topic matrix and exercise set

EX-03: Separate answer and solution paths
Expected: Question, answer key and optional user solution paths are distinct and reachable. Question artifacts provide necessary inputs and expected form without leaking final answers; answer links are deliberate. Preserve preexisting user solution bytes, and do not overwrite them with answer/starter content. Paired IDs and citations remain consistent.
Inputs: before/after file hashes and final question/answer/solution paths

EX-04: Answer validity and responsible excerpts
Expected: Every answer explains derivation, assumptions, units and independently verified result, including ambiguity/failure cases. Source/adaptation labels match actual origin. Use bounded quotations/excerpts and original explanation; do not reproduce whole external exercise collections or present inventions as source material.
Inputs: answer files, independent source/math oracle and inspected primary-source passages
