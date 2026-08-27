# Java Learning Path

Core Java curriculum from first program through JVM and concurrency. Theory follows Cornell notes. Examples use only the Java standard library.

> Environment check on 2026-08-26 found no `javac` on `PATH`. Install an LTS JDK before running examples. Java 21 LTS is the recommended baseline.

## Quick start

```bash
javac HelloJava.java
java HelloJava
```

The public class name, source filename, and launch name must match.

## Study workflow

1. Read one lesson in `01_learning/`.
2. Predict the matching program output.
3. Compile and run the program in `02_example/`.
4. Change the program and explain the result.
5. Complete the module practice tasks before continuing.

## Curriculum

### Foundation — complete

- [x] [01 Java platform and program structure](01_learning/01_java_platform_and_program_structure/01_java_platform_and_program_structure.md)
- [x] [02 Variables, types, and operators](01_learning/02_variables_types_and_operators/02_variables_types_and_operators.md)
- [x] [03 Arrays, strings, and input](01_learning/03_arrays_strings_and_input/03_arrays_strings_and_input.md)
- [x] [04 Control flow](01_learning/04_control_flow/04_control_flow.md)

### Core and advanced — planned

- [ ] 05 Methods
- [ ] 06 Classes and objects
- [ ] 07 Inheritance, interfaces, and polymorphism
- [ ] 08 Exceptions
- [ ] 09 Generics
- [ ] 10 Collections
- [ ] 11 Functional Java and streams
- [ ] 12 I/O, files, and serialization
- [ ] 13 Date/time and utilities
- [ ] 14 Concurrency
- [ ] 15 JVM memory and performance
- [ ] 16 Modules, packaging, and Javadoc

## Combined notes

Completed modules are collected in [java_complete_notes.md](java_complete_notes.md). Individual lesson files remain the source of truth.

## Resources

- [Dev.java Learn](https://dev.java/learn/)
- [Java Language Specification](https://docs.oracle.com/javase/specs/)
- [Java SE API](https://docs.oracle.com/en/java/javase/)
- [OpenJDK](https://openjdk.org/)

## Scope

Spring, REST, JDBC, Maven, Gradle, and JUnit are deferred. Learn the language and standard library first.
