---
schema_version: 1
id: VT-EF6E07ED-DES-0001
type: design
title: Standalone LeetCode 141 C/C++ exercise and Cornell note
owner: architect
status: draft
revision: 1
created_at: 2026-10-11T06:23:59.950Z
updated_at: 2026-10-11T06:23:59.950Z
links:
  - type: satisfies
    target: VT-EF6E07ED-REQ-0001
data:
  architecture: Two standalone source variants implement the same head-to-bool
    cycle-detection contract; LOCAL_TEST supplies ListNode and self-check main;
    LeetCode supplies ListNode in judge mode.
  interfaces:
    - "C: bool hasCycle(struct ListNode *head)"
    - "C++: bool Solution::hasCycle(ListNode *head)"
  verification_approach: Strict C11/C++17 LOCAL_TEST builds/runs, separate
    judge-supplied-node compilation, notes validator and independent inspection.
  baseline_paths: []
  inapplicable:
    - "Hardware/software allocation and bench checks: standalone algorithm
      exercise."
    - "Deployment: local study files only."
    - "Shared firmware integration: each example builds independently."
---
# Scope and architecture
Add only 141_linked_list_cycle.c, 141_linked_list_cycle.cpp, and 141_note.md in the selected exercise folder. LOCAL_TEST guards contain the local ListNode definitions and runtime checks; judge mode consumes the platform ListNode definition. This matches neighboring standalone source files while avoiding duplicate judge definitions.

# Interface and algorithm
C bool hasCycle(struct ListNode *head); C++ Solution::hasCycle(ListNode *head). Floyd traversal: initialize both at head; while fast and fast.next exist, move slow once and fast twice, then compare pointer identity. A meeting returns true; reaching null returns false. Comparison occurs after movement. No values or links change. O(n) time, O(1) auxiliary storage.

# Learning documentation
Use local Cornell template dated 11/10/2026. Document official examples/constraints, pos as test notation only, ownership, proof of convergence using relative advance modulo cycle length, Floyd and a visited-address-set alternative with average O(n) time/O(n) space. Each strategy gets generic and concrete styled Mermaid flows. Include edge cases and compile/run/judge-mode instructions.

# Verification allocation
Local harnesses call actual implementations and verify expected cycle status plus unchanged links/values. Include official examples, null, self-loop, two-node variants, repeated values, boundary values, maximum 10000-node lists and interior/tail cycles; exhaustive small lengths and tail positions use construction metadata as independent expected result. C uses a single owned node buffer and frees it directly; C++ uses owned fixed storage or vector after sizing so pointers remain stable, avoiding traversal-based cleanup of cycles. Failures return nonzero. Strict-warning compilers plus judge-supplied ListNode wrappers validate both interfaces. Notes validator and separate reviewer assess coverage/flows/contracts. Generated executable/wrapper files live outside the exercise folder in temporary storage.

# Compatibility and limits
No existing exercise is changed. No new dependency or framework. Top-level README indexes curriculum sections, not individual exercise directories, so its navigation needs no change. Full generalization of arbitrary pointer graphs, online judge submission and graphical Mermaid rendering are outside scope; static syntax and semantic inspection establish documented limits.
