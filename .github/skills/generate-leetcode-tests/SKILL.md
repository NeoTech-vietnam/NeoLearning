---
name: generate-leetcode-tests
description: Generate, add, extend, or repair runnable LeetCode test cases. Use when explicitly asked for tests, a harness, edge-case coverage, or test output. Optimize for minimal file reads, minimal diff, and strict verification.
---

# Generate LeetCode Tests

Create deterministic, runnable tests from local problem statement, constraints, signature, implementation, and existing harness conventions.

## Cheap-Agent Contract

1. Read only requested target files and attached problem statement. Scan nearby files only if convention is unclear.
2. Build coverage matrix in memory; create no planning files.
3. **Test-only final boundary:** preserve the submitted function byte-for-byte before validation. When its body is blank, a temporary reference solution may be inserted directly into that blank function solely to compile and validate generated tests. Never replace, fix, refactor, or alter a non-blank user solution.
4. Compile and run tests with the temporary reference solution, then remove it and restore the original blank function byte-for-byte. Final files must contain test code only. Verify the final diff has no temporary solution, solution scaffolding, placeholder algorithm, or changed non-test line.
5. Add or edit the same-file harness under `#ifdef LOCAL_TEST`. Reuse existing `main`; never add duplicate entry points or create another file.
6. Use one language-correct local harness per requested language.
7. Compile and run each changed language once with strict warnings before restoring temporary solutions. Use sanitizer only for ownership/memory risk or suspected defect. After restoration, run `git diff --check` and inspect the final diff.
8. Report files, exact validation commands, pass counts, and confirmation that temporary solutions were removed. Do not paste large output.

Do not install packages, add frameworks, create separate test directories, delegate, or enumerate every finite input when equivalence classes cover behavior.

## Test Requirements

- Cover examples, minimum input, homogeneous classes, already-correct and reverse arrangements, alternating arrangements, boundary positions, exceptional one-element cases, duplicates, zero/special values, min/max values, balanced and unbalanced distributions, required mutation/ownership/output-length invariants, and maximum-size stress when practical.
- For Sort Array By Parity include both examples, single even/odd, all even/odd, already/reverse partitioned, alternating orders, one even among odds, one odd among evens, duplicates with zero, min/max, first/middle/last parity positions, balanced mix, and 5000-element stress.
- Preserve mutable input before solution call. Print preserved input, never mutated argument.
- Validate complete contract: output length, order/structure invariant, and exact element multiset. Never validate only category counts.
- Store validation result. Print exactly `Passed` only when valid, otherwise `Failed`; assert validation result.
- Use exact standalone format:
  ```text
  Input: nums = [3,1,2,4]
  Output: [2,4,3,1]
  Passed
  ```
- Bound large output with first/last values and exact omitted count. Same bounded printer for input/output.
- Keep C strict: pointers, C headers, allocation/size checks, bounds checks before fixed-array indexing.
- Keep C++ explicit: required headers, references/STL only where signature requires.
- Avoid unseeded randomness, timing assertions, network, platform-dependent output, and expected-output copies of the algorithm.

## Scope and Verification

- If one file named, edit only it. If directory named, edit variants only when clearly requested.
- Follow local `LOCAL_TEST` guard and compiler convention.
- C: `gcc -std=c11 -Wall -Wextra -Werror -pedantic`.
- C++: `g++ -std=c++17 -Wall -Wextra -Werror -pedantic`.
- Run `git diff --check` on changed tracked files.
- Keep correctly failing tests; never weaken validation to make solution pass.
- Create test cases in the same file, DO NOT create any other file.
- DO NOT provide solution, only generate test case.
- Brainstorm possible scenarios and generate multiple meaningful test cases; DO NOT create only one test case.
