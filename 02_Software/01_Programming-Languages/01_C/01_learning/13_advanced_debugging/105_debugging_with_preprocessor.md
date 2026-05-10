# Section 15: Advanced Debugging, Analysis, and Compiler Opotions

## Topic: Debugging with the preprocessor

## Date: 28/12/2025

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

**1. Overview**
- we have previously discussed preprocessor directives in detail
  - specifically the conditional compilation directives (if, ifdef, else)
- by using these directives, you can arrange for blocks of code to be included in your program to assist in debugging
- the addition of tracing code of your own can still be very useful
- you have complete control of the formatting of data to be displayed for debugging purposes
  - can even arrange for the kind of output to vary according to conditions or relationships within the program
- I will show you how to use the preprocessor to allow for the conditional inclusion of debugging statements in your program
- the C preprocessor can be used to insert debugging code into your program
- by appropriate use of `#ifdef` statements, the debugging code can be enabled or disabled at your discretion
  - when a preprocessor identifier `DEBUG` is defined, the debugging code is compiled with the rest of the program
  - when `DEBUG` is not defined, the debugging code is left out

---

### Summary Section (Summary of Notes)
- [GCC online documentation](https://gcc.gnu.org/onlinedocs/gcc-15.2.0/gcc.pdf)

[Insert a brief summary of the key ideas and takeaways]
