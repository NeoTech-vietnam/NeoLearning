# Section 5: Advanced Data Types

## Topic: Register

## Date: 22/10/2025

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

**1. Overview**
- The `#define` preprocessor directive (like all preprocessor directives), begins with the #
symbol at the beginning of a line
  - Can be preceded by spaces or tabs
  - Allows for space between the # and the remainder of the directive
- In c programming you can use this directive to define symbolic, or manifest, constants in a program
- Preprocessor directives run until the first newline following the #
  - A directive is limited to one line in length
- The combination backslash/newline is deleted before preprocessing begins
  - You can spread the directive over several physical lines
    - These lines still constitute a single logical line
- Typically, `#define` statements appear first in the program
- Not required, they can appear anywhere in the program
- Most programmers group their `#define` statements at the beginning of the program (or inside an include file)
- They can be quickly referenced and shared by more than one source file
- By convention, `#define` names are defined using only uppercase letters and underscores

**2. Example**
- One of the primary uses of the `#define` statement is to assign symbolic names to program constants
```c
#define YES 1
```
- Defines the name `YES` and makes it equivalent to the value `1`
- The name `YES` can subsequently be used anywhere in the program where the constant `1` could be used
- It is the same as doing a search and replace with a text editor
- The preprocessor replaces all occurrences of the defined name with its associated text
- The `#define` statement has a special syntax
- No equal sign used to assign the value `1` to `YES`
- A semicolon does not appear at the end of the statement
- Whenever this name appears, its defined value of `1` is automatically substituted into the program by the preprocessor
```c
gameOver = YES;
```
- This statement assigns the value of `YES` to `gameOver`
- Has the effect of assigning `1` to `gameOver`
- A defined name is not a variable
- You cannot assign a value to it, unless the result of substituting the
defined value is in fact a variable

**3. #define expressions**
- A definition for a name can include more than a simple constant value
- A definition for a name can include an expression
- The following defines the name TWO_PI as the product of `2.0` and `3.141592654`
```c
#define TWO_PI 2.0 * 3.141592654
```
- You can subsequently use this defined name anywhere in a program where the expression `2.0 × 3.141592654` would be valid
- You could replace the return statement of a circumference function with the following statement
```c
return TWO_PI * r;
```


**4. NULL define**
- The defined name `NULL` is frequently used by programmers to represent the null pointer
- `NULL` is already defined on your system inside a file named `<stddef.h>`
- By including a definition such as
```c
#define NULL 0
```
- In a program, you can then write more readable statements, such as
```c
while ( listPtr != NULL )
```
- To set up a while loop that will execute as long as the value of listPtr is not equal to the
null pointer

**5. Benefits of #define**
- Using a defined name for a constant value helps to make programs more readily extendable and more readable
- e.g.
  - When you define an array, you must specify the number of elements in the array
  - Subsequent program statements will likely use the knowledge of the number of elements contained inside the array
```c
float dataValues[1000];
```
- There is a good chance that you will see statements in the program that use the fact that dataValues contains 1,000 elements
```c
for ( i = 0; i < 1000; ++i )
```
- You would use the value `1000` as an upper bound for sequencing through the elements of the array
- Suppose that you had to increase the size of the dataValues array from 1,000 to 2,000 elements
  - Would necessitate changing all statements that used the fact that dataValues contained 1,000 elements
- A better way of dealing with array bounds, which makes programs easier to extend, is to define a name for the upper array bound
```c
#define MAXIMUM_DATAVALUES 1000
```
- You can subsequently define the dataValues array to contain MAXIMUM_DATAVALUES elements
```c
float dataValues[MAXIMUM_DATAVALUES];
```
- Statements that use the upper array bound can also make use of this defined name
```c
for ( i = 0; i < MAXIMUM_DATAVALUES; ++i )
```
- You can now easily change the size of the dataValues array to 2,000 elements by simply changing the
definition
```c
#define MAXIMUM_DATAVALUES 2000
```
- If the program is written to use `MAXIMUM_DATAVALUES` in all cases where the size of the array was used
  - The preceding definition could be the only statement in the program that would have to be changed
- Another nice use of the `#define` statement is that it helps to make programs more portable from one computer system to another
- It might be necessary to use constant values that are related to the particular computer on which the program is running
- Might have to do with the use of a particular computer memory address, a filename, or the number of bits
contained in a computer word
- If you want to execute a program on a different machine
  - Where an int contains 64 bits as opposed to 32
    - Can use a define to set this
- In situations in which the program must be written to make use of machine-dependent values
- The `#define` statement can help isolate machine-dependent values from the program as much as possible
  - Would be easier to port to another machine

**6. #define vs. constant**
```c
#define PI 3.14159f
```
- The above defines `PI` as a symbol that is to be replaced in the code by the string `3.14159f`
- We could have defined `PI` as a variable, but to tell the compiler that its value is fixed and must not be changed
- You can fix the value of any variable when you declare it by prefixing the type name with the keyword `const`
```c
const float Pi = 3.14159f; // Defines the value of Pi as fixed
```
- The advantage of defining `Pi` in this way is that you are now defining it as a constant numerical value with a specified type
- When using `#define`, `PI` is just a sequence of characters that replaces all occurrences of `PI` in your code

--- 

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]
