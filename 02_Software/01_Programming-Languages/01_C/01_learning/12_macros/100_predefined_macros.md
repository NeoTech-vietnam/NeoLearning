# Section 14: Macros

## Topic: Predefined Macros

## Date: 05/12/2025

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

**1. Overview**
- there are usually a considerable number of standard preprocessing macros defined by the compiler (defined in the documentation)
- standard C provides predefined symbolic constants
  - begin and end with two underscores.
  - cannot be used in #define or #undef directives
- `__FILE__`
  - represent the current file name (string)
- `__LINE__`
  - represent the current line number of the current source code (an integer constant)
- `__func__`
  - the name of any function when placed inside a function of the current file
    - not part of the standard
- `__DATE__`
  - the date the source file was compiled (a string of the form "Mmm dd yyyy" such as "Jan 19 2002")
- `__TIME__`
  - the time the source file was compiled (a string literal of the form "hh:mm:ss")
- `__STDC__`
  - used to indicate if the compiler supports standard C by returning the value 1

**2. `__FILE__ `and `__LINE__`**
- the `__FILE__` macro represents the name of the current source file as a string literal
  - typically a string literal comprising the entire file path
    - `"C:\\Projects\\Test\\MyFile.c"`
- the `__LINE__` macro results in an integer constant corresponding to the current line number
  - can use this in combination with the `__FILE__` macro to identify where in the source code a particular event or error has been detected
```c
if(fopen(&pfile, filename, "rb")) // Open for binary read
{
  fprintf(stderr, "Failed to open file in %s line %d\n", __FILE__, __LINE__);
  return -1;
}
```
- if `fopen()` fails, there will be a message specifying the source file name and the line number within the source file where the failure occurred

**3. __func__**
- you can always obtain the name of any function in the code that represents the
function body by using the identifier `__func__`
```c
#include <stdio.h>
void my_function_name(void) {
  printf("%s was called.\n", __func__);
}
```
- this function just outputs its own name within the format string my_function_name was called

**4. `__DATE__` and `__TIME__`**
- the `__DATE__` macro generates a string representation of the date in the form `Mmm` `dd` `yyyy`
  - `Mmm` is the month in characters, such as Jan, Feb, and so on
  - `dd` is the day in the form of a pair of digits 1 to 31, where single-digit days are preceded by a space
  - `yyyy` is the year as four digits—2012
- a similar macro, `__TIME__`, provides a string containing the value of the current time in the form `hh:mm:ss`
  - digits for hours, minutes, and seconds, separated by colons
    - the time is when the compiler is executed, not when the program is run
- you could use this macro to record in the output when your program was last compiled with this statement:
```c
printf("Program last compiled at %s on %s\n", __TIME__, __DATE__ );
```
```cmd
Program last compiled at 13:47:02 on Nov 24 2012
```

**5. `__STDC__`**
- this macro expands to the constant 1 if the current compiler being used conforms to the ISO standard C compiler
```c
#include <stdio.h>
int main(void) {
#if (__STDC__ == 1)
  printf("Implementation is ISO-conforming.\n");
#else
  printf("Implementation is not ISO-conforming.\n");
#endif
/* ... */
return 0;
}
```
---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]
