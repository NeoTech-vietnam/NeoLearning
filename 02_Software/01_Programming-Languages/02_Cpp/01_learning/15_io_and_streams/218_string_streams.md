# Cornell Notes

## Topic: String streams

## Cue Column

- When is `std::istringstream` useful?
- How can parsing reject trailing garbage?
- What does `std::ostringstream` provide?

## Notes Section

String streams apply formatted stream operations to an in-memory string:

- `std::istringstream`: parse text.
- `std::ostringstream`: build text.
- `std::stringstream`: read and write.

```cpp
std::optional<int> parse_int(std::string_view text) {
    std::istringstream input{std::string{text}};
    int value{};
    input >> value;
    input >> std::ws;
    return input && input.eof() ? std::optional{value} : std::nullopt;
}
```

Checking `eof()` after consuming whitespace rejects inputs such as `"42xyz"`. For simple numeric conversion in performance-sensitive code, `std::from_chars` avoids locale and allocation overhead.

`std::ostringstream` is useful when stream formatting is required. Prefer direct string operations when no formatting is needed.

## Exercise

Parse `"sensor=17"` into a key and integer. Reject missing separators, empty keys, non-numeric values, and trailing characters.

## Summary

String streams reuse familiar formatted I/O for parsing and formatting. Check full consumption; use `std::from_chars` for lean numeric parsing.