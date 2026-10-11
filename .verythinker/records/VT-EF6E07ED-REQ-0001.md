---
schema_version: 1
id: VT-EF6E07ED-REQ-0001
type: requirement
title: LeetCode 141 Linked List Cycle
owner: requirements
status: draft
revision: 2
created_at: 2026-10-11T06:22:05.573Z
updated_at: 2026-10-11T06:23:07.345Z
links: []
data:
  intake_workflow_id: VT-EF6E07ED-KNW-0001
  acceptance_criteria:
    - Exactly one new exercise folder 141_linked_list_cycle with
      141_linked_list_cycle.c, 141_linked_list_cycle.cpp and 141_note.md beside
      unchanged existing exercises.
    - Both implementations expose LeetCode hasCycle(head), use Floyd pointers,
      O(n) time/O(1) auxiliary space, compare node identities and preserve
      links/values.
    - LOCAL_TEST sections call actual implementations, cover all official
      examples, null and self-loop, repeated values without cycle, interior and
      tail cycles, maximum n=10000 and boundary values, fail process on
      mismatch, and release owned nodes safely.
    - Cornell notes follow local template with problem
      examples/constraints/contracts, A Floyd and B visited-node strategy,
      generic and concrete Mermaid flows per strategy, invariant, edge cases,
      complexity and local compile/run instructions.
    - C11/C++17 strict-warning builds and runtime checks, judge-mode compilation
      and notes validator pass; independent review confirms deliverable;
      unrelated dirty changes preserved.
  source: user-request
---
# User requirement
Add one fully implemented LeetCode exercise with the same source/document layout as the existing contiguous-versus-linked exercises. Use only VeryThinker.

# Selected scope
LeetCode 141 Linked List Cycle builds directly on 876 fast/slow pointers. Three new source/document files. Embedded LOCAL_TEST harnesses match neighboring exercises. No top-level curriculum folder is created, so the master README navigation is unaffected.

# Verification
Strict compilation, actual-solution runtime checks, judge compilation, notes structure validation and separate independent review. Compiler artifacts remain in a temporary directory. Hardware, deployment and firmware integration are inapplicable to this standalone study example.
