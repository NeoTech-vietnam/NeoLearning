# Cornell Notes

## Topic: Conditions, switch, and loops

## Learning objectives

- Select branches using `if` and `switch`.
- Repeat work using `for`, enhanced `for`, `while`, and `do-while`.
- Use `break` and `continue` without hiding program flow.
- Choose the simplest control structure for a task.

## Cue questions

- When should `switch` replace an `if` chain?
- What differs between `while` and `do-while`?
- When is an enhanced `for` loop insufficient?
- How do modern switch expressions avoid fall-through?

## Theory

### 1. `if`, `else if`, and `else`

Java conditions must be `boolean` expressions.

```java
if (temperature > 80) {
    System.out.println("Hot");
} else if (temperature < 10) {
    System.out.println("Cold");
} else {
    System.out.println("Normal");
}
```

Unlike C++, integer values cannot stand in for booleans. Always use braces, including for one statement; braces prevent mistakes during later edits.

### 2. Conditional expression

Use the ternary operator for one small value choice:

```java
String parity = number % 2 == 0 ? "even" : "odd";
```

Do not nest ternary expressions when an `if` statement would be clearer.

### 3. `switch`

A switch expression selects and returns a value without accidental fall-through:

```java
String kind = switch (day) {
    case SATURDAY, SUNDAY -> "weekend";
    default -> "weekday";
};
```

A block case uses `yield`:

```java
int score = switch (grade) {
    case 'A' -> 4;
    case 'B' -> 3;
    case 'C' -> 2;
    default -> {
        System.out.println("Unrecognized grade");
        yield 0;
    }
};
```

Traditional `case:` statement syntax remains available and can fall through unless stopped with `break`. Prefer arrow cases for new code when supported by the chosen JDK.

### 4. `for` loop

```java
for (int i = 0; i < values.length; i++) {
    values[i] *= 2;
}
```

Use indexed `for` when the index is needed or array elements must be replaced.

### 5. Enhanced `for`

```java
for (int value : values) {
    System.out.println(value);
}
```

The loop variable receives each value. Assigning to it does not replace an array element:

```java
for (int value : values) {
    value = 0; // values remains unchanged
}
```

### 6. `while` and `do-while`

```java
while (condition) {
    work();
}

do {
    work();
} while (condition);
```

`while` checks before the body and may execute zero times. `do-while` checks afterward and executes at least once.

### 7. `break` and `continue`

- `break` exits the nearest loop or switch statement.
- `continue` skips to the next loop iteration.

```java
for (int value : values) {
    if (value < 0) {
        continue;
    }
    if (value == target) {
        break;
    }
}
```

Labeled `break` and `continue` can target an outer loop, but extracting a method often produces clearer code.

### 8. Loop safety

A loop needs a changing state that approaches termination. Check:

1. Initial state
2. Continuation condition
3. State update
4. Boundary cases

For array traversal, the usual safe condition is `i < array.length`, not `i <= array.length`.

## Common mistakes

- Writing `if (number)` instead of a boolean condition.
- Using `=` where `==` was intended.
- Writing `i <= array.length`.
- Forgetting the state update in a `while` loop.
- Expecting enhanced `for` assignment to modify primitive array elements.
- Forgetting `break` in a traditional switch statement.
- Adding a stray semicolon after `if`, `for`, or `while`.

## C++ comparison

Java does not convert integers or references to booleans in conditions. Modern Java switch expressions can return values and use arrow cases without fall-through. Enhanced `for` resembles C++ range-based `for`, but the loop variable receives a copied primitive value or copied object reference.

## Practice

1. Implement FizzBuzz from 1 through 100.
2. Find the first negative number in an array.
3. Build a multiplication table with nested loops.
4. Convert a numeric month to its season using a switch expression.
5. Rewrite one `for` loop as `while`; identify which form is clearer.

## Summary

Use `if` for arbitrary boolean decisions and `switch` for discrete alternatives. Use indexed `for` when position matters, enhanced `for` for simple traversal, `while` for condition-driven repetition, and `do-while` when one execution is mandatory. Keep termination and boundaries explicit.

## Example

[ControlFlow.java](../../02_example/04_control_flow/ControlFlow.java)

## References

- [JLS: Statements](https://docs.oracle.com/javase/specs/jls/se21/html/jls-14.html)
- [Java switch expressions](https://docs.oracle.com/en/java/javase/21/language/switch-expressions.html)
