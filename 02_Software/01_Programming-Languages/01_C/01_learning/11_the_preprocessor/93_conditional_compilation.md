# Section 13: The Preprocessor

## Topic: Conditional Compilation

## Date: 04/12/2025

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

**1. Overview**
- the C preprocessor offers a feature known as conditional compilation
  - often used to create one program that can be compiled to run on different computer systems
- if you had a large program that had many dependencies on specific hardware or software
  - you might end up with many defines whose values would have to be changed when the program was moved to another computer system
  - you can help reduce this problem by incorporating the values of these defines for each different machine into the program by using the conditional compilation capabilities of the preprocessor
- it is also used to switch on or off various statements in the program
  - debugging statements that print out the values of various variables
  - trace the flow of program execution
- conditional compilation enables you to control the execution of preprocessor directives and the compilation of program code
  - each of the conditional preprocessor directives evaluates an identifier or a constant integer expression
    - cast expressions, `sizeof` expressions and `enumeration` constants **cannot** be evaluated in preprocessor directives

**2. Conditional Compilation commands**
- includes a set of commands that tell the compiler to accept or ignore blocks of information or code according to conditions at the time of compilation
- the conditional preprocessor construct is much like the if selection statement
- every `#if` construct ends with an `#endif`
- directives `#ifdef` and `#ifndef` are provided as shorthand for
  - `#if defined(name)`
  - `#if !defined(name)`
- multiple-part conditional preprocessor constructs may be tested with directives `#elif` and `#else`

**3. #ifdef**
- this directive checks whether an identifier is currently defined
  - identifiers can be defined by a `#define` directive or on the command line
- to set an identifier, here is an example using the `#define` directive
```c
#define UNIX 1
```
OR
```c
#define UNIX
```
- most compilers also permit you to define a name to the preprocessor when the program is compiled
  - use the special option `–D` to the compiler command
```cmd
gcc -D UNIX program.c
```

**4. #ifdef and #endif**
- the general form of the `#ifdef` directive is
```c
#ifdef identifier
```
- identifiers cannot be any keywords or enumeration constants
- if the identifier specified has been defined by the preprocessor
  - compile all the code up to the next #else or `#endif`, whichever comes first
  - if there is an #else, all code from the #else to the `#endif` is compiled if the identifier is not defined
- the `#endif` directive ends the scope of the `#if `, `#ifdef` , `#ifndef `, `#else` , or `#elif` directives
- the `#endif` directive has the following syntax:
```c
#endif newline
```

**5. #ifndef**
- this directive checks to see if an identifier is not currently defined
  - `#ifndef` is the negative of `#ifdef`
  - often used to define a constant if it is not already defined
- the `#ifndef` directive has the following syntax
```c
#ifndef identifier
```
- Example:
```c
#ifndef SIZE
#define SIZE 100
#endif
```

**6. #if**
- you can use the `#if` directive to test the value of a constant expression
  - a constant expression is specified through a #define statement or via the command line when the program is compiled
- the general form of the `#if` directive
```c
#if constant_expression
```
- the operand must be a constant integer expression that does not contain any increment (`++`), decrement (`--`), `sizeof` , pointer (`*`), address (`&`), and cast operators
  - you can also use relational and logical operators with the `#if` directive
- the constant expression is subject to text replacement and can contain references to identifiers defined in previous #define directives
- if an identifier used in the expression is not currently defined, the compiler treats the identifier as though it were the constant zero

**7. #else**
- to complement the `#ifdef`/`#ifndef` and `#if` directives, you have the `#else` directive
  - works exactly the same way as the else statement does
  - identifies a group of directives to be executed or statements to be included if the `#ifdef`/`#ifndef` or `#if` condition fails
- the form `#ifdef`/`#ifndef`/`#if` `#else` is much like that of the C **if else**
  - main difference is that the preprocessor does not recognize the braces (`{}`) syntax of marking a block
  - it uses the #else (if any) and the #endif (which must be present) to mark blocks of directives
    - these conditional structures can be nested
- with an `#else` directive, everything from the `#else `to the #endif is done if the identifier is not defined
```c
#ifdef UNIX
# define DATADIR "/uxn1/data"
#else
# define DATADIR "\usr\data"
#endif
```
- the above has the effect of defining DATADIR to `"/uxn1/data"` if the symbol UNIX has been previously defined and to `"\usr\data"` otherwise
- you are allowed to put one or more spaces after the # that begins a preprocessor statement
- a value can also be assigned to the defined name on the command line
```c
gcc -D DATADIR=/c/my_data
```

**8. #elif**
- this directive is used for multiple-choice selections
  - similar to the combined use of the else-if statements in C
  - optional
- the `#elif` directive has the general form
```c
#elif constant_expression
```

---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]
