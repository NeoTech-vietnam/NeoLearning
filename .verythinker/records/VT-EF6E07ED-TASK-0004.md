---
schema_version: 1
id: VT-EF6E07ED-TASK-0004
type: task
title: Implement and document LeetCode 160 in C and C++
owner: developer
status: draft
revision: 2
created_at: 2026-10-11T22:55:50.341Z
updated_at: 2026-10-11T23:16:11.617Z
links:
  - type: satisfies
    target: VT-EF6E07ED-REQ-0003
  - type: implements
    target: VT-EF6E07ED-DES-0003
  - type: depends-on
    target: VT-EF6E07ED-TASK-0003
data:
  workflow_id: VT-EF6E07ED-KNW-0014
  requirement_ids:
    - VT-EF6E07ED-REQ-0003
  allowed_paths:
    - 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_intersection_of_two_linked_lists
  documentation_required: true
  documentation_paths:
    - 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_intersection_of_two_linked_lists/160_note.md
  acceptance_criteria:
    - "REQ-0003 AC1–AC7: exactly the specified three new files; correct
      pointer-identity result and complete nonmutation under DES-0003."
    - Both strict local builds/runtimes each satisfy reviewed 446-case count,
      independent judge oracle and current Cornell checks.
    - Current immutable preimplementation manifest preserved; current separate
      independent review and full work record precede acceptance.
  dependencies:
    - VT-EF6E07ED-TASK-0003
  baseline:
    requirement: de5e70d37e3dc79f604b618b3ec5096755ba607e7da4431cd19acc94d3bc6318
    design: 948711169f3c8241d2dd208a15c92be5e400f36169ef2fe6dd01ec2b44d91549
    inventory: Pending CHK-0004 actual evidence; no writes until confirmed absence.
  required_tools: []
  outputs:
    - 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_intersection_of_two_linked_lists/160_intersection_of_two_linked_lists.c
    - 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_intersection_of_two_linked_lists/160_intersection_of_two_linked_lists.cpp
    - 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_intersection_of_two_linked_lists/160_note.md
  verification_method: Frozen independent verifier commands executed by separate
    check executor and separate reviewer; no acceptance from inspection alone.
  escalation_conditions:
    - Candidate already present; native editing denial; mismatch with reviewed
      check/interface; failure after one repair.
  assumptions:
    - Existing files/dirty state and legacy histories remain untouched.
    - All generated compiler outputs stay system temp; no commit/staging.
    - Use task_file_write with observed hashes and note conventions; no
      shell/file editing bypass.
  author_invocation_id: 26caa8e8-9c38-443e-8010-c64f8a560aa9
  invocation_role: manager
  routing_required: true
  tools:
    - engineering-core
    - assigned-editing
  tool_contract_rationale: No external provider needed for bounded source edits;
    required_tools accepts provider IDs, not core capabilities.
---
# Objective
Add one complete, directly usable 160 Intersection of Two Linked Lists exercise under the target curriculum folder. Manager invocation 36735cc4-1b0b-474f-bcd1-2b49eac9be17.
# Ownership
Developer owns only three enumerated new files. You are not alone in the workspace; preserve others' changes. No source execution until reviewed plan/gates; no existing files, Trellis, submodule, or legacy workflow edits. Requirement/design authoritative by linked IDs; frozen checks added before start. Build/harness algorithms implement pointer-switching and independently expected fixture addresses; labels distinguish official versus null extension. Cornell note follows established LeetCode template with paired generic/worked flows per strategy. Documentation reviewed with implementation. Full seven-section task_submit work record required. At most one repair; manager escalation after repeated failure.
