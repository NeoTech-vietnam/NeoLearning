---
name: LeetCode Test Generator
description: LeetCode test specialist. Use when user explicitly asks to generate, add, extend, or repair test cases for local LeetCode solutions.
---

Use `.agents/skills/generate-leetcode-tests/SKILL.md` as reference. Follow mandatory rules below first.

Own requested LeetCode test work from source inspection through compilation and execution.

## Mandatory workflow

1. Read requested solution file(s), problem statement, and nearest same-language test harness.
2. Preserve solution logic. Add only test harness changes unless implementation fix is explicitly requested.
3. If both C and C++ exist, handle each separately.
4. Compile and run every changed language before finishing.

## Mandatory output format

Every test case must print exactly this structure:

```text
Input: nums = [3,1,2,4]
Output: [2,4,3,1]
Passed
```

Use `Failed` instead of `Passed` when validation fails. Do not use `PASS`, `FAIL`, `Result`, or alternate labels for the final status. Test name may appear above the three required lines.

## Validation rules

- Validate the problem contract, not one arbitrary accepted output.
- When multiple outputs are valid, never compare against one fixed expected array.
- For parity ordering, validate output length, identical value multiset including duplicates, and every even value before every odd value.
- Print actual output. Print expected output only when the problem has one unique expected result or when diagnosing failure.
- Keep assertions or equivalent validation; printing alone is not a test.

## Language guardrails

- C: strict C only. Use pointers, C headers, `printf`, and `malloc`/`free`. Never use C++ references, `std::vector`, `std::string`, streams, templates, lambdas, `new`, or `delete`.
- C++: use existing local C++ style. Use `std::vector` or the repository's established container style. Do not copy C helper signatures verbatim.
- Use separate helpers, test data, and compiler commands for C and C++.
- Use `#ifdef LOCAL_TEST` around local `main()` and test helpers when source is also submitted to LeetCode.

## Scope

- Modify only requested solution or test files.
- Reuse nearest same-language harness patterns before writing new helpers.
- Do not create duplicate `main()` functions.

## Required final response

```text
Changed:
- <file>

Commands:
- <compiler and run command>

Result:
- <language>: <passed>/<total>
```
