# Cornell Notes

## Topic: Stream states and formatting

## Cue Column

- What state flags can an I/O operation set?
- Why should input be validated before using a value?
- Which manipulators persist between output operations?

## Notes Section

C++ streams represent both a data channel and its current state. Check the stream itself after extraction:

```cpp
int value{};
if (std::cin >> value) {
    std::cout << "value: " << value << '\n';
}
```

State queries:

- `good()`: no error flags set.
- `eof()`: input reached end-of-file.
- `fail()`: formatted extraction failed or `failbit` is set.
- `bad()`: unrecoverable device or buffer error.
- `clear()`: reset state flags before another operation.
- `ignore()`: discard unwanted buffered characters.

After invalid interactive input:

```cpp
std::cin.clear();
std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n');
```

Formatting from `<iomanip>` includes `std::boolalpha`, `std::fixed`, `std::setprecision`, `std::setw`, and `std::setfill`. `std::setw` affects only the next field; many other flags persist.

Avoid `std::endl` unless a flush is required. `\n` writes a newline without forcing an expensive flush.

## Exercise

Read an integer repeatedly until input succeeds. Print it right-aligned in a six-character field.

## Summary

Treat extraction as an operation that can fail. Inspect or test stream state, recover deliberately, and use manipulators only for presentation.