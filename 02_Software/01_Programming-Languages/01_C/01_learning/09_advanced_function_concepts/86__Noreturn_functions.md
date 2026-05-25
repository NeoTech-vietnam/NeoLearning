# Section 11: Advanced Funtion Concepts

## Topic: _Noreturn Funtions

## Date: 02/12/2025

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

**1. Overview**
- C11 added a second function specifier (in addition to inline) named `_Noreturn`
- the purpose of this specifier is to inform the user and the compiler that a particular function will not return control to the calling program when it completes execution
  - informing the user helps to prevent misuse of the function
  - informing the compiler may enable it to make some code optimizations
- just like the inline function specifier, the `_Noreturn` function specifier is a hint to the compiler
  - using the `_Noreturn` function specifier does not stop a function from returning to its caller
    - only a promise made by the programmer to the compiler to allow it some more degree of freedom to generate optimized code
  - the degree of acceptance is implementation defined
- the `exit()` function is an example of a `_Noreturn` function
  - once `exit()` is called, the calling function never resumes
- note that this specifier is different from the void return type
  - a typical void function does return to the calling function
  - it just does not provide an assignable value
- if a function specified with the `_Noreturn` function specifier violates its promise and eventually returns to its caller (by using an explicit return statement or by reaching end of function body)
  - the behavior is undefined
  - You MUST NOT return from the function
- compilers are encouraged, but not required, to produce warnings or errors when a `_Noreturn` function appears to be capable of returning to its caller

**2. Using _Noreturn**
- the `_Noreturn` keyword appears in a function declaration
- the `_Noreturn` specifier may appear more than once in the same function declaration
  - the behavior is the same as if it appeared once
- this specifier is typically used through the convenience macro noreturn
  - provided in the header file `<stdnoreturn.h>`
  - using `_Noreturn` or noreturn is fine and equivalent

**3. Example**
```c
_Noreturn void f () {
abort(); // ok
}
_Noreturn void g (int i) {
// causes undefined behavior if i <= 0
if (i > 0) abort();
}
```

**4. Another example (using noreturn macro)**
```c
#include <stdio.h>
#include <stdlib.h>
#include <stdnoreturn.h>
noreturn void my_exit(void);
/* calls exit() and doesn't return to its caller. */
void my_exit(void) {
printf("Exiting...\n");
exit(0);
}
int main(void) {
my_exit();
return 0;
}
```

**5. Example (Undefined behavior)**
```c
#include <stdio.h>
#include <stdlib.h>
#include <stdnoreturn.h>
noreturn void func(void);
void func(void) {
printf("In func()...\n");
} /* Undefined behavior as func() returns */
int main(void) {
func();
return 0;
}
```
```c
#include <stdio.h>
#include <stdlib.h>
_Noreturn void foo() {
return 10;
}
int main(void) {
printf("Ready\n");
foo();
printf("NOT over till now\n");
return 0;
}
```
- compiler error:[Warning] function declared 'noreturn' has a 'return' statement
---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]
