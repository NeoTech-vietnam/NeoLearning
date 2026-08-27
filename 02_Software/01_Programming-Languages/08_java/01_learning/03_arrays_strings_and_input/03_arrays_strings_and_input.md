# Cornell Notes

## Topic: Arrays, strings, and console input

## Learning objectives

- Create, access, iterate, and copy arrays.
- Explain `String` immutability and compare strings safely.
- Build changing text efficiently with `StringBuilder`.
- Read and validate basic console input.

## Cue questions

- What does an array variable store?
- What happens after an invalid array index?
- Why does changing a `String` create another object?
- What input issue follows `nextInt()` before `nextLine()`?

## Theory

### 1. Arrays

An array is a fixed-length object containing elements of one type. Its index range is `0` through `length - 1`.

```java
int[] scores = {90, 85, 100};
int[] emptyScores = new int[3];

scores[1] = 88;
System.out.println(scores.length);
```

A new numeric array is filled with zero values; a boolean array with `false`; a reference array with `null`. Access outside the valid range throws `ArrayIndexOutOfBoundsException`.

Enhanced iteration reads each value:

```java
for (int score : scores) {
    System.out.println(score);
}
```

Use an indexed loop when changing elements or when the index matters.

### 2. Array references and copying

```java
int[] original = {1, 2, 3};
int[] alias = original;
alias[0] = 99; // original[0] is also 99

int[] copy = java.util.Arrays.copyOf(original, original.length);
```

Assignment copies the reference, not the array. `Arrays.copyOf` creates a separate shallow copy. For nested arrays, inner arrays remain shared unless copied too.

Useful `Arrays` methods include `sort`, `binarySearch`, `fill`, `equals`, `copyOf`, and `toString`.

### 3. Multidimensional arrays

Java represents a two-dimensional array as an array of array references:

```java
int[][] matrix = {
    {1, 2},
    {3, 4, 5}
};
```

Rows may have different lengths. Always use `matrix[row].length` for the selected row.

### 4. `String`

`String` is an immutable sequence of UTF-16 code units. Operations produce a new string rather than changing the existing value.

```java
String language = "Java";
String upper = language.toUpperCase();
System.out.println(language); // Java
System.out.println(upper);    // JAVA
```

Common methods:

- `length()`
- `charAt(index)`
- `substring(begin, end)`
- `contains(text)`
- `startsWith`, `endsWith`
- `indexOf`
- `toLowerCase`, `toUpperCase`
- `strip`
- `split`
- `equals`, `equalsIgnoreCase`

Use `.equals` for content comparison. `==` tests reference identity.

### 5. `StringBuilder`

Repeated concatenation in a loop creates many temporary strings. Use `StringBuilder` when text changes repeatedly:

```java
StringBuilder builder = new StringBuilder();
for (int i = 1; i <= 3; i++) {
    builder.append(i).append(' ');
}
String result = builder.toString();
```

For a few simple concatenations, `+` remains clearer and is usually appropriate.

### 6. Console input with `Scanner`

```java
import java.util.Scanner;

try (Scanner scanner = new Scanner(System.in)) {
    System.out.print("Age: ");
    if (scanner.hasNextInt()) {
        int age = scanner.nextInt();
        System.out.println("Age = " + age);
    } else {
        System.out.println("Expected an integer");
    }
}
```

`Scanner` token methods such as `nextInt()` leave the line separator unread. Calling `nextLine()` immediately afterward may return an empty remainder. A simple line-oriented strategy is `nextLine()` followed by `Integer.parseInt`, with `NumberFormatException` handling.

Closing a `Scanner` wrapping `System.in` closes standard input. This is fine for a short program that has finished reading, but shared applications should coordinate ownership.

## Common mistakes

- Using `array.length()` instead of the `array.length` field.
- Accessing index `array.length`.
- Assuming array assignment creates a copy.
- Comparing strings with `==`.
- Concatenating heavily inside a loop instead of using `StringBuilder`.
- Mixing token and line-based `Scanner` methods without consuming the remaining newline.

## C++ comparison

Java arrays know their length and check bounds at runtime. A bounds error throws an exception instead of producing undefined behavior. Java `String` is immutable; use `StringBuilder` for mutable text. Java arrays are objects referenced indirectly, not C-style contiguous values exposed through pointer arithmetic.

## Practice

1. Find the minimum and average of an integer array.
2. Copy an array, modify the copy, and prove the original is unchanged.
3. Reverse text using `StringBuilder`.
4. Read one complete line and parse a validated integer from it.
5. Traverse a ragged two-dimensional array.

## Summary

Arrays provide fixed-size, bounds-checked storage. Assignment aliases an array; copying requires an explicit operation. Strings are immutable and compared by `.equals`. `StringBuilder` handles repeated mutation. Console input must be validated and parsed deliberately.

## Example

[ArraysStringsInput.java](../../02_example/03_arrays_strings_and_input/ArraysStringsInput.java)

## References

- [JLS: Arrays](https://docs.oracle.com/javase/specs/jls/se21/html/jls-10.html)
- [String API](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/String.html)
- [Arrays API](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/Arrays.html)
- [Scanner API](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/Scanner.html)
