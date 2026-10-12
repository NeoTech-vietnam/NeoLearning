---
schema_version: 1
id: VT-EF6E07ED-CHK-0011
type: check
title: LeetCode 160 frozen semantic and preservation inspection rubric
owner: verifier
status: draft
revision: 1
created_at: 2026-10-11T23:17:41.644Z
updated_at: 2026-10-11T23:17:41.644Z
links:
  - type: verifies
    target: VT-EF6E07ED-REQ-0003
  - type: verifies
    target: VT-EF6E07ED-TASK-0004
  - type: references
    target: VT-EF6E07ED-DES-0003
  - type: references
    target: VT-EF6E07ED-KNW-0024
data:
  workflow_id: VT-EF6E07ED-KNW-0014
  task_id: VT-EF6E07ED-TASK-0004
  baseline:
    requirement:
      id: VT-EF6E07ED-REQ-0003
      revision: 2
      fingerprint: de5e70d37e3dc79f604b618b3ec5096755ba607e7da4431cd19acc94d3bc6318
    design:
      id: VT-EF6E07ED-DES-0003
      revision: 2
      fingerprint: 948711169f3c8241d2dd208a15c92be5e400f36169ef2fe6dd01ec2b44d91549
  method: inspection
  level: unit-source-and-learning-semantic-acceptance
  inspection_rubric:
    - id: LC160-SEM-01
      criterion: AC2/AC6 statement, examples and domain
      expected_outcome: Both headers and note identify LeetCode160 and official URL;
        all 3 examples show address sharing (example1 a2/b3/c3 first value8;
        example2 a3/b1/c2 value2; example3 disjoint); m,n=1..30000,
        val=1..100000, acyclic live nodes, no concurrent mutation; either/both
        null explicitly required local extension.
      referenced_inputs:
        - VT-EF6E07ED-REQ-0003@2
        - VT-EF6E07ED-DES-0003@2
        - 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_intersection_of_two_linked_lists/160_intersection_of_two_linked_lists.c
        - 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_intersection_of_two_linked_lists/160_intersection_of_two_linked_lists.cpp
        - 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_intersection_of_two_linked_lists/160_note.md
    - id: LC160-SEM-02
      criterion: AC2/AC4 exact judge interface and isolation
      expected_outcome: C exposes struct ListNode *getIntersectionNode(struct ListNode
        *,struct ListNode *); C++ public ListNode
        *Solution::getIntersectionNode(ListNode *,ListNode *); ListNode/local
        includes/helpers/counters/main are LOCAL_TEST guarded; nonlocal source
        contains routine/class/comments only; wrapper include and API binding
        evidence current.
      referenced_inputs:
        - VT-EF6E07ED-REQ-0003@2
        - VT-EF6E07ED-DES-0003@2
        - 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_intersection_of_two_linked_lists/160_intersection_of_two_linked_lists.c
        - 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_intersection_of_two_linked_lists/160_intersection_of_two_linked_lists.cpp
        - 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_intersection_of_two_linked_lists/160_note.md
    - id: LC160-SEM-03
      criterion: AC2 ownership and complete nonmutation
      expected_outcome: Routine only reads nodes and compares addresses; never changes
        val/next even transiently, allocates/frees/retains caller nodes,
        dereferences null or compares values to infer identity. No mutation
        restored before snapshot; no output-node dereference in oracle.
      referenced_inputs:
        - VT-EF6E07ED-REQ-0003@2
        - VT-EF6E07ED-DES-0003@2
        - 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_intersection_of_two_linked_lists/160_intersection_of_two_linked_lists.c
        - 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_intersection_of_two_linked_lists/160_intersection_of_two_linked_lists.cpp
        - 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_intersection_of_two_linked_lists/160_note.md
    - id: LC160-SEM-04
      criterion: AC3 Strategy A correctness/termination/complexity
      expected_outcome: Null guard returns null; two independent pointer updates
        switch only when current pointer null. Equal prefixes meet after a
        steps; unequal intersecting prefixes after a+b+c+1 updates; disjoint
        reaches null within m+n+1 updates. Finite acyclic assumptions justify
        O(m+n) time and O(1) solution space; no recursion or size-dependent
        solution storage; fixture space explicitly separate.
      referenced_inputs:
        - VT-EF6E07ED-REQ-0003@2
        - VT-EF6E07ED-DES-0003@2
        - 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_intersection_of_two_linked_lists/160_intersection_of_two_linked_lists.c
        - 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_intersection_of_two_linked_lists/160_intersection_of_two_linked_lists.cpp
        - 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_intersection_of_two_linked_lists/160_note.md
    - id: LC160-SEM-05
      criterion: AC5 local446 coverage and genuinely independent expectations
      expected_outcome: Actual solution called for every counted fixture; expected
        address constructed shared entry or null, no copied algorithm oracle.
        All union values/next snapshot checked before cleanup; own
        allocation/vector releases shared suffix once. 3 official+7 named+2*216
        exhaustive+4 max=446; exhaustive per family205 official+11 extensions so
        total424 official+22 extensions. Named/max tuples and values/order match
        DESrev2; counter increments after assertions; positive count and
        zero-failure marker cannot bypass failures.
      referenced_inputs:
        - VT-EF6E07ED-REQ-0003@2
        - VT-EF6E07ED-DES-0003@2
        - 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_intersection_of_two_linked_lists/160_intersection_of_two_linked_lists.c
        - 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_intersection_of_two_linked_lists/160_intersection_of_two_linked_lists.cpp
        - 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_intersection_of_two_linked_lists/160_note.md
    - id: LC160-SEM-06
      criterion: AC6 Cornell structure and explanatory alternative
      expected_outcome: English Cornell
        sections/order/date/motto/problem/examples/constraints/function
        input-output-mutation-ownership contract, cue questions,
        language-independent mindset and summary; implemented Strategy A and
        explanatory-only B length alignment each include
        steps/invariant/correctness/benefits/tradeoffs/O(m+n) time/O(1) space; B
        counts lengths, advances longer by difference, then compares addresses
        in tandem.
      referenced_inputs:
        - VT-EF6E07ED-REQ-0003@2
        - VT-EF6E07ED-DES-0003@2
        - 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_intersection_of_two_linked_lists/160_intersection_of_two_linked_lists.c
        - 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_intersection_of_two_linked_lists/160_intersection_of_two_linked_lists.cpp
        - 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_intersection_of_two_linked_lists/160_note.md
    - id: LC160-SEM-07
      criterion: AC6 generic Strategy A flow
      expected_outcome: One flowchart TD Mermaid fence with classDef palette, rounded
        start/returns and Yes/No decisions; explicit either-null guard,
        initialized p/q, p!=q loop, null-to-opposite-head switch for each
        pointer independent, first identity match/null return. Every branch
        agrees with source and prose.
      referenced_inputs:
        - VT-EF6E07ED-REQ-0003@2
        - VT-EF6E07ED-DES-0003@2
        - 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_intersection_of_two_linked_lists/160_intersection_of_two_linked_lists.c
        - 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_intersection_of_two_linked_lists/160_intersection_of_two_linked_lists.cpp
        - 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_intersection_of_two_linked_lists/160_note.md
    - id: LC160-SEM-08
      criterion: AC6 worked Strategy A flow
      expected_outcome: Official example2 identities
        A0(1),A1(9),A2(1),B0(3),C0(2),C1(4). States
        t0(A0,B0),t1(A1,C0),t2(A2,C1),t3(C0,null),t4(C1,A0),t5(null,A1),t6(B0,A2),t7(C0,C0),
        return C0. Show every comparison/update and actual Yes/No outcomes,
        including null switches; separate equal-value1 nodes distinct.
      referenced_inputs:
        - VT-EF6E07ED-REQ-0003@2
        - VT-EF6E07ED-DES-0003@2
        - 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_intersection_of_two_linked_lists/160_intersection_of_two_linked_lists.c
        - 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_intersection_of_two_linked_lists/160_intersection_of_two_linked_lists.cpp
        - 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_intersection_of_two_linked_lists/160_note.md
    - id: LC160-SEM-09
      criterion: AC6 generic and worked Strategy B flows
      expected_outcome: Two distinct styled Mermaid fences; generic includes null
        guard, count phases, length difference alignment, paired identity
        traversal/null return. Example2 m5/n3/diff2 advances A0->A1->A2, then
        (A2,B0)->(C0,C0), returns C0; count progression and concrete
        phase/decision states complete.
      referenced_inputs:
        - VT-EF6E07ED-REQ-0003@2
        - VT-EF6E07ED-DES-0003@2
        - 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_intersection_of_two_linked_lists/160_intersection_of_two_linked_lists.c
        - 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_intersection_of_two_linked_lists/160_intersection_of_two_linked_lists.cpp
        - 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_intersection_of_two_linked_lists/160_note.md
    - id: LC160-SEM-10
      criterion: AC6 pitfalls, edge table and implementation checklist
      expected_outcome: Explains values vs identity, switching current-null vs
        next-null, independent pointer updates, shared ownership/double-free,
        cycles/dangling input out of domain, repeated values, identical
        heads/singletons/disjoint/unequal/head-inside/tail/max/null extensions.
        Checklist covers source guards, strict compilation, actual case counts,
        snapshot preservation, complexity and links.
      referenced_inputs:
        - VT-EF6E07ED-REQ-0003@2
        - VT-EF6E07ED-DES-0003@2
        - 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_intersection_of_two_linked_lists/160_intersection_of_two_linked_lists.c
        - 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_intersection_of_two_linked_lists/160_intersection_of_two_linked_lists.cpp
        - 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_intersection_of_two_linked_lists/160_note.md
    - id: LC160-SEM-11
      criterion: AC4/AC6 runnable demonstration and evidence honesty
      expected_outcome: Note's reproducible strict C11/C++17 LOCAL_TEST commands
        compile actual sources into unique system-temp dirs, child runtime PATH
        includes compiler dir and exits/timeouts checked; judge wrapper guidance
        supplies ListNode before include without LOCAL_TEST. New current local
        check evidence demonstrates both actual source calls, exact446
        summaries; expected text separate from observed evidence with
        IDs/baselines. No extra practice/answer files inside exact3 folder.
      referenced_inputs:
        - VT-EF6E07ED-REQ-0003@2
        - VT-EF6E07ED-DES-0003@2
        - 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_intersection_of_two_linked_lists/160_intersection_of_two_linked_lists.c
        - 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_intersection_of_two_linked_lists/160_intersection_of_two_linked_lists.cpp
        - 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_intersection_of_two_linked_lists/160_note.md
    - id: LC160-SEM-12
      criterion: AC1/AC7 prerequisite and final preservation closure
      expected_outcome: Manager supplies current independently reviewed task-bound
        preflight evidence confirming full160 absence including alternate
        names/content, protected target/dirty bytes and legacy baselines. Final
        manifest compare uses immutable observed preimplementation
        hashes/status/revision and exactly three new product files; no baseline
        regeneration, unrelated/Trellis/legacy edits or partial-preservation
        acceptance. If missing, mark gap and block acceptance.
      referenced_inputs:
        - VT-EF6E07ED-REQ-0003@2
        - VT-EF6E07ED-DES-0003@2
        - 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_intersection_of_two_linked_lists/160_intersection_of_two_linked_lists.c
        - 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_intersection_of_two_linked_lists/160_intersection_of_two_linked_lists.cpp
        - 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_intersection_of_two_linked_lists/160_note.md
    - id: LC160-SEM-13
      criterion: AC6 source links and intended-use review
      expected_outcome: Relative links to both new sources and existing141/206 notes
        resolve; official citations support contract. Four diagrams readable and
        identities/output teach the supplied algorithm; syntax/rendering review
        explicitly labels observed renderer evidence or inspection-only limit;
        no claim of external LeetCode judge submission or hardware verification.
      referenced_inputs:
        - VT-EF6E07ED-REQ-0003@2
        - VT-EF6E07ED-DES-0003@2
        - 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_intersection_of_two_linked_lists/160_intersection_of_two_linked_lists.c
        - 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_intersection_of_two_linked_lists/160_intersection_of_two_linked_lists.cpp
        - 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_intersection_of_two_linked_lists/160_note.md
    - id: LC160-SEM-14
      criterion: AC7 evidence configuration and independent review
      expected_outcome: Executable logs identify actual source hashes, frozen check
        fingerprints, UTC, executor/native identity, OS/arch,
        Node/compiler/Python versions and preserved temp artifact metadata;
        archive before separate final reviewer. Planning reviewer independently
        validates commands/oracle/counts/rubric before execution; failed
        evidence retained, reviewed corrections and fresh execution required.
      referenced_inputs:
        - VT-EF6E07ED-REQ-0003@2
        - VT-EF6E07ED-DES-0003@2
        - 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_intersection_of_two_linked_lists/160_intersection_of_two_linked_lists.c
        - 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_intersection_of_two_linked_lists/160_intersection_of_two_linked_lists.cpp
        - 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_intersection_of_two_linked_lists/160_note.md
  inspection_items:
    - id: LC160-SEM-01
      criterion: AC2/AC6 statement, examples and domain
      expected_outcome: Both headers and note identify LeetCode160 and official URL;
        all 3 examples show address sharing (example1 a2/b3/c3 first value8;
        example2 a3/b1/c2 value2; example3 disjoint); m,n=1..30000,
        val=1..100000, acyclic live nodes, no concurrent mutation; either/both
        null explicitly required local extension.
      referenced_inputs:
        - VT-EF6E07ED-REQ-0003@2
        - VT-EF6E07ED-DES-0003@2
        - 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_intersection_of_two_linked_lists/160_intersection_of_two_linked_lists.c
        - 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_intersection_of_two_linked_lists/160_intersection_of_two_linked_lists.cpp
        - 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_intersection_of_two_linked_lists/160_note.md
    - id: LC160-SEM-02
      criterion: AC2/AC4 exact judge interface and isolation
      expected_outcome: C exposes struct ListNode *getIntersectionNode(struct ListNode
        *,struct ListNode *); C++ public ListNode
        *Solution::getIntersectionNode(ListNode *,ListNode *); ListNode/local
        includes/helpers/counters/main are LOCAL_TEST guarded; nonlocal source
        contains routine/class/comments only; wrapper include and API binding
        evidence current.
      referenced_inputs:
        - VT-EF6E07ED-REQ-0003@2
        - VT-EF6E07ED-DES-0003@2
        - 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_intersection_of_two_linked_lists/160_intersection_of_two_linked_lists.c
        - 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_intersection_of_two_linked_lists/160_intersection_of_two_linked_lists.cpp
        - 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_intersection_of_two_linked_lists/160_note.md
    - id: LC160-SEM-03
      criterion: AC2 ownership and complete nonmutation
      expected_outcome: Routine only reads nodes and compares addresses; never changes
        val/next even transiently, allocates/frees/retains caller nodes,
        dereferences null or compares values to infer identity. No mutation
        restored before snapshot; no output-node dereference in oracle.
      referenced_inputs:
        - VT-EF6E07ED-REQ-0003@2
        - VT-EF6E07ED-DES-0003@2
        - 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_intersection_of_two_linked_lists/160_intersection_of_two_linked_lists.c
        - 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_intersection_of_two_linked_lists/160_intersection_of_two_linked_lists.cpp
        - 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_intersection_of_two_linked_lists/160_note.md
    - id: LC160-SEM-04
      criterion: AC3 Strategy A correctness/termination/complexity
      expected_outcome: Null guard returns null; two independent pointer updates
        switch only when current pointer null. Equal prefixes meet after a
        steps; unequal intersecting prefixes after a+b+c+1 updates; disjoint
        reaches null within m+n+1 updates. Finite acyclic assumptions justify
        O(m+n) time and O(1) solution space; no recursion or size-dependent
        solution storage; fixture space explicitly separate.
      referenced_inputs:
        - VT-EF6E07ED-REQ-0003@2
        - VT-EF6E07ED-DES-0003@2
        - 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_intersection_of_two_linked_lists/160_intersection_of_two_linked_lists.c
        - 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_intersection_of_two_linked_lists/160_intersection_of_two_linked_lists.cpp
        - 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_intersection_of_two_linked_lists/160_note.md
    - id: LC160-SEM-05
      criterion: AC5 local446 coverage and genuinely independent expectations
      expected_outcome: Actual solution called for every counted fixture; expected
        address constructed shared entry or null, no copied algorithm oracle.
        All union values/next snapshot checked before cleanup; own
        allocation/vector releases shared suffix once. 3 official+7 named+2*216
        exhaustive+4 max=446; exhaustive per family205 official+11 extensions so
        total424 official+22 extensions. Named/max tuples and values/order match
        DESrev2; counter increments after assertions; positive count and
        zero-failure marker cannot bypass failures.
      referenced_inputs:
        - VT-EF6E07ED-REQ-0003@2
        - VT-EF6E07ED-DES-0003@2
        - 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_intersection_of_two_linked_lists/160_intersection_of_two_linked_lists.c
        - 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_intersection_of_two_linked_lists/160_intersection_of_two_linked_lists.cpp
        - 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_intersection_of_two_linked_lists/160_note.md
    - id: LC160-SEM-06
      criterion: AC6 Cornell structure and explanatory alternative
      expected_outcome: English Cornell
        sections/order/date/motto/problem/examples/constraints/function
        input-output-mutation-ownership contract, cue questions,
        language-independent mindset and summary; implemented Strategy A and
        explanatory-only B length alignment each include
        steps/invariant/correctness/benefits/tradeoffs/O(m+n) time/O(1) space; B
        counts lengths, advances longer by difference, then compares addresses
        in tandem.
      referenced_inputs:
        - VT-EF6E07ED-REQ-0003@2
        - VT-EF6E07ED-DES-0003@2
        - 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_intersection_of_two_linked_lists/160_intersection_of_two_linked_lists.c
        - 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_intersection_of_two_linked_lists/160_intersection_of_two_linked_lists.cpp
        - 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_intersection_of_two_linked_lists/160_note.md
    - id: LC160-SEM-07
      criterion: AC6 generic Strategy A flow
      expected_outcome: One flowchart TD Mermaid fence with classDef palette, rounded
        start/returns and Yes/No decisions; explicit either-null guard,
        initialized p/q, p!=q loop, null-to-opposite-head switch for each
        pointer independent, first identity match/null return. Every branch
        agrees with source and prose.
      referenced_inputs:
        - VT-EF6E07ED-REQ-0003@2
        - VT-EF6E07ED-DES-0003@2
        - 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_intersection_of_two_linked_lists/160_intersection_of_two_linked_lists.c
        - 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_intersection_of_two_linked_lists/160_intersection_of_two_linked_lists.cpp
        - 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_intersection_of_two_linked_lists/160_note.md
    - id: LC160-SEM-08
      criterion: AC6 worked Strategy A flow
      expected_outcome: Official example2 identities
        A0(1),A1(9),A2(1),B0(3),C0(2),C1(4). States
        t0(A0,B0),t1(A1,C0),t2(A2,C1),t3(C0,null),t4(C1,A0),t5(null,A1),t6(B0,A2),t7(C0,C0),
        return C0. Show every comparison/update and actual Yes/No outcomes,
        including null switches; separate equal-value1 nodes distinct.
      referenced_inputs:
        - VT-EF6E07ED-REQ-0003@2
        - VT-EF6E07ED-DES-0003@2
        - 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_intersection_of_two_linked_lists/160_intersection_of_two_linked_lists.c
        - 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_intersection_of_two_linked_lists/160_intersection_of_two_linked_lists.cpp
        - 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_intersection_of_two_linked_lists/160_note.md
    - id: LC160-SEM-09
      criterion: AC6 generic and worked Strategy B flows
      expected_outcome: Two distinct styled Mermaid fences; generic includes null
        guard, count phases, length difference alignment, paired identity
        traversal/null return. Example2 m5/n3/diff2 advances A0->A1->A2, then
        (A2,B0)->(C0,C0), returns C0; count progression and concrete
        phase/decision states complete.
      referenced_inputs:
        - VT-EF6E07ED-REQ-0003@2
        - VT-EF6E07ED-DES-0003@2
        - 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_intersection_of_two_linked_lists/160_intersection_of_two_linked_lists.c
        - 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_intersection_of_two_linked_lists/160_intersection_of_two_linked_lists.cpp
        - 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_intersection_of_two_linked_lists/160_note.md
    - id: LC160-SEM-10
      criterion: AC6 pitfalls, edge table and implementation checklist
      expected_outcome: Explains values vs identity, switching current-null vs
        next-null, independent pointer updates, shared ownership/double-free,
        cycles/dangling input out of domain, repeated values, identical
        heads/singletons/disjoint/unequal/head-inside/tail/max/null extensions.
        Checklist covers source guards, strict compilation, actual case counts,
        snapshot preservation, complexity and links.
      referenced_inputs:
        - VT-EF6E07ED-REQ-0003@2
        - VT-EF6E07ED-DES-0003@2
        - 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_intersection_of_two_linked_lists/160_intersection_of_two_linked_lists.c
        - 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_intersection_of_two_linked_lists/160_intersection_of_two_linked_lists.cpp
        - 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_intersection_of_two_linked_lists/160_note.md
    - id: LC160-SEM-11
      criterion: AC4/AC6 runnable demonstration and evidence honesty
      expected_outcome: Note's reproducible strict C11/C++17 LOCAL_TEST commands
        compile actual sources into unique system-temp dirs, child runtime PATH
        includes compiler dir and exits/timeouts checked; judge wrapper guidance
        supplies ListNode before include without LOCAL_TEST. New current local
        check evidence demonstrates both actual source calls, exact446
        summaries; expected text separate from observed evidence with
        IDs/baselines. No extra practice/answer files inside exact3 folder.
      referenced_inputs:
        - VT-EF6E07ED-REQ-0003@2
        - VT-EF6E07ED-DES-0003@2
        - 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_intersection_of_two_linked_lists/160_intersection_of_two_linked_lists.c
        - 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_intersection_of_two_linked_lists/160_intersection_of_two_linked_lists.cpp
        - 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_intersection_of_two_linked_lists/160_note.md
    - id: LC160-SEM-12
      criterion: AC1/AC7 prerequisite and final preservation closure
      expected_outcome: Manager supplies current independently reviewed task-bound
        preflight evidence confirming full160 absence including alternate
        names/content, protected target/dirty bytes and legacy baselines. Final
        manifest compare uses immutable observed preimplementation
        hashes/status/revision and exactly three new product files; no baseline
        regeneration, unrelated/Trellis/legacy edits or partial-preservation
        acceptance. If missing, mark gap and block acceptance.
      referenced_inputs:
        - VT-EF6E07ED-REQ-0003@2
        - VT-EF6E07ED-DES-0003@2
        - 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_intersection_of_two_linked_lists/160_intersection_of_two_linked_lists.c
        - 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_intersection_of_two_linked_lists/160_intersection_of_two_linked_lists.cpp
        - 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_intersection_of_two_linked_lists/160_note.md
    - id: LC160-SEM-13
      criterion: AC6 source links and intended-use review
      expected_outcome: Relative links to both new sources and existing141/206 notes
        resolve; official citations support contract. Four diagrams readable and
        identities/output teach the supplied algorithm; syntax/rendering review
        explicitly labels observed renderer evidence or inspection-only limit;
        no claim of external LeetCode judge submission or hardware verification.
      referenced_inputs:
        - VT-EF6E07ED-REQ-0003@2
        - VT-EF6E07ED-DES-0003@2
        - 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_intersection_of_two_linked_lists/160_intersection_of_two_linked_lists.c
        - 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_intersection_of_two_linked_lists/160_intersection_of_two_linked_lists.cpp
        - 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_intersection_of_two_linked_lists/160_note.md
    - id: LC160-SEM-14
      criterion: AC7 evidence configuration and independent review
      expected_outcome: Executable logs identify actual source hashes, frozen check
        fingerprints, UTC, executor/native identity, OS/arch,
        Node/compiler/Python versions and preserved temp artifact metadata;
        archive before separate final reviewer. Planning reviewer independently
        validates commands/oracle/counts/rubric before execution; failed
        evidence retained, reviewed corrections and fresh execution required.
      referenced_inputs:
        - VT-EF6E07ED-REQ-0003@2
        - VT-EF6E07ED-DES-0003@2
        - 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_intersection_of_two_linked_lists/160_intersection_of_two_linked_lists.c
        - 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_intersection_of_two_linked_lists/160_intersection_of_two_linked_lists.cpp
        - 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_intersection_of_two_linked_lists/160_note.md
  acceptance_criteria:
    - All14 unique LC160-SEM items pass against actual cited input source/note
      lines and current evidence; no missing item or inferred observation.
    - Actual observations belong to separate check_inspect evidence with item
      IDs, observed state/result, evidence/line references, reviewer identity
      and current baseline; this definition contains no observations.
    - Missing immutable absence/preservation baseline, inaccurate trace/claim,
      omitted counter/snapshot, incomplete evidence or unresolved finding blocks
      acceptance.
  observation_operation: check_inspect
  required_observation_fields:
    - item_id
    - actual_observation
    - pass_or_fail
    - source_path_and_line_or_evidence_id
    - current_input_hash
    - inspector_invocation_id
  verification_artifact_paths: []
  prerequisites:
    - Independent Sol planning review of REQrev2/DESrev2 and frozen product
      checks
    - TASK-0003 actual task-bound preflight after capability review confirms
      full absence and immutable preservation baseline; definitions do not
      authorize writes
    - Separate authorized check-executor invocation and approved core check_run
  protected_acceptance:
    review_required: true
    implementation_must_wait: true
    inspection_items:
      - id: LC160-SEM-01
        criterion: AC2/AC6 statement, examples and domain
        expected_outcome: Both headers and note identify LeetCode160 and official URL;
          all 3 examples show address sharing (example1 a2/b3/c3 first value8;
          example2 a3/b1/c2 value2; example3 disjoint); m,n=1..30000,
          val=1..100000, acyclic live nodes, no concurrent mutation; either/both
          null explicitly required local extension.
        referenced_inputs:
          - VT-EF6E07ED-REQ-0003@2
          - VT-EF6E07ED-DES-0003@2
          - 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_intersection_of_two_linked_lists/160_intersection_of_two_linked_lists.c
          - 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_intersection_of_two_linked_lists/160_intersection_of_two_linked_lists.cpp
          - 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_intersection_of_two_linked_lists/160_note.md
      - id: LC160-SEM-02
        criterion: AC2/AC4 exact judge interface and isolation
        expected_outcome: C exposes struct ListNode *getIntersectionNode(struct ListNode
          *,struct ListNode *); C++ public ListNode
          *Solution::getIntersectionNode(ListNode *,ListNode *); ListNode/local
          includes/helpers/counters/main are LOCAL_TEST guarded; nonlocal source
          contains routine/class/comments only; wrapper include and API binding
          evidence current.
        referenced_inputs:
          - VT-EF6E07ED-REQ-0003@2
          - VT-EF6E07ED-DES-0003@2
          - 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_intersection_of_two_linked_lists/160_intersection_of_two_linked_lists.c
          - 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_intersection_of_two_linked_lists/160_intersection_of_two_linked_lists.cpp
          - 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_intersection_of_two_linked_lists/160_note.md
      - id: LC160-SEM-03
        criterion: AC2 ownership and complete nonmutation
        expected_outcome: Routine only reads nodes and compares addresses; never changes
          val/next even transiently, allocates/frees/retains caller nodes,
          dereferences null or compares values to infer identity. No mutation
          restored before snapshot; no output-node dereference in oracle.
        referenced_inputs:
          - VT-EF6E07ED-REQ-0003@2
          - VT-EF6E07ED-DES-0003@2
          - 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_intersection_of_two_linked_lists/160_intersection_of_two_linked_lists.c
          - 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_intersection_of_two_linked_lists/160_intersection_of_two_linked_lists.cpp
          - 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_intersection_of_two_linked_lists/160_note.md
      - id: LC160-SEM-04
        criterion: AC3 Strategy A correctness/termination/complexity
        expected_outcome: Null guard returns null; two independent pointer updates
          switch only when current pointer null. Equal prefixes meet after a
          steps; unequal intersecting prefixes after a+b+c+1 updates; disjoint
          reaches null within m+n+1 updates. Finite acyclic assumptions justify
          O(m+n) time and O(1) solution space; no recursion or size-dependent
          solution storage; fixture space explicitly separate.
        referenced_inputs:
          - VT-EF6E07ED-REQ-0003@2
          - VT-EF6E07ED-DES-0003@2
          - 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_intersection_of_two_linked_lists/160_intersection_of_two_linked_lists.c
          - 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_intersection_of_two_linked_lists/160_intersection_of_two_linked_lists.cpp
          - 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_intersection_of_two_linked_lists/160_note.md
      - id: LC160-SEM-05
        criterion: AC5 local446 coverage and genuinely independent expectations
        expected_outcome: Actual solution called for every counted fixture; expected
          address constructed shared entry or null, no copied algorithm oracle.
          All union values/next snapshot checked before cleanup; own
          allocation/vector releases shared suffix once. 3 official+7
          named+2*216 exhaustive+4 max=446; exhaustive per family205 official+11
          extensions so total424 official+22 extensions. Named/max tuples and
          values/order match DESrev2; counter increments after assertions;
          positive count and zero-failure marker cannot bypass failures.
        referenced_inputs:
          - VT-EF6E07ED-REQ-0003@2
          - VT-EF6E07ED-DES-0003@2
          - 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_intersection_of_two_linked_lists/160_intersection_of_two_linked_lists.c
          - 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_intersection_of_two_linked_lists/160_intersection_of_two_linked_lists.cpp
          - 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_intersection_of_two_linked_lists/160_note.md
      - id: LC160-SEM-06
        criterion: AC6 Cornell structure and explanatory alternative
        expected_outcome: English Cornell
          sections/order/date/motto/problem/examples/constraints/function
          input-output-mutation-ownership contract, cue questions,
          language-independent mindset and summary; implemented Strategy A and
          explanatory-only B length alignment each include
          steps/invariant/correctness/benefits/tradeoffs/O(m+n) time/O(1) space;
          B counts lengths, advances longer by difference, then compares
          addresses in tandem.
        referenced_inputs:
          - VT-EF6E07ED-REQ-0003@2
          - VT-EF6E07ED-DES-0003@2
          - 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_intersection_of_two_linked_lists/160_intersection_of_two_linked_lists.c
          - 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_intersection_of_two_linked_lists/160_intersection_of_two_linked_lists.cpp
          - 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_intersection_of_two_linked_lists/160_note.md
      - id: LC160-SEM-07
        criterion: AC6 generic Strategy A flow
        expected_outcome: One flowchart TD Mermaid fence with classDef palette, rounded
          start/returns and Yes/No decisions; explicit either-null guard,
          initialized p/q, p!=q loop, null-to-opposite-head switch for each
          pointer independent, first identity match/null return. Every branch
          agrees with source and prose.
        referenced_inputs:
          - VT-EF6E07ED-REQ-0003@2
          - VT-EF6E07ED-DES-0003@2
          - 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_intersection_of_two_linked_lists/160_intersection_of_two_linked_lists.c
          - 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_intersection_of_two_linked_lists/160_intersection_of_two_linked_lists.cpp
          - 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_intersection_of_two_linked_lists/160_note.md
      - id: LC160-SEM-08
        criterion: AC6 worked Strategy A flow
        expected_outcome: Official example2 identities
          A0(1),A1(9),A2(1),B0(3),C0(2),C1(4). States
          t0(A0,B0),t1(A1,C0),t2(A2,C1),t3(C0,null),t4(C1,A0),t5(null,A1),t6(B0,A2),t7(C0,C0),
          return C0. Show every comparison/update and actual Yes/No outcomes,
          including null switches; separate equal-value1 nodes distinct.
        referenced_inputs:
          - VT-EF6E07ED-REQ-0003@2
          - VT-EF6E07ED-DES-0003@2
          - 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_intersection_of_two_linked_lists/160_intersection_of_two_linked_lists.c
          - 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_intersection_of_two_linked_lists/160_intersection_of_two_linked_lists.cpp
          - 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_intersection_of_two_linked_lists/160_note.md
      - id: LC160-SEM-09
        criterion: AC6 generic and worked Strategy B flows
        expected_outcome: Two distinct styled Mermaid fences; generic includes null
          guard, count phases, length difference alignment, paired identity
          traversal/null return. Example2 m5/n3/diff2 advances A0->A1->A2, then
          (A2,B0)->(C0,C0), returns C0; count progression and concrete
          phase/decision states complete.
        referenced_inputs:
          - VT-EF6E07ED-REQ-0003@2
          - VT-EF6E07ED-DES-0003@2
          - 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_intersection_of_two_linked_lists/160_intersection_of_two_linked_lists.c
          - 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_intersection_of_two_linked_lists/160_intersection_of_two_linked_lists.cpp
          - 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_intersection_of_two_linked_lists/160_note.md
      - id: LC160-SEM-10
        criterion: AC6 pitfalls, edge table and implementation checklist
        expected_outcome: Explains values vs identity, switching current-null vs
          next-null, independent pointer updates, shared ownership/double-free,
          cycles/dangling input out of domain, repeated values, identical
          heads/singletons/disjoint/unequal/head-inside/tail/max/null
          extensions. Checklist covers source guards, strict compilation, actual
          case counts, snapshot preservation, complexity and links.
        referenced_inputs:
          - VT-EF6E07ED-REQ-0003@2
          - VT-EF6E07ED-DES-0003@2
          - 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_intersection_of_two_linked_lists/160_intersection_of_two_linked_lists.c
          - 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_intersection_of_two_linked_lists/160_intersection_of_two_linked_lists.cpp
          - 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_intersection_of_two_linked_lists/160_note.md
      - id: LC160-SEM-11
        criterion: AC4/AC6 runnable demonstration and evidence honesty
        expected_outcome: Note's reproducible strict C11/C++17 LOCAL_TEST commands
          compile actual sources into unique system-temp dirs, child runtime
          PATH includes compiler dir and exits/timeouts checked; judge wrapper
          guidance supplies ListNode before include without LOCAL_TEST. New
          current local check evidence demonstrates both actual source calls,
          exact446 summaries; expected text separate from observed evidence with
          IDs/baselines. No extra practice/answer files inside exact3 folder.
        referenced_inputs:
          - VT-EF6E07ED-REQ-0003@2
          - VT-EF6E07ED-DES-0003@2
          - 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_intersection_of_two_linked_lists/160_intersection_of_two_linked_lists.c
          - 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_intersection_of_two_linked_lists/160_intersection_of_two_linked_lists.cpp
          - 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_intersection_of_two_linked_lists/160_note.md
      - id: LC160-SEM-12
        criterion: AC1/AC7 prerequisite and final preservation closure
        expected_outcome: Manager supplies current independently reviewed task-bound
          preflight evidence confirming full160 absence including alternate
          names/content, protected target/dirty bytes and legacy baselines.
          Final manifest compare uses immutable observed preimplementation
          hashes/status/revision and exactly three new product files; no
          baseline regeneration, unrelated/Trellis/legacy edits or
          partial-preservation acceptance. If missing, mark gap and block
          acceptance.
        referenced_inputs:
          - VT-EF6E07ED-REQ-0003@2
          - VT-EF6E07ED-DES-0003@2
          - 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_intersection_of_two_linked_lists/160_intersection_of_two_linked_lists.c
          - 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_intersection_of_two_linked_lists/160_intersection_of_two_linked_lists.cpp
          - 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_intersection_of_two_linked_lists/160_note.md
      - id: LC160-SEM-13
        criterion: AC6 source links and intended-use review
        expected_outcome: Relative links to both new sources and existing141/206 notes
          resolve; official citations support contract. Four diagrams readable
          and identities/output teach the supplied algorithm; syntax/rendering
          review explicitly labels observed renderer evidence or inspection-only
          limit; no claim of external LeetCode judge submission or hardware
          verification.
        referenced_inputs:
          - VT-EF6E07ED-REQ-0003@2
          - VT-EF6E07ED-DES-0003@2
          - 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_intersection_of_two_linked_lists/160_intersection_of_two_linked_lists.c
          - 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_intersection_of_two_linked_lists/160_intersection_of_two_linked_lists.cpp
          - 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_intersection_of_two_linked_lists/160_note.md
      - id: LC160-SEM-14
        criterion: AC7 evidence configuration and independent review
        expected_outcome: Executable logs identify actual source hashes, frozen check
          fingerprints, UTC, executor/native identity, OS/arch,
          Node/compiler/Python versions and preserved temp artifact metadata;
          archive before separate final reviewer. Planning reviewer
          independently validates commands/oracle/counts/rubric before
          execution; failed evidence retained, reviewed corrections and fresh
          execution required.
        referenced_inputs:
          - VT-EF6E07ED-REQ-0003@2
          - VT-EF6E07ED-DES-0003@2
          - 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_intersection_of_two_linked_lists/160_intersection_of_two_linked_lists.c
          - 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_intersection_of_two_linked_lists/160_intersection_of_two_linked_lists.cpp
          - 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_intersection_of_two_linked_lists/160_note.md
    all_items_required: true
    comparison_tolerance: exact identity, integer counts and complete semantic
      conformance; no numeric tolerance
  protected_fields:
    - inspection_rubric
    - inspection_items
    - acceptance_criteria
    - protected_acceptance
  limitations:
    - "Definition-only: no actual check_inspect invocation and no product
      source/runtime observations."
    - Inspector must be independently assigned with approved check_inspect
      capability. Core rubric schema and expectation interpretation require
      independent planning review; storage success is not executor validation.
    - Manifest-based postcheck can be frozen only from actual immutable
      task-bound preflight evidence; partial CHK-0003 alone cannot close
      AC1/AC7.
  invocation_id: b7469ce2-96d8-440f-9e2b-e0e573da8390
  author_invocation_id: b7469ce2-96d8-440f-9e2b-e0e573da8390
  invocation_role: verifier
  routing_required: true
---
## Criterion and Linked Requirements
REQ-0003rev2 AC1–AC7 / DES-0003rev2 / TASK-0004. Author b7469ce2-96d8-440f-9e2b-e0e573da8390 covering own orphan bf2b6da4-d151-453c-a40f-ff14a990d7a6.

## Method and Verification Level
Semantic source/learning/interface/configuration inspection; actual observations exclusively recorded through check_inspect after separate planning review. No executable marker is substituted for inspection evidence.

## Procedure and Configuration
Use all14 unique frozen data.inspection_rubric / inspection_items IDs LC160-SEM-01..14. Each has criterion, expected_outcome, referenced_inputs; these two metadata arrays contain the same frozen rubric, not different standards. Inspect actual source/note lines and current independent executable/preflight/preservation evidence. Report pass/fail/gap per ID with exact locations/hash/evidence and inspector invocation. A gap is not a pass. Separate reviewer determines semantic correctness.

## Expected Results
Every item meets its expected outcome. Strategy A example2 trace: t0(A0,B0),t1(A1,C0),t2(A2,C1),t3(C0,null),t4(C1,A0),t5(null,A1),t6(B0,A2),t7(C0,C0) then return shared C0. Strategy B counts5/3, difference2, A0->A1->A2, paired(A2,B0)->(C0,C0). Both null branches return null in generic diagrams. Four complete paired flows required. Only3 exercise files; LOCAL_TEST supplies actual runtime demonstration. No separate practice files required by this contract.

## Evidence to Capture
Actual observations separate from this rubric through check_inspect; source/note/current check fingerprints, cited lines, actual runtime and manifest evidence, inspector identity and UTC. Archive evidence before final reviewer. Manager owns preflight/preservation/acceptance, not this author.

## Limitations
No source exists here yet for product inspection and no execution authorized. Transient mutation/allocation/retention/complexity require code review; snapshots/markers alone cannot prove them. Readability/rendering and independent final review cannot be replaced by structural validator. Actual manifest preservation check must be authored later from immutable preimplementation evidence; no invented hash/dirty baseline.
