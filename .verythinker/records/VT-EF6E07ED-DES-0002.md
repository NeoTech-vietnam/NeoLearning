---
schema_version: 1
id: VT-EF6E07ED-DES-0002
type: design
title: LeetCode 344 array reversal and paired Cornell flows
owner: architect
status: draft
revision: 1
created_at: 2026-10-11T06:42:28.632Z
updated_at: 2026-10-11T06:42:28.632Z
links:
  - type: satisfies
    target: VT-EF6E07ED-REQ-0002
data:
  author_invocation: /root/design_344
  requested_model: gpt-6.1-sol
  reasoning_effort: high
  confirmed_model: unavailable
  interfaces:
    - C11 void reverseString(char *s, int sSize)
    - C++17 public void Solution::reverseString(std::vector<char>& s)
  architecture: Standalone in-place two-index swaps, LOCAL_TEST harnesses and
    Cornell note; three exercise files only.
  verification_approach: Real-solution indexing-oracle tests, C guard bytes, C++
    unchanged storage metadata, strict builds/judge external callers, notes
    validation, preservation fingerprints and independent semantic review.
  inapplicable:
    - "Hardware and deployed-system verification: standalone learning algorithm;
      neither firmware nor product build changed."
---
# Objective and allocation
Satisfy REQ-0002 with exactly 344_reverse_string.c/.cpp and 344_note.md. Strong design consultation /root/design_344 supplied this contract; requested gpt-6.1-sol high, observed model unavailable.

# Interfaces and operating domain
C11 void reverseString(char *s, int sSize). C++17 public void Solution::reverseString(std::vector<char>& s). Caller owns writable storage; valid judge n is 1..100000 and characters printable ASCII. No return value. Every element i becomes original[n-1-i]; preserve length/storage ownership. C uses explicit length, no strlen/NUL dependence. Empty/null or Unicode guarantees are outside the valid domain.

# Algorithm and correctness
Initialize left=0, right=n-1. While left<right, save left character, exchange endpoints, increment left and decrement right. Outside the remaining interval, values equal their final reversed positions. Each swap fixes two positions; odd midpoint stays unchanged. Exactly floor(n/2) swaps: O(n) time and O(1) auxiliary space. C++ size casts to int only under n<=100000. No allocation or recursion inside either solution; fixtures/helpers/main guarded LOCAL_TEST.

# Documentation
Follow local Cornell template dated 11/10/2026: official examples and constraints, mutation/ownership contract, cues/mindset/invariant, Strategy A iterative swaps and Strategy B recursive inward descent followed by swaps on unwind. B consumes O(n) stack and explicitly violates the problem's constant-space requirement; explanatory only. Both strategies have separate generic and concrete styled Mermaid flows; show recursive base case and every unwind. Include edge table/checklist/summary, local compile/run commands and contrast with 206 link rewiring. Paraphrase official statement and link source.

# Verification allocations
Harnesses call actual solutions, use snapshot[n-1-i] as independent oracle, verify C sentinel guards and C++ size/storage address. Official examples plus singleton/pair/asymmetric odd/even/repetition/palindrome/spaces/punctuation, all 95 printable ASCII, n100000 nonpalindrome and every ternary sequence lengths1..8 (9840 exhaustive fixtures). Allocation failure reports nonzero. Strict C11/C++17 -Wall -Wextra -Werror -pedantic LOCAL_TEST builds/runtime; judge mode without LOCAL_TEST with external callers confirms void signatures/main exclusion. Notes validator and whitespace/inventory/preserved-file hashes. Build outputs are temporary. Independent review checks code and all four diagrams, actual evidence/work record and intended learning fit.

# Bounded ownership and limitations
Economy implementation worker owns three exercise files; economy verifier owns only .verythinker/verification/leetcode344.ps1, consumes manager preservation manifest and runs core check. Manager owns records/integration; strong independent reviewer never implements. No existing exercise edits/dependencies/commits. Static diagram review only; no online judge or rendered-layout claim.
