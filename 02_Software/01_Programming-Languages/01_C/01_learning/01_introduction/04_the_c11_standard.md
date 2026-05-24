# Section 1: Introduction

## Topic: The C11 Standard

## Date: 13/10/2025

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

**1. Overview**

- We have not really focused on any **C11** concepts up to this point
- Features added to **C11** were for more advanced concepts
  - Multithreading support
  - Safer standard libraries
  - Better compliance with other industry standards
- The standard also attempts to fix some issues presented in **C99**
  - Some mandatory features are optional (variable length arrays and complex types)
- Also focuses on better compatibility with C++ as much as possible
- I want it to be clear that we may touch on some concepts from **C11** in this class, but, it will be minimal.
- **C11** standardizes many features that have already been available in common contemporary implementations
- Defines a memory model that better suits multithreading
- Fixes problems with the C99 standard
  - Some of its mandatory features proved difficult to implement in some platforms
  - Politics also played a role
    - Cooperation between the C and C++ standards committees in the late 1990s was lacking,
  - Design mistakes of **C99** were avoided in **C11**
- Focuses on security (such as the string manipulation functions and input/output )
  - A new set of safer standard functions that aim to replace the traditional unsafe functions
    - Bounds checking functions
      - That begin or end with `_s` (`strcat_s`, `strcpy_s`, etc)
  - Removal of the `gets` function
  - Optional to the standard (will not focus on due to most compilers not supporting)

**2. Topics we will address in this**
- Support for anonymous structs and unions
  - Has neither a `tag` name nor a `typedef` name
  - Useful when `unions` and structures are nested
- **Static assertions**
  - Evaluated during translation at a later phase than `#if` and `#error`
  - Let you catch errors that are impossible to detect during the preprocessing phase
- **No-return functions**
  - Declares a function that does not return
  - Suppresses compiler warnings on a function that doesn't return
  - Enables certain optimizations that are allowed only on functions that don't return

**3. Multithreading**
- The biggest change in **C11** is its standardized multithreading support
- C has supported multithreading for decades
  - However, all of the popular C threading libraries have thus far been non-standard extensions, and hence non-portable
- The new **C11** header file `<threads.h>`
  - Declares functions for creating and managing threads, mutexes, condition variables
- However, it is widely not supported on windows and thus we will be learning about `<pthread.h>` instead (posix compliant)


---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]
