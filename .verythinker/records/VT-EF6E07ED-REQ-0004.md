---
schema_version: 1
id: VT-EF6E07ED-REQ-0004
type: requirement
title: Read-only target inventory and preservation diagnostic baseline
owner: requirements
status: draft
revision: 1
created_at: 2026-10-11T23:22:30.780Z
updated_at: 2026-10-11T23:22:30.780Z
links:
  - type: derives-from
    target: VT-EF6E07ED-REQ-0003
  - type: references
    target: VT-EF6E07ED-KNW-0014
  - type: references
    target: VT-EF6E07ED-CHK-0004
  - type: references
    target: VT-EF6E07ED-KNW-0039
data:
  workflow_id: VT-EF6E07ED-KNW-0014
  source: bounded user refinement; invocation bae7ea3b-098c-4007-83cc-91da45fc6444
  source_ids:
    - VT-EF6E07ED-REQ-0003
    - VT-EF6E07ED-KNW-0014
    - VT-EF6E07ED-TASK-0003
    - VT-EF6E07ED-CHK-0004
    - VT-EF6E07ED-KNW-0039
  acceptance_criteria:
    - "DIAG1 — Existing CHK-0004 revision 2's prescribed command and oracle
      remain unchanged. Actual execution from D:/workspace/NeoLearning finishes
      within its 60000 ms timeout with exit exactly 0 and empty stderr; stdout
      contains one complete valid schema-1 JSON object followed by the exact
      final marker 'PREFLIGHT: inventory, hashes, HEAD and dirty status
      captured'. JSON records actual root, exact target, UTC timestamp,
      PowerShell version, one 40-lowercase-hex Git HEAD, directories array of
      every immediate target directory including hidden entries, files array of
      every recursively enumerated target file including hidden entries with
      workspace-relative normalized path, nonnegative bytes and 64-lowercase-hex
      SHA256, and dirty_porcelain array from Git status including all untracked
      files. No truncated, invented or partial target-file manifest passes."
    - DIAG2 — The diagnostic performs read-only target enumeration/hashing and
      Git HEAD/status with --no-optional-locks. Zero
      product/source/preexisting-file writes, deletes, renames, index refresh
      writes, resets, cleanup, staging or commits are authorized. Independent
      procedure inspection and actual executor work record confirm this scope;
      only manager-authorized core evidence/report persistence outside protected
      source is permitted. Captured file hashes become the immutable
      preimplementation preservation baseline, never a replacement baseline
      rebuilt after implementation.
    - DIAG3 — Complete actual stdout, stderr, exit, check revision/fingerprint,
      executor invocation, timestamp, working HEAD, runtime/tool version and
      environment are archived through the existing core evidence mechanism and
      linked to this diagnostic requirement/current rebound check. Actual JSON
      is parsed and inspected, with directory/file counts and protected
      path/byte/hash baseline reported. Candidate-160 absence assessment cites
      inspected actual directory/file paths and relevant existing contents,
      covering alternate names/case, and explicitly distinguishes canonical-path
      absence from complete topic absence. A found duplicate or incomplete
      inspection is reported as present/inconclusive and blocks the parent's
      absence prerequisite; it must never be labelled absent. Expected output,
      oracle text or a gate rejection is not actual inventory evidence. Separate
      current traceability review precedes diagnostic acceptance.
    - DIAG4 — Executor/inspection report explicitly states that dirty_porcelain
      for unrelated paths outside the target records path/status only and
      captures no outside-target byte/hash preservation baseline. It identifies
      any additional enumeration/content limitations and makes no
      full-workspace, legacy-record-preservation or product-AC7 completion
      claim. The manager retains responsibility for the parent's stronger
      preservation and product acceptance obligations.
  verification_method: configuration-baseline analysis, prescribed existing
    CHK-0004 rev2 actual evidence, manual inspection and independent
    traceability review
  baseline:
    parent_revision: 2
    parent_fingerprint: de5e70d37e3dc79f604b618b3ec5096755ba607e7da4431cd19acc94d3bc6318
    check_revision: 2
    check_fingerprint: f135dcf2b9d796f85e9fffb2f84d399bb84348c1b9c7d616101cd9d2974df6c0
    task_revision: 4
    task_fingerprint: 32f31b8f9cb6b982e12ca28158daa65d74c27929178387a55f9ee9d1ecdcb18c
  assumptions:
    - Live inventory and candidate absence remain unobserved; no preflight
      acceptance yet.
    - Directories are immediate-target entries; target files are recursive;
      outside-target dirty bytes are not captured.
  author_invocation_id: bae7ea3b-098c-4007-83cc-91da45fc6444
  invocation_id: bae7ea3b-098c-4007-83cc-91da45fc6444
  routing_required: true
  scope: diagnostic-only
  dependencies: []
  invocation_role: requirements
---
## Statement
Before product implementation in VT-EF6E07ED-KNW-0014, produce one actual, immutable read-only target inventory and preservation/absence diagnostic evidence package for D:/workspace/NeoLearning using existing CHK-0004 revision 2. Target: `02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures`.

## Rationale and Source
This subordinate requirement derives from VT-EF6E07ED-REQ-0003 AC1/AC7, supplying their diagnostic prerequisite without claiming their product outcomes. User's bounded refinement request is recorded in native invocation bae7ea3b-098c-4007-83cc-91da45fc6444, input SHA256 15f20a472929ba6366cf69551ec7abd8188441b9835e744d4c63d1135e4b805d; existing manager invocation 26caa8e8-9c38-443e-8010-c64f8a560aa9 owns VT-EF6E07ED-KNW-0014.
Current inspected sources:
- VT-EF6E07ED-REQ-0003 revision 2 fingerprint de5e70d37e3dc79f604b618b3ec5096755ba607e7da4431cd19acc94d3bc6318; all AC1..AC7 remain unchanged.
- VT-EF6E07ED-TASK-0003 revision 4 fingerprint 32f31b8f9cb6b982e12ca28158daa65d74c27929178387a55f9ee9d1ecdcb18c; existing diagnostic task, no replacement.
- VT-EF6E07ED-CHK-0004 revision 2 fingerprint f135dcf2b9d796f85e9fffb2f84d399bb84348c1b9c7d616101cd9d2974df6c0; exact current command/oracle baseline.
- VT-EF6E07ED-KNW-0039 revision 1 fingerprint 153a3c66d343d2f098ddd69faeca9e3559081a9444bde5738363853adcfd4743 records actual prior task_start failure on CHK-0005..0011 native/review prerequisites and DES-0003 review, with no execution/evidence. This is a source-reported prior executor failure, not this invocation's execution.
- Parent impact trace confirms CHK-0003..0011, DES-0003 and TASK-0003/0004 share the product requirement.
- Installed requirement template SHA256 45447c5fcb1a8839fbce2b534aa6af9cdcde4db32d3afc53827d56e1b6e964b3 and process guide SHA256 94ab1a3b8ff1da48ea2660d1ede7290d155f3aa807f58da42b66576c82d2c9b7 govern criteria, verification/validation and immutable evidence.

## Acceptance Criteria
DIAG1 — Existing CHK-0004 revision 2's prescribed command and oracle remain unchanged. Actual execution from D:/workspace/NeoLearning finishes within its 60000 ms timeout with exit exactly 0 and empty stderr; stdout contains one complete valid schema-1 JSON object followed by the exact final marker 'PREFLIGHT: inventory, hashes, HEAD and dirty status captured'. JSON records actual root, exact target, UTC timestamp, PowerShell version, one 40-lowercase-hex Git HEAD, directories array of every immediate target directory including hidden entries, files array of every recursively enumerated target file including hidden entries with workspace-relative normalized path, nonnegative bytes and 64-lowercase-hex SHA256, and dirty_porcelain array from Git status including all untracked files. No truncated, invented or partial target-file manifest passes.

DIAG2 — The diagnostic performs read-only target enumeration/hashing and Git HEAD/status with --no-optional-locks. Zero product/source/preexisting-file writes, deletes, renames, index refresh writes, resets, cleanup, staging or commits are authorized. Independent procedure inspection and actual executor work record confirm this scope; only manager-authorized core evidence/report persistence outside protected source is permitted. Captured file hashes become the immutable preimplementation preservation baseline, never a replacement baseline rebuilt after implementation.

DIAG3 — Complete actual stdout, stderr, exit, check revision/fingerprint, executor invocation, timestamp, working HEAD, runtime/tool version and environment are archived through the existing core evidence mechanism and linked to this diagnostic requirement/current rebound check. Actual JSON is parsed and inspected, with directory/file counts and protected path/byte/hash baseline reported. Candidate-160 absence assessment cites inspected actual directory/file paths and relevant existing contents, covering alternate names/case, and explicitly distinguishes canonical-path absence from complete topic absence. A found duplicate or incomplete inspection is reported as present/inconclusive and blocks the parent's absence prerequisite; it must never be labelled absent. Expected output, oracle text or a gate rejection is not actual inventory evidence. Separate current traceability review precedes diagnostic acceptance.

DIAG4 — Executor/inspection report explicitly states that dirty_porcelain for unrelated paths outside the target records path/status only and captures no outside-target byte/hash preservation baseline. It identifies any additional enumeration/content limitations and makes no full-workspace, legacy-record-preservation or product-AC7 completion claim. The manager retains responsibility for the parent's stronger preservation and product acceptance obligations.

## Verification Method
Configuration-baseline analysis and manual evidence inspection; applicable existing procedure is CHK-0004 revision 2 after verifier-owned traceability-only rebinding. DIAG1 uses the actual execution receipt and parsed complete JSON/marker/stderr, not substring-only acceptance. DIAG2 uses independent exact-command review and executor account; existing source hashes establish a future comparison baseline, not a claim that postimplementation preservation already passed. DIAG3 uses archived actual receipts/logs plus documented path/content/absence inspection. DIAG4 uses explicit limitation review in the actual inspection/report. The manager rebinds existing TASK-0003; the verifier changes CHK-0004 requirement links/body metadata consistently without command/oracle modification. An independent reviewer reviews this requirement and current rebound traceability before execution/acceptance.
Intended-use validation is separate: manager assesses whether the actual evidence supports a sound candidate-absence and protected-file-baseline decision before source writes. It does not validate the learning product. Compiler, runtime algorithm, product design and learning-package checks remain with parent AC1..AC7; they are not prerequisites or verification outcomes of this diagnostic requirement.

## Assumptions and Constraints
- Diagnostic scope only; no new task/workflow, product/design implementation or provider/execution operations in this requirements assignment. Legacy records and parent AC1..AC7 remain untouched.
- Current live HEAD, full target inventory, file hashes and actual candidate absence have not been observed by this invocation. Requirement creation neither supplies evidence nor unblocks the task by itself.
- CHK-0004 enumerates every immediate target directory and all recursive target files. Its directories array is not an inventory of all nested empty directories. Absence inspection must disclose this boundary and examine relevant content rather than infer complete absence from filenames alone. No command/oracle alteration is authorized here.
- Outside-target bytes and legacy record hashes are outside CHK-0004 capture; the parent retains all stronger preservation obligations.
- Gateway uses derives-from as lineage, not a product dependency imposed by this record. No depends-on/satisfies links to product design/checks are introduced. Manager/verifier must check actual core gate behavior after their rebinding; no bypass or hypothetical pass.
- Any inaccessible/truncated data, nonzero exit, nonempty stderr, execution permission refusal or unresolved traceability review keeps diagnostic acceptance blocked. Existing immutable failures and baselines remain history.

## Change Impact and Readiness
New diagnostic acceptance boundary only. Manager-owned TASK-0003 and verifier-owned CHK-0004 require rebinding; separate reviewer must re-review current fingerprints. Product TASK-0004, DES-0003, CHK-0005..0011 and parent requirements retain their outcomes. CHK-0003 ownership/disposition stays with manager/verifier; this assignment does not revise it. Diagnostics remain blocked until narrow scope and traceability are reviewed. No acceptance or execution is claimed.
Authored by requirements invocation bae7ea3b-098c-4007-83cc-91da45fc6444.
