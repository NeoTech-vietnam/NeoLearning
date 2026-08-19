# Cornell Notes

## Topic: Lambda syntax and captures

## Cue Column

- What are the parts of a lambda expression?
- What is the difference between value and reference capture?
- When can a captured value be modified?

## Notes Section

A lambda creates an unnamed function object:

```cpp
[captures](parameters) mutable noexcept -> return_type {
    body
}
```

Only the capture list and body are required. Prefer explicit captures because ownership and lifetime remain visible.

```cpp
int offset{3};
auto add_offset = [offset](int value) { return value + offset; };
auto increment = [&offset] { ++offset; };
```

- `[x]`: copy `x` into the closure.
- `[&x]`: store access to `x`; `x` must outlive every call.
- `[x = expression]`: initialize a capture, including move-only values.
- `[this]`: capture the current object pointer; the object must outlive calls.
- `[*this]`: capture a copy of the current object since C++17.
- `mutable`: permit modification of value captures inside the closure.

Avoid returning or storing lambdas that reference local variables. A dangling reference remains undefined behavior even though the lambda object itself still exists.

## Exercise

Create a counter lambda with an initialized value capture. Each call returns the next number without changing external state.

## Summary

A lambda is an object carrying behavior plus optional state. Capture explicitly; choose value for ownership, reference only for a proven shorter lifetime.