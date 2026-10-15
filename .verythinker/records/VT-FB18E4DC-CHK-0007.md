---
schema_version: 1
id: VT-FB18E4DC-CHK-0007
type: check
title: Independent numerical DSP examples and runnable-practice executable plan
owner: verifier
status: draft
revision: 2
created_at: 2026-10-12T08:31:33.594Z
updated_at: 2026-10-12T15:37:20.839Z
links:
  - type: verifies
    target: VT-FB18E4DC-REQ-0001
  - type: verifies
    target: VT-FB18E4DC-REQ-0004
  - type: verifies
    target: VT-FB18E4DC-REQ-0005
  - type: verifies
    target: VT-FB18E4DC-REQ-0006
  - type: references
    target: VT-FB18E4DC-CHK-0001
data:
  workflow_id: VT-FB18E4DC-KNW-0001
  requirement_ids:
    - VT-FB18E4DC-REQ-0001
    - VT-FB18E4DC-REQ-0004
    - VT-FB18E4DC-REQ-0005
    - VT-FB18E4DC-REQ-0006
  invocation_id: d743a43c-b400-416a-827f-5adb7515337b
  definition_status: bounded-awaiting-source-inventory-and-independent-plan-review
  execution_status: not-run
  source_baseline:
    VT-FB18E4DC-REQ-0001: 59b09d68f572e87fe86220f3bd0d389e4c5774556597382cb0bc83b6b6e70485
    VT-FB18E4DC-KNW-0002: 3d0cb3a3803c035acb47993d9052f503856ac988402af946cbc6ee402a295f04
    VT-FB18E4DC-REQ-0004: a98958282674924638cee5286aeda3c3c2613ada589692666ca874b5c0d69e3c
    VT-FB18E4DC-REQ-0005: 8ca5bc6ffa040d1c02014a9c381bc58ce9bbc24c47897e0c0967457d7e54a85a
    VT-FB18E4DC-REQ-0006: a90e9de9fa33dd212546d2dab1fdea7492ff252cc5f28005fa238a29445eb3dc
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
  method: simulation
  verification_level: unit
  dependencies:
    - inspected numerical/symbolic claim and topic inventory with exact source
      locators
    - reviewed per-case independent oracle and tolerances
    - separate practice/answer/reference artifacts and preservation baseline
    - exact command/environment and frozen verification script/fixture hashes
    - authorized check-executor and independent plan review
  verification_cases:
    - id: MATH-01
      input: every claimed numeric value/intermediate/answer and mathematical identity
        in delivered artifacts
      expected: All claims receive a unique case ID, artifact line/element locator,
        current source SHA-256 + exact 1-based PDF/printed page +
        section/problem/item, inputs, units/domains/conventions, independently
        derived formula/exact value and tolerance rationale. Use independent
        handwritten derivation or different reviewed computation, not
        answer/practice-under-test output. Symbolic identities need independent
        algebra and domains; sampled numbers alone cannot prove a general
        identity.
      oracle: Inspected source formulas plus independently worked derivation; reported
        source discrepancies retained separately from corrections.
    - id: MATH-02
      input: deterministic normal, boundary and fault vectors for each applicable
        computation class
      expected: "Choose cases by actual inventoried topics before implementation.
        Include zero/both signs/scaling, unit/index conventions and relevant
        boundary/fault cases; unavailable tooling is a blocker, not N/A.
        Conditional examples if sampled sinusoids are inventoried: fs=1000 Hz,
        f=50 Hz has discrete period 20 samples; normalized cos samples at
        n=0,5,10,20 are 1,0,-1,1 by exact angle identities. If aliasing is
        inventoried, compare f=900 Hz and 100 Hz at integer n with fs=1000 Hz
        using cos(2*pi*n-theta)=cos(theta); record ambiguity of original
        continuous frequencies. These are proposed independent analytic vectors,
        not claims about lecture contents or run results. Do not add
        absent-topic scope."
      oracle: Independent exact rational period arithmetic and trigonometric
        identities with the actual inspected section locators added before
        execution. Cases and primary locators currently pending.
    - id: MATH-03
      input: numeric output against frozen independent expected value
      expected: "Exact integers/counts/rational assertions checked exactly where
        representable; finite floating real/imag components satisfy
        abs(actual-expected) <= atol + rtol*abs(expected), with both thresholds
        and units declared per case BEFORE execution. Near-zero expected uses
        explicit atol. Candidate for short, finite normalized double-precision
        sinusoid vectors: atol=1e-12, rtol=1e-10 (dimensionless), justified by
        short computation rounding, not blanket tolerance for every DSP formula.
        Source-rounded data require separate explicit rounding/uncertainty
        interval. Long/ill-conditioned computations need pre-reviewed error
        bound; NaN/infinity or unexpected dimensional/sign/index mismatch fails.
        Never widen a threshold after observing failure."
      oracle: Exact analytic values or independently computed higher-accuracy
        references plus reviewed numerical-error/rounding bound. No
        output-driven oracle/tolerance.
    - id: MATH-04
      input: each topic's runnable applicability and all supplied practice commands
      expected: Before implementation classify every inventoried topic as runnable or
        N/A with pedagogical/technical rationale. Every applicable item has
        separate exercise and answer/reference paths, deterministic inputs,
        exact executable+argument array, working directory, dependency
        versions/config and stable evidence IDs. Execute every planned runnable
        item on reviewed bytes, including its boundary/fault cases; preserve
        current actual output/result/time/environment/hashes. Empty or skipped
        suite is a gap; source inspection, expected text or receipt recovery
        cannot count as execution.
      oracle: Reviewed topic applicability table and independently source/math-audited
        case set; question/answer flow verified separately.
  execution_ready: false
  command_binding_status: absent-pending-reviewed-artifacts
  author_invocation_id: d743a43c-b400-416a-827f-5adb7515337b
  invocation_role: verifier
  routing_required: true
---
# Objective
Independent numerical DSP examples and runnable-practice executable plan; authored by verifier invocation d5d56ba9-4373-453d-bae5-c1c27ff413c0 for VT-FB18E4DC-REQ-0004, VT-FB18E4DC-REQ-0005, VT-FB18E4DC-REQ-0006.

# Protected cases/rubric
MATH-01: every claimed numeric value/intermediate/answer and mathematical identity in delivered artifacts
Expected: All claims receive a unique case ID, artifact line/element locator, current source SHA-256 + exact 1-based PDF/printed page + section/problem/item, inputs, units/domains/conventions, independently derived formula/exact value and tolerance rationale. Use independent handwritten derivation or different reviewed computation, not answer/practice-under-test output. Symbolic identities need independent algebra and domains; sampled numbers alone cannot prove a general identity.
Independent oracle: Inspected source formulas plus independently worked derivation; reported source discrepancies retained separately from corrections.

MATH-02: deterministic normal, boundary and fault vectors for each applicable computation class
Expected: Choose cases by actual inventoried topics before implementation. Include zero/both signs/scaling, unit/index conventions and relevant boundary/fault cases; unavailable tooling is a blocker, not N/A. Conditional examples if sampled sinusoids are inventoried: fs=1000 Hz, f=50 Hz has discrete period 20 samples; normalized cos samples at n=0,5,10,20 are 1,0,-1,1 by exact angle identities. If aliasing is inventoried, compare f=900 Hz and 100 Hz at integer n with fs=1000 Hz using cos(2*pi*n-theta)=cos(theta); record ambiguity of original continuous frequencies. These are proposed independent analytic vectors, not claims about lecture contents or run results. Do not add absent-topic scope.
Independent oracle: Independent exact rational period arithmetic and trigonometric identities with the actual inspected section locators added before execution. Cases and primary locators currently pending.

MATH-03: numeric output against frozen independent expected value
Expected: Exact integers/counts/rational assertions checked exactly where representable; finite floating real/imag components satisfy abs(actual-expected) <= atol + rtol*abs(expected), with both thresholds and units declared per case BEFORE execution. Near-zero expected uses explicit atol. Candidate for short, finite normalized double-precision sinusoid vectors: atol=1e-12, rtol=1e-10 (dimensionless), justified by short computation rounding, not blanket tolerance for every DSP formula. Source-rounded data require separate explicit rounding/uncertainty interval. Long/ill-conditioned computations need pre-reviewed error bound; NaN/infinity or unexpected dimensional/sign/index mismatch fails. Never widen a threshold after observing failure.
Independent oracle: Exact analytic values or independently computed higher-accuracy references plus reviewed numerical-error/rounding bound. No output-driven oracle/tolerance.

MATH-04: each topic's runnable applicability and all supplied practice commands
Expected: Before implementation classify every inventoried topic as runnable or N/A with pedagogical/technical rationale. Every applicable item has separate exercise and answer/reference paths, deterministic inputs, exact executable+argument array, working directory, dependency versions/config and stable evidence IDs. Execute every planned runnable item on reviewed bytes, including its boundary/fault cases; preserve current actual output/result/time/environment/hashes. Empty or skipped suite is a gap; source inspection, expected text or receipt recovery cannot count as execution.
Independent oracle: Reviewed topic applicability table and independently source/math-audited case set; question/answer flow verified separately.

# Permitted procedure
Numerical software simulation only; no MCU/bench/HIL claim. Final case table must be reviewed after source access. Author frozen verification harness/oracle fixtures under explicitly approved verifier artifact paths through an authorized producer; declare exact paths and SHA-256 in verification_artifact_paths and command arrays before planning review. Practice/answer/reference files are implementation inputs and are not automatically frozen merely because commands read them; record their current baseline separately. No harness, command, source locator or runnable result exists now. Authorized check-executor uses check_run; verifier then inspects raw actual outputs against independent expectations. Manual symbolic/source/visual results remain CHK-0003/4 observations recorded by check_inspect.

# Dependencies and execution status
inspected numerical/symbolic claim and topic inventory with exact source locators
reviewed per-case independent oracle and tolerances
separate practice/answer/reference artifacts and preservation baseline
exact command/environment and frozen verification script/fixture hashes
authorized check-executor and independent plan review
NOT RUN. Bounded plan awaits source inventory, exact executable/fixture/artifact bindings where applicable, and independent planning review. Empty verification_artifact_paths means no script has been falsely declared/frozen; executor must not run until reviewed complete bindings exist.

# Change control and evidence
Retain prior expectations, review and failure history. Any semantic oracle/rubric/script correction needs explicit reviewed change and fresh evidence; never loosen expectations to obtain a pass.
Capture check fingerprint, source/output baselines, executor/inspector invocation, timestamp, environment/dependency versions, stdout/stderr or observations, status, archived evidence IDs and limitations. No structural pass or administrative receipt is DSP content/runtime evidence.
