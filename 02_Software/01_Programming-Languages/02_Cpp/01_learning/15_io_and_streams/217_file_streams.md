# Cornell Notes

## Topic: File streams

## Cue Column

- Which stream types read and write files?
- How does RAII protect file handles?
- Why must every read or write be checked?

## Notes Section

`std::ifstream` reads, `std::ofstream` writes, and `std::fstream` does both. Their destructors close files automatically.

```cpp
std::ifstream input{"numbers.txt"};
if (!input) {
    std::cerr << "cannot open numbers.txt\n";
    return 1;
}

int value{};
while (input >> value) {
    std::cout << value << '\n';
}
if (!input.eof()) {
    std::cerr << "invalid file data\n";
    return 1;
}
```

Open modes combine with `|`: `std::ios::in`, `out`, `app`, `trunc`, `ate`, and `binary`. Text serialization is portable and inspectable. Raw binary object dumps are usually not portable because layout, padding, endianness, and type sizes may differ.

For durable data, write to a temporary file and replace the destination only after a successful close. A successful `open()` does not guarantee later writes succeed.

## Exercise

Write five integers to a text file, read them back, calculate their sum, and report malformed input.

## Summary

File streams provide RAII ownership, not automatic correctness. Validate opening, parsing, final stream state, and every operation whose failure could lose data.