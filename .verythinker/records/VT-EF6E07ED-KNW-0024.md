---
schema_version: 1
id: VT-EF6E07ED-KNW-0024
type: knowledge
title: REQ-0003 verification strategy and pending product-check contract
owner: verifier
status: draft
revision: 1
created_at: 2026-10-11T22:48:27.951Z
updated_at: 2026-10-11T22:48:27.951Z
links:
  - type: documents
    target: VT-EF6E07ED-REQ-0003
  - type: references
    target: VT-EF6E07ED-CHK-0003
  - type: references
    target: VT-EF6E07ED-CHK-0004
  - type: references
    target: VT-EF6E07ED-KNW-0017
  - type: references
    target: VT-EF6E07ED-KNW-0019
  - type: references
    target: VT-EF6E07ED-KNW-0020
data:
  workflow_id: VT-EF6E07ED-KNW-0014
  kind: verification-strategy
  implementation_authorized: false
  pending_dependencies:
    - independent preflight review
    - CHK-0004 actual execution/inspected evidence
    - frozen selected-problem REQ-0003 criteria
    - architect design API/artifact paths
    - supported executor check expectation field validation
  verification_artifact_paths: []
  invocation_id: b5c8a338-0129-487b-9b2d-789ec7bd786a
  author_invocation_id: b5c8a338-0129-487b-9b2d-789ec7bd786a
  invocation_role: verifier
  routing_required: true
---
# Verification allocation
Preimplementation baseline uses CHK-0004 and partial byte preservation uses CHK-0003. No product check can be honestly frozen for 206: that exercise already exists, while candidates 24 and 160 remain provisional. Resume verifier after reviewed preflight evidence, final requirement criteria and design.

# Required frozen executable checks after selection
1. C11 LOCAL_TEST build: C:/msys64/mingw64/bin/gcc.exe, -std=c11 -Wall -Wextra -Werror -pedantic -DLOCAL_TEST, exact selected .c source operand, -o temporary executable. C++17 counterpart: C:/msys64/mingw64/bin/g++.exe -std=c++17 with identical warning policy. Wrap compile and runtime in frozen Node/PowerShell argv that creates a unique system-temp directory, adds compiler runtime directory to child PATH, propagates each compiler/runtime error, enforces timeout and exact selected case/failure summary, and emits compiler version plus output references. Do not suppress warnings. Freeze runner/oracle scripts or inline argv, not compiler source operands.
2. Actual C and C++ runtime cases: freeze one count per implemented strategy, derive counts arithmetically from case classes before implementation. Require empty/singleton/two-node, repeated values in distinct nodes, official examples, odd/even lengths, value min/max and max node count. Freeze independent expected identities from construction metadata; never use a second implementation of the solution as the oracle. Add deliberately noncontiguous node addresses/allocation order. Assert exact returned address and required link order, unchanged values, bounded termination and null tail; snapshot all relevant next pointers when nonmutation is required. Fixture cleanup releases original owned allocations directly, regardless of output links. For intersection include disjoint equal-valued lists, shared head/tail/interior, asymmetric prefix lengths, null head defensive behavior explicitly separated from official domain and unchanged complete snapshots. For pair swap expected index order is [1,0,3,2,...] with trailing odd node preserved; 206 reversal oracle [n-1,...,0] is inapplicable to the new scope.
3. Judge mode compile/integration: separate host wrapper defines C struct ListNode / C++ ListNode before including selected source, LOCAL_TEST absent, strict warnings-as-errors. Bind function/method signature and call actual solution using host nodes. Compiler must reject duplicate node definitions/main and missing interface dependencies. Require exit 0 and exact judge marker after identity assertions. Wrappers/expectations must be verifier-authored/frozen and independently reviewed before execution.
4. Cornell structural check: exact new-folder inventory matching established naming (problem_slug.c, .cpp, problem_number_note.md plus required registered demonstration/practice/answer); required topic/date/problem examples/constraints/function contract, cue/main/summary sections, citations, complexity and failures; generic and concrete Mermaid flow for every discussed strategy; resolve local links without escaping project. Registered managed note requires note_validate with current sources/links. Format success does not imply semantic correctness.
5. Runnable demonstration and separate exercise/answer: freeze each command argv and exact stdout/exit 0 from learning objective before implementation; invoke actual source/API or standalone linked demonstration, not only echo an expected string. Answer artifact is distinct from exercise and note; practice checks compare independent identities/values or explicit explanation outcomes. These are required additional evidence, not inferred from LOCAL_TEST.
6. Preservation: extend CHK-0003 using immutable CHK-0004 preimplementation manifest through a separately reviewed new check or bounded reviewed baseline revision; never overwrite historical hashes. Check every preexisting target path and allow only approved new paths. Whole-tree dirty-byte preservation outside target remains a documented gap unless manager supplies a fuller hash baseline.

# Semantic inspection rubric, to freeze under selected design
SEM-01 official statement/constraints/examples and source retrieval labels match selected problem.
SEM-02 input/output/mutation/ownership contracts match APIs and runtime assertions.
SEM-03 invariant and termination proof justify code steps, including preservation of next pointer before destructive relinking where applicable.
SEM-04 time and auxiliary-space claims distinguish solution, fixture, recursion and alternative strategies.
SEM-05 each generic Mermaid path corresponds to algorithm branches; each concrete trace uses explicit identities and yields independently derived output.
SEM-06 named failure cases and edge table include repeated-value identity traps and boundary/domain distinctions.
SEM-07 demonstration command and separate practice/answer teach actual topic, with expected versus observed evidence clearly separated.
SEM-08 source links, related exercise links, language naming and established Cornell sections are coherent.
Record actual observations through check_inspect, with unique item IDs and cited line locations. Separate final reviewer evaluates semantics on current baseline.

# Protected acceptance and evidence
Independent planning reviewer must assess commands, coverage, oracle independence, counts and tolerance (exact integer/address equality; no tolerance), review frozen runner artifacts and checks. Implementation waits for reviewed requirement/design/check baseline. Executor may execute only approved frozen commands through check_run/check_inspect; missing compiler/node environment is a failure or documented unavailable environment, never a silent skip. Capture actual exit/stdout/stderr, source and check fingerprints, Git HEAD plus dirty/hash manifest, OS/architecture, compiler/Node/PowerShell versions, UTC, invocation ID and temp artifact references. Archive core logs before final review. Any correction needs reviewed change plus fresh evidence; retained failed logs remain historical. Gate acceptance also requires submission, current check evidence, independent review and finding dispositions.

# Scope and limitations
No source writes, compilation, runtime, note validation or inspection of a completed new artifact happened in this assignment. Core accepted check record storage; check_run expectation-field support still needs executor/schema validation. A definition is not a passing result. Software unit/interface/learning acceptance levels apply; firmware/bench/HIL and external judge submission are outside this host learning exercise. The requirement and design are not yet frozen.
