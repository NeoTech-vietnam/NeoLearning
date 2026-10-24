# TDD and Unit Testing

This section introduces test-driven development (TDD) for embedded C with
**Ceedling as the primary host-side unit-test workflow**. Zephyr's `ztest`
appears as a focused reference for work that must remain in Zephyr's own build
and test ecosystem. This is a documentation-only learning path; runnable
examples are intentionally deferred.

## Learning path

1. [TDD Foundations](01_TDD-Foundations.md) — workflow and design habits.
2. [Ceedling Unit Tests](02_Ceedling-Unit-Tests.md) — the primary, fast
   host-side C workflow.
3. [Ceedling and ztest Strategy](04_Ceedling-and-ztest-Strategy.md) — choose
   Ceedling by default and recognize the Zephyr-specific exceptions.
4. [Zephyr ztest reference](03_Zephyr-ztest.md) — concise guidance for tests
   that need Zephyr's build, kernel, or platform tooling.

## Audience

- Developers new to TDD in C or embedded systems.
- Developers adding TDD and unit tests to a Ceedling-based C project.
- Zephyr developers who need to understand when ztest is more appropriate than
  a host-side Ceedling test.

## Scope

These notes explain concepts, vocabulary, workflow, and official references.
They do not add tool installation, configuration, source code, or runnable test
projects to this repository.

## Official documentation

- [Ceedling documentation](https://throwtheswitch.github.io/Ceedling/latest/)
- [Ceedling repository](https://github.com/ThrowTheSwitch/Ceedling)
- [Zephyr Test Framework (`ztest`)](https://docs.zephyrproject.org/latest/develop/test/ztest.html)
- [Zephyr Test Runner (Twister)](https://docs.zephyrproject.org/latest/develop/test/twister.html)

## Deferred practical work

The next phase may add small, independently runnable examples for the TDD loop,
Ceedling with CMock, an isolated ztest unit test, and a Twister-driven
`native_sim` test. Those examples are intentionally out of scope here.
