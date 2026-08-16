---
name: generate-leetcode-tests
description: Generate, add, extend, or repair runnable test cases for local LeetCode solution files and problem directories. Use only when the user explicitly asks for tests, test cases, a test harness, edge-case coverage, or test output for a LeetCode problem. Supports the target language and local repository conventions. Do not trigger for solution-only, explanation-only, review-only, or note-only requests.
---

# Generate LeetCode Tests

Create focused, runnable tests from local problem statements, constraints, implementations, and nearby repository conventions. Optimize for low-cost execution: inspect only requested files, make smallest valid diff, run one strict verification command.

## Cheap-Agent Contract

Follow this exact order:

1. Read requested target file(s) and attached problem statement. Do not scan repository unless target conventions are missing.
2. Build compact coverage matrix in memory; do not create planning files.
3. Edit only requested solution file(s). Keep solution logic unchanged unless user explicitly requests a fix.
4. Use one local harness per language, guarded by existing local-test convention. Never add duplicate `main`.
5. Compile and run each changed language once with strict warnings. Use sanitizer only when a defect or memory ownership risk warrants it.
6. Report changed files, exact commands, pass counts, and failures. No long output copy.

Do not delegate, install packages, add frameworks, generate separate test directories, or enumerate every input when equivalence classes cover behavior.

## Workflow

1. Resolve the requested problem directory and exact target file or files.
2. Read every requested solution file, the local problem statement, existing tests, and the nearest comparable same-language test harness only when needed.
3. Treat local examples, constraints, function signatures, mutation rules, and judge behavior as primary truth. Report material conflicts instead of guessing.
4. When both C and C++ variants exist, isolate them. Do not copy helper signatures or syntax across languages without adapting them fully.
5. For C files, stay strict C: pointers instead of references, C headers and I/O, no STL or C++-only syntax.
6. Preserve solution logic. Modify it only when the user also asks for implementation or fixes.
7. Add tests inside the requested source file unless the user requests separate tests or the repository clearly requires them.
8. Reuse an existing `main`, test framework, helper style, or build convention. Never create duplicate entry points.
9. Build a coverage matrix before writing tests. Generate one or more deterministic cases for every applicable category:
   - Every supplied example.
   - Empty or null input only when allowed.
   - Minimum input length and smallest behavior-changing input.
   - Each homogeneous class, such as all even and all odd.
   - Already-correct, reverse/maximally incorrect, and alternating arrangements from each relevant starting class.
   - One exceptional element among many opposite-class elements, in first, middle, and last positions when behavior differs.
   - Repetitions, duplicates, zero or other neutral/special values, signs, and minimum/maximum allowed values.
   - Balanced and highly unbalanced class counts.
   - Mutation, ownership, stability, node identity, output length, or structural invariants required by the contract.
   - Maximum-size deterministic stress input when practical; truncate its display.
   Example-only coverage is incomplete. Target at least 10 focused cases per language when 10 meaningful categories apply. Fewer are allowed only when fewer distinct categories exist, and the final report must explain why. “All possible” means all meaningful equivalence classes and boundaries, not enumeration of an enormous finite domain.
10. For Sort Array By Parity specifically, include both examples; single even; single odd; all even; all odd; already partitioned; reverse partitioned; alternating even-first; alternating odd-first; one even among odds; one odd among evens; duplicates with zero; minimum/maximum values; first/middle/last parity boundaries; balanced mix; and a 5000-element stress case.
11. In a standalone harness, print every case using this exact structure; test name may appear before it:
   ```text
   Input: nums = [3,1,2,4]
   Output: [2,4,3,1]
   Passed
   ```
   Print `Failed` when validation fails. Do not substitute `PASS`, `FAIL`, `Result`, or alternate labels. Adapt input variable name from `nums` only when function signature uses a different input name. Include expected output only for uniquely defined outputs or useful failure diagnosis.
12. Preserve input before invoking a mutable solution. Print preserved original input, never mutated argument. Store validation result, print `Passed` only when true, print `Failed` otherwise, then assert it.
13. Assert behavior, not merely printed values. For problems allowing multiple valid outputs, verify output length, contract invariants, and exact input-element multiset rather than comparing one fixed valid output. Never use only counts by category when duplicate values can expose corruption.
14. Bound traversal and truncate large displays with first/last values plus exact omitted count. Use same bounded printer for input and output. Tests must not hang on cycles or malformed output.
14. Compile and run with the strictest locally available warnings. Compilation is mandatory gate. If changed file does not compile in its own language, task is not done.
15. Use a relevant sanitizer only when the solution owns or frees memory, or when a defect is suspected. If LeakSanitizer is incompatible with the environment, retry with UBSan or another available safe check.
16. Keep failing tests when they correctly expose an incomplete or incorrect solution. Do not weaken tests to make a solution pass.
17. Report changed files, exact commands run, pass counts, and any solution-caused failures. Do not paste full large output.

## Scope Rules

- When the user names one file, modify only that file.
- When the user names a directory, cover its solution variants only when the request clearly includes the directory as a whole.
- Do not edit notes, unrelated solutions, build files, or sibling languages outside requested scope.
- If only `foo.c` was requested, do not silently mirror edits into `foo.cpp`, and vice versa.
- Do not replace user-written tests; extend or adapt them carefully.
- If a solution is incomplete, create a syntactically valid harness when possible, validate compilation separately, and state that runtime tests await implementation.
- Follow local judge compatibility. If nearby files guard local test code, use the same guard and compile flag.

## Test Quality

- Assert behavior, not merely printed values. A harness that always prints `Passed` is invalid.
- Preserve original mutable input before calling solution; compare and print against preserved copy.
- Avoid tests whose expected result duplicates the algorithm under test.
- For non-unique outputs, validate complete contract: size, structure/order invariant, and exact element multiset.
- Match helper signatures to file language. Example: C shared counters use `int*`; C++ may use references.
- In C, validate numeric/index bounds before indexing fixed count arrays; check allocation and returned size before traversal.
- In C++, compile required headers explicitly; do not rely on transitive includes.
- For mutable structures, retain independent evidence of original elements or nodes.
- For linked lists, verify values, exact length, null termination, node reuse when required, and absence of extra nodes or cycles.
- For arrays or strings, verify returned length and relevant mutated regions, including judge-ignored regions only when the contract defines them.
- For trees or graphs, serialize with bounded traversal and track visited nodes when cycles are possible.
- Free test-owned memory independently of mutated structure links.
- Avoid unseeded randomness, network access, timing assertions, and platform-dependent output.

## Verification

- C: prefer `gcc -std=c11 -Wall -Wextra -Werror -pedantic`.
- C++: prefer `g++ -std=c++17 -Wall -Wextra -Werror -pedantic`.
- If problem directory contains both `.c` and `.cpp`, compile each changed file with its matching compiler, never with shared assumptions.
- Use the repository's configured compiler, test runner, or language version when present.
- Add `-fsanitize=address,undefined` when supported. If LeakSanitizer is incompatible with the environment, retry with UBSan or another available safe check.
- Run `git diff --check` on changed tracked files and inspect new files for whitespace errors.
