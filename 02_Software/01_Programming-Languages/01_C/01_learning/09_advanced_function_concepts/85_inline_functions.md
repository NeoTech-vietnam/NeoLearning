# Section 11: Advanced Funtion Concepts

## Topic: Inline Functions

## Date: 02/12/2025

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

**1. Overview**
- normally, a function call has **overhead** when being invoked
  - it takes execution time to set up the call, pass arguments, jump to the function code, and return
- C99 added the concept of inline functions to try and avoid the amount of overhead that comes along with invoking a function
- the point of making a function inline is to hint to the compiler that it is worth making some form of extra effort to call the function faster than it would otherwise
  - usually the compiler will substitute the code of the function into its caller (eliminating the need for a call and return sequence)
    - the program no longer calls that function, the compiler replaces every call to an inline function with the code body of that function
- the inline declaration is only advice to the compiler, which can decide to ignore it
  - may cause the compiler to replace the function call with inline code and/or perform some other sorts of optimizations, or it may have no effect
- inline functions can improve the runtime performance of a program
  - not guaranteed
  - whether an inline function serves your purpose in a positive or in a negative way depends purely on your code design and is largely debatable
- it is a common misconception that in-lining always equals faster code
  - if there are many lines in inline function or there are more function calls, then in-lining can cause wastage of space
- inline functions can increase the size of the program
  - it increases file size as the same function code is copied again and again in the program wherever it is called
- making a function inline has no effect on the logic of the program from the user’s perspective
- it is suggested to only declare functions as inline if they are short and called frequently
  - for a long function, the time consumed in calling the function is short compared to the time spent executing the body of the function
    - no great savings in time using an inline version

**2. declaring inline functions (single file program)**
- you can declare an inline function by placing the keyword inline before the function declaration
```c
inline void randomFunction();
```
- there are different places to create inline function definitions (same file or header file)
- for the compiler to make inline optimizations, it has to know the contents of the function definition
- the inline function definition has to be in the same file as the function call (internal linkage)
- should always use the inline function specifier along with the static storage-class specifier (using extern less portable)
  - inline functions are usually defined before their first use in a file (definition also acts as a prototype)
```c
inline static void foo() // inline definition/prototype
{
// do something
}
```
**3. declaring inline functions (multi-file program)**
- if you have a multi-file program, you need an inline definition in each file that calls the function
  - the simplest way to accomplish this is to put the inline function definition in a header file
  - include the header file in those files that use the function
```c
// foo.h
#ifndef FOO_H_
#define FOO_H_
inline static void foo() {
// do something
}
#endif
```
- an inline function is an exception to the rule of not placing executable code in a header file
  - because the inline function has internal linkage, defining one in several files does not cause problems

---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]
