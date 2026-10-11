---
schema_version: 1
id: VT-EF6E07ED-CHK-0002
type: check
title: LeetCode344 strict builds, exhaustive reversal and docs preservation
owner: verifier
status: draft
revision: 1
created_at: 2026-10-11T06:42:29.994Z
updated_at: 2026-10-11T06:42:29.994Z
links:
  - type: verifies
    target: VT-EF6E07ED-REQ-0002
  - type: verifies
    target: VT-EF6E07ED-DES-0002
data:
  command:
    - C:/Program Files/PowerShell/7/pwsh.exe
    - -NoProfile
    - -File
    - .verythinker/verification/leetcode344.ps1
  baseline_paths:
    - 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/344_reverse_string
    - .verythinker/verification/leetcode344.ps1
    - .verythinker/verification/leetcode344-preservation.json
    - .agents/skills/leetcode-notes/scripts/validate_notes.py
  method: automated-test
  timeout_ms: 60000
  environment: Windows; GCC/G++13.1.0; C11/C++17; PowerShell7; Python3.11
  acceptance_criteria:
    - Strict local builds and oracle/guard tests pass; external judge callers
      confirm void interfaces; Cornell validator and exact file
      inventory/whitespace/preservation checks pass.
---
# Procedure
Economy verifier /root/check_344 implements the saved runner after reading DES-0002. Compile/run actual LOCAL_TEST C/C++ with strict warnings and timed processes; run external judge callers without LOCAL_TEST and verify void signatures; validate note, exactly three exercise files, whitespace and manager baseline manifest. Artifacts stay outside exercise folder. Core check_run then archives output/receipt bound to exact sources.

# Limits
Asymptotic behavior and diagram semantics are reviewed separately. No online judge, sanitizer or graphical rendering claim. Runtime processes timeout after 15seconds; overall60seconds.
