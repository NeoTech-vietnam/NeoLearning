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
- The `volatile` type qualifier tells the compiler explicitly that the specified variable will change its value
- It is provided so that a program can tell the compiler to suppress various kinds of optimizations
  - Prevents the compiler from optimizing away seemingly redundant assignments to a variable
  - Prevents the compiler from repeated examination of a variable without its value seemingly changing
- Essentially, prevents the compiler from “caching” variables
- The reason for having this type qualifier is mainly because of the problems that are encountered in real-time or embedded systems programming
  - Programs that have a lot of threading
  - Programs where resources are scarce

**2. Use cases**
- A variable should be declared `volatile` whenever its value could change unexpectedly
- The optimizer must be careful to reload the variable every time it is used instead
of holding a copy in a register
- Only three types of variables should use `volatile`
  - Memory-mapped peripheral registers
  - Global variables (non stack variables) modified by an interrupt service routine
  - Global variables accessed by multiple tasks within a multi-threaded application

**3. Syntax**
- the syntax is the same as for const
```c
volatile int loc1; /* loc1 is a volatile location */
volatile int * ploc; /* ploc points to a volatile location */
```
- `loc1` is a volatile value
- `ploc` points to a volatile value

**4. Example**
```c
val1 = x;
/* some code not using x */
val2 = x;
```
- A smart (optimizing) compiler might notice that you use x twice without changing its value
  - Would temporarily store the x value in a register
  - When x is needed for val2, it can save time by reading the value from a register instead of from the original memory location
- This optimization is not desired if x is changed between the two statements by some other agency
  - You would use the volatile keyword to ensure that the compiler does not optimize and instead has a stored value for each variable
- If the volatile keyword is not used in the declaration, the compiler can assume that a value has not changed between uses, and it can then attempt to optimize the code

**5. Another Example (An I/O port)**
- Suppose you have an output port that is pointed to by a variable in your program
- If you want to write two characters to the port
- An `O` followed by an `N`
```c
*outPort = 'O';
*outPort = 'N';
```
- A smart compiler might notice two successive assignments to the same location
  - Because `outPort` is not being modified in between, the compiler would remove the first assignment from the program
- To prevent this from happening, you declare `outPort` to be a volatile pointer
```c
volatile char *outPort;
```

**6. Using volatile with const**
- A value can be both const and volatile
- A hardware clock setting normally should not be changed by the program
  - Make it `const`
- However, it is changed by an agency other than the program
  - Make it `volatile`
- Use both qualifiers in the declaration (order does not matter)
```c
volatile const int loc;
const volatile int * ploc;
```

--- 

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]
