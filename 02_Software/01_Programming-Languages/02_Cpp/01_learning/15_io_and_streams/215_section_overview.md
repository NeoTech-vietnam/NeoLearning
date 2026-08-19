# Cornell Notes

## Topic: I/O and Streams Overview

## Date: 12/06/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- How do streams represent data flow and errors?
- Which stream type fits console, file, or string I/O?
- What must be checked to prevent invalid input or data loss?

---

### Notes Section (Main Notes)

#### I/O and Streams

A stream exposes sequential input or output through a common interface. This section covers:

1. [Stream states and formatting](216_stream_states_and_formatting.md): formatted I/O, error flags, recovery, and manipulators.
2. [File streams](217_file_streams.md): RAII file ownership, open modes, text/binary concerns, and failure checks.
3. [String streams](218_string_streams.md): in-memory parsing and formatting with full-input validation.

Use `std::cin`, `std::cout`, and `std::cerr` for console I/O; file streams for files; string streams when formatted parsing or formatting must operate on strings. Always test operations that can fail.

---

### Summary Section (Summary of Notes)

Streams unify console, file, and string I/O. Correct code selects the narrowest stream type, validates state after operations, and relies on RAII for resource cleanup.