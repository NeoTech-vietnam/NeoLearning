---
schema_version: 1
id: VT-EF6E07ED-DES-0003
type: design
title: Proposed LeetCode 160 identity-preserving intersection exercise
owner: architect
status: draft
revision: 2
created_at: 2026-10-11T22:47:46.505Z
updated_at: 2026-10-11T22:53:14.027Z
links:
  - type: satisfies
    target: VT-EF6E07ED-REQ-0003
  - type: references
    target: VT-EF6E07ED-KNW-0016
  - type: references
    target: VT-EF6E07ED-KNW-0017
  - type: references
    target: VT-EF6E07ED-KNW-0020
  - type: references
    target: VT-EF6E07ED-KNW-0022
data:
  workflow_id: VT-EF6E07ED-KNW-0014
  invocation_id: 995a62dc-356f-438a-ae21-b6932a3ab51b
  requirement_baseline: de5e70d37e3dc79f604b618b3ec5096755ba607e7da4431cd19acc94d3bc6318
  selection_status: selected-in-requirement-pending-full-inventory-and-design-review
  change_type: feature
  semver_classification: minor/additive; exact release version manager-owned
  interfaces:
    - C11 struct ListNode *getIntersectionNode(struct ListNode *headA, struct
      ListNode *headB)
    - C++17 public ListNode *Solution::getIntersectionNode(ListNode *headA,
      ListNode *headB)
  architecture: Three-file exercise; pointer-switching routine; LOCAL_TEST owns
    fixture/main/types, judge supplies nodes; caller ownership unchanged
  verification_approach: 446 identity/nonmutation fixtures including
    exhaustive0..5 and22 null-extension; independent external oracle; strict
    local/judge modes; Cornell review; immutable preservation; separate review
  source_baseline:
    - path: 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/141_linked_list_cycle/141_linked_list_cycle.c
      sha256: e5cacb6a9630464207d95ac99c2ead0b91e57feef3308780386960d7d7365f9c
    - path: 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/141_linked_list_cycle/141_linked_list_cycle.cpp
      sha256: fc7d84a8dce67f9fbd55565125d475be7944e5256888d5f679b4cce0096883cd
    - path: 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/141_linked_list_cycle/141_note.md
      sha256: fa057e52ef88e0045afe231326108e70827d4729ef160495e5caee3016d3c920
    - path: 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/344_reverse_string/344_reverse_string.cpp
      sha256: 703ef8dafcea9667d05651d84c0fad65ae0f6edf30b411269c4da8265bd0e497
    - path: 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/344_reverse_string/344_note.md
      sha256: 8e385e9519159296f423f6e6aaf535cb9b64ead90f2e60f8f93a2098cfd9c878
    - path: 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/206_reverse_linked_list/206_reverse_linked_list.cpp
      sha256: 123a7ee799d3fe2e24998548fa1df5da0758cdc73672d83e21cdde18bc61c51a
    - path: 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/206_reverse_linked_list/206_note.md
      sha256: ce6b007e731c63711713fa0a0eb98abb6b459032d0639f88075b7980f88bd7c4
    - path: .agents/skills/leetcode-notes/references/note-requirements.md
      sha256: 3d0ac9dbab761f9b76ab176f4931b2db6d5f7a905e1989d20bc99aa1c090291f
    - path: .agents/skills/leetcode-notes/references/mermaid-style.md
      sha256: 11482c8c0540aa41b02c294ae8862883ed7c320f3ae7b4fd69d77826cb5177b8
    - path: .agents/skills/leetcode-notes/assets/cornell-note-template.md
      sha256: 143d7be4ea4d7e00fcc3067b7843939cdfe63e14d4dcf11411c99a52c8eb6a37
    - path: .verythinker/templates/design.md
      sha256: 0fbd2791c9f0973c836e8ff3c74a19358e894902ba8a22fddbdac4af93f0bd03
    - path: .verythinker/guides/process.md
      sha256: 94ab1a3b8ff1da48ea2660d1ede7290d155f3aa807f58da42b66576c82d2c9b7
  baseline_limitations:
    - Actual TASK-0003/CHK-0004 evidence pending
    - Current Git/dirty baseline unavailable
    - Full160 absence unproven
    - No implementation/execution/independent full-design review/acceptance
  author_invocation_id: 995a62dc-356f-438a-ae21-b6932a3ab51b
  invocation_role: architect
  routing_required: true
  covered_architect_invocations:
    - efdfecbd-788f-464b-afa7-b91e18183bcf
  requirement_revision: 2
  expected_case_count_per_language: 446
  acceptance_allocation:
    - AC1 inventory/layout
    - AC2 identity/nonmutation/null
    - AC3 complexity
    - AC4 local/judge isolation
    - AC5 fixtures/external oracle
    - AC6 Cornell/source docs
    - AC7 preservation/evidence/review
  revision_rationale: Recover prior same-role assignment; align required null and
    exhaustive0..5 against REQ-0003 revision2; preserve source hashes and
    preflight prerequisites
---
## Objective and Allocated Requirements

Propose one new exercise for VT-EF6E07ED-REQ-0003 in workflow VT-EF6E07ED-KNW-0014. Original author invocation efdfecbd-788f-464b-afa7-b91e18183bcf; current recovery architect invocation 995a62dc-356f-438a-ae21-b6932a3ab51b, requested/confirmed gpt-6.1-sol, high reasoning. Recovery covers the prior same-role assignment and its source inspections. Manager invocation 36735cc4-1b0b-474f-bcd1-2b49eac9be17 owns selection, tasking, integration and acceptance.

206 is already present, established by direct reads of its source and note; it cannot satisfy "one absent exercise." REQ-0003 revision2 selects160 Intersection of Two Linked Lists from the architect proposal. Full inventory still must confirm actual absence. A failed read of the canonical 160 source establishes only that exact source path is missing, not complete absence under another spelling. Current baseline: REQ-0003 revision2 fingerprint de5e70d37e3dc79f604b618b3ec5096755ba607e7da4431cd19acc94d3bc6318, refined AC1..AC7 and required null-head extension. Revision1 fingerprint e039f36c96a276dd24574ecd67dd1e864a0a25b6dcd5344b4e048738c8557529 remains historical. This is a proposed bounded contract, not implementation authorization or design-ready approval.

Allocation against acceptance criteria:
- AC1: manager/preflight confirms full absence; developer adds exactly three files below.
- AC2: exact identity-return APIs, no mutation/allocation/free/retention, required null guard.
- AC3: pointer-switching invariant/termination and constant-space analysis; separate reviewer.
- AC4: guarded LOCAL_TEST/judge isolation and strict local/judge builds; verifier/executor.
- AC5: construction-address oracle and union snapshots in446 fixtures, exhaustive0..5 including null; independently authored verifier oracle.
- AC6: English source/Cornell docs, four paired flows, source links and runnable commands; developer/reviewer.
- AC7: manager-owned preservation manifest/current evidence and separate review, protected dirty files and legacy baselines unchanged.

Responsibilities against stakeholder intent:
- One absent exercise and learning fit: manager/requirements select 160 and establish actual absence, developer adds only its three files.
- Matching source/API/harness conventions: developer implements C11 and C++17 judge APIs and guarded local fixtures below.
- Matching documentation: developer writes 160_note.md following the inspected local Cornell template.
- Correct behavior and preservation: verifier freezes checks; separate check executor records current evidence; reviewer examines contract, source, diagrams and preservation evidence.
- Release/version classification: manager/release treat addition as feature/minor (additive curriculum capability; no existing interface break). No numeric release or tooling-version bump is assigned to this exercise.

## Boundaries and Responsibilities

Standalone algorithm example in a knowledge base, with no repo build system, dependency, framework or shared helper. No firmware, board, power, deployment or network interface changes. Software unit = intersection routine. Local integration = guarded fixtures calling the real routine. System/intended-use verification = new folder inventory, source-mode separation, note usability and unchanged preexisting workspace. Hardware, HIL and deployed-system levels are inapplicable because this adds host-learning C/C++ examples only.

Exact proposed developer scope is 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_intersection_of_two_linked_lists/ containing exactly:
1. 160_intersection_of_two_linked_lists.c
2. 160_intersection_of_two_linked_lists.cpp
3. 160_note.md

No fourth exercise file, no separate test executable committed, no README or existing exercise edits. The top-level README already links the parent algorithms topic; no top-level topic is added or renamed. Manager decides any navigation requirement before tasking; a required index edit is a scope change. This architect writes design records only. Verifier/check executor own check definitions and prescribed execution; reviewer owns independent review. Neither historical workflow nor dirty file may be repaired as part of this increment.

## Interfaces and Flow

C provided interface: struct ListNode *getIntersectionNode(struct ListNode *headA, struct ListNode *headB).
C++ provided interface: public ListNode *Solution::getIntersectionNode(ListNode *headA, ListNode *headB).
ListNode required fields: int val; next points to another live ListNode or null, using struct ListNode * in C and ListNode * in C++. Judge supplies the type. LOCAL_TEST alone introduces a simple local type, all fixture includes/helpers, case counters and main. Source comments document title, official URL, all examples, constraints and ownership. With LOCAL_TEST undefined, source contains only the judge routine/class and comments; no duplicate node definition, fixture, main or test dependency. Temporary judge wrappers define the node before including the actual source, then call the exact public API.

Required input domain: two finite acyclic singly linked lists, lengths m,n in 1..30000, values 1..100000. They may share a suffix; they cannot split again after a common node because each node has one next. Caller owns all nodes, including shared suffix. Return the first shared node by address, or null for disjoint lists. Equal values at distinct addresses are not intersection. Never alter val or next, allocate/free nodes, or retain pointers. intersectVal, skipA, skipB and list arrays are fixture metadata, not API arguments. Required local extension under AC2: either or both null heads return null. Explicitly label this beyond official nonempty inputs in sources, docs and fixtures; include it in required coverage.

Control flow, implemented Strategy A:
- If either head is null, return null immediately (required local extension).
- Otherwise p=headA; q=headB.
- While p != q, independently set p to p->next when nonnull or headB when null; set q to q->next when nonnull or headA when null.
- Return p (shared node or null).
The null state consumes a switching step: switch when the pointer itself is null, not when its next is null. Neither update depends on the other pointer's new value.

Reasoning: each pointer traverses its original chain then the other chain, equalizing unequal prefix lengths. Let private prefix lengths be a,b and shared suffix length c. If a=b, they meet at the first shared node after a steps. If a!=b and c>0, after switching they both reach the shared entry after a+b+c+1 updates (the additional update is the null-to-other-head switch). For disjoint lists they reach null together within m+n+1 updates, or sooner for equal lengths. Every read follows a validated nonnull pointer. Finite acyclic input guarantees termination. O(m+n) time, O(1) solution auxiliary space.

Documented Strategy B only: return null if either head is null; otherwise count both lengths, advance the longer head by their difference, then advance together until addresses match or both reach null. Distance-to-tail alignment proves first shared-node return. O(m+n) time and O(1) space, extra initial passes/counters versus implicit alignment in A. No second exported routine or alternate implementation required. A visited-address set is unnecessary to meet this bounded task.

## Failure Behavior and Operating Limits

No status/error channel in judge APIs. Invalid/dangling links, concurrent mutation and cycles violate preconditions; no cycle detection, validation traversal, allocation, exceptions or recovery layer is added to the solution. Large valid inputs use iteration and constant solution storage. Null must be checked before each next read. Address comparison is equality only; do not subtract/order unrelated pointers.

Local harness C allocation failure emits a diagnostic and exits nonzero after releasing every successful allocation. C++ pre-sized vector ownership releases storage by scope; an allocation exception is a nonzero process failure and never a pass. Owners release each node once independently of either head traversal because a suffix can be shared. No traversal-based double free. Executor imposes a reviewed external time limit so a looping regression cannot silently stall.

## Decisions and Rationale

Use current 141 as the local-vs-judge isolation reference: the older directly inspected 206 C++ sample exposes unguarded node/main helpers, so literal copying would contradict judge compatibility. Preserve 206 unchanged. C and C++ use the same pointer switching semantics; standard language/runtime only.

160 is a source-backed candidate that complements 141's node identity and 206's links-versus-values learning. Manager observation KNW-0016 also confirms 21 already exists. REQ-0003 revision2 adopts160. Earlier83/203 alternatives are not deliverables; KNW-0020 reports203 already exists. If preflight finds160 under another name, manager/requirements revises selection and this design explicitly before independent review.

No C/C++ exercise recipe exists in the inspected catalog. cornell-evidence-note v1.0.0 hash 8385a4cab0235c2b8b7bfb014aa692455e5865d324b3f9a07018cabfd881e976 may support separate workflow guidance, but requires separate practice/answer files. Do not apply it to the exact three-file exercise layout by creating extra practice artifacts. Use the inspected LeetCode-specific Cornell template for 160_note.md. If manager requires additional process documentation, give it a separately bounded scope; architect does not generate notes here.

Documentation contract: current local date DD/MM/YYYY (12/10/2026 at inspection); exact Cornell heading order/motto, one Problem Description, all three official examples and constraints, input/output/nonmutation/ownership/judge metadata contracts, cues, language-agnostic mindset, A/B strategies with correctness/benefits/tradeoffs/complexity, four styled Mermaid fences (generic and complete concrete flow for each strategy), identity-labelled trace, common failure points, edge table, local commands, checklist and summary. Use official Example 2 for concise complete traces: A private A0(1)->A1(9)->A2(1), B private B0(3), shared C0(2)->C1(4). Never treat separate value-1 nodes as identical. Show every actual pointer update including null and head switch through C0 return. B flow shows counting, two-node alignment of A, then synchronized C0 meeting. All diagram decisions label Yes/No, starts/returns rounded, flowchart TD, phase subgraphs where appropriate, semantic classDef palette per mermaid-style.md. Link both new160 source files relatively and existing141_note.md/206_note.md via sibling relative paths. Both generic flows show the null-head decision/return; concrete flows use complete official Example2.

Local commands belong in the new note, invoke gcc C11/g++ C++17 with -Wall -Wextra -Werror -pedantic -DLOCAL_TEST, put outputs in a fresh temporary directory, and check compile and execution exit statuses. Installed compiler path/version must be verified by executor; historical neighbor commands are not current environment proof. Judge mode requires temporary host wrapper before source inclusion.

## Verification Implications

Current proposed fixture contract aligned to REQ-0003 revision2; verifier freezes executable checks after actual preflight:
- Construct disjoint private A and B prefixes plus one shared suffix; logical counts a,b,c give m=a+c and n=b+c. If c=0, expected=null. Nonempty prefixes form official-domain disjoint fixtures; a=0 or b=0 labels required null-head extensions. If c>0, expected is the constructed shared[0] address, independent of the intersection algorithm.
- C uses a caller-owned node pool and before snapshots, C++ fully sizes its node vector before any linking. Logical-node-to-owner-index mapping may scatter links; a second enumeration family uses reversed physical placement, proving fixtures do not imply contiguous traversal. Both compare the returned pointer with expected without dereferencing returned foreign addresses, then compare every owned node's val and next against its pre-call snapshot. A fixture owns the union once, including shared nodes.
- 3 official examples.
- 7 named identity/topology cases: shared singleton identical heads; disjoint equal-valued singleton heads; A head equals interior B entry (a=0,b=3,c=2); B head equals interior A entry (a=3,b=0,c=2); equal private-prefix lengths with shared tail (a=2,b=2,c=1); unequal disjoint lengths and repeated values (a=2,b=5,c=0); unequal prefixes with repeated private/shared values and boundary values (a=1,b=4,c=3).
- Exhaust all a,b,c in0..5: 216 tuples;205 official nonempty and11 with c=0 and a=0 or b=0 (6+6-1=11), labelled null-head extensions. Run each twice: repeated value7 in logical physical order; alternating1/100000 values in reversed physical placement.432 fixtures =410 official-domain +22 null-extension. This covers both null and either null with other lengths1..5. Zero union size performs no allocation/dereference; a zero-sized malloc result is not an allocation failure.
- 4 maximum cases: (a,b,c)=(30000,30000,0), (0,0,30000), (29999,29999,1), (29999,0,1). All satisfy m,n<=30000 and exercise disjoint/identical/full-length prefixes/extreme asymmetry.
- Total expected446 cases per language =3 official +7 named +432 exhaustive +4 maximum, each checks exact identity AND every union node value/link. Print exactly "C LOCAL_TEST: 446 cases, 0 failures" or "C++ LOCAL_TEST: 446 cases, 0 failures" on success, newline terminated, and return EXIT_SUCCESS. Actual counter determines cases; failure emits a useful fixture diagnostic and nonzero status. This is an expected contract, no execution observed.

Verification allocation:
1. Unit behavior: local actual-routine harnesses, strict C11/C++17 build/runtime; nonzero exit or different count/output fails.
2. Integration/API: compile and run temporary C/C++ judge-provided-node external callers without LOCAL_TEST; confirm exact signatures, one host main/type, real source inclusion, and an independently authored expected-address oracle and unique-node snapshots, covering shared/disjoint equal values, identical heads, asymmetric shared tails, maximums and either/both null. Verifier owns exact external cases/commands. External oracle constructors must not import/copy local fixture helpers or compute expectations with the implemented pointer-switching algorithm.
3. Source analysis: reviewer establishes no mutation/allocation/recursion, correct null guards, termination/complexity; memory snapshots alone do not prove transient nonmutation or O(1).
4. Documentation: validator validate_notes.py on 160_note.md, manual/independent semantic review of all four complete Mermaid flows, examples/constraints and ownership, relative links and usable commands. Structural validation does not establish rendered Mermaid or online judge acceptance.
5. System scope/preservation: preimplementation complete directory inventory establishes 160 absence; exact new three-file inventory; preservation manifest of ALL preexisting exercise/source/docs and unrelated dirty files; Git status and hashes compared on final baseline; no generated outputs in repo. Byte preservation and task scope have distinct checks.
6. Release reproducibility: evidence captures source hashes, requirement/design/check fingerprints, current Git commit/dirty manifest, Windows/compiler/Python versions, exact command arrays, stdout/stderr/exit/time limits and temporary wrapper inputs; separate native review after current evidence.

Separate verifier owns actual check IDs/commands; this design proposes allocations, not frozen executed checks. Manager must link resulting check/task records to this design and REQ-0003. Independent reviewer must review this full current design before design-ready; no gate pass claimed here.

## Assumptions and Open Questions

Blocking prerequisites before full design review/implementation: actual TASK-0003/CHK-0004 preflight confirms full160 absence and current Git/dirty preservation manifest, including protected dirty paths and authorized-owner legacy REQ-0001/0002 fingerprints; verifier freezes product checks/tool availability; separate reviewer assesses current design/check baseline. Selection/refinement now exists at REQ-0003 revision2. KNW-0020 fingerprint e676e5e543a41e1c5efe53d24e05b863b386e362ed3a3d50e69eb0bb26f7e1b1 and KNW-0022 fingerprint42054b21e6237ad812707b3a9b5c49a2337fa40d918e2358c6ffc24f6a9cdef2 define the separate read-only diagnostic route, not actual inventory evidence. Manager instruction permits finishing this proposed design/report now; full design review waits actual preflight. Existing inspection hashes below are a partial current source baseline only, not an exhaustive workspace manifest or Git commit. Git commit, branch, dirty inventory and compiler availability are unavailable in this invocation.

Historical prior-own-invocation observation efdfecbd-788f-464b-afa7-b91e18183bcf: optional codegraph capability_resolve with explicit providers:["codegraph"] observed unavailable due to freshness sync "UNIQUE constraint failed: schema_versions.version". Required engineering-core/source-retrieval tools are callable; optional provider failure is not algorithm evidence. project_read refuses directories and .git metadata. Native shell startup failed in that prior invocation before execution; no workaround/source write used. Recovery uses approved core/project_read only, with no provider retry. Prior verify(design ID, design-ready) returned not-task because completion gates apply to task records; no design review or gate pass claimed.

Source ledger (actual project_read SHA256; samples/docs remain untouched):
- 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/141_linked_list_cycle/141_linked_list_cycle.c : e5cacb6a9630464207d95ac99c2ead0b91e57feef3308780386960d7d7365f9c
- 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/141_linked_list_cycle/141_linked_list_cycle.cpp : fc7d84a8dce67f9fbd55565125d475be7944e5256888d5f679b4cce0096883cd
- 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/141_linked_list_cycle/141_note.md : fa057e52ef88e0045afe231326108e70827d4729ef160495e5caee3016d3c920
- 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/344_reverse_string/344_reverse_string.cpp : 703ef8dafcea9667d05651d84c0fad65ae0f6edf30b411269c4da8265bd0e497
- 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/344_reverse_string/344_note.md : 8e385e9519159296f423f6e6aaf535cb9b64ead90f2e60f8f93a2098cfd9c878
- 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/206_reverse_linked_list/206_reverse_linked_list.cpp : 123a7ee799d3fe2e24998548fa1df5da0758cdc73672d83e21cdde18bc61c51a
- 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/206_reverse_linked_list/206_note.md : ce6b007e731c63711713fa0a0eb98abb6b459032d0639f88075b7980f88bd7c4
- .agents/skills/leetcode-notes/references/note-requirements.md : 3d0ac9dbab761f9b76ab176f4931b2db6d5f7a905e1989d20bc99aa1c090291f
- .agents/skills/leetcode-notes/references/mermaid-style.md : 11482c8c0540aa41b02c294ae8862883ed7c320f3ae7b4fd69d77826cb5177b8
- .agents/skills/leetcode-notes/assets/cornell-note-template.md : 143d7be4ea4d7e00fcc3067b7843939cdfe63e14d4dcf11411c99a52c8eb6a37
- .verythinker/templates/design.md : 0fbd2791c9f0973c836e8ff3c74a19358e894902ba8a22fddbdac4af93f0bd03
- .verythinker/guides/process.md : 94ab1a3b8ff1da48ea2660d1ede7290d155f3aa807f58da42b66576c82d2c9b7

External current source: https://leetcode.com/problems/intersection-of-two-linked-lists/description/ retrieved 2026-10-11 UTC / 12-10 local, official title/examples/constraints/nonmutation/acyclic preconditions/follow-up. Pointer-switching correctness and case allocation above are architect analysis, not quoted official editorial or measured claims.

Contribution sources for manager/curator: REQ-0003 revision2; DES-0003 current revision; KNW-0016; prior own KNW-0017/0023; KNW-0020/0022 diagnostic coordination; recovery assignment report. DES-0003 revision1 fingerprint3f8adc308734159f346f5c92de6d8bfc071479334eca9a792632d80d805bb106 and raw SHA256 f63c743d3cbae0d5eed043a5e41b231b10ec08b20bb554dc0f01a7283ba4a92f remain historical. Count/null revisions align current requirements before implementation, not expectations changed to obtain a pass. Reusable qualified lesson candidate: preserve node identity and shared ownership in pointer-algorithm test oracles, but this increment has analysis/neighbor precedent only and no new execution evidence. Any contribution must explicitly retain that limitation; no empirical model-cost or performance claim.
