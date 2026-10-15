---
schema_version: 1
id: VT-FB18E4DC-REQ-0010
type: requirement
title: Read-only CORE PDF source-route bootstrap prerequisites
owner: requirements
status: draft
revision: 2
created_at: 2026-10-12T12:27:51.118Z
updated_at: 2026-10-12T15:40:11.392Z
links:
  - type: derives-from
    target: VT-FB18E4DC-REQ-0001
  - type: references
    target: VT-FB18E4DC-KNW-0001
  - type: references
    target: VT-FB18E4DC-KNW-0023
  - type: references
    target: VT-FB18E4DC-REQ-0008
  - type: references
    target: VT-FB18E4DC-REQ-0009
  - type: references
    target: VT-FB18E4DC-DES-0001
  - type: references
    target: VT-FB18E4DC-CHK-0009
  - type: references
    target: VT-FB18E4DC-CHK-0010
  - type: references
    target: VT-FB18E4DC-CHK-0011
data:
  workflow_id: VT-FB18E4DC-KNW-0001
  scope: "source-bootstrap: read-only
    runtime/import/skill/two-source-identity/fresh-scoped-snapshot prerequisites
    only"
  stage: source-bootstrap
  source: current stakeholder narrow decomposition instruction;
    VT-FB18E4DC-KNW-0023 intake expectations
  acceptance_criteria:
    - "BOOT-01: A separately invoked check-executor runs the independently
      reviewed, task-bound CORE check_run definition with executable exactly
      C:/Users/daveb/.cache/codex-runtimes/codex-primary-runtime/dependencies/p\
      ython/python.exe and the frozen exact argument array from the actual CORE
      API. Capture command/arguments, definition fingerprint, invocation,
      timestamp, working directory, exit code and unabridged output. Exit code
      is 0; sys.executable resolves to the specified executable. No shell helper
      retry, provider resolve/probe, sandbox change or alternate executable
      route."
    - "BOOT-02: In that exact runtime, imports of pypdf, pdfplumber and
      pypdfium2 all succeed. Capture Python implementation/full version and the
      installed distribution versions for all three, underlying PDFium version
      where exposed, and versions of additional dependencies actually used by
      the frozen check. No missing/unavailable dependency is reported as
      success; no installation or environment mutation."
    - "BOOT-03: Independently read both exact source paths in expected_sources,
      recompute byte lengths and SHA-256, and obtain PDF page counts using both
      pypdf and pypdfium2. Both libraries must agree with expected_sources: book
      983 pages / 9466589 bytes /
      f2ae2b5d68b8809a040de28d98ac2a614163d37e85259453a96e70791f0eb057; lecture
      408 pages / 13042041 bytes /
      de60eb0ab30b67e3d59f94a426795fcdea0232809c096435dbd77e444ae1dbea. Evidence
      distinguishes these expected values from actual observations; any
      mismatch, unreadable file or parser failure fails bootstrap without
      changing expectations."
    - "BOOT-04: Read
      C:/Users/daveb/.codex/plugins/cache/openai-primary-runtime/pdf/26.1011.11\
      113/skills/pdf/SKILL.md through the prescribed runtime and capture its
      exact complete text, byte size, SHA-256 and retrieval timestamp in CORE
      evidence. Summaries, previously supplied text and the path alone do not
      satisfy this criterion."
    - "BOOT-05: Capture a fresh read-only, operation-local before/after scoped
      snapshot of D:/workspace/NeoLearning: actual branch and HEAD;
      tracked/staged/dirty/untracked/deleted path inventory; relevant Examples
      submodule state; scoped source and existing solution identities/hashes;
      current contents or absence of
      07_mechatronics_engineering_master_program/04_Signal-Processing-For-Mecha\
      tronic-System/01_learning/; and existence/tracked-deletion/collision
      status of manager-proposed future output paths, including intro_dsp_study
      if still proposed. Do not assume an empty directory, absent collision,
      clean tree or unchanged intake baseline. Record captured scope and
      invocation-owned CORE record/evidence changes; identify concurrent changes
      or unresolved attribution explicitly rather than claiming global
      preservation."
    - "BOOT-06: Both PDF hashes/sizes are identical before and after the
      read-only bootstrap. No source PDF, learning document, user solution,
      deletion, unrelated configuration or submodule is written/restored by this
      operation; zero learning writes. Only invocation-owned CORE
      record/evidence capture is permitted. Frozen check must use read-only
      source/skill/workspace access and account for incidental writes or
      unresolved preservation as failures/limitations."
    - "BOOT-07: Bootstrap evidence supports only
      runtime/import/skill/source-identity/snapshot prerequisites. No source
      page text, heading, edition, printed-page mapping, range endpoint,
      all-page/item inventory, teaching artifact, F2/F3 artifact or final
      acceptance result is marked independently observed/passed from intake
      alone. Such observations await separate independent execution and
      applicable review; original REQ-0001..0009, all 34 detailed criteria,
      DES-0001 and CHK-0009..0011/final expectations remain unchanged and
      mandatory."
  expected_sources:
    - kind: book
      path: D:/workspace/NeoLearning/07_mechatronics_engineering_master_program/04_Signal-Processing-For-Mechatronic-System/03_resources/03-Understanding-Digital-Signal-Processing.pdf
      pages: 983
      bytes: 9466589
      sha256: f2ae2b5d68b8809a040de28d98ac2a614163d37e85259453a96e70791f0eb057
    - kind: lecture
      path: D:/workspace/NeoLearning/07_mechatronics_engineering_master_program/04_Signal-Processing-For-Mechatronic-System/03_resources/01_lectures/00_Intro.pdf
      pages: 408
      bytes: 13042041
      sha256: de60eb0ab30b67e3d59f94a426795fcdea0232809c096435dbd77e444ae1dbea
  runtime_executable: C:/Users/daveb/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe
  pdf_skill_path: C:/Users/daveb/.codex/plugins/cache/openai-primary-runtime/pdf/26.1011.11113/skills/pdf/SKILL.md
  required_imports:
    - pypdf
    - pdfplumber
    - pypdfium2
  verification_status: planned-not-executed
  verification_method: Reviewed task-bound CORE check_run plus separate
    actual-evidence inspection; verifier allocates check and manager binds task
  intended_use_validation: Not performed at bootstrap; unchanged downstream study
    walkthrough remains required
  original_baseline_references:
    VT-FB18E4DC-REQ-0001:
      revision: 2
    VT-FB18E4DC-REQ-0002:
      revision: 1
    VT-FB18E4DC-REQ-0003:
      revision: 1
    VT-FB18E4DC-REQ-0004:
      revision: 1
    VT-FB18E4DC-REQ-0005:
      revision: 1
    VT-FB18E4DC-REQ-0006:
      revision: 1
    VT-FB18E4DC-REQ-0007:
      revision: 1
    VT-FB18E4DC-REQ-0008:
      revision: 1
    VT-FB18E4DC-REQ-0009:
      revision: 1
    VT-FB18E4DC-DES-0001:
      revision: 2
    VT-FB18E4DC-CHK-0009:
      revision: 1
      fingerprint: 471e024bcdeb441eaeea4c802da2e1cfb8efdafcf07584e71c33c184da9f91d7
    VT-FB18E4DC-CHK-0010:
      revision: 1
      fingerprint: 46f0ca8f121a7dc9bd56efe71642c231e175c95c476e118e9799c497e680e74b
    VT-FB18E4DC-CHK-0011:
      revision: 1
      fingerprint: 49c00ff47b2b52bfce14fd69d77a1c0bcfbb48761df628fab3613176fae0db81
  assumptions:
    - Intake identities are expected values pending independent execution
    - Source-content observations await independent execution; no fabricated
      observations
  author_invocation_id: 69c69765-fecb-4f3c-8355-71d7cf27fe0f
  invocation_id: 69c69765-fecb-4f3c-8355-71d7cf27fe0f
  routing_required: true
  invocation_role: requirements
---
## Statement
Before source-content observation or learning-document production in the saved DSP workflow, establish one independently evidenced, read-only PDF source-route bootstrap through the prescribed task-bound CORE execution route, using the exact bundled Python runtime, exact two source PDFs and exact PDF skill.

## Rationale and Source
Derived from VT-FB18E4DC-REQ-0001. The stakeholder's current narrow instruction and VT-FB18E4DC-KNW-0023 supply expected source identities and a working intake route; helper process-creation failure is a route failure, not proof of unreadable PDFs. A prerequisite-only requirement lets the manager bind a small ready check-executor assignment without making downstream F2/F3 teaching outputs prerequisites for source observation. This additive decomposition neither replaces nor waives any parent criterion.

## Acceptance Criteria
- BOOT-01: A separately invoked check-executor runs the independently reviewed, task-bound CORE check_run definition with executable exactly C:/Users/daveb/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe and the frozen exact argument array from the actual CORE API. Capture command/arguments, definition fingerprint, invocation, timestamp, working directory, exit code and unabridged output. Exit code is 0; sys.executable resolves to the specified executable. No shell helper retry, provider resolve/probe, sandbox change or alternate executable route.
- BOOT-02: In that exact runtime, imports of pypdf, pdfplumber and pypdfium2 all succeed. Capture Python implementation/full version and the installed distribution versions for all three, underlying PDFium version where exposed, and versions of additional dependencies actually used by the frozen check. No missing/unavailable dependency is reported as success; no installation or environment mutation.
- BOOT-03: Independently read both exact source paths in expected_sources, recompute byte lengths and SHA-256, and obtain PDF page counts using both pypdf and pypdfium2. Both libraries must agree with expected_sources: book 983 pages / 9466589 bytes / f2ae2b5d68b8809a040de28d98ac2a614163d37e85259453a96e70791f0eb057; lecture 408 pages / 13042041 bytes / de60eb0ab30b67e3d59f94a426795fcdea0232809c096435dbd77e444ae1dbea. Evidence distinguishes these expected values from actual observations; any mismatch, unreadable file or parser failure fails bootstrap without changing expectations.
- BOOT-04: Read C:/Users/daveb/.codex/plugins/cache/openai-primary-runtime/pdf/26.1011.11113/skills/pdf/SKILL.md through the prescribed runtime and capture its exact complete text, byte size, SHA-256 and retrieval timestamp in CORE evidence. Summaries, previously supplied text and the path alone do not satisfy this criterion.
- BOOT-05: Capture a fresh read-only, operation-local before/after scoped snapshot of D:/workspace/NeoLearning: actual branch and HEAD; tracked/staged/dirty/untracked/deleted path inventory; relevant Examples submodule state; scoped source and existing solution identities/hashes; current contents or absence of 07_mechatronics_engineering_master_program/04_Signal-Processing-For-Mechatronic-System/01_learning/; and existence/tracked-deletion/collision status of manager-proposed future output paths, including intro_dsp_study if still proposed. Do not assume an empty directory, absent collision, clean tree or unchanged intake baseline. Record captured scope and invocation-owned CORE record/evidence changes; identify concurrent changes or unresolved attribution explicitly rather than claiming global preservation.
- BOOT-06: Both PDF hashes/sizes are identical before and after the read-only bootstrap. No source PDF, learning document, user solution, deletion, unrelated configuration or submodule is written/restored by this operation; zero learning writes. Only invocation-owned CORE record/evidence capture is permitted. Frozen check must use read-only source/skill/workspace access and account for incidental writes or unresolved preservation as failures/limitations.
- BOOT-07: Bootstrap evidence supports only runtime/import/skill/source-identity/snapshot prerequisites. No source page text, heading, edition, printed-page mapping, range endpoint, all-page/item inventory, teaching artifact, F2/F3 artifact or final acceptance result is marked independently observed/passed from intake alone. Such observations await separate independent execution and applicable review; original REQ-0001..0009, all 34 detailed criteria, DES-0001 and CHK-0009..0011/final expectations remain unchanged and mandatory.

## Verification Method
Specification verification at component-integration/configuration level: verifier freezes one executable CORE check definition against this requirement and the actual check_run API; separate plan review precedes manager task binding and check-executor execution. Independently inspect actual logs/evidence against BOOT-01..07 and the fixed identities below. Record expected/observed/result separately, with current requirement/check/source fingerprints, executor identity, environment, timestamps and limitations. CORE record creation or an intake report alone cannot pass this requirement. No runnable check or execution result is authored by this assignment; the verifier owns executable-check allocation and the manager owns task binding and independent review.

## Expected Sources and Runtime
book: D:/workspace/NeoLearning/07_mechatronics_engineering_master_program/04_Signal-Processing-For-Mechatronic-System/03_resources/03-Understanding-Digital-Signal-Processing.pdf
Expected pages=983; bytes=9466589; SHA-256=f2ae2b5d68b8809a040de28d98ac2a614163d37e85259453a96e70791f0eb057

lecture: D:/workspace/NeoLearning/07_mechatronics_engineering_master_program/04_Signal-Processing-For-Mechatronic-System/03_resources/01_lectures/00_Intro.pdf
Expected pages=408; bytes=13042041; SHA-256=de60eb0ab30b67e3d59f94a426795fcdea0232809c096435dbd77e444ae1dbea
Runtime: C:/Users/daveb/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe
PDF skill: C:/Users/daveb/.codex/plugins/cache/openai-primary-runtime/pdf/26.1011.11113/skills/pdf/SKILL.md

## Assumptions and Constraints
Stage and scope are source-bootstrap only. Expected hashes/sizes/counts are intake-derived oracles awaiting independent execution. PDF page/headings/edition/printed-label/body facts are not independently established here. No all-source inventory, source-audit Cornell/practice/answer production, teaching, learning writes, intended-use validation or final acceptance is included. Source-operation immutability applies now; comprehensive inventory, mapping, teaching and final preservation/acceptance remain under their unchanged parent criteria/checks. A bootstrap pass may support later source-identity applicability after reassessment; it cannot pass CHK-0009..0011 as a whole or close REQ-0001..0009. No new workflow, replan or exception. Only this new requirement and the assignment report are owned by invocation 1d4781c8-b826-46f3-8565-09a8107db004 (confirmed gpt-6.1-sol/high).
