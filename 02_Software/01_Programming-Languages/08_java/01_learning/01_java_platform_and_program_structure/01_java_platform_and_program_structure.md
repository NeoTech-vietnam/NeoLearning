# Cornell Notes

## Topic: Java platform and program structure

## Learning objectives

- Distinguish the JDK, JVM, and Java runtime.
- Explain source compilation and bytecode execution.
- Write, compile, and run a minimal Java program.
- Recognize classes, methods, statements, packages, and imports.

## Cue questions

- Why can Java bytecode run on different operating systems?
- What does `javac` produce?
- Why must `main` have its exact signature?
- When are packages and imports needed?

## Theory

### 1. JDK, JVM, and runtime

The **Java Virtual Machine (JVM)** loads, verifies, and executes Java bytecode. A Java runtime contains the JVM and standard libraries needed to run programs. The **Java Development Kit (JDK)** adds development tools such as `javac`, `java`, `javadoc`, and `jar`.

Use a JDK for learning because compiling requires `javac`.

```text
HelloJava.java --javac--> HelloJava.class --JVM--> machine execution
```

Source code is platform-independent only after compilation to JVM bytecode. A compatible JVM supplies the platform-specific implementation.

### 2. Minimal program

```java
public class HelloJava {
    public static void main(String[] args) {
        System.out.println("Hello, Java!");
    }
}
```

- `public class HelloJava` declares a class visible from other code.
- `main` is the conventional application entry point.
- `public` lets the launcher access it.
- `static` lets the JVM invoke it without constructing `HelloJava`.
- `void` means it returns no value.
- `String[] args` receives command-line arguments.
- A statement normally ends with `;`.
- Braces delimit class and method bodies.

A public top-level class named `HelloJava` belongs in `HelloJava.java`.

### 3. Compile and run

```bash
javac HelloJava.java
java HelloJava
```

`javac` creates `HelloJava.class`. `java` receives a class name, not `HelloJava.class` or a source path in the basic workflow.

Command-line arguments follow the class name:

```bash
java HelloJava first second
```

Then `args[0]` is `"first"` and `args[1]` is `"second"`.

### 4. Comments and naming

```java
// One line
/* Multiple lines */
/** Documentation comment for Javadoc. */
```

Conventions:

- Classes: `UpperCamelCase`
- Methods and variables: `lowerCamelCase`
- Constants: `UPPER_SNAKE_CASE`
- Packages: lowercase reverse-domain names, such as `com.example.sensor`

Java identifiers are case-sensitive. `count` and `Count` differ.

### 5. Packages and imports

A package groups related types and prevents naming collisions:

```java
package com.example.app;

import java.time.LocalDate;
```

The package declaration, when present, is first except for comments. Imports allow short type names; they do not copy code. `java.lang` types such as `String` and `System` are imported automatically.

Beginner single-file examples use the unnamed package. Real multi-file applications should use named packages.

## Common mistakes

- Installing only a runtime: `java` exists but `javac` does not.
- Naming the file differently from its public class.
- Running `java HelloJava.class` instead of `java HelloJava`.
- Writing `Main` and `main` interchangeably.
- Adding a semicolon after a class or method header.

## C++ comparison

Java compiles to JVM bytecode rather than directly to a native executable in the normal workflow. Java has no preprocessor `#include`; `import` only resolves names. `main` belongs to a class and returns `void`.

## Practice

1. Explain the JDK/JVM difference without notes.
2. Print every value in `args`.
3. Intentionally mismatch the filename and public class name; interpret the compiler error.
4. Add a second static method and call it from `main`.

## Summary

The JDK compiles Java source into bytecode. A JVM executes that bytecode. Every application starts from a class containing the required `main` method. Filenames, public class names, and case must agree.

## Example

[HelloJava.java](../../02_example/01_java_platform_and_program_structure/HelloJava.java)

## References

- [Getting Started with Java](https://dev.java/learn/getting-started/)
- [JLS: Compilation Units](https://docs.oracle.com/javase/specs/jls/se21/html/jls-7.html)
- [Java launcher](https://docs.oracle.com/en/java/javase/21/docs/specs/man/java.html)
- [Java compiler](https://docs.oracle.com/en/java/javase/21/docs/specs/man/javac.html)
