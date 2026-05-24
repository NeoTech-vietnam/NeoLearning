# Section 6: Advanced Data Types

## Topic: Flexible Array Members

## Date: 02/11/2025

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

**1. Overview**
- A flexible array member is a feature introduced in the **C99** standard of the C
programming language
- When using a structure, we can declare an array without a dimension and whose size is
flexible in nature
- A flexible array member’s size is variable (can be changed be at runtime)
```c
struct s {
int arraySize;
int array[];
}; // end struct s
```
- A flexible array member is declared by specifying empty square brackets ([])

**2. Restrictions**

- A flexible array member can be declared only as the last member of a struct
- Each struct can contain at most one flexible array member
- A flexible array cannot be the only member of a struct
  - The struct must also have one or more fixed members
- Any struct containing a flexible array member cannot be a member of another struct
- A struct with a flexible array member cannot be statically initialized
  - It must be allocated dynamically
  - You cannot fix the size of the flexible array member at compile time

**3. Summary**

- It is debatable on whether it is good practice to use flexible array members
- Some argue that it is not portable
  - Since ISO C99 was released in 1999 (20 years ago), striving for ISO C89 compatibility is a weak argument
- Some argue that you can just declare an array of size 0 or 1 and reallocate
  - In previous standards of the C language, it was common to declare a zero-sized array member instead of a flexible array member
  - Using non-standardized constructs to support flexible array members can yield undefined behavior
    - Bad practice and any undefined-behavior should be avoided
- A struct with a flexible array member reduces the number of allocations for it by 1⁄2
  - Instead of 2 allocations for one struct object you need just 1
    - Meaning less effort and less memory occupied
    - You save the storage for one additional pointer
- If you have to allocate a large number of struct instances, you can measurably improve the runtime and memory usage of your program (by a constant factor)

--- 

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]
