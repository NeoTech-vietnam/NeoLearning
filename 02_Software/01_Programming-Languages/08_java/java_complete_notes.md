# Java Complete Notes

Completed foundation notes, ordered for study. Individual lessons remain the source of truth.

## Table of contents

1. [Java platform and program structure](01_learning/01_java_platform_and_program_structure/01_java_platform_and_program_structure.md)
2. [Variables, types, and operators](01_learning/02_variables_types_and_operators/02_variables_types_and_operators.md)
3. [Arrays, strings, and input](01_learning/03_arrays_strings_and_input/03_arrays_strings_and_input.md)
4. [Control flow](01_learning/04_control_flow/04_control_flow.md)

## Foundation summary

### Java platform

- The JDK supplies development tools; the JVM executes bytecode.
- `javac Name.java` compiles source to `Name.class`.
- `java Name` launches the class containing `public static void main(String[] args)`.
- Public class name, filename, and case must match.
- Packages group types; imports shorten names.

### Variables and types

- Eight primitives: `byte`, `short`, `int`, `long`, `float`, `double`, `char`, `boolean`.
- Objects and arrays use references; `null` means no object.
- Local variables require definite assignment.
- Widening conversions are usually implicit; narrowing requires a cast.
- Integer division truncates. Integer overflow wraps unless exact arithmetic methods are used.
- Primitive `==` compares values. Reference `==` compares identity. `.equals` compares logical object values.

### Arrays, strings, and input

- Arrays have fixed length and runtime bounds checks.
- Array assignment aliases; `Arrays.copyOf` creates a shallow copy.
- `String` is immutable and uses `.equals` for content comparison.
- `StringBuilder` efficiently handles repeated text changes.
- Validate console input. Avoid careless mixing of `Scanner` token and line methods.

### Control flow

- Java conditions require `boolean` values.
- Use `if` for arbitrary conditions; switch expressions for discrete alternatives.
- Use indexed `for` when position or replacement matters; enhanced `for` for traversal.
- `while` may run zero times; `do-while` runs at least once.
- Verify loop initialization, condition, update, and boundary.

## Review checkpoint

Before module 05, be able to:

1. Compile and run a single Java source file.
2. Explain primitive values versus object references.
3. Predict conversions, integer division, and equality behavior.
4. Traverse and copy arrays safely.
5. Compare and build strings correctly.
6. Select and trace branch/loop structures.

For full theory, examples, mistakes, exercises, and references, follow each linked lesson.
