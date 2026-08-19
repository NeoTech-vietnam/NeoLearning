# Cornell Notes: Language Mastery

## Cues

- When does an object begin and end its lifetime?
- Why are value categories different from types?
- When do templates, concepts, or type erasure fit?
- Which low-level operations cause undefined behavior?

## Notes

### Lifetime and ownership

Storage duration controls how long storage exists; object lifetime controls when a typed object exists there. Prefer automatic storage and RAII. Follow the Rule of Zero: let members manage resources. Write all five special members only when directly owning a raw resource.

References do not extend lifetime except in narrowly defined temporary-binding cases. `std::string_view` and `std::span` never own their data.

### Value categories and forwarding

An lvalue identifies a persistent object. A prvalue initializes a result object. An xvalue identifies an expiring object. `std::move` is only a cast; moving occurs when a move operation consumes the result. In a forwarding template, preserve the caller's category with `std::forward<T>(value)`.

### Type deduction and templates

`auto` follows template deduction and usually drops top-level `const` and references. `decltype(auto)` preserves the declared expression category. Constrain generic interfaces with C++20 concepts; use specialization for genuine type-dependent behavior, not ordinary branching. Variadic templates plus folds replace recursive template boilerplate.

Type erasure (`std::function`, `std::any`, custom erased wrappers) trades static type information for runtime flexibility. Prefer templates when the set of operations is known and code-size impact is acceptable.

### Representation and program boundaries

`sizeof`, `alignof`, and `offsetof` describe representation constraints. Never assume padding bytes or use `reinterpret_cast` to violate alignment or aliasing. Inspect object representation through `std::byte`, `unsigned char`, or `std::bit_cast` when size and trivial-copy rules hold.

Undefined behavior permits the compiler to assume the forbidden case never occurs. Common sources: dangling access, out-of-bounds indexing, signed overflow, data races, invalid shifts, misalignment, and strict-aliasing violations.

The One Definition Rule governs definitions across translation units. `inline` permits equivalent definitions; it does not require inlining. ABI includes calling conventions, layout, name mangling, exception model, and standard-library compatibility.

## Pitfalls

- Returning `decltype(auto)` from a local expression can return a dangling reference.
- Moving from an object leaves it valid but generally unspecified.
- Perfect forwarding everywhere worsens APIs and diagnostics.
- Binary serialization by copying structs includes padding and is not portable.

## Exercises

1. Implement a move-only RAII handle, then replace it with a standard smart pointer plus custom deleter.
2. Constrain a generic `sum` to arithmetic types.
3. Demonstrate `auto`, `auto&`, and `decltype(auto)` deduction with `static_assert`.
4. Explain why two conflicting class definitions across translation units violate ODR.

## Summary

Advanced language use starts with lifetime, representation, and program-boundary correctness. Prefer Rule of Zero, constrained templates, explicit ownership, and defined byte-level operations.
