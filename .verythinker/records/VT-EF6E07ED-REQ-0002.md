---
schema_version: 1
id: VT-EF6E07ED-REQ-0002
type: requirement
title: LeetCode 344 Reverse String with tiered model delegation
owner: requirements
status: draft
revision: 2
created_at: 2026-10-11T06:38:30.713Z
updated_at: 2026-10-11T06:40:58.889Z
links: []
data:
  intake_workflow_id: VT-EF6E07ED-KNW-0007
  acceptance_criteria:
    - AC1 — Add exactly one exercise folder
      02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/344_reverse_string
      containing exactly 344_reverse_string.c, 344_reverse_string.cpp, and
      344_note.md as authored exercise files. Preserve all previous 141 files
      and unrelated user changes; generated executables belong outside the
      exercise folder.
    - AC2 — C exposes void reverseString(char *s, int sSize), and C++ exposes
      public void Solution::reverseString(std::vector<char>& s). For every valid
      input length n in [1,100000] containing printable ASCII characters, after
      the call s[i] equals its original value at n-1-i for every i in [0,n).
      Both interfaces return void and mutate the caller-owned storage.
    - AC3 — The implemented two-index algorithm uses O(n) time and O(1)
      auxiliary space, allocates/frees no input storage, and does not resize or
      replace the C++ vector. C reads and writes only the explicitly supplied n
      characters and does not depend on strlen, a trailing NUL, or C-string
      formatting. Verify complexity and bounds by independent source inspection
      as well as functional checks.
    - AC4 — With LOCAL_TEST enabled, each source compiles and runs an embedded
      harness calling its actual solution. Each case checks every output byte
      against an independent saved-input indexing oracle. Include both official
      examples, singleton, unequal pair, distinct odd/even lengths, repeated
      characters, palindrome, printable space and tilde boundaries, a
      non-NUL-terminated C buffer, all 95 printable ASCII characters, and at
      least one non-palindromic maximum length 100000 input. Exhaustively
      enumerate every sequence of lengths 1 through 8 over a three-character
      printable alphabet. Check C surrounding guard bytes and C++
      size/capacity/data address preservation.
    - AC5 — LOCAL_TEST binaries report case counts and failures and return
      nonzero on any failure. C11 and C++17 builds pass -Wall -Wextra -Werror
      -pedantic. With LOCAL_TEST absent, both sources compile in judge mode
      without a local main or local-test machinery; runtime evidence identifies
      actual compiler versions and commands.
    - AC6 — 344_note.md follows the local Cornell standard, date 11/10/2026,
      official problem link, both official examples, constraints, exact
      mutation/ownership/function contract, recognized pattern,
      outside-the-active-interval invariant, correctness/termination reasoning,
      O(n)/O(1) bounds, failure points, edge-case table, implementation
      checklist, summary, and reproducible PowerShell LOCAL_TEST commands.
      Include optimal Strategy A and one meaningful educational alternative with
      honest trade-offs, plus separate generic and concrete worked-example
      Mermaid flows for every documented strategy.
    - "AC7 — The note explains the topic fit: arrays provide direct indexed
      access and reversal swaps values in fixed contiguous storage, whereas
      existing 206 reverses next links in the same linked-list nodes. It states
      that printable ASCII character-array reversal is neither UTF-8/grapheme
      reversal nor a NUL-terminated-string operation. Empty/null C inputs are
      outside the official constraints; any optional defensive extension is
      labelled separately."
    - AC8 — Specification verification includes actual strict builds, functional
      harness execution, judge-mode compilation, Cornell validator, scoped
      whitespace/diff checks, and source inspection of complexity/in-place
      behavior. Intended-use validation is separate independent review of
      completeness, correctness, educational usefulness, and consistency with
      existing 141/206. Acceptance requires current baseline-bound evidence and
      a separate reviewer invocation. Requirements/design/review request
      gpt-6.1-sol high; bounded implementation/routine checks may request
      gpt-6-luna medium. Record actual invocation identities and mark runtime
      model observation unavailable if not exposed. Use only VeryThinker.
  source: user-request
---
# Stakeholder requirement
Add exactly one additional implemented LeetCode exercise in 02_contiguous_vs_linked_structures matching existing structure, C/C++ files, embedded LOCAL_TEST checks and Cornell docs. Preserve previous 141 and all unrelated files. Use only VeryThinker per persistent instruction. Use gpt-6.1-sol with high reasoning for requirements, design and independent review; delegate bounded implementation and routine checks to the lowest cost suitable available model, selected gpt-6-luna.

# Selected exercise and rationale
LeetCode 344 Reverse String is one bounded contiguous-array exercise. Two inward-moving indexes swap character values in fixed storage, contrasting 206 Reverse Linked List, where links change and nodes remain. This extends the requested topic without creating another curriculum section or editing prior exercises.

# Conditions and contract
Official valid inputs contain 1 through 100000 printable ASCII characters. C receives a writable array and explicit int length; C++ receives a mutable vector<char> reference. For each valid index i, output[i] = input_before[n-1-i]. Ownership and array length remain unchanged. The production implementation is iterative, O(n) time, O(1) auxiliary space. No UTF-8, grapheme, strlen, trailing-NUL, or Unicode semantics are implied. Empty/null C inputs are outside the judge domain.

# Acceptance criteria
- AC1 — Add exactly one exercise folder 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/344_reverse_string containing exactly 344_reverse_string.c, 344_reverse_string.cpp, and 344_note.md as authored exercise files. Preserve all previous 141 files and unrelated user changes; generated executables belong outside the exercise folder.
- AC2 — C exposes void reverseString(char *s, int sSize), and C++ exposes public void Solution::reverseString(std::vector<char>& s). For every valid input length n in [1,100000] containing printable ASCII characters, after the call s[i] equals its original value at n-1-i for every i in [0,n). Both interfaces return void and mutate the caller-owned storage.
- AC3 — The implemented two-index algorithm uses O(n) time and O(1) auxiliary space, allocates/frees no input storage, and does not resize or replace the C++ vector. C reads and writes only the explicitly supplied n characters and does not depend on strlen, a trailing NUL, or C-string formatting. Verify complexity and bounds by independent source inspection as well as functional checks.
- AC4 — With LOCAL_TEST enabled, each source compiles and runs an embedded harness calling its actual solution. Each case checks every output byte against an independent saved-input indexing oracle. Include both official examples, singleton, unequal pair, distinct odd/even lengths, repeated characters, palindrome, printable space and tilde boundaries, a non-NUL-terminated C buffer, all 95 printable ASCII characters, and at least one non-palindromic maximum length 100000 input. Exhaustively enumerate every sequence of lengths 1 through 8 over a three-character printable alphabet. Check C surrounding guard bytes and C++ size/capacity/data address preservation.
- AC5 — LOCAL_TEST binaries report case counts and failures and return nonzero on any failure. C11 and C++17 builds pass -Wall -Wextra -Werror -pedantic. With LOCAL_TEST absent, both sources compile in judge mode without a local main or local-test machinery; runtime evidence identifies actual compiler versions and commands.
- AC6 — 344_note.md follows the local Cornell standard, date 11/10/2026, official problem link, both official examples, constraints, exact mutation/ownership/function contract, recognized pattern, outside-the-active-interval invariant, correctness/termination reasoning, O(n)/O(1) bounds, failure points, edge-case table, implementation checklist, summary, and reproducible PowerShell LOCAL_TEST commands. Include optimal Strategy A and one meaningful educational alternative with honest trade-offs, plus separate generic and concrete worked-example Mermaid flows for every documented strategy.
- AC7 — The note explains the topic fit: arrays provide direct indexed access and reversal swaps values in fixed contiguous storage, whereas existing 206 reverses next links in the same linked-list nodes. It states that printable ASCII character-array reversal is neither UTF-8/grapheme reversal nor a NUL-terminated-string operation. Empty/null C inputs are outside the official constraints; any optional defensive extension is labelled separately.
- AC8 — Specification verification includes actual strict builds, functional harness execution, judge-mode compilation, Cornell validator, scoped whitespace/diff checks, and source inspection of complexity/in-place behavior. Intended-use validation is separate independent review of completeness, correctness, educational usefulness, and consistency with existing 141/206. Acceptance requires current baseline-bound evidence and a separate reviewer invocation. Requirements/design/review request gpt-6.1-sol high; bounded implementation/routine checks may request gpt-6-luna medium. Record actual invocation identities and mark runtime model observation unavailable if not exposed. Use only VeryThinker.

# Verification allocations
Implementation owner: new C/C++ files and their LOCAL_TEST harnesses only. Documentation owner: new Cornell note only, inspected against the actual language variants. Manager owns task/design/check/evidence links and workflow closure; a separate reviewer assesses the current implementation, note and results. Unit/functional checks exercise valid arrays and mutation. Judge-mode compilation checks interface packaging. Note validator and independent diagram review assess documentation. Source inspection checks complexity and absence of size-dependent production allocations. Intended-use validation assesses whether a learner receives one complete, usable, consistent exercise. No hardware, application integration, deployment or firmware release testing applies to these standalone educational programs.

# Sources and assumptions
- User request preserved in revision 1 and intake workflow VT-EF6E07ED-KNW-0007.
- Official source: https://leetcode.com/problems/reverse-string/description/; title, examples, printable-ASCII domain, n bounds and constant-extra-memory requirement supplied by the manager after live verification.
- Local comparison baseline: 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/141_linked_list_cycle/{141_linked_list_cycle.c,141_linked_list_cycle.cpp,141_note.md}, and 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/206_reverse_linked_list/{206_reverse_linked_list.c,206_reverse_linked_list.cpp,206_note.md}.
- Local note contract: .agents/skills/leetcode-notes/references/note-requirements.md and references/mermaid-style.md.
- Process: .verythinker/roles/requirements.md and .verythinker/guides/{workflow,process}.md; software profile; automation documentation required.
- No README navigation change is required because this adds one problem inside an existing topic, not a top-level curriculum topic. No separate test file is required; tests are embedded to match 141.
- Optional out-of-domain defensive behavior must not be presented as an official constraint.

# Baseline preservation and impact
Revision 1 stakeholder scope is retained above; its placeholder acceptance criteria are refined by this revision. Pre-update trace impact showed only incoming documents link from VT-EF6E07ED-KNW-0007 and no downstream design/task/check/evidence records. The manager will establish downstream traceability against this refined baseline.

# Consultation provenance
Actual invocation: /root/requirements_344. Requested model: gpt-6.1-sol. Requested reasoning: high. Confirmed runtime model: unavailable; no observation endpoint exposed to this invocation. This is a pre-task bounded requirements consultation, not execution acceptance or independent review.
