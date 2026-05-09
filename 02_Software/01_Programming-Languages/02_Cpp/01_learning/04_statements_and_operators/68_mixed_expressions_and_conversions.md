# Cornell Notes

## Topic: Mixed Expressions and Conversions

## Date: 18/04/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

#### Mixed Types Expressions
- C++ operations occur on same type operands
- If operands are of different types, C++ will convert one
- Important! since it could affect calculation results
- C++ will attempt to automatically convert types (coercion).
  - If it can’t, a compiler error will occur

#### Conversions
- Higher vs. Lower types are based on the size of the values the type can hold
  - `long double`,`double`,`float`,`unsigned long`,`long`,`unsigned int`,`int`,`unsigned short`,`short`,`char`
  - `short` and `char` types are always converted to `int` or `unsigned int` before any other conversions are performed.
- **Type Coercion**: conversion of one operand to another data type
- **Promotion**: conversion to a higher type
  - Used in mathematical expressions
- **Demotion**: conversion to a lower type
  - Used with assignment to lower type

#### Examples
![alt text](image-2.png)

#### Explicit Type Casting – `static_cast<type>`
![alt text](image-3.png)

---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]