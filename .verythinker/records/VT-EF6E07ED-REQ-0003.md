---
schema_version: 1
id: VT-EF6E07ED-REQ-0003
type: requirement
title: Add one matching LeetCode exercise to contiguous versus linked structures
owner: requirements
status: draft
revision: 2
created_at: 2026-10-11T22:38:11.732Z
updated_at: 2026-10-11T22:48:10.702Z
links:
  - type: references
    target: VT-EF6E07ED-KNW-0014
  - type: references
    target: VT-EF6E07ED-KNW-0017
  - type: references
    target: VT-EF6E07ED-KNW-0016
  - type: references
    target: VT-EF6E07ED-KNW-0018
  - type: references
    target: VT-EF6E07ED-KNW-0021
data:
  intake_workflow_id: VT-EF6E07ED-KNW-0014
  acceptance_criteria:
    - AC1 — A current preimplementation inventory confirms LeetCode 160 is
      absent throughout the target folder, including alternate names/content.
      Relative to that saved baseline, exactly one new exercise folder
      160_intersection_of_two_linked_lists is added with exactly
      160_intersection_of_two_linked_lists.c,
      160_intersection_of_two_linked_lists.cpp and 160_note.md; no preexisting
      curriculum file changes.
    - AC2 — For valid live acyclic singly linked inputs of official lengths
      1..30000 per list and values 1..100000, C getIntersectionNode(headA,headB)
      and C++ Solution::getIntersectionNode(headA,headB) return the first shared
      node's actual address, or null when none. Both preserve every input node's
      value and next pointer and caller ownership; neither allocates, frees, or
      retains input nodes. As a documented local robustness extension,
      either/both null heads return null.
    - AC3 — The implemented strategy in both languages has O(m+n) worst-case
      time and O(1) auxiliary space, independently justified by
      invariant/termination analysis; no recursion or size-dependent storage in
      the solution. Fixture storage is explicitly excluded from that
      solution-space claim.
    - AC4 — With LOCAL_TEST defined each source supplies its own guarded
      ListNode, harness, and main, calls its actual solution, and builds under
      C11/C++17 with -Wall -Wextra -Werror -pedantic. Both harnesses terminate,
      report a positive executed case count and zero failures, and return zero
      only after all checks pass. With LOCAL_TEST absent, each compiles through
      a wrapper supplying ListNode before the include, exposing the stated judge
      API with no local main or fixture code.
    - AC5 — Both runtime harnesses use expected addresses from fixture
      construction metadata and snapshots of all unique nodes, independent of
      the implemented algorithm. Cover the three official examples, disjoint
      equal-value lists, identical heads, singleton intersection/disjointness,
      unequal prefixes, one head inside the other list, tail-only sharing, value
      limits 1/100000, both/one null extensions, exhaustive
      prefix-A/prefix-B/shared-suffix lengths 0..5 (including disjoint
      construction, retaining official nonempty inputs plus labelled
      extensions), and maximum 30000-node lengths in intersecting and disjoint
      cases. Fixture ownership releases each allocation exactly once without
      double-free of a shared suffix. An independently authored verifier oracle
      evaluates the same API and nonmutation contract.
    - AC6 — New sources and an English 160_note.md follow the directly inspected
      141 naming/layout and LOCAL_TEST pattern. Source headers cite official
      identity/URL, contract, constraints and examples. Cornell note contains
      topic/date, problem/examples/constraints, explicit function and ownership
      contract, cue column, language-independent mindset/invariant, implemented
      strategy plus at least one explanatory alternative and accurate
      tradeoffs/complexities, generic and concrete worked-example Mermaid flows
      for each documented strategy, pointer-identity/nonmutation pitfalls,
      edge-case table, implementation checklist, relative links to both source
      files, reproducible temporary-directory build/run and judge-wrapper
      guidance, and summary. Expected results and actual execution evidence are
      separate; no unchecked success claims or broken local links.
    - AC7 — Current preimplementation preservation evidence identifies working
      revision when accessible, inventory and byte/hash manifest for protected
      existing files and dirty paths, and legacy REQ-0001/REQ-0002 record
      baselines via an authorized owner. After this increment all protected
      content/status remains unchanged, and the incremental product delta is
      only AC1's three files. Workflow/check/evidence/report artifacts use
      separately manager-authorized .verythinker paths. Current checks and
      separate reviewer findings precede manager acceptance; no resets,
      cleanups, staging/committing of unrelated dirty files, Trellis tasks or
      legacy record edits.
  source: user-request
  routing_required: true
  workflow_id: VT-EF6E07ED-KNW-0014
  selected_problem:
    id: 160
    title: Intersection of Two Linked Lists
    slug: 160_intersection_of_two_linked_lists
    absence_status: canonical-files-absent-full-inventory-pending
  author_invocation_id: 9141d0a8-f61d-435b-ba92-748287dcda58
  requirement_refinement_invocation_id: 9141d0a8-f61d-435b-ba92-748287dcda58
  previous_baseline:
    revision: 1
    fingerprint: e039f36c96a276dd24574ecd67dd1e864a0a25b6dcd5344b4e048738c8557529
  readiness_prerequisites:
    - current full target inventory/no duplicate
    - current preservation manifest including unrelated dirty state and
      owner-inspected legacy requirements
    - reviewed current design and executable check plan
  assumptions:
    - Null inputs are local robustness extension beyond official nonempty inputs
    - One implemented optimal strategy per language; explanatory alternative
      follows 141 convention
  source_ids:
    - VT-EF6E07ED-KNW-0017
    - VT-EF6E07ED-KNW-0016
    - VT-EF6E07ED-KNW-0018
    - VT-EF6E07ED-KNW-0021
  invocation_id: 9141d0a8-f61d-435b-ba92-748287dcda58
  invocation_role: requirements
---
## Statement
Under workflow VT-EF6E07ED-KNW-0014, add one runnable, source-backed LeetCode 160 — Intersection of Two Linked Lists learning exercise beneath `02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures`, matching the existing C/C++/Cornell-note convention. The observable deliverable is one complete new exercise package, subject to the absence and preservation prerequisites below.

## Rationale and Source
The stakeholder requests one additional exercise matching prior structure, files and documentation. The requirements/architect choice is recorded in VT-EF6E07ED-KNW-0021, referencing architect contribution VT-EF6E07ED-KNW-0017. Node-identity reasoning adds useful coverage beside cycle detection without selecting already-present 206 or 21. Problem 24 was only a provisional alternative in KNW-0019 and is superseded for this choice; it is not an additional deliverable.

Sources inspected in invocation 9141d0a8-f61d-435b-ba92-748287dcda58:
- S1: Original REQ-0003 revision 1, fingerprint e039f36c96a276dd24574ecd67dd1e864a0a25b6dcd5344b4e048738c8557529; full original statement preserved below.
- S2: VT-EF6E07ED-KNW-0017 revision 1, fingerprint 815afd37a4f3d36a8932fda1c475e3b2835beafc0719798f8acd067496482c35: architect problem suggestion and local convention findings.
- S3: `02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/141_linked_list_cycle/141_linked_list_cycle.c`, project_read SHA-256 e5cacb6a9630464207d95ac99c2ead0b91e57feef3308780386960d7d7365f9c.
- S4: `02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/141_linked_list_cycle/141_linked_list_cycle.cpp`, project_read SHA-256 fc7d84a8dce67f9fbd55565125d475be7944e5256888d5f679b4cce0096883cd.
- S5: `02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/141_linked_list_cycle/141_note.md`, project_read SHA-256 fa057e52ef88e0045afe231326108e70827d4729ef160495e5caee3016d3c920. Full files inspected, not merely filename evidence.
- S6: [Official LeetCode 160 statement](https://leetcode.com/problems/intersection-of-two-linked-lists/description/), actual web retrieval on 2026-10-11 UTC. It specifies first shared-node identity, no cycles, original structure retained, list lengths 1..30000, values 1..100000, and the linear-time/constant-space follow-up. Judge metadata is not part of the function API.
- S7: VT-EF6E07ED-KNW-0016 current manager observation and VT-EF6E07ED-KNW-0018 verifier contribution; neither is a full directory or dirty-state manifest.
- S8: `.verythinker/templates/requirement.md` SHA-256 45447c5fcb1a8839fbce2b534aa6af9cdcde4db32d3afc53827d56e1b6e964b3 and `.verythinker/guides/process.md` SHA-256 94ab1a3b8ff1da48ea2660d1ede7290d155f3aa807f58da42b66576c82d2c9b7: requirement sections, software profile, verification/validation and gates.

## Acceptance Criteria
AC1 — A current preimplementation inventory confirms LeetCode 160 is absent throughout the target folder, including alternate names/content. Relative to that saved baseline, exactly one new exercise folder 160_intersection_of_two_linked_lists is added with exactly 160_intersection_of_two_linked_lists.c, 160_intersection_of_two_linked_lists.cpp and 160_note.md; no preexisting curriculum file changes.

AC2 — For valid live acyclic singly linked inputs of official lengths 1..30000 per list and values 1..100000, C getIntersectionNode(headA,headB) and C++ Solution::getIntersectionNode(headA,headB) return the first shared node's actual address, or null when none. Both preserve every input node's value and next pointer and caller ownership; neither allocates, frees, or retains input nodes. As a documented local robustness extension, either/both null heads return null.

AC3 — The implemented strategy in both languages has O(m+n) worst-case time and O(1) auxiliary space, independently justified by invariant/termination analysis; no recursion or size-dependent storage in the solution. Fixture storage is explicitly excluded from that solution-space claim.

AC4 — With LOCAL_TEST defined each source supplies its own guarded ListNode, harness, and main, calls its actual solution, and builds under C11/C++17 with -Wall -Wextra -Werror -pedantic. Both harnesses terminate, report a positive executed case count and zero failures, and return zero only after all checks pass. With LOCAL_TEST absent, each compiles through a wrapper supplying ListNode before the include, exposing the stated judge API with no local main or fixture code.

AC5 — Both runtime harnesses use expected addresses from fixture construction metadata and snapshots of all unique nodes, independent of the implemented algorithm. Cover the three official examples, disjoint equal-value lists, identical heads, singleton intersection/disjointness, unequal prefixes, one head inside the other list, tail-only sharing, value limits 1/100000, both/one null extensions, exhaustive prefix-A/prefix-B/shared-suffix lengths 0..5 (including disjoint construction, retaining official nonempty inputs plus labelled extensions), and maximum 30000-node lengths in intersecting and disjoint cases. Fixture ownership releases each allocation exactly once without double-free of a shared suffix. An independently authored verifier oracle evaluates the same API and nonmutation contract.

AC6 — New sources and an English 160_note.md follow the directly inspected 141 naming/layout and LOCAL_TEST pattern. Source headers cite official identity/URL, contract, constraints and examples. Cornell note contains topic/date, problem/examples/constraints, explicit function and ownership contract, cue column, language-independent mindset/invariant, implemented strategy plus at least one explanatory alternative and accurate tradeoffs/complexities, generic and concrete worked-example Mermaid flows for each documented strategy, pointer-identity/nonmutation pitfalls, edge-case table, implementation checklist, relative links to both source files, reproducible temporary-directory build/run and judge-wrapper guidance, and summary. Expected results and actual execution evidence are separate; no unchecked success claims or broken local links.

AC7 — Current preimplementation preservation evidence identifies working revision when accessible, inventory and byte/hash manifest for protected existing files and dirty paths, and legacy REQ-0001/REQ-0002 record baselines via an authorized owner. After this increment all protected content/status remains unchanged, and the incremental product delta is only AC1's three files. Workflow/check/evidence/report artifacts use separately manager-authorized .verythinker paths. Current checks and separate reviewer findings precede manager acceptance; no resets, cleanups, staging/committing of unrelated dirty files, Trellis tasks or legacy record edits.

## Verification Method
The verifier owns executable check records and commands; the requirement owner creates no tasks or implementation.
- AC1/AC7: before/after inspection of current inventory and immutable byte/hash manifest, assessing incremental changes against the dirty baseline rather than assuming clean Git state. Manager/authorized owner provides inventory, revision and legacy-record baselines; unavailable observations block readiness.
- AC2/AC5: unit-level C/C++ harness runtime evidence plus independently authored pointer oracle; use actual returned addresses and all unique-node value/link snapshots. Run timeout and failure exit ensure termination and faults are observable.
- AC3: source/algorithm analysis and separate review of invariant, termination and storage; boundary runtime is supplementary and does not prove asymptotic complexity.
- AC4: strict local compilation/runtime checks and integration-level judge-wrapper compilation for each language. Use a recorded compiler/environment; matching the neighbor command syntax is not evidence that GCC is currently executable.
- AC6: semantic Cornell review, structure/citation/relative-link validation, consistency of worked examples/diagrams with the code and reproducibility of documented commands. Record diagram-render limitations separately from Markdown syntax inspection.
- Whole increment: package/system-level artifact and preservation inspection, current linked evidence and separate reviewer disposition before manager's acceptance gate.
Intended-use validation is separate: reviewer/manager assesses whether a learner can understand node identity versus equal values and shared-tail ownership, trace a worked example, and run the documented local checks. This validates learning-package usability, not official LeetCode acceptance. No remote submission is required or claimed.

## Assumptions and Constraints
- English applies to authored source comments, notes, records and reports.
- Choice 160 is coordinated through persisted records, but implementation is conditional on AC1 absence confirmation. Three canonical 160 source/note project_read calls returned ENOENT; they establish those paths' absence only, not global problem absence under alternate names.
- No new topic folder is introduced: the new folder is an exercise within an existing topic. Target README.md is absent; no unrelated index creation/update is authorized by this bounded increment.
- Official inputs are acyclic and nonempty. Null support is a deliberate local extension. Cyclic, dangling or otherwise invalid pointer inputs are outside scope; no cycle detection/error API is added.
- Judge signatures: C `struct ListNode *getIntersectionNode(struct ListNode *headA, struct ListNode *headB)`; C++ `ListNode *Solution::getIntersectionNode(ListNode *headA, ListNode *headB)`. Only the two heads are parameters; intersectVal, skipA and skipB describe fixture construction.
- Match the current 141 model: one implemented optimal strategy in C and C++, alternatives may be explanatory. Exact algorithm choice belongs to architect design; the requirement fixes behavior and complexity.
- Current local hashes above are bounded content baselines. Working revision, full inventory, extensive dirty-state manifest and legacy requirement hashes remain unobserved in this role. project_read is file-only; approved CodeGraph timed out ETIMEDOUT in freshness resolution; shell startup failed. Do not infer unavailable observations or bypass native controls.
- Requirements ownership is limited to this record and invocation-bound discussion/report operations. No implementation, checks, tasks, acceptance, archive or publication is performed by this role.
- Downstream impact inspection before revision showed only KNW-0014 workflow documents link, with no design/implementation/check records. Manager must reassess discussion fingerprints and new design/check baselines against this revision. Legacy REQ-0001/0002 are outside assigned context and remain untouched.

## Readiness Disposition
Draft requirement refined; implementation readiness is NOT established. Manager must obtain the full inventory/no-duplicate finding and current preservation manifest, then coordinate design/check review and scoped assignments. If 160 already exists under another name, return problem choice to architect/requirements and revise the baseline; do not add a duplicate.

## Previous Baseline (immutable revision reference)
REQ-0003 revision 1, fingerprint e039f36c96a276dd24574ecd67dd1e864a0a25b6dcd5344b4e048738c8557529:
> Use VeryThinker Manager to implement: from this current workspace D:\workspace\NeoLearning, I want to have 1 more leetcode exercise implemented inside 02_contiguous_vs_linked_structures folder with the same structure, files, docs,... of previous exercises.

Prior acceptance text: "Refine measurable criteria from the request and clarification." Prior data acceptance_criteria was empty. This refinement preserves the stakeholder intent and narrows measurable matching conventions; it does not accept the increment.
