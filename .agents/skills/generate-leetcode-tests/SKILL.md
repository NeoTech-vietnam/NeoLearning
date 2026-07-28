---
name: generate-leetcode-tests
description: Generate, add, extend, or repair runnable test cases for local LeetCode solution files and problem directories. Use only when the user explicitly asks for tests, test cases, a test harness, edge-case coverage, or test output for a LeetCode problem. Supports the target language and local repository conventions. Do not trigger for solution-only, explanation-only, review-only, or note-only requests.
---

# Generate LeetCode Tests

Create focused tests from local problem statements, constraints, implementations, and nearby repository conventions.

## Workflow

1. Resolve the requested problem directory and exact target file or files.
2. Read every requested solution file, the local problem statement, existing tests, and the nearest comparable same-language test harness.
3. Treat local examples, constraints, function signatures, mutation rules, and judge behavior as primary truth. Report material conflicts instead of guessing.
4. When both C and C++ variants exist, isolate them. Do not copy helper signatures or syntax across languages without adapting them fully.
5. For C files, stay strict C: pointers instead of references, C headers and I/O, no STL or C++-only syntax.
6. Preserve solution logic. Modify it only when the user also asks for implementation or fixes.
7. Add tests inside the requested source file unless the user requests separate tests or the repository clearly requires them.
8. Reuse an existing `main`, test framework, helper style, or build convention. Never create duplicate entry points.
9. Generate deterministic cases covering relevant categories:
   - Every supplied example.
   - Empty or null input when allowed.
   - Minimum-size and smallest behavior-changing inputs.
   - Boundary positions, ordering, repetitions, duplicates, signs, and value limits when applicable.
   - Mutation, ownership, node identity, output length, or structural invariants required by the contract.
   - Maximum-size input when useful and practical.
10. In a standalone harness, print every case using this exact structure; test name may appear before it:
   ```text
   Input: nums = [3,1,2,4]
   Output: [2,4,3,1]
   Passed
   ```
   Print `Failed` when validation fails. Do not substitute `PASS`, `FAIL`, `Result`, or alternate labels. Adapt input variable name from `nums` only when function signature uses a different input name. Include expected output only for uniquely defined outputs or useful failure diagnosis.
11. Assert behavior, not merely printed values. For problems allowing multiple valid outputs, verify invariants and input preservation rather than comparing one fixed expected output.
12. Bound traversal and truncate large displays with an omitted-count marker. Tests must not hang on cycles or malformed output.
13. Compile and run with the strictest locally available warnings. Compilation is mandatory gate. If changed file does not compile in its own language, task is not done.
14. Use a relevant sanitizer when supported; if sandbox limitations block one sanitizer, use a safe fallback and report it.
15. Keep failing tests when they correctly expose an incomplete or incorrect solution. Do not weaken tests to make a solution pass.
16. Report changed files, commands run, pass count, and any solution-caused failures.

## Scope Rules

- When the user names one file, modify only that file.
- When the user names a directory, cover its solution variants only when the request clearly includes the directory as a whole.
- Do not edit notes, unrelated solutions, build files, or sibling languages outside requested scope.
- If only `foo.c` was requested, do not silently mirror edits into `foo.cpp`, and vice versa.
- Do not replace user-written tests; extend or adapt them carefully.
- If a solution is incomplete, create a syntactically valid harness when possible, validate compilation separately, and state that runtime tests await implementation.
- Follow local judge compatibility. If nearby files guard local test code, use the same guard and compile flag.

## Test Quality

- Assert behavior, not merely printed values.
- Avoid tests whose expected result duplicates the algorithm under test.
- Match helper signatures to file language. Example: C shared counters use `int*`; C++ may use references.
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
