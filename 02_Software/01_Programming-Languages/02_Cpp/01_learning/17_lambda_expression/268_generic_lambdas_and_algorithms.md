# Cornell Notes

## Topic: Generic lambdas and algorithms

## Cue Column

- How does `auto` make a lambda generic?
- Why are lambdas useful with standard algorithms?
- When should a lambda become a named function?

## Notes Section

Since C++14, `auto` parameters make the call operator a function template:

```cpp
auto greater = [](const auto &left, const auto &right) {
    return left > right;
};
```

C++20 permits an explicit template parameter list:

```cpp
auto first = []<typename T>(std::span<const T> values) -> const T & {
    return values.front();
};
```

Lambdas keep short policy close to an algorithm:

```cpp
std::erase_if(values, [limit](int value) { return value < limit; });
std::ranges::sort(values, std::greater{});
```

Use a named function when behavior is reused broadly, needs independent tests, or becomes hard to understand. Prefer an existing standard function object such as `std::less<>` over a lambda that merely repeats it.

Generic lambdas are templates; errors occur when instantiated with an unsupported argument. Add C++20 constraints when the accepted interface matters.

## Exercise

Sort records by descending priority, then remove records below a captured threshold using standard algorithms.

## Summary

Generic lambdas provide local template behavior. They work best as small algorithm policies; standard function objects or named functions win when they express intent more directly.