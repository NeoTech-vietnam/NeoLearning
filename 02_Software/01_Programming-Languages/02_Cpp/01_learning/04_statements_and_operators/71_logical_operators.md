# Cornell Notes

## Topic: Logical Operators

## Date: 21/04/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

#### Logical Operators Overview

| Opperator | Description |
| --------- | ----------- |
| not `!`   | Negation    |
| and `&&`  | logical AND |
| or        | logical OR  |

#### Not Operator (`!`)
```cpp
!expr
```
- Evaluates to `true` if `expr` is `false`, and vice versa.

| Expression `a` | Not a `!a` |
| -------------- | ---------- |
| true           | false      |
| false          | true       |

#### AND (`&&`) Operator
```cpp
expr1 && expr2
```
| Expression `a` | Expression `b` | `a` and `b` (`a && b`) |
| -------------- | -------------- | ----------------------- |
| true           | true           | true                    |
| true           | false          | false                   |
| false          | true           | false                   |
| false          | false          | false                   |

#### OR Operator
```cpp
expr1 or expr2
```
| Expression `a` | Expression `b` | `a` or `b` (`a or b`) |
| -------------- | -------------- | ---------------------- |
| true           | true           | true                   |
| true           | false          | true                   |
| false          | true           | true                   |
| false          | false          | false                  |

#### Precedence of Logical Operators
1. `!` (not)
2. `&&` (and)
3. `or` (or)
- Not `!` is a unary operator and has the highest precedence, followed by `&&` and then `or`, which are binary operators. Parentheses can be used to override the default precedence.

#### Short-Circuit Evaluation
- When evaluating a logical expression C++ stops as soon as the result is known.

```cpp
expr1 && expr2 && expr3
expr1 || expr2 || expr3
```




---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]