# Section 9: Advanced Control Flow

## Topic: setjmp and longjmp functions

## Date: 16/11/2025 

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)
**1. Overview**
- `setjmp()` and l`ongjmp()` are functions that let you perform complex flow-of-control in C
- normal program flow in C follows function calls and branching constructs (if, while, etc.)
  - functions setjmp and longjmp introduce another kind of program flow
- mainly used to implement exception handling in C (error recovery situations)
  - setjmp can be used like try (in languages like C++ and Java)
  - longjmp can be used like throw
- suppose there is an error deep down in a function nested in many other functions and error handling makes sense only in the top level function
  - would be very tedious and awkward if all the functions in between had to return normally and evaluate return values
  - would be very tedious if you used a global error variable to determine that further processing doesn't make sense or even would be bad
- the above is a situation where setjmp/longjmp makes sense
- you can use setjmp and longjmp for error handling so that you can jump out of deeply nested call chain without needing to deal with handling errors in every function in the chain

**2. How it works**
- `setjmp` saves a copy of the program counter and the current pointer to the top of the stack
- `int setjmp(jmp_buf j)`
  - use the variable j to remember where you are now
  - must be called first
- `longjmp` is then invoked after `setjmp` ( `longjmp(jmp_buf j, int i)` )
  - says go back to the place that the `j` is remembering
  - restores the process in the state that it existed when it called setjmp
    - return the value of i so the code can tell when you actually got back here via `longjmp()`
  - the contents of the `j` are destroyed when it is used in a `longjmp()`
- often referred to as “unwinding the stack,” because you unroll activation records from the stack until you get to the saved one
- the header file `<setjmp.h>` needs to be included in any source file that uses setjmp or `longjmp`

**3. Similarity to goto statement**
- although it causes a branch, longjmp differs from a goto
- a goto can’t jump out of the current function in C
  - a “longjmp” can jump a long way away, even to a function in a different file
- you can only longjmp back to somewhere you have already been, where you did a setjmp, and that still has a live activation record
- `setjmp` is more like a “come from” statement than a “go to”

---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]
