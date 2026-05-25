# Section 14: Macros

## Topic: Creating your own Macros

## Date: 05/12/2025

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

**1. Symbolic constants**
- as mentioned previously, there are two ways of defining macros, one of which looks like a function and one which does not
  - symbolic constants (constants represented as symbols)
  - function macros (operations defined as symbols)
- the below definition does not look like a function (symbolic constant)
```c
#define NONFMAC some text here
```
- defines a macro and some replacement text
  - the replacement text for a macro is any text on the line after the identifier in the `#define` directive
- after the definition, the macro can be used as follows
```c
NONFMAC
/* some text here */
```
- leading or trailing white space around the replacement text is discarded
- its name is simply replaced by its replacement text

**2. Function Macros**
- the below definition looks more like a function
  - function macro (operations defined as symbols)
```c
#define FMAC(a,b) a here, then b
#define macro_name( list_of_identifiers ) substitution_string
```
- defines a macro and some replacement text
  - the list of identifiers separated by `commas (a, b)` appears between parentheses following the macro_name (`FMAC`)
  - each of these identifiers can appear one or more times in the substitution string
- after the definition, the macro can be used as follows
```c
FMAC(first text, some more)
/* first text here, then some more */
```
- leading or trailing white space around the replacement text is discarded
- it gets a bit trickier with the function macro because of the (`identifiers`) or formal parameters

**3. macros with arguments**
- you can create function-like macros that look and act much like functions when you pass data to them (arguments)
  - looks very similar to a function because the arguments are enclosed within parentheses
- function-like macro definitions have one or more arguments in parentheses, and these arguments then appear in the replacement portion
- to create a macro with arguments, put them in parentheses separated by commas after the macro name
```c
#define SQUARE(X) X*X
```
- can be used in program like the below
```c
z = SQUARE(2);
```
- looks like a function call, but it does not necessarily behave identically
```c
#define macro_name( list_of_identifiers ) substitution_string
```
- a macro that contains arguments has its arguments substituted in the replacement text when the macro is expanded
  - the replacement text for a macro is any text on the line after the identifier in the `#define` directive
  - the replacement-text replaces the identifier and argument list in the program
- use should use parentheses around each argument and around the definition as a whole
  - ensures that the enclosed terms are grouped properly in an expression (avoid operator precedence)


---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]
