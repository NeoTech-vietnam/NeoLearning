# Section 5: Storage Classes

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
- A processor register (CPU register) is one of a small set of data holding places that are part of the computer
processor
  - A register may hold an instruction, a storage address, or any kind of data
- The register storage class is used to define local variables that should be stored in a register instead of RAM (memory)
  - Makes the use of register variables to be much faster than that of the variables stored in the memory during the runtime of the program
- The register storage class should only be used for variables that require quick access
  - The variables which are most frequently used in a C program
  - If a function uses a particular variable heavily
- The keyword register hints to the compiler that a given variable can be put in a register
  - It is the compiler’s choice to put it in a register or not
  - MIGHT be stored in a register depending on hardware and implementation restrictions
  - Generally, compilers themselves do optimizations and put the variables in register
- The keyword register is used to define register storage class
- Both local variables and formal parameters can be declared as register variables
- This storage class declares register variables which have the same functionality as that of the auto variables
  - The lifetime of register variable remains only when control is within the block
- The variable stored in a register has a maximum size equal to the register size
- You cannot obtain the address of a register variable using pointers
  - Cannot have the unary '&' operator applied to it (as it does not have a memory location)

---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]
