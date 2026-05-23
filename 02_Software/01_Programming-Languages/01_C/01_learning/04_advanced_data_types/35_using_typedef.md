# Section 5: Advanced Data Types

## Topic: Register

## Date: 22/10/2025

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

**1. Overview**
- The `typedef` keyword is an advanced feature in C that enables you to create your own name for an existing data type
- To define a new type name with `typedef`
  - Write the statement as if a variable of the desired type were being declared
  - Where the name of the declared variable would normally appear, substitute the new type name
  - In front of everything, place the keyword `typedef`
```c
typedef int Counter;
```
- Defines the name Counter to be equivalent to the C data type `int`
- Variables can subsequently be declared to be of type `Counter`
```c
Counter j, n;
```
- The C compiler treats the declaration of the variables `j` and `n` as normal integer variables

**2. Advantages**
- One advantage is in the added readability that it lends to the definition of the variables
  - Code is more readable when the names of the types lend insight into the meaning and intended use of a type
  - It is clear from the definition of what the intended purpose of certain variables are in the program
- Another advantage is maintainability
  - Using typedef‘s instead of explicit types is analogous to using variables instead of explicit numbers (magic numbers)
  - If the type used for a certain purpose needs to be changed, then only the typedef line needs to be changed
    - When typedef’s are not used, thousands of manual changes to the code may be required to achieve this simple logical operation
- You can also use typedef to help make a program more portable
  - Used to create synonyms for the basic data types
- A program requiring 4-byte integers may use type int on one system and type long on another
- Programs designed for portability often use typedef to create an alias for 4-byte integers, such as Integer
  - The alias Integer can be changed once in the program to make the program work on both systems

**3. typedef vs. #define**
- In many instances, a `typedef` statement can be equivalently substituted by the appropriate `#define` statement
```c
#define Counter int; // has the same results as using a typedef as in the previous slide
```
- We know that the `#define` is handled by the preprocessor
- The `typedef` is handled by the C compiler
  - Provides more flexibility when it comes to assigning names to derived data types
- Remember, the `typedef` statement does not actually define a new type
  - Only a new type name

**4. Best practice**
- Do not bother using `typedefs` for structs
- All they do is save you writing the word `“struct”`, which is a clue that you probably shouldn’t be hiding anyway
- Use typedefs for types that combine arrays, `structs`, `pointers`, or `functions`
- Use `typedefs` for portable types
  - When you need a type that’s at least 20-bits, make it a typedef
    - When you port the code to different platforms, select the right `type`, `short`, `int`, `long`
    - Making the change in just the `typedef`, rather than in every declaration
- Use `typedefs` for casting
  - A `typedef` can provide a simple name for a complicated type cast
```c
typedef int (*ptr_to_int_fun)(void);
char * p;
..... = (ptr_to_int_fun) p;
```

--- 

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]
