# Cornell Notes: Embedded C++

## Cues

- Which C++ abstractions remain deterministic and zero-overhead?
- Why does `volatile` not provide synchronization?
- What may execute inside an ISR?
- How can hardware-facing code remain host-testable?

## Notes

### Representation and hardware access

Use `<cstdint>` fixed-width types only when width is part of the protocol or register contract. Use `std::size_t` for object sizes and indexing. Handle byte order explicitly with shifts, masks, or C++23 `std::byteswap`.

Memory-mapped registers require target-defined addresses, access widths, barriers, and semantics. `volatile` preserves observable accesses; it does not make compound operations atomic, order cores, or prevent data races. Isolate MMIO behind a small typed API. Test behavior against host-backed storage.

### Determinism

Prefer static storage, stack storage, `std::array`, fixed-capacity queues, and explicit pools where heap latency or fragmentation is unacceptable. Check every capacity boundary. Avoid hidden allocation in callbacks, type erasure, strings, and coroutine frames.

Zero-cost abstraction means no overhead compared with the correct hand-written alternative after optimization. Verify generated code and map files; do not assume templates are free because they can increase flash through duplication.

### Interrupts and concurrency

Keep ISRs bounded: acknowledge hardware, capture minimal data, signal deferred work. Avoid allocation, blocking locks, exceptions, logging, and unbounded loops. Shared state needs architecture-appropriate atomics or critical sections. Lock-free does not imply wait-free or ISR-safe. Confirm atomic operations are lock-free on the target.

### Toolchain and runtime policy

Exceptions and RTTI have code-size, metadata, and failure-path implications; choose policy per product and toolchain, not ideology. If disabled, APIs need explicit failure channels. Understand startup code, static initialization, linker sections, stack/heap placement, constructors before `main`, and the linker map.

Compile-time configuration catches invalid hardware combinations early. Keep board values at the boundary; keep parsing and state machines hardware-independent for Linux tests.

## Pitfalls

- `volatile bool ready` is not an inter-thread synchronization primitive.
- Packed structs can cause misaligned accesses and nonportable layouts.
- Static initialization order across translation units is unspecified.
- A fixed-capacity container still needs explicit full behavior.

## Exercises

1. Extend the fixed queue example with `front` and overflow counting.
2. Implement a register field encoder with masks and compile-time range checks.
3. Separate an ISR event capture function from deferred processing.
4. Inspect optimized assembly and a linker map for one template-heavy example.

## Summary

Embedded C++ succeeds through explicit timing, storage, representation, and failure policies. Isolate hardware, defer ISR work, verify code generation, and host-test pure logic.
