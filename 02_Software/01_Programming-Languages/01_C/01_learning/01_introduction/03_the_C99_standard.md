# Section 1: Introduction

## Topic: The C99 Standard

## Date: 13/10/2025

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

**1. Overview**
- We have already discussed some concepts of the C programming language (beginner class) that were included in the C99 standard
  - `bool` data type – `stdbool.h` (added `true/false` keywords)
  - Variable length arrays
  - Single line comments
- However, we have mainly focused on the C89 standard in the beginnerclass
- some concepts in this class will include functionality from the C99 standard

**2. History**

- **C99** is a **revised standard** for the C programming language
  - Refines and expands the capabilities of Standard C
- C99 has not been widely adopted
  - Not all popular C compilers support it
  - Of the compilers that do offer C99 support, most support only a subset of the language
- So, we do not focus on many of the additions added for C99
  - This is why the focus is mainly on C89
  - C89 is almost universally supported

**3. New features added that we will use**
- Macros with a variable number of arguments
- C99 allows the use of sophisticated numbers (complex.h)
  - **_Complex**
    - Used to declare complex floating type variables to store mathematical complex numbers
  - **_Imaginary**
    - Declare imaginary floating type variables store mathematical imaginary numbers
- **Designated initializers**
  - Allow you to initialize the elements of an `array`, `union`, or `struct` explicitly by subscript or name
- **Restricted pointers**
  - A type qualifier that can be used only for pointers
- **New comment techniques**
  - C99 allows to put comment using a double front slash (//)
- **Inline functions**
  - Supplies a hint for the compiler to perform optimizations
- **Variable length arrays**
  - Array dimension has to be declared in **C89**
  - **C99** permits declaration of array dimensions using integer variables or any valid integer expressions
- **Flexible array members**
  - allows us to declare an array of unspecified length as the last member of a struct
- **Declaration of variables**
  - It is now legal to declare variables it at any point of the program within the
curly braces of main() function
- **Very obvious in loops**
  - Required in C89 (all variables be declared at the start of a block)
```c
int i;
for (i = 0; i < 10, i++)
```
- New in C99 (variable can be declared anywhere)
```c
for (int i = 0; i < 10; i++)
```

---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]
