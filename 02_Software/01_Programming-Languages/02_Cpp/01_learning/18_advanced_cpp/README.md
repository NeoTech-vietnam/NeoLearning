# Advanced C++

Prerequisite-ordered C++20 track. C++23 features are labeled. Each module includes a Cornell note, runnable host example, exercises, embedded constraints, and references.

## Prerequisites

Complete sections 1–17. Know RAII, smart pointers, templates, STL algorithms, lambdas, exceptions, and basic concurrency.

## Compile baseline

```bash
g++ -std=c++20 -Wall -Wextra -Wpedantic example.cpp -o example
./example
```

Use `-std=c++23` only where marked. Hosted examples run on Linux. Board-specific firmware belongs in [`Examples/`](../../../../../Examples/).

## Learning order

1. [Language mastery](01_language_mastery.md) — lifetime, value categories, templates, concepts, layout, UB, ODR, ABI.
2. [Modern C++17–23](02_modern_cpp17_23.md) — vocabulary types, compile-time evaluation, ranges, formatting, filesystem, modules, coroutines, `expected`.
3. [Embedded C++](03_embedded_cpp.md) — MMIO, deterministic storage, interrupts, atomics, endian handling, toolchain boundaries.
4. [Production quality](04_production_quality.md) — CMake targets, warnings, sanitizers, analysis, tests, fuzzing, profiling, guidelines.

## Runnable examples

| Module | Example | Standard |
| --- | --- | --- |
| Language mastery | [`value_categories.cpp`](../../02_example/18_advanced_cpp/value_categories.cpp) | C++20 |
| Modern C++ | [`vocabulary_types.cpp`](../../02_example/18_advanced_cpp/vocabulary_types.cpp) | C++20 |
| Embedded C++ | [`fixed_queue.cpp`](../../02_example/18_advanced_cpp/fixed_queue.cpp) | C++20 |
| Production quality | [`validated_parser.cpp`](../../02_example/18_advanced_cpp/validated_parser.cpp) | C++20 |

## Capstones

1. Extend `fixed_queue.cpp` with overflow telemetry and trivially copyable messages.
2. Build a type-safe register wrapper backed by a host array; never dereference a real device address on Linux.
3. Write an RAII peripheral guard with explicit acquire/release callbacks.
4. Build a bounded protocol parser or state machine; test malformed and truncated frames on the host.

## Completion criteria

- Explain ownership, lifetime, UB, ODR, and ABI boundaries.
- Select hosted versus freestanding-safe facilities deliberately.
- Keep interrupt paths bounded and allocation-free.
- Compile warning-clean; pass assertions plus ASan/UBSan.
- Measure before optimizing.

## References

- [C++ reference](https://en.cppreference.com/)
- [C++ Core Guidelines](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines)
- [Compiler support](https://en.cppreference.com/w/cpp/compiler_support)
- [CMake documentation](https://cmake.org/documentation/)
