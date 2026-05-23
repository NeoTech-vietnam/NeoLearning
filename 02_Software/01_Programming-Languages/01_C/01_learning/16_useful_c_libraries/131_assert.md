# Section 18: Useful C Libraries

## Topic: Assert

## Date: 15/01/2025

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

**1. Overview**
- the assert library is designed to help with debugging programs
  - defined in `assert.h`
- the **assert()** macro enables you to insert tests of arbitrary expressions in your program
  - a run-time check
- takes as its argument an integer expression
  - the argument is a relational or logical expression
- the program will be terminated with a diagnostic message if a specified expression is false during execution
  - error message is written to the standard error stream (stderr)
    - displays the test that failed, the name of the file containing the test, and a line number
  - abort() function is invoked which terminates the program
- assertions are often used for critical conditions in a program
  - if certain conditions are not met, disaster will occur
  - you would want to be sure that the program does not continue when this error occurs
- assertions are not meant as a substitute for error handling during normal runtime conditions
  - use should be limited to finding logic errors

**2. Example**
```c
assert(some_variable < some_count);
```
- if some_variable is not less than some_count
  - the expression will be false, so the program will assert
- typical output from the assertion looks like this
```cmd
Assertion failed: file c:\jfedin\my_program.c, func main line 44,
some_variable<some_count abort -- terminating
```
- you can see that the function name and the line number of the code are identified as well as the condition that was not met

**3. Switching Off Assertions**
- assertions can be switched off by defining the symbol `NDEBUG` before the `#include` directive for `assert.h`
```c
#define NDEBUG
#include <assert.h>
// Switch off runtime assertions
```
- this code snippet will cause all `assert()` macros in your code to be ignored
- with some nonstandard systems, assertions are disabled by default, in which case you can enable them by undefining `NDEBUG`
```c
#undef NDEBUG
#include <assert.h>
// Switch on assertions
```
- by including the directive to undefine `NDEBUG`, you ensure that assertions are enabled for your source file
  - `#undef` must appear before the `#include` directive for `assert.h` to be effective

**4. Compile-Time Assertions**
- C11 added a feature that does a compile-time check
  - can cause a program not to compile
- the assert.h header makes static_assert an alias for the C keyword _Static_assert
  - more compatible with C++, which uses static_assert as its keyword for this feature
- static_assert is treated as a declaration statement
  - unlike most kinds of C statements, it can appear either in a function or external to a function
- the static_assert() macro enables you to output an error message during compilation
  - message includes a string literal that you specify
    - whether or not the output is produced depends on the value of an expression that is a compile time constant
- takes two arguments
  - first is a constant integer expression
  - second is a string
```c
static_assert(constant_expression, string_literal);
```
- when the constant expression evaluates to zero, compilation stops and the error message is output
- the static_assert() enables you to build checks into your code about your implementation
- suppose your code assumes that type char is an unsigned type
  - you could include this static assertion in the source file
```c
static_assert(CHAR_MIN == 0, "Type char is a signed type. Code won't work.");
```
- `CHAR_MIN` is defined in limits.h and is the minimum value for type char
  - when `char` is an `unsigned type`, `CHAR_MIN` will be zero
  - when it is a signed type it will be negative.
- the above will cause compilation to be halted and an error message that includes your
string to be produced when type char is signed

---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]
