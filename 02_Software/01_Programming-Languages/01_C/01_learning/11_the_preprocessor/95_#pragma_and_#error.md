# Section 13: The Preprocessor

## Topic: #pragma and #error

## Date: 04/12/2025

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

**1. #pragma**
- the `#pragma` directive lets you place compiler instructions in your source code
  - lets you request special behavior from the compiler
- this directive is most useful for programs that are unusually large or that need to take advantage of the capabilities of a particular compiler
- `#pragmas` can be used
  - to control the amount of memory set aside for automatic variables
  - to set the strictness of error checking
  - to enable nonstandard language features
- the pragma (pragmatic information) directive is part of the standard
  - the meaning of any pragma depends on the software implementation of the standard that is used
  - generally, each compiler has its own set of pragmas
- for example, while C99 was being developed, it was referred to as C9X, and one compiler used the following pragma to turn on C9X support
```c
#pragma c9x on
```
- the syntax of the #pragma directive is:
```c
#pragma token_name
```
- `#pragma` is usually followed by a single token
  - represents a command for the compiler to obey
- there are only a limited list of supported tokens for each standard/compiler
  - the set of commands that can appear in #pragma directives is different for each compiler
  - need to reference the compiler documentation
  - a pragma not recognized by the implementation is ignored
- we will be studying the following #pragmas (which are available in the gcc compiler)
```c
#pragma GCC dependency
#pragma GCC poison
#pragma GCC system_header
#pragma once
#pragma GCC warning
#pragma GCC error
#pragma message
```

**2. #pragma GCC dependency**
- #pragma GCC dependency
- allows you to check the relative dates of the current file and another file
- If the other file is more recent than the current file, a warning is issued
- this pragma is useful if the current file is derived from the other file,
and should be regenerated
```c
#pragma GCC dependency "parse.y"
#pragma GCC dependency "/usr/include/time.h" rerun fixincludes
```

**3. #pragma GCC poison**
- this directive is used to remove an identifier completely from the program
- sometimes, there is an identifier that you want to remove completely from your program, and make sure that it is never used
- to enforce this, you can poison the identifier with this pragma
  - followed by a list of identifiers to poison
  - if any of those identifiers appear anywhere in the source after the directive, an error will be displayed by the compiler
```c
#pragma GCC poison printf sprintf fprintf
sprintf(some_string, "hello"); // will produce an error
```

**4. #pragma GCC system_header**
- the `#pragma` GCC system_header tells the compiler to consider the rest of the current include file as a system header
  - code that comes before the ‘`#pragma`’ in the file is not affected
  - this pragma takes no arguments
- system headers are header files that come with the OS or compiler
- GCC gives code found in system headers special treatment
- this pragma can affect the severity of some diagnostic messages
  - all warnings are suppressed while GCC is processing a system header
  - macros defined in a system header are immune to a few warnings wherever they are expanded

**5. #pragma warning, errors, and message**
- **#pragma once**
  - specifies that the header file containing this directive is included only once even if the programmer includes it multiple times during a compilation
  - works similar to using include guards
  - a less-portable alternative to using ‘#ifndef’ to guard the contents of header files against multiple inclusions
- **#pragma GCC warning "message"**
  - causes the preprocessor to issue a warning diagnostic with the text ‘message’
  - message contained in the pragma must be a single string literal
- **#pragma GCC error “message”**
  - causes the preprocessor to issue an error with the text ‘message’
  - message contained in the pragma must be a single string literal
- **#pragma message “message”**
  - prints string as a compiler message on compilation
  - the message is informational only (not a warning or an error)

**6. #error directive**
- one of the least used but potentially most useful features of the C preprocessor is the ANSI-specified `#error` directive
- the `#error` directive causes the preprocessor to issue an error message that includes any text in the directive
  - error message is a sequence of characters separated by spaces
  - you do not have to enclose the text in quotes
  - the message is optional
**Example**
```c
#if __STDC_VERSION__ != 201112L // should fail if compiler used is an older standard and succeed when it uses C11
#error Not C11
#endif
```
- gcc test.c
```cmd
test.c:8:2: error: #error Not C11
#error Not C11
```
- this directive can be used for code that compiles, but, still never the less is incorrect
- Useful in the following situations

**Incomplete code**
```c
#error *** Jason - Function incomplete. Fix before using ***
```
**Compiler-dependent code**
```c
#include <float.h>
#include <limits.h>
#if (INT_MAX != 32767)
#error *** This file only works with 16-bit int.
Do not use this compiler! ***
```
**Conditionally-compiled code**
```c
#ifdef OPT_1
/* Do option_1 */
#elif defined OPT_2
/* Do option_2 */
#else
#error *** You must define one of OPT_1 or OPT_2 ***
#endif
```

**7. Other directives**
- many compilers support a #warning directive
  - when one is encountered, the compiler emits a diagnostic containing the remaining tokens in the directive
```c
#warning message
```
- the #line preprocessor directive is used to set the file name and the line number of the line following the directive to new values
- used to set the `__FILE__ `and `__LINE__` macros
```c
#line linenum
#line linenum filename
```

---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]
