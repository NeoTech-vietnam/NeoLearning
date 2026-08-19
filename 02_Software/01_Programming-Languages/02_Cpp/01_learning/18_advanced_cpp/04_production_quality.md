# Cornell Notes: Production Quality

## Cues

- What belongs on a CMake target?
- Which defects do warnings, sanitizers, and static analysis find?
- What is the smallest useful test strategy?
- When should performance work begin?

## Notes

### Build contracts

Use target-based CMake. Attach include paths, compile features, definitions, warnings, and dependencies to the target that needs them. Avoid global flags and directory-wide mutable state. Declare the required standard with `target_compile_features`.

Treat warnings as a maintained profile. GCC and Clang commonly start with `-Wall -Wextra -Wpedantic`; add project-relevant checks deliberately. Turning warnings into errors is useful in controlled CI but external headers and compiler upgrades need boundaries.

### Layered verification

Assertions and unit tests check intended behavior. Integration tests check boundaries. AddressSanitizer catches many memory errors; UndefinedBehaviorSanitizer catches selected UB; ThreadSanitizer detects data races but generally runs separately. Sanitizers are hosted diagnostics, not embedded runtime protection.

Static analysis explores paths without execution. Fuzzing supplies generated inputs to parsers and state machines. Neither replaces clear invariants, reviews, or target tests.

### Performance and dependencies

Profile representative workloads before optimizing. Use Compiler Explorer for small code-generation questions; use target traces and counters for hardware timing. Preserve readable source unless measurements justify complexity.

Keep dependencies few, versioned, reviewable, and isolated behind meaningful boundaries. Prefer the standard library. Record licenses and update ownership.

### Engineering guidance

Document public contracts, ownership, thread safety, units, error behavior, and hardware assumptions. The C++ Core Guidelines teach broad practice. MISRA C++ and AUTOSAR C++ are compliance frameworks; applicability, deviations, and tool qualification require project policy rather than blind rule copying.

## Minimal verification loop

1. Compile with strict warnings.
2. Run assertions/tests.
3. Run ASan and UBSan on host logic.
4. Apply available static analysis.
5. Test timing and hardware behavior on target.

## Exercises

1. Create one CMake executable target with C++20 and compiler-specific warnings.
2. Introduce an out-of-bounds access, observe ASan, then remove it.
3. Feed malformed strings to the parser example with a small randomized loop.
4. Benchmark only after writing a performance question and representative input.

## Summary

Production quality comes from explicit build contracts and layered evidence. Warnings, tests, sanitizers, analysis, profiling, and target validation find different defect classes.
