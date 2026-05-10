# Section 7: Type Qualifiers

## Topic: Volatile

## Date: 04/11/2025

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

**1. Overview**
- The restrict type qualifier is an optimization hint for the compiler
  - The compiler can choose to ignore it
- Used in pointer declarations as a type qualifier for pointers
  - Tells the compiler that a particular pointer is the only reference to the value it points to throughout its scope
    - The same value is not referenced by any other pointer or variable within that scope
    - The pointer is the sole initial means of accessing a data object
  - Tells the compiler it does not need to add any additional checks
- Without the restrict keyword, the compiler has to assume the worse case
  - That some other identifier might have changed the data in between two uses of a pointer
- With the restrict keyword used, the compiler is free to look for computational shortcuts
- If a programmer uses restrict keyword and violate the above condition, result is undefined behavior
- Not supported by C++

**2. Syntax**
```c
int * restrict intPtrA;
int * restrict intPtrB;
```
- Tells the compiler that, for the duration of the scope in which `intPtrA`
and `intPtrB` are defined
  - They will never access the same value
- Their use for pointing to integers inside an array is mutually exclusive

--- 

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]
