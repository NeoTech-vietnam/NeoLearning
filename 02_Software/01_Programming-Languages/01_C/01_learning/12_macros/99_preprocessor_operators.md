# Section 14: Macros

## Topic: Preprocessor Operators

## Date: 05/12/2025

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

**1. Overview**
- the preprocessor includes the following four operators which can make it easier to create macros
```c
\
defined
#
##
```
- the backslash `(\)` operator allows for the continuation of a macro to the next line when the macro is too long for a single line
  - a macro is always a single, logical line
- the `defined()` operator is used in constant expressions to determine if an identifier is defined using `#define`
- the `#` and `##` operators are used for concatenation
- often useful to merge two tokens into one while expanding macros, called token pasting or token concatenation
- the ( `#` ) operator is used within a macro definition
  - causes a replacement text token to be converted to a string surrounded by quotes
- the (`##`) operator performs token pasting
  - concatenates two tokens
  - when a macro is expanded, the two tokens on either side of each `##` operator are combined into a single token

**2. `(\)` operator**
- a macro is normally confined to a single line
- the macro continuation operator (\) is used to continue a macro that is too long for a single line
```c
#define min(x, y) \
((x)<(y) ? (x) : (y))
```
- the above macro definition continues on the second physical line with the first nonblank character found
  - you can position the text on the second line to wherever you feel is the most readable
  - the `\` must be the last character on the line, immediately before you press Enter
  - result is seen by the compiler as a single, logical line

**3. defined() operator**
- the defined operator is used in constant expressions to determine if an identifier is defined using #define
- if the specified identifier is defined, the value is true (non-zero)
- if the symbol is not defined, the value is false (zero)
- It can also be used in #if statements
```c
#if defined (DEBUG)
...
#endif
// the same as the above, but, using #ifdef
#ifdef DEBUG
...
#endif
```
**4. Example**
```c
#if defined (WINDOWS) || defined (WINDOWSNT)
# define BOOT_DRIVE "C:/"
#else
# define BOOT_DRIVE "D:/"
#endif
int main(void) {
  printf("Here is the boot drive path: %s\n", BOOT_DRIVE);
  return 0;
}
```
- the above will display as output `"C:/"` if either `WINDOWS` or `WINDOWSNT` is defined
- output will be `"D:/"` otherwise

**5. (# and ##) operators**
- these operators are often useful to merge two tokens into one while expanding macros
  - token pasting or token concatenation
- the `#` operator causes a replacement text token to be converted to a string surrounded by quotes (String expansion)
- the `##` preprocessing operator performs token pasting
  - The two tokens on either side of each ‘##’ operator are combined into a single token
  - replaces the `##` and the two original tokens in the macro expansion

**6. the # operator**
- if you place a # in front of a parameter in a macro definition
  - creates a constant string out of the macro argument when the macro is invoked
  - literally inserts double quotation marks around the actual macro argument
```c
#define str(x) # x
causes the subsequent invocation
str (testing)
```
- to be expanded into `"testing“`
  - `printf (str (Programming in C is fun.\n));`
- is therefore equivalent to
- ` printf ("Programming in C is fun.\n");`
```c
#define HELLO(x) printf( "Hello, " #x "\n" );
```
when `HELLO(John)` appears in a program file, it is expanded to
```c
printf( "Hello, " "John" "\n" );
```
- the string "John" replaces `#x` in the replacement text
  - strings separated by white space are concatenated during preprocessing, so the preceding statement is equivalent to
```c
printf( "Hello, John\n" );
```
- the `#` operator must be used in a macro with arguments because the operand of `#` refers to an argument of the macro

**7. a more practical example**
```c
#define printint(var) printf (# var " = %i\n", var)
```
- this macro is used to display the value of an integer variable
  - if count is an integer variable with a value of 100, the statement
```
printint (count);
```
- is expanded into
```c
printf ("count" " = %i\n", count);
```
- which, after string concatenation is performed on the two adjacent strings, becomes
```c
printf ("count = %i\n", count);
```
- the `#` operator gives you a means to create a character string out of a macro argument
  - a space between the # and the parameter name is optional

**8. the ## Operator**
- this operator is used in macro definitions to join two tokens together
  - preceded (or followed) by the name of a parameter to the macro
  - takes the actual argument to the macro that is supplied when the macro is invoked and creates a single token out of that argument and whatever token follows (or precedes) the `##`
- usually both will be identifiers, or one will be an identifier and the other a preprocessing number
  - when pasted, they make a longer identifier
- two tokens that don’t together form a valid token cannot be pasted together
  - you cannot concatenate `x` with `+` in either order
- this operator is most useful when one or both of the tokens comes from a macro argument
  - if either of the tokens next to an ‘##’ is a parameter name
    - replaced by its actual argument before ‘##’ executes
```c
#define TOKENCONCAT(x, y) x ## y // TOKENCONCAT(O, K) is replaced by OK in the program
```

**9. another example**
```c
#define concatenate( x, y ) x ## y
...
int xy = 10;
...
```
- will make the compiler turn
```c
printf( "%d", concatenate( x, y ));
```
- into
```c
printf( "%d", xy);
```
- which will, of course, display `10` to standard output
- it is possible to concatenate a macro argument with a constant prefix or suffix to obtain a valid identifier as in
```c
#define make_function( name ) int my_ ## name (int foo) {}
make_function( bar )
```
- will define a function called my_bar()
```c
#define eat( what ) puts( "I'm eating " #what " today." )
eat( fruit )
```
- which the macro-processor will turn into
```c
puts( "I'm eating " "fruit" " today." )
```
- which in turn will be interpreted by the C parser as a single string constant

**10. another example**
- consider a C program that interprets named commands. There probably needs to be a table of commands, perhaps an array of structures declared as follows:
```c
struct command {
char *name;
void (*function) (void);
};
struct command commands[] = {
{ "quit", quit_command },
{ "help", help_command },
...
};
```
- it would be cleaner not to have to give each command name twice, once in the string constant and once in the function name
- a macro which takes the name of a command as an argument can make this unnecessary
  - the string constant can be created with stringizing, and the function name by concatenating the argument with ‘_command’
```c
#define COMMAND(NAME) { #NAME, NAME ## _command }
struct command commands[] = {
  COMMAND (quit),
  COMMAND (help),
  ...
};
```
---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]
