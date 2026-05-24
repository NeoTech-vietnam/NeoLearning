# Section 7: Type Qualifiers

## Topic: Const

## Date: 04/11/2025

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

**1. Overview**
- Type qualifiers can be used in front of variables to give the compiler more information about the intended use of the
variable
  - Helps with optimization
- We will discuss the const, volatile, and restrict type qualifiers in the upcoming lectures
- C90 added two new type qualifiers
  - Constancy and volatility
- These properties are declared with the keywords const and volatile, which create qualified types
- The C99 standard added a third qualifier
  - Restrict
    - Designed to facilitate compiler optimizations
- Type qualifiers are also Idempotent (added in C99)
  - Means that you can use the same qualifier more than once in a declaration, and the superfluous ones are ignored

**2. Const**
- The compiler allows you to associate the const qualifier with variables whose values will not be changed by the program
  - You can tell the compiler that the specified variables have a constant value throughout the program’s execution
- If you try to assign a value to a const variable after initializing it
  - The compiler might issue an error message, although it is not required to do so
- One of the motivations for the const attribute in the language is that it allows the compiler to place your const variables into read-only memory

**3. const vs. define**
- `#define` is pre-processor directive while `const` is a keyword
- `const` variables are actual variables like any other normal variable
  - We can pass them around, typecast them and any other thing that can be done with a normal variable
- `#define` is not scope controlled whereas `const` is scope controlled
  - `#define` can be used in anywhere in the program or in other files to by including the related header file
  - A constant can be declared inside a function (function/scope)
- Another advantage of using a `const` over a #define macro is that a `const` variable provides for type checking by the compiler
- we have also discussed situations when #define cannot be replaced by `const`

--- 

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]
