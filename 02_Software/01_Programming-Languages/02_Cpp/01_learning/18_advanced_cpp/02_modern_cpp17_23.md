# Cornell Notes: Modern C++17–23

## Cues

- Which vocabulary type communicates absence, alternatives, or a view?
- What work belongs at compile time?
- Why are ranges views lifetime-sensitive?
- Which features require C++23 or incomplete toolchain support?

## Notes

### Vocabulary types

- `std::optional<T>`: zero or one owned `T`.
- `std::variant<Ts...>`: one value from a closed set; inspect with `std::visit`.
- `std::any`: runtime type from an open set; use sparingly.
- `std::span<T>`: non-owning contiguous sequence.
- `std::string_view`: non-owning character sequence.

Views must not outlive their source. Prefer `optional` or `expected` over sentinel values when absence or failure needs explicit representation.

### Language and library evolution

C++17 adds structured bindings, `if constexpr`, fold expressions, filesystem, and the main vocabulary types. C++20 adds concepts, ranges, `std::span`, designated initialization with declaration order, `std::format` where implemented, and expanded `constexpr`. `consteval` requires compile-time evaluation; `constinit` guarantees static initialization without making the object immutable.

C++20 ranges compose algorithms with projections and lazy views. A view may reference its input; materialize results when ownership or repeated traversal is required.

C++23 adds `std::expected`, more ranges facilities, and broader library `constexpr` support. Check feature-test macros and compiler support rather than assuming a language mode provides every library feature.

### Large features

Modules address textual inclusion and isolation but remain toolchain/build-system sensitive. Coroutines provide suspension machinery, not a scheduler, executor, or allocation policy. Learn their generated state and lifetime before using them in constrained systems.

`std::filesystem` and formatting are hosted facilities. Embedded targets may need narrow wrappers or compile-time formatting alternatives.

## Pitfalls

- A `string_view` into a temporary string dangles.
- A lazy view can retain references to destroyed state.
- `std::any` hides interfaces and moves errors to runtime.
- `std::format` availability depends on the standard library version.

## Exercises

1. Parse a configuration value into `std::optional<int>` without a sentinel.
2. Model three message kinds with `std::variant` and an overloaded visitor.
3. Filter and transform integers with ranges; then copy into an owning vector.
4. Gate a C++23 `std::expected` implementation with `__cpp_lib_expected`.

## Summary

Modern C++ provides precise vocabulary and safer generic composition. Select by semantics, preserve view lifetimes, and verify compiler-library support for new features.
