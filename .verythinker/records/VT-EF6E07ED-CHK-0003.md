---
schema_version: 1
id: VT-EF6E07ED-CHK-0003
type: check
title: REQ-0003 preservation of eight inspected preexisting exercise files
owner: verifier
status: draft
revision: 4
created_at: 2026-10-11T22:46:04.524Z
updated_at: 2026-10-11T23:03:10.401Z
links:
  - type: verifies
    target: VT-EF6E07ED-REQ-0003
  - type: references
    target: VT-EF6E07ED-KNW-0016
data:
  workflow_id: VT-EF6E07ED-KNW-0014
  method: automated-test
  level: integration
  command:
    - node
    - -e
    - "const fs=require('node:fs'),crypto=require('node:crypto');const
      expected={\"02_Software/02_Programming-Fundamentals/01_Algorithms-and-Dat\
      a-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_struc\
      tures/141_linked_list_cycle/141_linked_list_cycle.c\":\"e5cacb6a963046420\
      7d95ac99c2ead0b91e57feef3308780386960d7d7365f9c\",\"02_Software/02_Progra\
      mming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_\
      structures/02_contiguous_vs_linked_structures/141_linked_list_cycle/141_l\
      inked_list_cycle.cpp\":\"fc7d84a8dce67f9fbd55565125d475be7944e5256888d5f6\
      79b4cce0096883cd\",\"02_Software/02_Programming-Fundamentals/01_Algorithm\
      s-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_lin\
      ked_structures/141_linked_list_cycle/141_note.md\":\"fa057e52ef88e0045afe\
      231326108e70827d4729ef160495e5caee3016d3c920\",\"02_Software/02_Programmi\
      ng-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_str\
      uctures/02_contiguous_vs_linked_structures/344_reverse_string/344_reverse\
      _string.c\":\"d68857919b9ef92a3f3187d61991e5c44bd37f5ea347042b0956d446dee\
      36a23\",\"02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-\
      Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structu\
      res/344_reverse_string/344_reverse_string.cpp\":\"703ef8dafcea9667d05651d\
      84c0fad65ae0f6edf30b411269c4da8265bd0e497\",\"02_Software/02_Programming-\
      Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_struct\
      ures/02_contiguous_vs_linked_structures/344_reverse_string/344_note.md\":\
      \"8e385e9519159296f423f6e6aaf535cb9b64ead90f2e60f8f93a2098cfd9c878\",\"02\
      _Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/0\
      2_practice/03_data_structures/02_contiguous_vs_linked_structures/206_reve\
      rse_linked_list/206_reverse_linked_list.c\":\"89c0eaa805109d917e2e39602fd\
      ce3057df7bf16affeb5c9c0334860b318d019\",\"02_Software/02_Programming-Fund\
      amentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures\
      /02_contiguous_vs_linked_structures/203_remove_linked_list_elements/203_r\
      emove_linked_list_elements.c\":\"07b1a7f7d1e0ec864b31fb391928f868655729de\
      e51506b1551d81a5765fe068\"};for(const [p,h] of
      Object.entries(expected)){if(crypto.createHash('sha256').update(fs.readFi\
      leSync(p)).digest('hex')!==h)throw new Error('PRESERVATION FAIL
      '+p);}console.log('PRESERVATION: 8 files unchanged');"
  cwd: .
  expected_exit: 0
  expected_stdout: |
    PRESERVATION: 8 files unchanged
  expected_stderr: ""
  acceptance_criteria:
    - Exit 0; exact stdout and empty stderr; every byte SHA-256 equals the
      preimplementation observation.
  oracle_rationale: Independent SHA-256 snapshots retrieved via project_read
    before any authorized implementation; not derived from newly written
    solutions.
  coverage_classes:
    - byte-preservation
    - existing-C
    - existing-C++
    - existing-Cornell-notes
  failure_cases:
    - file removed
    - file replaced
    - byte modification including formatting
  verification_artifact_paths: []
  preservation_manifest:
    02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/141_linked_list_cycle/141_linked_list_cycle.c: e5cacb6a9630464207d95ac99c2ead0b91e57feef3308780386960d7d7365f9c
    02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/141_linked_list_cycle/141_linked_list_cycle.cpp: fc7d84a8dce67f9fbd55565125d475be7944e5256888d5f679b4cce0096883cd
    02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/141_linked_list_cycle/141_note.md: fa057e52ef88e0045afe231326108e70827d4729ef160495e5caee3016d3c920
    02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/344_reverse_string/344_reverse_string.c: d68857919b9ef92a3f3187d61991e5c44bd37f5ea347042b0956d446dee36a23
    02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/344_reverse_string/344_reverse_string.cpp: 703ef8dafcea9667d05651d84c0fad65ae0f6edf30b411269c4da8265bd0e497
    02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/344_reverse_string/344_note.md: 8e385e9519159296f423f6e6aaf535cb9b64ead90f2e60f8f93a2098cfd9c878
    02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/206_reverse_linked_list/206_reverse_linked_list.c: 89c0eaa805109d917e2e39602fdce3057df7bf16affeb5c9c0334860b318d019
    02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/203_remove_linked_list_elements/203_remove_linked_list_elements.c: 07b1a7f7d1e0ec864b31fb391928f868655729dee51506b1551d81a5765fe068
  limitations:
    - Partial preservation covers only eight directly inspected files, not the
      entire working tree or absent-directory inventory. Full Git dirty baseline
      unavailable. No execution performed.
  evidence_policy: Separate check-executor must check_run, inspect exact
    output/exit, archive core logs and record node version/current source
    hashes/UTC timestamp; no weakening snapshots to obtain a pass.
  protected_acceptance:
    review_required: true
    implementation_must_wait: true
    oracle: SHA256 bytes equality
    expected_exit: 0
    expected_stdout: |
      PRESERVATION: 8 files unchanged
  invocation_id: 5e2d99a4-e6c5-4128-9da4-d48f2ae3cc3f
  author_invocation_id: 5e2d99a4-e6c5-4128-9da4-d48f2ae3cc3f
  invocation_role: verifier
  routing_required: true
  timeout_ms: 60000
---
# Procedure
Run the frozen Node argv from repository root through check_run. The command reads only existing files; it creates no repository artifacts. Compare exact stdout, stderr and exit.

# Protected baseline
The command embeds the eight content hashes. Review this check independently before implementation. Treat any mismatch as a failure for investigation; a baseline correction requires reviewed change and new evidence. Compiler operands elsewhere are implementation inputs, not frozen verification artifacts.

# Evidence
Keep check fingerprint, required requirement/design baseline, invocation identity, Node version, actual stdout/stderr/exit, timestamp, source hash snapshot and core evidence references. Archive before final independent review. Expected pass is not observed evidence.

# Limitations
No full-tree preservation or selection-absence claim is established. The directory reader is not an inventory API. This check is planned and unexecuted.
