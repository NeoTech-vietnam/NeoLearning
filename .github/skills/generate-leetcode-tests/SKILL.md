---
name: generate-leetcode-tests
description: Generate, add, extend, or repair runnable test cases for local LeetCode solution files and problem directories. Use only when the user explicitly asks for tests, test cases, a test harness, edge-case coverage, or test output for a LeetCode problem. Supports the target language and local repository conventions. Do not trigger for solution-only, explanation-only, review-only, or note-only requests.
---

# Generate LeetCode Tests

Create focused tests from local problem statements, constraints, implementations, and nearby repository conventions.

## Workflow

1. Resolve the requested problem directory and exact target file or files.
2. Read every requested solution file, the local problem statement, existing tests, and the nearest comparable test harness.
3. Treat local examples, constraints, function signatures, mutation rules, and judge behavior as primary truth. Report material conflicts instead of guessing.
4. Preserve solution logic. Modify it only when the user also asks for implementation or fixes.
5. Add tests inside the requested source file unless the user requests separate tests or the repository clearly requires them.
6. Reuse an existing `main`, test framework, helper style, or build convention. Never create duplicate entry points.
7. Generate deterministic cases covering relevant categories:
   - Every supplied example.
   - Empty or null input when allowed.
   - Minimum-size and smallest behavior-changing inputs.
   - Boundary positions, ordering, repetitions, duplicates, signs, and value limits when applicable.
   - Mutation, ownership, node identity, output length, or structural invariants required by the contract.
   - Maximum-size input when useful and practical.
8. Print each case's name, input, actual output, and PASS/FAIL result when using a standalone harness. Include expected output on failure when it improves diagnosis.
9. Bound traversal and truncate large displays with an omitted-count marker. Tests must not hang on cycles or malformed output.
10. Compile and run with the strictest locally available warnings. Use a relevant sanitizer when supported; if sandbox limitations block one sanitizer, use a safe fallback and report it.
11. Keep failing tests when they correctly expose an incomplete or incorrect solution. Do not weaken tests to make a solution pass.
12. Report changed files, commands run, pass count, and any solution-caused failures.

## Scope Rules

- When the user names one file, modify only that file.
- When the user names a directory, cover its solution variants only when the request clearly includes the directory as a whole.
- Do not edit notes, unrelated solutions, build files, or sibling languages outside requested scope.
- Do not replace user-written tests; extend or adapt them carefully.
- If a solution is incomplete, create a syntactically valid harness when possible, validate compilation separately, and state that runtime tests await implementation.
- Follow local judge compatibility. If nearby files guard local test code, use the same guard and compile flag.

## Test Quality

- Assert behavior, not merely printed values.
- Avoid tests whose expected result duplicates the algorithm under test.
- For mutable structures, retain independent evidence of original elements or nodes.
- For linked lists, verify values, exact length, null termination, node reuse when required, and absence of extra nodes or cycles.
- For arrays or strings, verify returned length and relevant mutated regions, including judge-ignored regions only when the contract defines them.
- For trees or graphs, serialize with bounded traversal and track visited nodes when cycles are possible.
- Free test-owned memory independently of mutated structure links.
- Avoid unseeded randomness, network access, timing assertions, and platform-dependent output.

## Verification

- C: prefer `gcc -std=c11 -Wall -Wextra -Werror -pedantic`.
- C++: prefer `g++ -std=c++17 -Wall -Wextra -Werror -pedantic`.
- Use the repository's configured compiler, test runner, or language version when present.
- Add `-fsanitize=address,undefined` when supported. If LeakSanitizer is incompatible with the environment, retry with UBSan or another available safe check.
- Run `git diff --check` on changed tracked files and inspect new files for whitespace errors.
