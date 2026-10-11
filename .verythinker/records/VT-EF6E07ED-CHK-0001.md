---
schema_version: 1
id: VT-EF6E07ED-CHK-0001
type: check
title: Strict builds, runtime, judge integration and Cornell validation
owner: verifier
status: draft
revision: 2
created_at: 2026-10-11T06:25:26.326Z
updated_at: 2026-10-11T06:27:12.117Z
links:
  - type: verifies
    target: VT-EF6E07ED-REQ-0001
  - type: verifies
    target: VT-EF6E07ED-DES-0001
data:
  command:
    - C:/Program Files/PowerShell/7/pwsh.exe
    - -NoProfile
    - -File
    - .verythinker/verification/leetcode141.ps1
  baseline_paths:
    - 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/141_linked_list_cycle
    - .verythinker/verification/leetcode141.ps1
    - .verythinker/verification/leetcode141-preservation.json
    - .agents/skills/leetcode-notes/scripts/validate_notes.py
  method: automated-test
  timeout_ms: 60000
  environment: Windows, GCC/G++ 13.1.0, C11/C++17, PowerShell 7, Python 3.11;
    judge stubs without LOCAL_TEST
  acceptance_criteria:
    - Strict compile and all runtime fixture tests return zero, judge wrappers
      compile without duplicate node types, note validator and
      inventory/whitespace checks pass.
---
# Verification procedure
Run the saved PowerShell check via core check_run. It builds both real LOCAL_TEST implementations with strict warnings, enforces a 15-second runtime limit per executable, compiles both judge-supplied-node wrappers with LOCAL_TEST absent, validates Cornell notes, checks exact three-file inventory and whitespace. Artifacts live in unique temporary storage. Source inspection and intended-use acceptance are assigned to the independent reviewer.

# Coverage and limits
Fixture-level expected answers derive from tail-entry metadata, not a duplicate Floyd implementation. Source inspection evaluates asymptotic claims. Diagrams receive static/semantic review only; no visual-render claim or online-judge submission.
