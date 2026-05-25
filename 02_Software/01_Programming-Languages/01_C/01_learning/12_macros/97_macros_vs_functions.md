# Section 14: Macros

## Topic: Macros vs. Functions

## Date: 05/12/2025

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

**1. Overview**
- many tasks can be done by using a macro with arguments or by using a function
- as we have learned in the last lecture, macros are essentially functions, but, with different syntax
  - behave just like a function
- however, there are some huge differences (under the hood) and without understanding these differences, you might be using either one when you should not be
- you must understand that macros are pre-processed which means that all the macros would be processed before your program compiles
  - functions are not preprocessed, they are compiled
- so, now the question becomes, what are the differences and when should I use one vs. the other
  - there is no hard-and-fast rule
- the main consideration becomes a trade off between time and space

**2. Speed**
- a macro is faster than a function
  - program control must shift to where the function is and then return to the calling program
    - takes longer than inline code
- if you intend to use a macro instead of a function primarily to speed up a program
  - first try to determine whether it is likely to make a significant difference
- a macro that is used once in a program probably will not have any noticeable improvement in running time
- a macro inside a nested loop is a much better candidate for speed improvements
  - many systems offer program profilers to help you pin down where a program spends the most time

**3. Space**
- when you call a function, it has to allocate some data (a newly allocated stack frame)
  - macros do not have this overhead
  - macros insert code directly into the program (textual substitution)
- a macro produces inline code (a statement in your program)
  - if you use the same macro 20 times, you get 20 lines of code inserted into your program
  - if you use a function 20 times, you have just one copy of the function statements in your program (less space is used)
- functions are preferred over macros when writing large chunks of code

**4. Other considerations**
- macros have an advantage in that they do not have to worry about variable types
  - deal with character strings, not with actual values
  - a macro can be used equally well with an int or float
    - just substitute the argument you pass them
- functions give you type checking
  - if a function expects a string, but you give it an int, you will get an error
- macros are somewhat trickier to use than regular functions because they can have odd side effects if you are not careful
  - some compilers limit the macro definition to one line, and it is probably best to observe that limit, even if your compiler does not
- it is much harder to debug a macro than when you use a function
  - a function can be stepped through by the debugger and a macro cannot
  - when a macro fails, the only way you can find out what the problem is, is by looking at its definition and trying to find out what happened
    - you can tell gcc to tell you how everything expands using `gcc -E source_file.c`

**5. Alternatives**
- inline functions are the best alternative to macros
- when you add the inline keyword in front of a function, you are hinting to the compiler to embed the function body inside the caller (just like a macro)
- inline functions can debugged
- inline functions also have type checking
- however, the inline keyword is merely a hint to the compiler, it is not a strict rule and the compiler can decide to ignore the hint
- macros will always have their place and are not going away

---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]
