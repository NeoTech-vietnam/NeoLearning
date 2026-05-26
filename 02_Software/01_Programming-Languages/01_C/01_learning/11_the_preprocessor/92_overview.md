# Section 13: The Preprocessor

## Topic: Overview

## Date: 04/12/2025

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

**1. Overview**
- the process of creating a C program involves many different steps
  - preprocessor
  - compilation
  - assembler
  - linker
  - loader
- a program called the preprocessor is invoked before any code gets compiled in the C programming language
  - a separate step in the compilation process
  - not part of the compiler
- the C Preprocessor is essentially a text substitution tool
  - instructs the compiler to do required pre-processing before the actual compilation
- the C preprocessor mainly performs three tasks on your code

**removes all the comments**
- a comment is written only for other engineers who need to understand your code
  - it is of no use to a machine
- the preprocessor removes all comments as they are not required in the execution of the program

**includes all of the files from various libraries that the program needs to compile**
- `#include` directive (includes the contents of the library file specified)

**expansion of macro definitions**
- we will discuss macros in the next section
  - small functions that do not contain as much overhead to process as a regular function

**2. Preprocessor Directives**
- commands used by the preprocessor are called preprocessor directives and they begin with **“#”** symbol
  - must be the first nonblank character
  - should begin in the first column
- we have already learned some of them
  - `#define` (simplest form) and `#include`
- in the upcoming lectures, we will learn about more of them
  - conditional compilation commands
    - `#ifdef`, `#ifndef`, `#if`, `#elif`, `#else`, `#endif`
  - other directives
    - `#undef`, `#pragma`, and `#error`

**3. Preprocessor operators**
- the preprocessor offers operators which can help in creation of macros
  - we will discuss macros in our next section
- these operators are used in the context of the #define directive
- we will learn about the following operators in the next section
  - continuation operator (\)
  - concatenation operators
    - (#) when used within a macro definition, converts a macro parameter into a string
    constant
    - (##) within a macro definition combines two arguments
      - permits two separate tokens in the definition to be joined into a single token
  - `defined()`
    - simplifies the writing of compound expressions in certain macro directives


---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]
