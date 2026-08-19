# C++

C++ learning path from language fundamentals through modern, embedded, and production C++. Lessons use Cornell notes; runnable code lives under [`02_example/`](02_example/).

## Prerequisites

- Basic programming and command-line usage
- A C++20 compiler (`g++` or `clang++`)
- Later embedded topics: basic computer architecture and microcontroller knowledge

## Compile baseline

```bash
g++ -std=c++20 -Wall -Wextra -Wpedantic example.cpp -o example
./example
```

Use the standard declared by a lesson when it differs. Board-specific firmware belongs in the [`Examples/`](../../../../Examples/) submodule.

## Learning path

### Fundamentals

1. [Structure of a C++ program](01_learning/01_structure_of_a_cpp_program/)
2. [Variables and constants](01_learning/02_variables_and_constants/)
3. [Arrays and vectors](01_learning/03_arrays_and_vectors/)
4. [Statements and operators](01_learning/04_statements_and_operators/)
5. [Controlling program flow](01_learning/05_controlling_program_flow/)
6. [Characters and strings](01_learning/06_characters_and_strings/)
7. [Functions](01_learning/07_functions/)
8. [Pointers and references](01_learning/08_pointers_and_references/)

### Object-oriented C++

9. [Classes and objects](01_learning/09_oop_classes_and_objects/)
10. [Operator overloading](01_learning/10_operator_overloading/)
11. [Inheritance](01_learning/11_inheritance/)
12. [Polymorphism](01_learning/12_polymorphism/)
13. [Smart pointers and RAII](01_learning/13_smart_pointers/)
14. [Exception handling](01_learning/14_exception_handling/)

### Standard library and functional features

15. [I/O and streams](01_learning/15_io_and_streams/)
16. [Standard Template Library](01_learning/16_the_standard_template_library/)
17. [Lambda expressions](01_learning/17_lambda_expression/)
18. [Advanced C++](01_learning/18_advanced_cpp/)

## Study workflow

1. Read the section overview and lesson note.
2. Compile the matching example with strict warnings.
3. Complete the exercise without copying the example.
4. Compare behavior, then record mistakes in the lesson summary.

[`cpp_complete_notes.md`](cpp_complete_notes.md) aggregates the individual lessons for continuous reading. Individual files remain the source of truth.

## Curriculum status

| Area | Status |
| --- | --- |
| Sections 1–14 | Content present; placeholder cleanup in progress |
| Section 15 | Stream lessons and examples present |
| Section 16 | Content and examples present |
| Section 17 | Lambda lessons and examples present |
| Section 18 | Four advanced modules and runnable examples present |
| Complete-notes aggregation | Currently incomplete; regeneration planned |

## Resources

- [C++ For Beginners](03_resources/LPA-Beginning-C++-Programming-From-Beginner-to-Beyond-SEP2024.pdf)
- [C++ reference](https://en.cppreference.com/)
- [C++ Core Guidelines](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines)
- [Compiler Explorer](https://godbolt.org/)
- [CMake documentation](https://cmake.org/documentation/)
