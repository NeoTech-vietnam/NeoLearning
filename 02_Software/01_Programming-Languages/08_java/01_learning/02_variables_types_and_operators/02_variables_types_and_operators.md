# Cornell Notes

## Topic: Variables, types, scope, conversions, and operators

## Learning objectives

- Use Java's primitive and reference types correctly.
- Declare variables and constants with suitable scope.
- Predict numeric conversion and operator results.
- Distinguish identity from value equality.

## Cue questions

- Which Java values are primitives?
- Why are local variables not automatically initialized?
- When is a cast required?
- Why is `==` usually wrong for strings?

## Theory

### 1. Variables and initialization

```java
int count = 3;
String label = "sensor";
final double PI = 3.141592653589793;
```

A declaration gives a variable a static type. Local variables must be definitely assigned before use. Fields receive defaults such as `0`, `false`, or `null`, but relying on implicit defaults often hides intent. `final` permits one assignment; the referenced object may still be mutable.

Prefer the narrowest useful scope. A local variable should not become a field merely to make it accessible elsewhere.

### 2. Primitive types

| Type | Meaning | Size/value notes |
|---|---|---|
| `byte` | signed integer | 8-bit |
| `short` | signed integer | 16-bit |
| `int` | signed integer | 32-bit |
| `long` | signed integer | 64-bit; suffix `L` for large literals |
| `float` | IEEE 754 floating point | 32-bit; suffix `F` |
| `double` | IEEE 754 floating point | 64-bit; default decimal type |
| `char` | UTF-16 code unit | 16-bit unsigned; not a full Unicode character in every case |
| `boolean` | logical value | `true` or `false` |

Java fixes primitive ranges across platforms. Unsigned arithmetic support is limited to utility methods; integer primitives themselves are signed except `char`.

### 3. Reference types and `null`

Classes, interfaces, arrays, records, and enums define reference types. A reference identifies an object or contains `null`.

```java
String name = new String("Ada");
String absent = null;
```

Dereferencing `null`, such as `absent.length()`, throws `NullPointerException`.

### 4. Literals and readable numbers

```java
int decimal = 1_000_000;
int hex = 0xFF;
int binary = 0b1010;
long distance = 9_000_000_000L;
double ratio = 2.5;
float sample = 2.5F;
char letter = 'A';
String text = "A";
```

Single quotes form a `char`; double quotes form a `String`.

### 5. Conversion and promotion

A widening conversion is normally implicit:

```java
int count = 42;
long wider = count;
double measured = wider;
```

A narrowing conversion requires an explicit cast and can lose data:

```java
double value = 12.9;
int truncated = (int) value; // 12
```

Arithmetic on `byte`, `short`, and `char` values usually promotes them to `int`. Integer division discards the fractional part:

```java
int a = 7 / 2;       // 3
double b = 7 / 2.0;  // 3.5
```

Overflow wraps for ordinary integer operations; Java does not report it automatically. Use `Math.addExact` and related methods when overflow must fail visibly.

### 6. Operators

- Arithmetic: `+ - * / %`
- Assignment: `= += -= *= /= %=`
- Comparison: `== != < <= > >=`
- Logical short-circuit: `&& || !`
- Bitwise: `& | ^ ~`
- Shift: `<< >> >>>`
- Conditional: `condition ? first : second`
- Increment/decrement: `++ --`

`&&` and `||` skip the right operand when the result is already known. This supports guarded access:

```java
if (name != null && !name.isEmpty()) {
    System.out.println(name);
}
```

### 7. Equality

For primitives, `==` compares values. For references, `==` compares whether both references identify the same object. `.equals` usually compares logical values.

```java
String first = new String("Java");
String second = new String("Java");

System.out.println(first == second);      // false
System.out.println(first.equals(second)); // true
```

Use `Objects.equals(first, second)` when either reference may be `null`.

## Common mistakes

- Assuming a local variable has a default value.
- Using `int` for a literal outside its range without `L`.
- Expecting `7 / 2` to produce `3.5`.
- Comparing strings using `==`.
- Believing `final List<?>` makes the list contents immutable.
- Casting without checking whether truncation or overflow is acceptable.

## C++ comparison

Java primitive sizes are fixed. `boolean` is not an integer. Java references are not C++ references and cannot perform pointer arithmetic. Java has no unsigned primitive family comparable to C++'s. Objects are normally accessed through references and reclaimed by garbage collection.

## Practice

1. Predict results for integer and floating-point division.
2. Demonstrate one narrowing conversion that loses data.
3. Compare two equal strings using both `==` and `.equals`.
4. Use `Math.addExact(Integer.MAX_VALUE, 1)` and inspect the exception.

## Summary

Java separates primitive values from object references. Local variables require definite assignment. Widening is usually automatic; narrowing requires a cast. Numeric promotion affects expression types. Use `.equals`, not `==`, for object value equality.

## Example

[TypesAndOperators.java](../../02_example/02_variables_types_and_operators/TypesAndOperators.java)

## References

- [JLS: Types, Values, and Variables](https://docs.oracle.com/javase/specs/jls/se21/html/jls-4.html)
- [JLS: Conversions](https://docs.oracle.com/javase/specs/jls/se21/html/jls-5.html)
- [JLS: Operators](https://docs.oracle.com/javase/specs/jls/se21/html/jls-15.html)
